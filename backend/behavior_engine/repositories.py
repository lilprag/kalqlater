from __future__ import annotations

from typing import Dict, Protocol

from pymongo.collection import Collection

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


class MongoAssessmentSessionRepository:
    """Durable session storage for multi-request production assessments."""

    def __init__(self, collection: Collection):
        self.collection = collection

    def save(self, session: AssessmentSessionState) -> None:
        document = session.model_dump(mode="json")
        document["_id"] = session.id
        # TTL indexes require a BSON datetime rather than an ISO string.
        document["expires_at"] = session.expires_at
        self.collection.replace_one({"_id": session.id}, document, upsert=True)

    def get(self, session_id: str) -> AssessmentSessionState | None:
        document = self.collection.find_one({"_id": session_id})
        if not document:
            return None
        document.pop("_id", None)
        return AssessmentSessionState.model_validate(document)


class MongoAnalyzerResultRepository:
    """Durable private result storage paired with persisted assessment sessions."""

    def __init__(self, collection: Collection):
        self.collection = collection

    def save(self, snapshot: ResultSnapshot) -> None:
        document = snapshot.model_dump(mode="json")
        document["_id"] = snapshot.id
        self.collection.replace_one({"_id": snapshot.id}, document, upsert=True)

    def get(self, result_id: str) -> ResultSnapshot | None:
        document = self.collection.find_one({"_id": result_id})
        if not document:
            return None
        document.pop("_id", None)
        return ResultSnapshot.model_validate(document)
