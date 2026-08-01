"""Focused unit checks for the server-only QA cleanup and owner-only job deletion paths."""
import asyncio
import os
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

import server


class DeleteResult:
    def __init__(self, count=1):
        self.deleted_count = count


class JobsCollection:
    def __init__(self, job=None):
        self.job = job
        self.deleted = []

    async def find_one(self, query):
        return self.job if self.job and self.job["id"] == query.get("id") else None

    async def delete_one(self, query):
        self.deleted.append(query)
        return DeleteResult()


class EmptyCollection:
    def __init__(self):
        self.deleted = []

    async def delete_many(self, query):
        self.deleted.append(query)
        return DeleteResult(0)


def test_owner_can_delete_own_job_and_intents_are_removed():
    original_db = server.db
    jobs = JobsCollection({"id": "job-1", "owner_id": "owner"})
    intents = EmptyCollection()
    server.db = SimpleNamespace(
        community_jobs=jobs,
        community_job_apply_intents=intents,
        community_feed_posts=EmptyCollection(),
        community_job_invitations=EmptyCollection(),
    )
    try:
        response = asyncio.run(server.delete_job("job-1", {"id": "owner"}))
    finally:
        server.db = original_db
    assert response["success"] is True
    assert intents.deleted == [{"job_id": "job-1"}]
    assert jobs.deleted == [{"id": "job-1", "owner_id": "owner"}]


def test_non_owner_cannot_delete_job():
    original_db = server.db
    server.db = SimpleNamespace(community_jobs=JobsCollection({"id": "job-1", "owner_id": "owner"}))
    try:
        with pytest.raises(HTTPException) as error:
            asyncio.run(server.delete_job("job-1", {"id": "other"}))
    finally:
        server.db = original_db
    assert error.value.status_code == 403


def test_qa_cleanup_secret_rejects_missing_and_wrong_values(monkeypatch):
    monkeypatch.setenv("QA_CLEANUP_SECRET", "test-secret")
    server.QA_CLEANUP_RATE_LIMIT.clear()
    request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
    for value in (None, "wrong-secret"):
        with pytest.raises(HTTPException) as error:
            server.require_qa_cleanup_secret(request, value)
        assert error.value.status_code == 404


def test_cleanup_is_idempotent_when_the_qa_account_is_already_gone():
    original_db = server.db

    class Users:
        async def find_one(self, query):
            return None

    server.db = SimpleNamespace(community_users=Users())
    try:
        response = asyncio.run(server.cleanup_qa_account("00000000-0000-0000-0000-000000000000"))
    finally:
        server.db = original_db
    assert response["success"] is True
    assert response["deleted"]["users"] == 0
