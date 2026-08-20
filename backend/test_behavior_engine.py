import json
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from behavior_engine.api import create_engine_router
from behavior_engine.content import ContentNotAvailableError, FileAnalyzerContentRepository, InvalidAnalyzerContentError
from behavior_engine.models import AnalyzerDefinition, AssessmentResponseInput, AssessmentSessionState, ConfidenceBand, PersonalityContext, SessionStatus, StoredResponse
from behavior_engine.repositories import MongoAnalyzerResultRepository, MongoAssessmentSessionRepository
from behavior_engine.service import AssessmentError, AssessmentService, SessionConflictError, SessionExpiredError, SessionNotFoundError
from behavior_engine.timestamps import normalize_utc


def service(ttl=timedelta(hours=1)):
    return AssessmentService(allow_test_drafts=True, session_ttl=ttl)


class FakeMongoCollection:
    """Small Mongo-shaped store for the durable session regression test."""

    def __init__(self, mongo_naive_datetimes=False):
        self.documents = {}
        self.mongo_naive_datetimes = mongo_naive_datetimes

    def replace_one(self, query, document, upsert=False):
        assert upsert and query["_id"] == document["_id"]
        self.documents[document["_id"]] = dict(document)

    def find_one(self, query):
        document = self.documents.get(query["_id"])
        if not document:
            return None
        restored = dict(document)
        if self.mongo_naive_datetimes and isinstance(restored.get("expires_at"), datetime):
            restored["expires_at"] = restored["expires_at"].astimezone(timezone.utc).replace(tzinfo=None)
        return restored


def test_durable_repositories_keep_every_published_insight_session_available_across_service_instances():
    sessions = FakeMongoCollection(mongo_naive_datetimes=True)
    results = FakeMongoCollection(mongo_naive_datetimes=True)
    first = AssessmentService(
        session_repository=MongoAssessmentSessionRepository(sessions),
        result_repository=MongoAnalyzerResultRepository(results),
    )
    for slug in ("communication-style", "conflict-insights", "leadership-insights", "learning-insights"):
        created = first.create_session(slug, "en")
        # Mirrors the next browser request landing on a fresh Render process.
        second = AssessmentService(
            session_repository=MongoAssessmentSessionRepository(sessions),
            result_repository=MongoAnalyzerResultRepository(results),
        )
        restored = second.get_next_scenario(created.id, created.access_token)
        assert restored and restored["scenario_id"] == created.scenario_ids[0]
        definition = second.get_analyzer_definition(slug)
        for index, scenario in enumerate(definition.scenarios):
            second.submit_response(
                created.id,
                created.access_token,
                AssessmentResponseInput(scenario_id=scenario.id, option_id="a", idempotency_key=f"{slug}-{index}"),
            )
        snapshot = second.complete_session(created.id, created.access_token)
        # Simulate a legacy BSON result timestamp returned by PyMongo without tzinfo.
        results.documents[snapshot.id]["created_at"] = snapshot.created_at.replace(tzinfo=None)
        third = AssessmentService(
            session_repository=MongoAssessmentSessionRepository(sessions),
            result_repository=MongoAnalyzerResultRepository(results),
        )
        restored_snapshot = third.get_result(snapshot.id, created.access_token)
        assert restored_snapshot.result.analyzer_slug == slug
        assert restored_snapshot.created_at.tzinfo == timezone.utc


def test_mongo_style_naive_session_timestamps_are_normalized_for_create_reload_and_api_access():
    sessions = FakeMongoCollection(mongo_naive_datetimes=True)
    engine = AssessmentService(session_repository=MongoAssessmentSessionRepository(sessions))
    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)

    for slug in ("communication", "conflict", "leadership", "learning"):
        created = client.post(f"/api/analyzers/{slug}/sessions", json={"locale": "en"})
        assert created.status_code == 201
        credentials = created.json()
        persisted = sessions.documents[credentials["session_id"]]
        assert persisted["expires_at"].tzinfo == timezone.utc
        retrieved = client.get(
            f"/api/analyzer-sessions/{credentials['session_id']}",
            headers={"X-Assessment-Access": credentials["access_token"]},
        )
        assert retrieved.status_code == 200
        assert retrieved.json()["status"] == "active"
        assert retrieved.json()["expires_at"].endswith(("Z", "+00:00"))

    assert client.post("/api/analyzers/decision/sessions", json={"locale": "en"}).status_code == 404


