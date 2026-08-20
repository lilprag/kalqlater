from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from .content import AnalyzerContentRepository, ContentNotAvailableError, FileAnalyzerContentRepository
from .models import (
    AnalyzerDefinition, AnalyzerResult, AssessmentResponseInput, AssessmentSessionState,
    ConfidenceBand, DirectionBand, EvidenceMoment, PersonalityContext, Recommendation, ResultSnapshot, SelectedInterpretation,
    SessionStatus, StoredResponse,
)
from .repositories import (
    AnalyzerResultRepository, AssessmentSessionRepository, InMemoryAnalyzerResultRepository,
    InMemoryAssessmentSessionRepository,
)
from .scoring import calculate_dimension_results
from .timestamps import normalize_utc


class AssessmentError(Exception):
    pass


class SessionNotFoundError(AssessmentError):
    pass


class SessionConflictError(AssessmentError):
    pass


class SessionExpiredError(AssessmentError):
    pass


class AssessmentService:
    """Generic, server-authoritative orchestration for version-pinned analyzers."""

    COMMUNICATION_CATEGORIES_FR = {
        "meeting": "Réunion",
        "remote-work": "Travail à distance",
        "feedback": "Retours",
        "friendship": "Amitié",
        "leadership": "Leadership",
        "customer-service": "Service client",
        "close-relationship": "Relation proche",
        "stress": "Stress",
        "disagreement": "Désaccord",
        "family": "Famille",
    }

    def __init__(
        self,
        content_repository: AnalyzerContentRepository | None = None,
        session_repository: AssessmentSessionRepository | None = None,
        result_repository: AnalyzerResultRepository | None = None,
        allow_test_drafts: bool = False,
        session_ttl: timedelta = timedelta(hours=24),
    ) -> None:
        self.content_repository = content_repository or FileAnalyzerContentRepository()
        self.session_repository = session_repository or InMemoryAssessmentSessionRepository()
        self.result_repository = result_repository or InMemoryAnalyzerResultRepository()
        self.allow_test_drafts = allow_test_drafts
        self.session_ttl = session_ttl

    def get_analyzer_definition(self, slug: str, version: str | None = None) -> AnalyzerDefinition:
        return self.content_repository.get(slug, version, self.allow_test_drafts)

    def get_safe_analyzer_metadata(self, slug: str, locale: str) -> dict:
        definition = self.get_analyzer_definition(slug)
        return FileAnalyzerContentRepository.safe_metadata(definition, locale)

    def create_session(self, slug: str, locale: str, personality_context: PersonalityContext | None = None) -> AssessmentSessionState:
        definition = self.get_analyzer_definition(slug)
        if locale not in FileAnalyzerContentRepository.supported_locales(definition.analyzer.slug) or locale not in definition.analyzer.locales:
            raise AssessmentError("Locale unavailable")
        now = datetime.now(timezone.utc)
        session = AssessmentSessionState(
            id=str(uuid.uuid4()),
            access_token=secrets.token_urlsafe(32),
            analyzer_slug=definition.analyzer.slug,
            analyzer_version=definition.analyzer.version,
            locale=locale,
            scenario_ids=[scenario.id for scenario in definition.scenarios],
            status=SessionStatus.ACTIVE,
            created_at=now,
            expires_at=now + self.session_ttl,
            personality_context=personality_context,
        )
        self.session_repository.save(session)
        return session

    def _session(self, session_id: str, access_token: str) -> AssessmentSessionState:
        session = self.session_repository.get(session_id)
        if not session or not secrets.compare_digest(session.access_token, access_token):
            raise SessionNotFoundError("Assessment unavailable")
        expires_at = normalize_utc(session.expires_at)
        if session.status == SessionStatus.EXPIRED or expires_at <= datetime.now(timezone.utc):
            session.status = SessionStatus.EXPIRED
            session.expires_at = expires_at
            self.session_repository.save(session)
            raise SessionExpiredError("Assessment expired")
        session.expires_at = expires_at
        return session

    def get_next_scenario(self, session_id: str, access_token: str) -> dict | None:
        session = self._session(session_id, access_token)
        if session.status != SessionStatus.ACTIVE:
            return None
        definition = self.get_analyzer_definition(session.analyzer_slug, session.analyzer_version)
        next_id = next((scenario_id for scenario_id in session.scenario_ids if scenario_id not in session.responses), None)
        if not next_id:
            return None
        scenario = next(item for item in definition.scenarios if item.id == next_id)
        return {
            "scenario_id": scenario.id,
            "category": self._scenario_category(definition.analyzer.slug, scenario.category, session.locale),
            "prompt": getattr(scenario.prompt, session.locale),
            "options": [{"id": option.id, "text": getattr(option.text, session.locale)} for option in scenario.options],
            "progress": {"answered": len(session.responses), "total": len(session.scenario_ids)},
        }

    def get_scenario(self, session_id: str, access_token: str, scenario_id: str) -> dict:
        """Return a safe scenario view, including only its existing selected option."""
        session = self._session(session_id, access_token)
        if session.status != SessionStatus.ACTIVE or scenario_id not in session.scenario_ids:
            raise SessionNotFoundError("Assessment unavailable")
        definition = self.get_analyzer_definition(session.analyzer_slug, session.analyzer_version)
        scenario = next(item for item in definition.scenarios if item.id == scenario_id)
        existing = session.responses.get(scenario_id)
        return {
            "scenario_id": scenario.id,
            "category": self._scenario_category(definition.analyzer.slug, scenario.category, session.locale),
            "prompt": getattr(scenario.prompt, session.locale),
            "options": [{"id": option.id, "text": getattr(option.text, session.locale)} for option in scenario.options],
            "selected_option_id": existing.option_id if existing else None,
            "progress": {"answered": len(session.responses), "total": len(session.scenario_ids), "index": session.scenario_ids.index(scenario_id)},
        }

    def submit_response(self, session_id: str, access_token: str, response: AssessmentResponseInput) -> AssessmentSessionState:
        session = self._session(session_id, access_token)
        if session.status != SessionStatus.ACTIVE:
            raise SessionConflictError("Assessment is already complete")
        if response.scenario_id not in session.scenario_ids:
            raise AssessmentError("Scenario unavailable")
        definition = self.get_analyzer_definition(session.analyzer_slug, session.analyzer_version)
        scenario = next(item for item in definition.scenarios if item.id == response.scenario_id)
        if response.option_id not in {option.id for option in scenario.options}:
            raise AssessmentError("Response unavailable")
        existing = session.responses.get(response.scenario_id)
        if existing:
            # A recovered client may retry after saving its answer but before receiving
            # the following completion result. Same-choice retries are safely idempotent.
            if existing.option_id == response.option_id:
                return session
            raise SessionConflictError("A response already exists for this situation")
        session.responses[response.scenario_id] = StoredResponse(
            scenario_id=response.scenario_id,
            option_id=response.option_id,
            idempotency_key=response.idempotency_key,
            submitted_at=datetime.now(timezone.utc),
        )
        self.session_repository.save(session)
        return session

    def update_response(self, session_id: str, access_token: str, response: AssessmentResponseInput) -> AssessmentSessionState:
        """Replace one active-session answer; completed sessions always remain frozen."""
        session = self._session(session_id, access_token)
        if session.status != SessionStatus.ACTIVE:
            raise SessionConflictError("Assessment is already complete")
        if response.scenario_id not in session.scenario_ids:
            raise AssessmentError("Scenario unavailable")
        definition = self.get_analyzer_definition(session.analyzer_slug, session.analyzer_version)
        scenario = next(item for item in definition.scenarios if item.id == response.scenario_id)
        if response.option_id not in {option.id for option in scenario.options}:
            raise AssessmentError("Response unavailable")
        existing = session.responses.get(response.scenario_id)
        if existing and existing.option_id == response.option_id:
            return session
        session.responses[response.scenario_id] = StoredResponse(
            scenario_id=response.scenario_id, option_id=response.option_id,
            idempotency_key=response.idempotency_key, submitted_at=datetime.now(timezone.utc),
        )
        self.session_repository.save(session)
        return session

    def _result_from_session(self, session: AssessmentSessionState, definition: AnalyzerDefinition) -> AnalyzerResult:
        response_map = {scenario_id: response.option_id for scenario_id, response in session.responses.items()}
        dimensions = calculate_dimension_results(definition, response_map, session.locale, len(session.scenario_ids) - len(response_map))
        by_id = {result.dimension_id: result for result in dimensions}
        selected_rules = []
        for rule in definition.interpretation_rules.cross_dimension_rules:
            if all(by_id[dimension].direction == expected and by_id[dimension].confidence != ConfidenceBand.LIMITED for dimension, expected in rule.when.items()):
                selected_rules.append(SelectedInterpretation(rule_id=rule.id, text=getattr(rule.summary, session.locale)))
        meaningful = [result for result in dimensions if result.confidence != ConfidenceBand.LIMITED]
        name = lambda result: self._dimension_name(definition, result.dimension_id, session.locale)
        strengths = [result.explanation for result in meaningful if result.direction == DirectionBand.HIGHER][:3]
        balanced = [result for result in meaningful if result.direction == DirectionBand.BALANCED]
        for result in balanced:
            strengths.append(self._localized(session.locale, f"Your {name(result)} responses show useful flexibility across contexts.", f"{name(result)} से जुड़े आपके उत्तर अलग संदर्भों में उपयोगी लचीलापन दिखाते हैं。", f"Vos réponses liées à {name(result)} montrent une souplesse utile selon les contextes.", definition.analyzer.slug))
        for result in dimensions:
            if len(strengths) >= 3:
                break
            strengths.append(self._localized(session.locale, f"You have enough evidence to begin a careful reflection on {name(result)}.", f"{name(result)} पर सावधानी से विचार शुरू करने के लिए आपके पास पर्याप्त संकेत हैं।", f"Vous disposez de suffisamment d’éléments pour commencer une réflexion attentive sur {name(result)}.", definition.analyzer.slug))
        blind_spots = [result.explanation for result in meaningful if result.direction == DirectionBand.LOWER][:3]
        for result in balanced:
            if len(blind_spots) >= 3:
                break
            blind_spots.append(self._localized(session.locale, f"Because {name(result)} shifts by context, naming what you need may help others respond well.", f"क्योंकि {name(result)} संदर्भ के साथ बदलता है, अपनी जरूरत स्पष्ट करने से दूसरों को बेहतर प्रतिक्रिया देने में मदद मिल सकती है।", f"Comme {name(result)} varie selon le contexte, exprimer ce dont vous avez besoin peut aider les autres à mieux répondre.", definition.analyzer.slug))
        for result in dimensions:
            if len(blind_spots) >= 3:
                break
            blind_spots.append(self._localized(session.locale, f"A strong or still-emerging {name(result)} pattern can be worth checking with a trusted person.", f"{name(result)} के इस उभरते पैटर्न को किसी भरोसेमंद व्यक्ति के साथ जाँचना उपयोगी हो सकता है।", f"Une tendance marquée ou encore émergente autour de {name(result)} peut mériter d’être examinée avec une personne de confiance.", definition.analyzer.slug))
        misunderstandings = [item.text for item in selected_rules][:2]
        for result in meaningful:
            if len(misunderstandings) >= 2:
                break
            if result.direction == DirectionBand.HIGHER:
                misunderstandings.append(self._localized(session.locale, f"Others may read your stronger {name(result)} as certainty when you are simply trying to be useful.", f"दूसरे आपके {name(result)} को निश्चितता समझ सकते हैं, जबकि आप केवल उपयोगी बनने की कोशिश कर रहे हों।", f"Les autres peuvent interpréter une tendance plus marquée en matière de {name(result)} comme de la certitude, alors que vous cherchez simplement à être utile.", definition.analyzer.slug))
            elif result.direction == DirectionBand.BALANCED:
                misunderstandings.append(self._localized(session.locale, f"Others may miss how much context shapes your {name(result)} response.", f"दूसरे यह नहीं समझ पाते कि संदर्भ आपके {name(result)} को कितना प्रभावित करता है।", f"Les autres peuvent ne pas percevoir à quel point le contexte façonne votre réponse en matière de {name(result)}.", definition.analyzer.slug))
        for result in dimensions:
            if len(misunderstandings) >= 2:
                break
            misunderstandings.append(self._localized(session.locale, f"A limited signal about {name(result)} can be mistaken for a fixed style; it is better treated as provisional.", f"{name(result)} का सीमित संकेत एक स्थायी शैली समझा जा सकता है; इसे अभी अंतिम निष्कर्ष न मानना बेहतर है।", f"Un signal limité concernant {name(result)} peut être pris pour un style fixe ; il vaut mieux le considérer comme provisoire.", definition.analyzer.slug))
        target = next((result for result in dimensions if result.direction in {DirectionBand.LOWER, DirectionBand.BALANCED} and result.confidence != ConfidenceBand.LIMITED), None)
        if target is None:
            target = next((result for result in dimensions if result.confidence != ConfidenceBand.LIMITED), None)
        challenge = next((item for item in definition.weekly_challenges if target and item.dimension == target.dimension_id), definition.weekly_challenges[0])
        ordered_dimensions = [result.dimension_id for result in ([target] if target else []) + meaningful + dimensions if result]
        candidates = []
        for dimension_id in ordered_dimensions:
            candidates.extend(item for item in definition.weekly_challenges if item.dimension == dimension_id and item.id != challenge.id)
        candidates.extend(item for item in definition.weekly_challenges if item.id != challenge.id)
        suggestions = []
        seen_ids = set()
        for item in candidates:
            if item.id in seen_ids:
                continue
            seen_ids.add(item.id)
            suggestions.append(Recommendation(id=f"practice-{item.id}", text=getattr(item.instruction, session.locale)))
            if len(suggestions) == 3:
                break
        lead = max(meaningful, key=lambda item: abs(item.evidence.raw_score), default=dimensions[0])
        evidence_moments = []
        if definition.analyzer.slug == "conflict-insights":
            scenarios = {item.id: item for item in definition.scenarios}
            for scenario_id, response in session.responses.items():
                scenario = scenarios[scenario_id]
                option = next(item for item in scenario.options if item.id == response.option_id)
                if lead.dimension_id in option.scores:
                    evidence_moments.append(EvidenceMoment(
                        id=scenario_id,
                        title=getattr(scenario.prompt, session.locale),
                        observation=getattr(option.text, session.locale),
                    ))
                if len(evidence_moments) == 3:
                    break
            if not evidence_moments:
                raise AssessmentError("Conflict result is missing required authored evidence")
        elif definition.analyzer.slug == "leadership-insights":
            scenarios = {item.id: item for item in definition.scenarios}
            for scenario_id, response in session.responses.items():
                scenario = scenarios[scenario_id]
                option = next(item for item in scenario.options if item.id == response.option_id)
                if lead.dimension_id in option.scores:
                    evidence_moments.append(EvidenceMoment(id=scenario_id, title=getattr(scenario.prompt, session.locale), observation=getattr(option.text, session.locale)))
                if len(evidence_moments) == 3:
                    break
            if not evidence_moments:
                raise AssessmentError("Leadership result is missing required authored evidence")
        elif definition.analyzer.slug == "learning-insights":
            scenarios = {item.id: item for item in definition.scenarios}
            for scenario_id, response in session.responses.items():
                scenario = scenarios[scenario_id]
                option = next(item for item in scenario.options if item.id == response.option_id)
                if lead.dimension_id in option.scores:
                    evidence_moments.append(EvidenceMoment(id=scenario_id, title=getattr(scenario.prompt, session.locale), observation=getattr(option.text, session.locale)))
                if len(evidence_moments) == 3:
                    break
            if not evidence_moments:
                raise AssessmentError("Learning result is missing required authored evidence")
        summary = self._summary(session.locale, lead, definition)
        personality_note = None
        if session.personality_context:
            code = session.personality_context.type_code
            personality_note = self._localized(
                session.locale,
                f"Your responses add another practical layer to your {code} profile.",
                f"आपके उत्तर आपके {code} प्रोफ़ाइल में एक और व्यावहारिक परत जोड़ते हैं।",
                f"Vos réponses ajoutent une dimension pratique supplémentaire à votre profil {code}.",
                definition.analyzer.slug,
            )
        return AnalyzerResult(
            analyzer_slug=definition.analyzer.slug,
            analyzer_version=definition.analyzer.version,
            locale=session.locale,
            summary=summary,
            dimension_results=dimensions,
            strengths=strengths,
            blind_spots=blind_spots,
            misunderstandings=misunderstandings,
            practical_suggestions=suggestions,
            weekly_challenge=challenge,
            interpretations=selected_rules,
            evidence_moments=evidence_moments,
            personality_note=personality_note,
            disclaimer=getattr(definition.analyzer.disclosures, session.locale),
        )

    @staticmethod
    def _localized(locale: str, en: str, hi: str, fr: str | None = None, analyzer_slug: str | None = None) -> str:
        if locale == "hi": return hi
        if locale == "fr" and analyzer_slug == "communication-style" and fr: return fr
        return en

    @classmethod
    def _scenario_category(cls, analyzer_slug: str, category: str, locale: str) -> str:
        if analyzer_slug == "communication-style" and locale == "fr":
            return cls.COMMUNICATION_CATEGORIES_FR.get(category, category)
        return category

    @staticmethod
    def _dimension_name(definition: AnalyzerDefinition, dimension_id: str, locale: str) -> str:
        dimension = next(item for item in definition.dimensions if item.id == dimension_id)
        return getattr(dimension.name, locale)

    def _summary(self, locale: str, lead, definition: AnalyzerDefinition) -> str:
        name = self._dimension_name(definition, lead.dimension_id, locale)
        if lead.confidence == ConfidenceBand.MIXED:
            return self._localized(locale, f"Your responses suggest that {name} changes with context rather than following one fixed style.", f"आपके उत्तर संकेत देते हैं कि {name} एक स्थायी शैली के बजाय संदर्भ के साथ बदलता है।", f"Vos réponses suggèrent que votre tendance en matière de {name} varie selon le contexte plutôt que de suivre un style unique et constant.", definition.analyzer.slug)
        if lead.confidence == ConfidenceBand.LIMITED:
            return self._localized(locale, "Your responses offer a starting point for reflection; some patterns need more situations before they become clear.", "आपके उत्तर आत्मचिंतन की शुरुआत देते हैं; कुछ पैटर्न स्पष्ट होने के लिए और स्थितियों की जरूरत है।", "Vos réponses constituent un point de départ pour la réflexion ; certaines tendances nécessitent davantage de situations pour se préciser.", definition.analyzer.slug)
        tendency = "more present" if lead.direction == DirectionBand.HIGHER else "lighter"
        if definition.analyzer.slug == "conflict-insights":
            return self._localized(locale, f"Across these situations, {name} appears {tendency} in how you meet tension and repair.", f"इन स्थितियों में तनाव और सुधार से जुड़ी आपकी प्रतिक्रियाओं में {name} अधिक स्पष्ट दिखता है।")
        if definition.analyzer.slug == "leadership-insights":
            return self._localized(locale, f"Across these situations, {name} appears {tendency} in how you guide shared work.", f"इन स्थितियों में साझा काम को दिशा देने में {name} अधिक स्पष्ट दिखता है।")
        if definition.analyzer.slug == "learning-insights":
            return self._localized(locale, f"Across these situations, {name} appears {tendency} in how you build understanding and practice.", f"इन स्थितियों में समझ और अभ्यास बनाने में {name} अधिक स्पष्ट दिखता है।")
        return self._localized(locale, f"Across these situations, {name} appears {tendency} in your communication.", f"इन स्थितियों में आपके संवाद में {name} अधिक स्पष्ट दिखता है।", f"Dans ces situations, votre tendance en matière de {name} paraît {('plus marquée' if lead.direction == DirectionBand.HIGHER else 'moins marquée')} dans votre communication.", definition.analyzer.slug)

    def complete_session(self, session_id: str, access_token: str) -> ResultSnapshot:
        session = self._session(session_id, access_token)
        if session.status == SessionStatus.COMPLETED:
            snapshot = self.result_repository.get(session.result_id or "")
            if snapshot:
                return snapshot
            raise SessionConflictError("Assessment result unavailable")
        if len(session.responses) != len(session.scenario_ids):
            raise SessionConflictError("Complete every planned situation before finishing")
        definition = self.get_analyzer_definition(session.analyzer_slug, session.analyzer_version)
        snapshot = ResultSnapshot(
            id=str(uuid.uuid4()),
            session_id=session.id,
            access_token=session.access_token,
            created_at=datetime.now(timezone.utc),
            result=self._result_from_session(session, definition),
        )
        self.result_repository.save(snapshot)
        session.status = SessionStatus.COMPLETED
        session.completed_at = snapshot.created_at
        session.result_id = snapshot.id
        self.session_repository.save(session)
        return snapshot

    def get_result(self, result_id: str, access_token: str) -> ResultSnapshot:
        snapshot = self.result_repository.get(result_id)
        if not snapshot or not secrets.compare_digest(snapshot.access_token, access_token):
            raise SessionNotFoundError("Result unavailable")
        return snapshot

    def claim_result(self, result_id: str, access_token: str, account_id: str) -> None:
        """Placeholder contract: account claiming requires future persistent ownership storage."""
        self.get_result(result_id, access_token)
        raise NotImplementedError("Result claiming is not available in this sprint")
