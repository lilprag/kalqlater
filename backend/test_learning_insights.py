from behavior_engine.models import AssessmentResponseInput
from behavior_engine.service import AssessmentService

def test_learning_release_is_bilingual_and_deterministic():
    for locale in ('en', 'hi'):
        service = AssessmentService(); definition = service.get_analyzer_definition('learning-insights')
        assert definition.analyzer.version == '1.0.0' and len(definition.dimensions) == 8 and len(definition.scenarios) == 12
        assert {key for item in definition.scenarios for option in item.options for key in option.scores} == {item.id for item in definition.dimensions}
        session = service.create_session('learning-insights', locale)
        for index, scenario in enumerate(definition.scenarios): service.submit_response(session.id, session.access_token, AssessmentResponseInput(scenario_id=scenario.id, option_id='a', idempotency_key=f'learning-{locale}-{index:02d}'))
        result = service.complete_session(session.id, session.access_token).result
        assert result.summary and len(result.evidence_moments) and len(result.practical_suggestions) == 3 and len({item.id for item in result.practical_suggestions}) == 3 and result.weekly_challenge
        assert 'overall_score' not in result.model_dump()