def test_naive_expiry_is_rejected_and_aware_datetimes_remain_utc():
    naive_utc = datetime(2030, 1, 1, 12, 0, 0)
    aware_non_utc = datetime(2030, 1, 1, 17, 30, tzinfo=timezone(timedelta(hours=5, minutes=30)))
    assert normalize_utc(naive_utc) == datetime(2030, 1, 1, 12, 0, tzinfo=timezone.utc)
    assert normalize_utc(aware_non_utc) == datetime(2030, 1, 1, 12, 0, tzinfo=timezone.utc)

    sessions = FakeMongoCollection(mongo_naive_datetimes=True)
    engine = AssessmentService(
        session_repository=MongoAssessmentSessionRepository(sessions),
        session_ttl=timedelta(seconds=-1),
    )
    expired = engine.create_session("leadership", "en")
    with pytest.raises(SessionExpiredError):
        engine.get_next_scenario(expired.id, expired.access_token)


def complete_with_option(service_instance, option_id="a", locale="en", personality=None):
    session = service_instance.create_session("communication-style", locale, personality)
    definition = service_instance.get_analyzer_definition("communication-style")
    for index, scenario in enumerate(definition.scenarios):
        service_instance.submit_response(
            session.id,
            session.access_token,
            AssessmentResponseInput(scenario_id=scenario.id, option_id=option_id, idempotency_key=f"response-{index:03d}"),
        )
    return session, service_instance.complete_session(session.id, session.access_token)


def test_published_content_is_default_and_draft_requires_explicit_test_override():
    published = AssessmentService().get_analyzer_definition("communication-style")
    assert published.analyzer.version == "1.0.0"
    assert published.analyzer.status.value == "published"
    with pytest.raises(ContentNotAvailableError):
        AssessmentService().get_analyzer_definition("communication-style", "1.0.0-draft")
    definition = service().get_analyzer_definition("communication-style", "1.0.0-draft")
    assert definition.analyzer.version == "1.0.0-draft"
    assert len(definition.scenarios) == 12


def test_backend_packaged_registry_is_cwd_independent_and_exposes_only_public_analyzers(monkeypatch):
    """Render starts from backend/, so registry discovery must not depend on cwd."""
    repository = FileAnalyzerContentRepository()
    assert repository.content_directory == Path(__file__).resolve().parent / "behavior_engine" / "analyzer_content"
    monkeypatch.chdir(Path(__file__).resolve().parent)
    assert repository.validate_required_published_analyzers() == (
        "communication-style",
        "conflict-insights",
        "leadership-insights",
        "learning-insights",
    )

    engine = AssessmentService(content_repository=repository)
    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)
    for alias, canonical_slug in FileAnalyzerContentRepository.SLUG_ALIASES.items():
        created = client.post(f"/api/analyzers/{alias}/sessions", json={"locale": "en"})
        assert created.status_code == 201
        session_id = created.json()["session_id"]
        assert engine._session(session_id, created.json()["access_token"]).analyzer_slug == canonical_slug
    assert client.post("/api/analyzers/decision/sessions", json={"locale": "en"}).status_code == 404
    assert client.post("/api/analyzers/decision-style/sessions", json={"locale": "en"}).status_code == 404


