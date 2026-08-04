import json
from datetime import timedelta

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from behavior_engine.api import create_engine_router
from behavior_engine.content import ContentNotAvailableError, FileAnalyzerContentRepository, InvalidAnalyzerContentError
from behavior_engine.models import AssessmentResponseInput, ConfidenceBand, PersonalityContext, SessionStatus
from behavior_engine.service import AssessmentError, AssessmentService, SessionConflictError, SessionExpiredError, SessionNotFoundError


def service(ttl=timedelta(hours=1)):
    return AssessmentService(allow_test_drafts=True, session_ttl=ttl)


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


def test_safe_result_text_has_no_diagnostic_hiring_or_benchmarking_claims():
    _, snapshot = complete_with_option(service())
    rendered = json.dumps(snapshot.result.model_dump(mode="json")).lower()
    for prohibited in ("diagnosis", "hiring eligibility", "most intj", "scientifically reliable", "overall_score"):
        assert prohibited not in rendered
