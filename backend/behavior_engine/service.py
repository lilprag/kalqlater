from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from .content import AnalyzerContentRepository, ContentNotAvailableError, FileAnalyzerContentRepository
from .models import (
    AnalyzerDefinition, AnalyzerResult, AssessmentResponseInput, AssessmentSessionState,
    ConfidenceBand, DirectionBand, PersonalityContext, ResultSnapshot, SelectedInterpretation,
    SessionStatus, StoredResponse,
)
from .repositories import (
    AnalyzerResultRepository, AssessmentSessionRepository, InMemoryAnalyzerResultRepository,
    InMemoryAssessmentSessionRepository,
)
from .scoring import calculate_dimension_results


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
        if locale not in definition.analyzer.locales:
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
        if session.status == SessionStatus.EXPIRED or session.expires_at <= datetime.now(timezone.utc):
            session.status = SessionStatus.EXPIRED
            self.session_repository.save(session)
            raise SessionExpiredError("Assessment expired")
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
            "category": scenario.category,
            "prompt": getattr(scenario.prompt, session.locale),
            "options": [{"id": option.id, "text": getattr(option.text, session.locale)} for option in scenario.options],
            "progress": {"answered": len(session.responses), "total": len(session.scenario_ids)},
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
            if existing.idempotency_key == response.idempotency_key and existing.option_id == response.option_id:
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

    def _result_from_session(self, session: AssessmentSessionState, definition: AnalyzerDefinition) -> AnalyzerResult:
        response_map = {scenario_id: response.option_id for scenario_id, response in session.responses.items()}
        dimensions = calculate_dimension_results(definition, response_map, session.locale, len(session.scenario_ids) - len(response_map))
        by_id = {result.dimension_id: result for result in dimensions}
        selected_rules = []
        for rule in definition.interpretation_rules.cross_dimension_rules:
            if all(by_id[dimension].direction == expected and by_id[dimension].confidence != ConfidenceBand.LIMITED for dimension, expected in rule.when.items()):
                selected_rules.append(SelectedInterpretation(rule_id=rule.id, text=getattr(rule.summary, session.locale)))
        meaningful = [result for result in dimensions if result.confidence != ConfidenceBand.LIMITED]
        strengths = [result.explanation for result in meaningful if result.direction == DirectionBand.HIGHER][:3]
        blind_spots = [result.explanation for result in meaningful if result.direction == DirectionBand.LOWER][:3]
        misunderstandings = [item.text for item in selected_rules][:2]
        target = next((result for result in dimensions if result.direction in {DirectionBand.LOWER, DirectionBand.BALANCED} and result.confidence != ConfidenceBand.LIMITED), None)
        if target is None:
            target = next((result for result in dimensions if result.confidence != ConfidenceBand.LIMITED), None)
        challenge = next((item for item in definition.weekly_challenges if target and item.dimension == target.dimension_id), None)
        suggestions = [getattr(challenge.instruction, session.locale)] if challenge else []
        summary = (
            "Your responses suggest patterns across the situations you answered."
            if session.locale == "en" else "आपके उत्तरों से उन स्थितियों में कुछ पैटर्न दिखते हैं जिनका आपने उत्तर दिया।"
        )
        personality_note = None
        if session.personality_context:
            code = session.personality_context.type_code
            personality_note = (
                f"Your communication result adds another practical layer to your {code} profile."
                if session.locale == "en" else f"आपका संवाद परिणाम आपके {code} प्रोफ़ाइल में एक और व्यावहारिक परत जोड़ता है।"
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
            personality_note=personality_note,
            disclaimer=getattr(definition.analyzer.disclosures, session.locale),
        )

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