def test_missing_packaged_definition_or_release_manifest_fails_explicitly(tmp_path):
    source_repository = FileAnalyzerContentRepository()
    content_directory = tmp_path / "analyzer_content"
    shutil.copytree(source_repository.content_directory, content_directory)
    repository = FileAnalyzerContentRepository(content_directory)

    (content_directory / "leadership-insights.v1.json").unlink()
    with pytest.raises(InvalidAnalyzerContentError, match="Analyzer content is invalid"):
        repository.validate_required_published_analyzers()

    shutil.copytree(source_repository.content_directory, content_directory, dirs_exist_ok=True)
    (content_directory / "learning-insights.v1.release.json").unlink()
    with pytest.raises(InvalidAnalyzerContentError, match="Analyzer release manifest is invalid"):
        repository.validate_required_published_analyzers()


def test_malformed_duplicate_and_missing_locale_content_are_rejected(tmp_path):
    source = FileAnalyzerContentRepository().content_directory / "communication-analyzer.v1.draft.json"
    raw = json.loads(source.read_text())
    raw["dimensions"].append(raw["dimensions"][0])
    duplicate = tmp_path / "duplicate.json"
    duplicate.write_text(json.dumps(raw))
    repository = FileAnalyzerContentRepository(tmp_path)
    repository.DRAFT_FILES = {"communication-style": "duplicate.json"}
    with pytest.raises(InvalidAnalyzerContentError):
        repository.get("communication-style", "1.0.0-draft", allow_test_drafts=True)

    raw = json.loads(source.read_text())
    del raw["scenarios"][0]["prompt"]["hi"]
    missing_locale = tmp_path / "missing-locale.json"
    missing_locale.write_text(json.dumps(raw))
    repository.DRAFT_FILES = {"communication-style": "missing-locale.json"}
    with pytest.raises(InvalidAnalyzerContentError):
        repository.get("communication-style", "1.0.0-draft", allow_test_drafts=True)


def test_session_selector_is_fixed_localized_and_hides_scoring_rules():
    engine = service()
    session = engine.create_session("communication-style", "hi")
    scenario = engine.get_next_scenario(session.id, session.access_token)
    assert scenario["scenario_id"] == "meeting-unclear-update-01"
    assert scenario["prompt"]
    assert len(scenario["options"]) == 4
    assert all("scores" not in option for option in scenario["options"])
    assert scenario["progress"] == {"answered": 0, "total": 12}


def test_response_validation_idempotency_and_completion_freeze():
    engine = service()
    session = engine.create_session("communication-style", "en")
    first = session.scenario_ids[0]
    payload = AssessmentResponseInput(scenario_id=first, option_id="a", idempotency_key="same-response")
    engine.submit_response(session.id, session.access_token, payload)
    assert len(engine.submit_response(session.id, session.access_token, payload).responses) == 1
    recovered_retry = AssessmentResponseInput(scenario_id=first, option_id="a", idempotency_key="new-request-after-recovery")
    assert len(engine.submit_response(session.id, session.access_token, recovered_retry).responses) == 1
    with pytest.raises(SessionConflictError):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=first, option_id="b", idempotency_key="change-key"))
    with pytest.raises(AssessmentError):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id="unknown-scenario", option_id="a", idempotency_key="unknown-scenario"))
    with pytest.raises(AssessmentError):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=session.scenario_ids[1], option_id="unknown", idempotency_key="unknown-option"))
    for index, scenario_id in enumerate(session.scenario_ids[1:], 1):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=scenario_id, option_id="a", idempotency_key=f"answer-{index:03d}"))
    snapshot = engine.complete_session(session.id, session.access_token)
    assert engine.complete_session(session.id, session.access_token).id == snapshot.id
    with pytest.raises(SessionConflictError):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=first, option_id="a", idempotency_key="after-complete"))
    with pytest.raises(SessionConflictError):
        engine.update_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=first, option_id="b", idempotency_key="after-complete-update"))


def test_previous_scenario_view_and_active_response_revision_are_safe():
    engine = service()
    session = engine.create_session("communication-style", "en")
    first, second = session.scenario_ids[:2]
    engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=first, option_id="a", idempotency_key="first-answer"))
    engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=second, option_id="b", idempotency_key="second-answer"))
    view = engine.get_scenario(session.id, session.access_token, first)
    assert view["selected_option_id"] == "a" and view["progress"]["index"] == 0
    engine.update_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=first, option_id="c", idempotency_key="revised-answer"))
    assert engine.get_scenario(session.id, session.access_token, first)["selected_option_id"] == "c"
    assert engine.get_scenario(session.id, session.access_token, second)["selected_option_id"] == "b"


