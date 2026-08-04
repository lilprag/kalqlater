from __future__ import annotations

import json
import hashlib
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

    DRAFT_FILES = {"communication-style": "communication-analyzer.v1.draft.json"}
    RELEASE_FILES = {"communication-style": "communication-analyzer.v1.release.json"}

    def __init__(self, content_directory: Path | None = None):
        # The repository root is an approved internal directory; filenames are allowlisted above.
        self.content_directory = content_directory or Path(__file__).resolve().parents[2]

    def get(self, slug: str, version: str | None = None, allow_test_drafts: bool = False) -> AnalyzerDefinition:
        if version == "1.0.0-draft":
            if not allow_test_drafts:
                raise ContentNotAvailableError("Analyzer unavailable")
            return self._load_definition(self.DRAFT_FILES.get(slug))
        if version not in (None, "1.0.0"):
            raise ContentNotAvailableError("Analyzer unavailable")
        manifest = self._load_release_manifest(self.RELEASE_FILES.get(slug))
        definition = self._load_definition(manifest["source"])
        if hashlib.sha256((self.content_directory / manifest["source"]).read_bytes()).hexdigest() != manifest["sourceContentSha256"]:
            raise InvalidAnalyzerContentError("Analyzer content integrity check failed")
        definition = definition.model_copy(update={"analyzer": definition.analyzer.model_copy(update={"version": manifest["version"], "status": AnalyzerStatus.PUBLISHED})})
        if version and definition.analyzer.version != version:
            raise ContentNotAvailableError("Analyzer version unavailable")
        return definition

    def _load_definition(self, filename: str | None) -> AnalyzerDefinition:
        if not filename:
            raise ContentNotAvailableError("Analyzer unavailable")
        path = self.content_directory / filename
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
            return AnalyzerDefinition.model_validate(raw)
        except (OSError, json.JSONDecodeError, ValueError) as error:
            raise InvalidAnalyzerContentError("Analyzer content is invalid") from error

    def _load_release_manifest(self, filename: str | None) -> dict:
        if not filename:
            raise ContentNotAvailableError("Analyzer unavailable")
        try:
            manifest = json.loads((self.content_directory / filename).read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise InvalidAnalyzerContentError("Analyzer release manifest is invalid") from error
        required = {"slug", "version", "status", "source", "sourceContentSha256", "publishedAt", "scoringVersion", "interpretationVersion", "localeVersions", "approvalRecord", "acceptedRisks", "disclaimerPolicy"}
        if set(manifest) != required or manifest["status"] != "published" or manifest["version"] != "1.0.0" or manifest["slug"] != "communication-style":
            raise InvalidAnalyzerContentError("Analyzer release manifest is invalid")
        return manifest

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
