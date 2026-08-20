from typing import Optional

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from .content import ContentNotAvailableError
from .models import AssessmentResponseInput, LocaleCode, PersonalityContext
from .service import AssessmentError, AssessmentService, SessionConflictError, SessionExpiredError, SessionNotFoundError


class SessionCreateInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    locale: LocaleCode
    personality_context: Optional[PersonalityContext] = None


def _access_token(value: Optional[str]) -> str:
    if not value:
        raise HTTPException(status_code=404, detail="Assessment unavailable")
    return value


def _error(error: Exception) -> HTTPException:
    if isinstance(error, HTTPException):
        return error
    if isinstance(error, (SessionNotFoundError, ContentNotAvailableError)):
        return HTTPException(status_code=404, detail="Assessment unavailable")
    if isinstance(error, SessionExpiredError):
        return HTTPException(status_code=410, detail="Assessment expired")
    if isinstance(error, SessionConflictError):
        return HTTPException(status_code=409, detail=str(error))
    return HTTPException(status_code=422, detail=str(error))


def _safe_result(result) -> dict:
    """Return reflective result content without internal scoring evidence."""
    return result.model_dump(exclude={"dimension_results": {"__all__": {"evidence"}}})


def create_engine_router(service: Optional[AssessmentService] = None) -> APIRouter:
    service = service or AssessmentService()
    router = APIRouter(tags=["behavior-engine"])

    @router.get("/analyzers/{slug}")
    def get_analyzer(slug: str, locale: str = "en") -> dict:
        try:
            return service.get_safe_analyzer_metadata(slug, locale)
        except Exception as error:
            raise _error(error) from error

    @router.post("/analyzers/{slug}/sessions", status_code=201)
    def create_session(slug: str, payload: SessionCreateInput) -> dict:
        try:
            session = service.create_session(slug, payload.locale, payload.personality_context)
            return {"session_id": session.id, "access_token": session.access_token, "expires_at": session.expires_at, "status": session.status}
        except Exception as error:
            raise _error(error) from error

    @router.get("/analyzer-sessions/{session_id}")
    def get_session(session_id: str, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            session = service._session(session_id, _access_token(x_assessment_access))
            return {"session_id": session.id, "status": session.status, "locale": session.locale, "answered": len(session.responses), "total": len(session.scenario_ids), "scenario_ids": session.scenario_ids, "answered_scenario_ids": [scenario_id for scenario_id in session.scenario_ids if scenario_id in session.responses], "expires_at": session.expires_at}
        except Exception as error:
            raise _error(error) from error

    @router.get("/analyzer-sessions/{session_id}/scenarios/{scenario_id}")
    def get_scenario(session_id: str, scenario_id: str, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            return {"scenario": service.get_scenario(session_id, _access_token(x_assessment_access), scenario_id)}
        except Exception as error:
            raise _error(error) from error

    @router.get("/analyzer-sessions/{session_id}/next")
    def next_scenario(session_id: str, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            scenario = service.get_next_scenario(session_id, _access_token(x_assessment_access))
            return {"scenario": scenario}
        except Exception as error:
            raise _error(error) from error

    @router.post("/analyzer-sessions/{session_id}/responses")
    def submit_response(session_id: str, payload: AssessmentResponseInput, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            session = service.submit_response(session_id, _access_token(x_assessment_access), payload)
            return {"status": session.status, "answered": len(session.responses), "total": len(session.scenario_ids)}
        except Exception as error:
            raise _error(error) from error

    @router.put("/analyzer-sessions/{session_id}/responses")
    def update_response(session_id: str, payload: AssessmentResponseInput, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            session = service.update_response(session_id, _access_token(x_assessment_access), payload)
            return {"status": session.status, "answered": len(session.responses), "total": len(session.scenario_ids)}
        except Exception as error:
            raise _error(error) from error

    @router.post("/analyzer-sessions/{session_id}/complete")
    def complete(session_id: str, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            snapshot = service.complete_session(session_id, _access_token(x_assessment_access))
            return {"result_id": snapshot.id, "result": _safe_result(snapshot.result)}
        except Exception as error:
            raise _error(error) from error

    @router.get("/analyzer-results/{result_id}")
    def get_result(result_id: str, x_assessment_access: Optional[str] = Header(default=None)) -> dict:
        try:
            snapshot = service.get_result(result_id, _access_token(x_assessment_access))
            return {"result_id": snapshot.id, "created_at": snapshot.created_at, "result": _safe_result(snapshot.result)}
        except Exception as error:
            raise _error(error) from error

    return router