def test_scoring_is_deterministic_has_no_overall_score_and_supports_personality_context():
    engine = service()
    personality = PersonalityContext(type_code="INTJ", source="user_selected")
    _, first = complete_with_option(engine, "a", personality=personality)
    _, second = complete_with_option(service(), "a", personality=personality)
    assert first.result.model_dump(exclude={"analyzer_version"}) == second.result.model_dump(exclude={"analyzer_version"})
    assert "overall_score" not in first.result.model_dump()
    assert "INTJ" in first.result.personality_note
    assert "most INTJs" not in first.result.personality_note
    assert any(item.direction.value == "higher" for item in first.result.dimension_results)


def test_negative_contributions_mixed_and_limited_confidence():
    engine = service()
    session = engine.create_session("communication-style", "en")
    # Selected options deliberately vary directional signals; unscored dimensions remain limited.
    choices = ["d", "b", "b", "a", "b", "b", "c", "c", "c", "b", "b", "c"]
    for index, (scenario_id, option_id) in enumerate(zip(session.scenario_ids, choices)):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=scenario_id, option_id=option_id, idempotency_key=f"mixed-{index:03d}"))
    result = engine.complete_session(session.id, session.access_token).result
    assert any(item.confidence in {ConfidenceBand.MIXED, ConfidenceBand.LIMITED} for item in result.dimension_results)
    limited = next(item for item in result.dimension_results if item.confidence == ConfidenceBand.LIMITED)
    assert "not enough evidence" in limited.explanation
    assert len(result.strengths) >= 3
    assert len(result.misunderstandings) >= 2
    assert len(result.practical_suggestions) == 3
    assert len({item.id for item in result.practical_suggestions}) == 3
    assert result.weekly_challenge.id not in {item.id.replace("practice-", "") for item in result.practical_suggestions}


def test_expiry_and_result_access_are_not_enumerable():
    engine = service(timedelta(seconds=-1))
    session = engine.create_session("communication-style", "en")
    with pytest.raises(SessionExpiredError):
        engine.get_next_scenario(session.id, session.access_token)
    active_engine = service()
    session, snapshot = complete_with_option(active_engine)
    with pytest.raises(SessionNotFoundError):
        active_engine.get_result(snapshot.id, "wrong-token")
    assert active_engine.get_result(snapshot.id, session.access_token).id == snapshot.id


def test_api_vertical_slice_hides_scoring_internals_and_handles_errors():
    engine = service()
    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)
    created = client.post("/api/analyzers/communication-style/sessions", json={"locale": "en"})
    assert created.status_code == 201
    credentials = created.json()
    headers = {"X-Assessment-Access": credentials["access_token"]}
    next_response = client.get(f"/api/analyzer-sessions/{credentials['session_id']}/next", headers=headers)
    assert next_response.status_code == 200
    assert "scores" not in next_response.text
    assert client.get(f"/api/analyzer-sessions/{credentials['session_id']}/next").status_code == 404
    assert client.post(f"/api/analyzer-sessions/{credentials['session_id']}/responses", headers=headers, json={"scenario_id": "bad", "option_id": "a", "idempotency_key": "bad-response"}).status_code == 422


