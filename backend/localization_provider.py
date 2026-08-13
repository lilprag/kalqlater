"""Pluggable, server-only localization provider contract.

No provider is enabled unless an operator explicitly selects one with environment
configuration.  The Editorial Workbench never calls a model directly.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, Protocol

import requests

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


class LocalizedStageOutput(BaseModel):
    """The strictly validated payload the provider is allowed to return."""

    model_config = ConfigDict(extra="forbid")
    stage: str = Field(pattern=r"^[a-z_]{3,80}$")
    text: str = Field(min_length=1, max_length=30000)
    confidence: float = Field(ge=0, le=1)


class LocalizationProviderError(RuntimeError):
    """Safe provider failure message suitable for an authenticated workbench."""


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


class OpenAIResponsesLocalizationProvider:
    """Optional OpenAI Responses adapter, kept entirely on the server.

    It deliberately performs no automatic retries: a draft-generation request is
    not retried unless a future provider contract can guarantee idempotency.  A
    reviewer can explicitly request another draft from the workbench instead.
    """

    name = "openai"
    _endpoint = "https://api.openai.com/v1/responses"

    def __init__(self, api_key: str, model: str, timeout_seconds: float = 30) -> None:
        if not api_key or not model:
            raise ValueError("OpenAI localization provider configuration is incomplete")
        if timeout_seconds <= 0 or timeout_seconds > 120:
            raise ValueError("OpenAI localization provider timeout is invalid")
        self._api_key = api_key
        self._model = model
        self._timeout_seconds = timeout_seconds

    def generate(self, request: LocalizationDraftRequest) -> LocalizationDraftResult:
        schema = {
            "type": "object",
            "additionalProperties": False,
            "required": ["stage", "text", "confidence"],
            "properties": {
                "stage": {"type": "string"},
                "text": {"type": "string"},
                "confidence": {"type": "number", "minimum": 0, "maximum": 1},
            },
        }
        payload = {
            "model": self._model,
            "input": request.prompt,
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "localized_stage_output",
                    "strict": True,
                    "schema": schema,
                }
            },
        }
        try:
            response = requests.post(
                self._endpoint,
                headers={"Authorization": f"Bearer {self._api_key}", "Content-Type": "application/json"},
                json=payload,
                timeout=self._timeout_seconds,
            )
        except requests.RequestException as error:
            raise LocalizationProviderError("The localization draft provider is temporarily unavailable") from error
        if not response.ok:
            raise LocalizationProviderError("The localization draft provider could not create a draft")

        try:
            response_body: Dict[str, Any] = response.json()
            output_text = next(
                content["text"]
                for item in response_body.get("output", [])
                for content in item.get("content", [])
                if content.get("type") == "output_text" and isinstance(content.get("text"), str)
            )
            output = LocalizedStageOutput.model_validate(json.loads(output_text))
        except (KeyError, StopIteration, TypeError, ValueError, json.JSONDecodeError) as error:
            raise LocalizationProviderError("The localization draft provider returned an invalid draft") from error

        if output.stage != request.stage:
            raise LocalizationProviderError("The localization draft provider returned an invalid draft")
        return LocalizationDraftResult(
            provider=self.name,
            provider_model=self._model,
            prompt_version=request.prompt_version,
            output={"stage": output.stage, "text": output.text},
            confidence=output.confidence,
        )


def configured_localization_provider_registry(environment: Dict[str, str] | None = None) -> LocalizationProviderRegistry:
    """Return only explicitly selected providers; missing credentials keep it disabled."""

    config = os.environ if environment is None else environment
    registry = LocalizationProviderRegistry()
    selected = config.get("LOCALIZATION_AI_PROVIDER", "").strip().lower()
    if not selected:
        return registry
    if selected != OpenAIResponsesLocalizationProvider.name:
        raise ValueError("Unsupported localization AI provider")

    api_key = config.get("OPENAI_API_KEY", "").strip()
    model = config.get("OPENAI_LOCALIZATION_MODEL", "").strip()
    timeout_value = config.get("LOCALIZATION_PROVIDER_TIMEOUT_SECONDS", "30").strip()
    if not api_key or not model:
        raise ValueError("OpenAI localization provider requires server environment credentials")
    try:
        timeout_seconds = float(timeout_value)
    except ValueError as error:
        raise ValueError("OpenAI localization provider timeout is invalid") from error
    registry.register(OpenAIResponsesLocalizationProvider(api_key, model, timeout_seconds))
    return registry
