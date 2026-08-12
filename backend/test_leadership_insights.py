from fastapi import FastAPI
from fastapi.testclient import TestClient

from behavior_engine.api import create_engine_router
from behavior_engine.models import AssessmentResponseInput
from behavior_engine.service import AssessmentService


def complete(locale: str, option_id: str):
    service = AssessmentService()
    definition = service.get_analyzer_definition("leadership-insights")
    assert len(definition.dimensions) == 8
    assert len(definition.scenarios) == 12
    assert len(definition.weekly_challenges) == 15
    session = service.create_session("leadership-insights", locale)
    for index, scenario in enumerate(definition.scenarios):
        service.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=scenario.id, option_id=option_id, idempotency_key=f"leadership-{locale}-{index:02d}"))
    return service.complete_session(session.id, session.access_token).result


def test_leadership_results_are_bilingual_evidence_based_and_exactly_three_recommendations():
    english, hindi = complete("en", "a"), complete("hi", "c")
    for result in (english, hindi):
        assert result.analyzer_slug == "leadership-insights"
        assert len(result.practical_suggestions) == 3
        assert len({item.id for item in result.practical_suggestions}) == 3
        assert result.weekly_challenge is not None
        assert 1 <= len(result.evidence_moments) <= 3
        assert "overall_score" not in result.model_dump()
    assert english.summary != hindi.summary


def test_leadership_api_hides_scoring_internals_from_private_result():
    service = AssessmentService()
    app = FastAPI()
    app.include_router(create_engine_router(service), prefix="/api")
    client = TestClient(app)
    created = client.post("/api/analyzers/leadership-insights/sessions", json={"locale": "en"}).json()
    headers = {"X-Assessment-Access": created["access_token"]}
    for index, scenario in enumerate(service.get_analyzer_definition("leadership-insights").scenarios):
        response = client.post(f"/api/analyzer-sessions/{created['session_id']}/responses", headers=headers, json={"scenario_id": scenario.id, "option_id": "a", "idempotency_key": f"leadership-api-{index:02d}"})
        assert response.status_code == 200
    payload = client.post(f"/api/analyzer-sessions/{created['session_id']}/complete", headers=headers).json()["result"]
    assert len(payload["practical_suggestions"]) == 3
    assert payload["evidence_moments"]
    assert "raw_score" not in str(payload)
    assert "selector" not in str(payload)
