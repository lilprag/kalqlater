"""Pluggable server-side provider contract; no provider is configured by default."""

from __future__ import annotations

from typing import Dict, Protocol

from pydantic import BaseModel, ConfigDict, Field


class LocalizationDraftRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    locale: str = Field(pattern=r"^[a-z]{2,8}(?:-[a-z]{2,8})?$")
    content_id: str = Field(pattern=r"^[A-Z][A-Z0-9_.{}-]{2,160}$")
    stage: str = Field(pattern=r"^[a-z_]{3,80}$")
    prompt_version: str = Field(min_length=1, max_length=120)
    prompt: str = Field(min_length=1, max_length=30000)


class LocalizationDraftResult(BaseModel):
    model_config = ConfigDict(extra="forbid")
    provider: str
    provider_model: str
    prompt_version: str
    output: dict
    confidence: float = Field(ge=0, le=1)


class LocalizationProvider(Protocol):
    name: str

    def generate(self, request: LocalizationDraftRequest) -> LocalizationDraftResult: ...


class LocalizationProviderRegistry:
    """Explicit registration keeps models, credentials, and business logic decoupled."""

    def __init__(self) -> None:
        self._providers: Dict[str, LocalizationProvider] = {}

    def register(self, provider: LocalizationProvider) -> None:
        if not getattr(provider, "name", None) or provider.name in self._providers:
            raise ValueError("Localization provider registration is invalid")
        self._providers[provider.name] = provider

    def get(self, name: str) -> LocalizationProvider:
        if name not in self._providers:
            raise LookupError("Localization provider is not configured")
        return self._providers[name]

    def configured_names(self) -> tuple[str, ...]:
        return tuple(sorted(self._providers))
