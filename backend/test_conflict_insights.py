from behavior_engine.models import AssessmentResponseInput
from behavior_engine.api import create_engine_router
from behavior_engine.service import AssessmentService
from fastapi import FastAPI
from fastapi.testclient import TestClient


def complete_conflict(locale: str, option_id: str):
    engine = AssessmentService()
    definition = engine.get_analyzer_definition("conflict-insights")
    assert definition.analyzer.status.value == "published"
    assert len(definition.dimensions) == 8
    assert len(definition.scenarios) == 12
    assert len(definition.weekly_challenges) == 15
    session = engine.create_session("conflict-insights", locale)
    for index, scenario in enumerate(definition.scenarios):
        engine.submit_response(
            session.id,
            session.access_token,
            AssessmentResponseInput(
                scenario_id=scenario.id,
                option_id=option_id,
                idempotency_key=f"conflict-{locale}-{index:02d}",
            ),
        )
    return engine.complete_session(session.id, session.access_token).result


def test_conflict_has_authored_bilingual_complete_results_without_scores():
    english = complete_conflict("en", "a")
    hindi = complete_conflict("hi", "c")
    for result in (english, hindi):
        assert result.analyzer_slug == "conflict-insights"
        assert len(result.practical_suggestions) == 3
        assert len({item.id for item in result.practical_suggestions}) == 3
        assert result.weekly_challenge is not None
        assert result.weekly_challenge.title.en and result.weekly_challenge.title.hi
        assert 1 <= len(result.evidence_moments) <= 3
        assert "overall_score" not in result.model_dump()
    assert english.summary != hindi.summary


def test_conflict_result_retrieval_requires_its_session_access_token():
    engine = AssessmentService()
    session = engine.create_session("conflict-insights", "en")
    definition = engine.get_analyzer_definition("conflict-insights")
    for index, scenario in enumerate(definition.scenarios):
        engine.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=scenario.id, option_id="a", idempotency_key=f"retrieve-{index:02d}"))
    snapshot = engine.complete_session(session.id, session.access_token)
    assert engine.get_result(snapshot.id, session.access_token).id == snapshot.id


def test_conflict_api_result_hides_scoring_internals():
    engine = AssessmentService()
    app = FastAPI()
    app.include_router(create_engine_router(engine), prefix="/api")
    client = TestClient(app)
    created = client.post("/api/analyzers/conflict-insights/sessions", json={"locale": "en"}).json()
    definition = engine.get_analyzer_definition("conflict-insights")
    headers = {"X-Assessment-Access": created["access_token"]}
    for index, scenario in enumerate(definition.scenarios):
        response = client.post(f"/api/analyzer-sessions/{created['session_id']}/responses", headers=headers, json={"scenario_id": scenario.id, "option_id": "a", "idempotency_key": f"conflict-api-{index:02d}"})
        assert response.status_code == 200
    completed = client.post(f"/api/analyzer-sessions/{created['session_id']}/complete", headers=headers)
    assert completed.status_code == 200
    payload = completed.json()["result"]
    assert len(payload["practical_suggestions"]) == 3
    assert payload["evidence_moments"]
    assert "raw_score" not in str(payload)
    assert "selector" not in str(payload)
