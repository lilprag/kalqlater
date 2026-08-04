from __future__ import annotations

import json
from pathlib import Path
from typing import Protocol

from .models import AnalyzerDefinition, AnalyzerStatus


class AnalyzerContentRepository(Protocol):
    def get(self, slug: str, version: str | None = None, allow_test_drafts: bool = False) -> AnalyzerDefinition: ...


class ContentNotAvailableError(LookupError):
    pass


class InvalidAnalyzerContentError(ValueError):
    pass


class FileAnalyzerContentRepository:
    """Loads only explicitly approved repository-owned analyzer configuration."""

    APPROVED_FILES = {"communication-style": "communication-analyzer.v1.draft.json"}

    def __init__(self, content_directory: Path | None = None):
        # The repository root is an approved internal directory; filenames are allowlisted above.
        self.content_directory = content_directory or Path(__file__).resolve().parents[2]

    def get(self, slug: str, version: str | None = None, allow_test_drafts: bool = False) -> AnalyzerDefinition:
        filename = self.APPROVED_FILES.get(slug)
        if not filename:
            raise ContentNotAvailableError("Analyzer unavailable")
        path = self.content_directory / filename
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
            definition = AnalyzerDefinition.model_validate(raw)
        except (OSError, json.JSONDecodeError, ValueError) as error:
            raise InvalidAnalyzerContentError("Analyzer content is invalid") from error
        if version and definition.analyzer.version != version:
            raise ContentNotAvailableError("Analyzer version unavailable")
        if definition.analyzer.status != AnalyzerStatus.PUBLISHED and not allow_test_drafts:
            raise ContentNotAvailableError("Analyzer unavailable")
        return definition

    @staticmethod
    def safe_metadata(definition: AnalyzerDefinition, locale: str) -> dict:
        if locale not in definition.analyzer.locales:
            raise ContentNotAvailableError("Locale unavailable")
        return {
            "slug": definition.analyzer.slug,
            "version": definition.analyzer.version,
            "locales": definition.analyzer.locales,
            "dimension_count": len(definition.dimensions),
            "scenario_count": len(definition.scenarios),
            "dimensions": [{"id": dimension.id, "name": getattr(dimension.name, locale)} for dimension in definition.dimensions],
            "disclaimer": getattr(definition.analyzer.disclosures, locale),
        }