def test_analyzer_specific_locale_capabilities_allow_extended_communication_only():
    engine = AssessmentService()
    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)

    assert FileAnalyzerContentRepository.ANALYZER_LOCALES == {
        "communication-style": ("en", "hi", "fr", "ja"),
        "conflict-insights": ("en", "hi"),
        "leadership-insights": ("en", "hi"),
        "learning-insights": ("en", "hi"),
    }
    for locale in ("en", "hi", "fr", "ja"):
        assert client.post("/api/analyzers/communication-style/sessions", json={"locale": locale}).status_code == 201
    for slug in ("conflict-insights", "leadership-insights", "learning-insights"):
        assert client.post(f"/api/analyzers/{slug}/sessions", json={"locale": "fr"}).status_code == 422
    for slug in ("conflict-insights", "leadership-insights", "learning-insights"):
        assert client.post(f"/api/analyzers/{slug}/sessions", json={"locale": "ja"}).status_code == 422

    created = client.post("/api/analyzers/communication-style/sessions", json={"locale": "fr"})
    credentials = created.json()
    headers = {"X-Assessment-Access": credentials["access_token"]}
    session = client.get(f"/api/analyzer-sessions/{credentials['session_id']}", headers=headers)
    assert session.status_code == 200
    assert session.json()["status"] == "active"
    assert session.json()["locale"] == "fr"
    scenario = client.get(f"/api/analyzer-sessions/{credentials['session_id']}/next", headers=headers).json()["scenario"]
    definition = engine.get_analyzer_definition("communication-style")
    authored = definition.scenarios[0]
    assert scenario["category"] == "Réunion"
    assert scenario["prompt"] == authored.prompt.fr
    assert [option["text"] for option in scenario["options"]] == [option.text.fr for option in authored.options]

    created = client.post("/api/analyzers/communication-style/sessions", json={"locale": "ja"})
    credentials = created.json()
    headers = {"X-Assessment-Access": credentials["access_token"]}
    session = client.get(f"/api/analyzer-sessions/{credentials['session_id']}", headers=headers)
    assert session.status_code == 200
    assert session.json()["locale"] == "ja"
    scenario = client.get(f"/api/analyzer-sessions/{credentials['session_id']}/next", headers=headers).json()["scenario"]
    assert scenario["category"] == "会議"
    assert scenario["prompt"] == authored.prompt.ja
    assert [option["text"] for option in scenario["options"]] == [option.text.ja for option in authored.options]


def test_french_communication_end_to_end_is_localized_and_scoring_matches_english():
    personality = PersonalityContext(type_code="INTJ", source="user_selected")
    english_engine = AssessmentService()
    french_engine = AssessmentService()
    _, english = complete_with_option(english_engine, "a", locale="en", personality=personality)
    french_session, french = complete_with_option(french_engine, "a", locale="fr", personality=personality)

    english_scores = [(item.dimension_id, item.direction, item.confidence, item.evidence.model_dump()) for item in english.result.dimension_results]
    french_scores = [(item.dimension_id, item.direction, item.confidence, item.evidence.model_dump()) for item in french.result.dimension_results]
    assert french_scores == english_scores
    assert french.result.locale == "fr"
    assert french.result.summary != english.result.summary
    assert french.result.strengths != english.result.strengths
    assert french.result.blind_spots != english.result.blind_spots
    assert french.result.misunderstandings != english.result.misunderstandings
    assert [item.text for item in french.result.practical_suggestions] != [item.text for item in english.result.practical_suggestions]
    assert all(item.explanation != english.result.dimension_results[index].explanation for index, item in enumerate(french.result.dimension_results))
    assert french.result.weekly_challenge.title.fr
    assert french.result.weekly_challenge.instruction.fr
    assert french.result.personality_note == "Vos réponses ajoutent une dimension pratique supplémentaire à votre profil INTJ."
    assert french.result.disclaimer == french_engine.get_analyzer_definition("communication-style").analyzer.disclosures.fr

    app = FastAPI()
    app.include_router(create_engine_router(french_engine), prefix="/api")
    client = TestClient(app)
    headers = {"X-Assessment-Access": french_session.access_token}
    retrieved = client.get(f"/api/analyzer-results/{french.id}", headers=headers)
    assert retrieved.status_code == 200
    payload = retrieved.json()["result"]
    assert payload["locale"] == "fr"
    assert payload["summary"] == french.result.summary
    assert payload["strengths"] == french.result.strengths
    assert payload["blind_spots"] == french.result.blind_spots
    assert payload["misunderstandings"] == french.result.misunderstandings
    assert payload["personality_note"] == french.result.personality_note


