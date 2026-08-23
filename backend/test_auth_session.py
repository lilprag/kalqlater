import asyncio
from types import SimpleNamespace

import pytest
from fastapi import HTTPException, Response
import bcrypt

import server


class Users:
    def __init__(self):
        self.rows = [{"id": "existing-user", "email": "existing@example.com", "password_hash": bcrypt.hashpw(b"existing-password", bcrypt.gensalt()).decode()}]

    async def find_one(self, query):
        return next((row for row in self.rows if all(row.get(key) == value for key, value in query.items())), None)

    async def insert_one(self, row):
        self.rows.append(row)


def request(method="GET", cookies=None):
    return SimpleNamespace(method=method, cookies=cookies or {})


def with_users(callback):
    original = server.db
    server.db = SimpleNamespace(community_users=Users())
    try:
        return callback()
    finally:
        server.db = original


def test_existing_account_login_preserves_identity_and_sets_cookie(monkeypatch):
    monkeypatch.setenv("AUTH_COOKIE_SECURE", "false")
    users = Users(); original = server.db; server.db = SimpleNamespace(community_users=users)
    response = Response()
    try:
        result = asyncio.run(server.login(server.LoginPayload(email="existing@example.com", password="existing-password"), response))
    finally:
        server.db = original
    assert result["user"]["id"] == "existing-user"
    assert any(item.startswith(f"{server.AUTH_COOKIE}=") for item in response.headers.getlist("set-cookie"))


def test_minimal_signup_creates_only_canonical_user(monkeypatch):
    monkeypatch.setenv("AUTH_COOKIE_SECURE", "false")
    users = Users(); original = server.db; server.db = SimpleNamespace(community_users=users)
    response = Response()
    try:
        result = asyncio.run(server.signup(server.SignupPayload(email="new@example.com", password="a-secure-password"), response))
    finally:
        server.db = original
    created = next(row for row in users.rows if row["email"] == "new@example.com")
    assert result["user"]["id"] == created["id"]
    assert set(created) == {"id", "email", "password_hash", "created_at"}


def test_existing_bearer_token_remains_compatible():
    token = server.token_for("existing-user")
    user = with_users(lambda: asyncio.run(server.current_user(request(), f"Bearer {token}")))
    assert user["id"] == "existing-user"


def test_cookie_session_survives_without_bearer(monkeypatch):
    monkeypatch.setenv("AUTH_COOKIE_SECURE", "false")
    response = Response()
    token = server.token_for("existing-user")
    csrf = server.set_auth_cookies(response, token)
    user = with_users(lambda: asyncio.run(server.current_user(request(cookies={server.AUTH_COOKIE: token, server.CSRF_COOKIE: csrf}), None, None)))
    assert user["email"] == "existing@example.com"
    headers = response.headers.getlist("set-cookie")
    assert any("HttpOnly" in item and "SameSite=lax" in item for item in headers)


def test_cookie_mutation_requires_matching_csrf():
    token = server.token_for("existing-user")
    mutation = request("POST", {server.AUTH_COOKIE: token, server.CSRF_COOKIE: "expected"})
    with pytest.raises(HTTPException) as missing:
        with_users(lambda: asyncio.run(server.current_user(mutation, None, None)))
    assert missing.value.status_code == 403
    user = with_users(lambda: asyncio.run(server.current_user(mutation, None, "expected")))
    assert user["id"] == "existing-user"


def test_signup_contract_is_credentials_only():
    fields = set(server.SignupPayload.model_fields)
    assert fields == {"email", "password"}
    assert "username" not in fields and "profile" not in fields


def test_logout_clears_both_session_cookies():
    response = Response()
    server.clear_auth_cookies(response)
    headers = response.headers.getlist("set-cookie")
    assert any(item.startswith(f"{server.AUTH_COOKIE}=") and "Max-Age=0" in item for item in headers)
    assert any(item.startswith(f"{server.CSRF_COOKIE}=") and "Max-Age=0" in item for item in headers)
