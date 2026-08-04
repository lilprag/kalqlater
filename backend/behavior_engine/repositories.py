from __future__ import annotations

from typing import Dict, Protocol

from .models import AssessmentSessionState, ResultSnapshot


class AssessmentSessionRepository(Protocol):
    def save(self, session: AssessmentSessionState) -> None: ...
    def get(self, session_id: str) -> AssessmentSessionState | None: ...


class AnalyzerResultRepository(Protocol):
    def save(self, snapshot: ResultSnapshot) -> None: ...
    def get(self, result_id: str) -> ResultSnapshot | None: ...


class InMemoryAssessmentSessionRepository:
    def __init__(self) -> None:
        self._sessions: Dict[str, AssessmentSessionState] = {}

    def save(self, session: AssessmentSessionState) -> None:
        self._sessions[session.id] = session.model_copy(deep=True)

    def get(self, session_id: str) -> AssessmentSessionState | None:
        session = self._sessions.get(session_id)
        return session.model_copy(deep=True) if session else None


class InMemoryAnalyzerResultRepository:
    def __init__(self) -> None:
        self._results: Dict[str, ResultSnapshot] = {}

    def save(self, snapshot: ResultSnapshot) -> None:
        self._results[snapshot.id] = snapshot.model_copy(deep=True)

    def get(self, result_id: str) -> ResultSnapshot | None:
        snapshot = self._results.get(result_id)
        return snapshot.model_copy(deep=True) if snapshot else None