def test_japanese_communication_authoring_is_complete_localized_and_score_neutral():
    source = FileAnalyzerContentRepository().content_directory / "communication-analyzer.v1.draft.json"
    raw = json.loads(source.read_text(encoding="utf-8"))
    definition = AnalyzerDefinition.model_validate(raw)
    localized_records = []

    def collect(value):
        if isinstance(value, dict):
            if all(isinstance(value.get(locale), str) for locale in ("en", "hi", "fr", "ja")):
                localized_records.append(value)
            for child in value.values():
                collect(child)
        elif isinstance(value, list):
            for child in value:
                collect(child)

    collect(raw)
    assert len(localized_records) == 111
    assert all(item["ja"].strip() and item["ja"] != item["en"] for item in localized_records)
    assert all(any("ぁ" <= character <= "ん" or "ァ" <= character <= "ン" or "一" <= character <= "龯" for character in item["ja"]) for item in localized_records)

    class DraftRepository:
        def get(self, slug, version=None, allow_test_drafts=False):
            if FileAnalyzerContentRepository.canonical_slug(slug) != "communication-style":
                raise ContentNotAvailableError("Analyzer unavailable")
            return definition

    engine = AssessmentService(content_repository=DraftRepository())
    for locale in ("en", "hi", "fr", "ja"):
        assert engine.create_session("communication-style", locale).locale == locale

    personality = PersonalityContext(type_code="INTJ", source="user_selected")

    def generated_result(locale, choices=None):
        now = datetime.now(timezone.utc)
        selected = choices or ["a"] * len(definition.scenarios)
        responses = {
            scenario.id: StoredResponse(
                scenario_id=scenario.id,
                option_id=selected[index],
                idempotency_key=f"{locale}-{index:03d}",
                submitted_at=now,
            )
            for index, scenario in enumerate(definition.scenarios)
        }
        session = AssessmentSessionState(
            id=f"authoring-{locale}",
            access_token=f"authoring-access-{locale}",
            analyzer_slug="communication-style",
            analyzer_version=definition.analyzer.version,
            locale=locale,
            scenario_ids=[scenario.id for scenario in definition.scenarios],
            status=SessionStatus.ACTIVE,
            created_at=now,
            expires_at=now + timedelta(hours=1),
            responses=responses,
            personality_context=personality,
        )
        return engine._result_from_session(session, definition)

    english = generated_result("en")
    hindi = generated_result("hi")
    french = generated_result("fr")
    japanese = generated_result("ja")

    def score_signature(result):
        return [
            (item.dimension_id, item.direction, item.confidence, item.evidence.model_dump())
            for item in result.dimension_results
        ]

    assert score_signature(japanese) == score_signature(english) == score_signature(french)
    assert japanese.weekly_challenge.id == english.weekly_challenge.id == french.weekly_challenge.id
    assert score_signature(hindi) == score_signature(english)

    japanese_text = [
        japanese.summary,
        *japanese.strengths,
        *japanese.blind_spots,
        *japanese.misunderstandings,
        *(item.text for item in japanese.practical_suggestions),
        *(item.explanation for item in japanese.dimension_results),
        *(item.caveat for item in japanese.dimension_results if item.caveat),
        japanese.weekly_challenge.title.ja,
        japanese.weekly_challenge.instruction.ja,
        japanese.personality_note,
        japanese.disclaimer,
    ]
    assert all(text and any("ぁ" <= character <= "ん" or "ァ" <= character <= "ン" or "一" <= character <= "龯" for character in text) for text in japanese_text)
    assert japanese.summary != english.summary
    assert japanese.strengths != english.strengths
    assert japanese.blind_spots != english.blind_spots
    assert japanese.misunderstandings != english.misunderstandings
    assert japanese.personality_note == "回答から、INTJプロフィールに実践的な視点がもう一つ加わります。"
    assert french.summary != english.summary and hindi.summary != english.summary

    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)
    created = client.post(
        "/api/analyzers/communication-style/sessions",
        json={"locale": "ja", "personality_context": {"type_code": "INTJ", "source": "user_selected"}},
    )
    assert created.status_code == 201
    credentials = created.json()
    headers = {"X-Assessment-Access": credentials["access_token"]}
    session = client.get(f"/api/analyzer-sessions/{credentials['session_id']}", headers=headers)
    assert session.status_code == 200
    assert session.json()["locale"] == "ja"
    assert session.json()["total"] == 12

    seen_scenarios = []
    for index, authored in enumerate(definition.scenarios):
        next_response = client.get(f"/api/analyzer-sessions/{credentials['session_id']}/next", headers=headers)
        assert next_response.status_code == 200
        scenario = next_response.json()["scenario"]
        seen_scenarios.append(scenario["scenario_id"])
        assert scenario["prompt"] == authored.prompt.ja
        assert [option["text"] for option in scenario["options"]] == [option.text.ja for option in authored.options]
        assert any("ぁ" <= character <= "ん" or "ァ" <= character <= "ン" or "一" <= character <= "龯" for character in scenario["category"])
        submitted = client.post(
            f"/api/analyzer-sessions/{credentials['session_id']}/responses",
            headers=headers,
            json={"scenario_id": scenario["scenario_id"], "option_id": "a", "idempotency_key": f"ja-api-{index:03d}"},
        )
        assert submitted.status_code == 200
        assert submitted.json()["answered"] == index + 1
    assert seen_scenarios == [scenario.id for scenario in definition.scenarios]

    completed = client.post(f"/api/analyzer-sessions/{credentials['session_id']}/complete", headers=headers)
    assert completed.status_code == 200
    retrieved = client.get(f"/api/analyzer-results/{completed.json()['result_id']}", headers=headers)
    assert retrieved.status_code == 200
    payload = retrieved.json()["result"]
    assert payload["locale"] == "ja"
    result_text = [
        payload["summary"],
        *payload["strengths"],
        *payload["blind_spots"],
        *payload["misunderstandings"],
        *(item["text"] for item in payload["practical_suggestions"]),
        *(item["explanation"] for item in payload["dimension_results"]),
        *(item["caveat"] for item in payload["dimension_results"] if item.get("caveat")),
        payload["weekly_challenge"]["title"]["ja"],
        payload["weekly_challenge"]["instruction"]["ja"],
        payload["personality_note"],
        payload["disclaimer"],
    ]
    assert all(text and any("ぁ" <= character <= "ん" or "ァ" <= character <= "ン" or "一" <= character <= "龯" for character in text) for text in result_text)
    assert payload["summary"] == japanese.summary
    assert payload["personality_note"] == japanese.personality_note

    for choices in (
        ["d", "b", "b", "a", "b", "b", "c", "c", "c", "b", "b", "c"],
        ["d"] * len(definition.scenarios),
    ):
        english_variant = generated_result("en", choices)
        french_variant = generated_result("fr", choices)
        japanese_variant = generated_result("ja", choices)
        assert score_signature(japanese_variant) == score_signature(english_variant) == score_signature(french_variant)
        assert japanese_variant.weekly_challenge.id == english_variant.weekly_challenge.id == french_variant.weekly_challenge.id
        variant_text = [
            japanese_variant.summary,
            *japanese_variant.strengths,
            *japanese_variant.blind_spots,
            *japanese_variant.misunderstandings,
            *(item.explanation for item in japanese_variant.dimension_results),
            *(item.caveat for item in japanese_variant.dimension_results if item.caveat),
        ]
        assert all(text and any("ぁ" <= character <= "ん" or "ァ" <= character <= "ン" or "一" <= character <= "龯" for character in text) for text in variant_text)


def test_safe_result_text_has_no_diagnostic_hiring_or_benchmarking_claims():
    _, snapshot = complete_with_option(service())
    rendered = json.dumps(snapshot.result.model_dump(mode="json")).lower()
    for prohibited in ("diagnosis", "hiring eligibility", "most intj", "scientifically reliable", "overall_score"):
        assert prohibited not in rendered
