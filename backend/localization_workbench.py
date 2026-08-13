"""Provider-neutral, reviewer-gated localization workbench contracts."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


ReviewAction = Literal["approve", "reject", "request_rewrite", "lock", "restore"]


class LocalizationBlockSave(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    locale: str = Field(pattern=r"^[a-z]{2,8}(?:-[a-z]{2,8})?$")
    content_id: str = Field(pattern=r"^[A-Z][A-Z0-9_.{}-]{2,160}$")
    page_family: str = Field(pattern=r"^[a-z-]{2,40}$")
    source_revision: str = Field(min_length=1, max_length=120)
    english_source: str = Field(min_length=1, max_length=12000)
    ai_draft: Optional[str] = Field(default=None, max_length=12000)
    human_edit: Optional[str] = Field(default=None, max_length=12000)


class LocalizationReviewInput(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    action: ReviewAction
    comment: str = Field(min_length=1, max_length=3000)
    restore_version: Optional[int] = Field(default=None, ge=0)


class LocalizationBlockEdit(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    human_edit: str = Field(min_length=1, max_length=12000)
    comment: str = Field(min_length=1, max_length=3000)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def initialize_block(payload: LocalizationBlockSave, reviewer_email: str) -> dict:
    now = utc_now()
    return {
        "locale": payload.locale,
        "content_id": payload.content_id,
        "page_family": payload.page_family,
        "source_revision": payload.source_revision,
        "english_source": payload.english_source,
        "ai_draft": payload.ai_draft,
        "human_edit": payload.human_edit,
        "published_copy": None,
        "approval_status": "draft",
        "locked": False,
        "history": [{"version": 0, "event": "created", "reviewer": reviewer_email, "timestamp": now, "reason": "Editorial block created"}],
        "created_at": now,
        "updated_at": now,
    }


def apply_review_action(block: dict, review: LocalizationReviewInput, reviewer_email: str) -> dict:
    """Returns a copy; publication is deliberately not an available action."""
    updated = {**block, "history": list(block.get("history", []))}
    if updated.get("locked") and review.action != "restore":
        raise ValueError("Approved wording is locked")
    if review.action == "restore":
        version = next((item for item in updated["history"] if item.get("version") == review.restore_version and item.get("human_edit")), None)
        if not version:
            raise ValueError("Requested version is unavailable")
        updated["human_edit"] = version["human_edit"]
        updated["approval_status"] = "draft"
        updated["locked"] = False
    elif review.action == "approve":
        if not updated.get("human_edit"):
            raise ValueError("Human-edited wording is required before approval")
        updated["approval_status"] = "approved"
    elif review.action == "reject":
        updated["approval_status"] = "rejected"
    elif review.action == "request_rewrite":
        updated["approval_status"] = "rewrite_requested"
    elif review.action == "lock":
        if updated.get("approval_status") != "approved":
            raise ValueError("Only approved wording can be locked")
        updated["locked"] = True
    now = utc_now()
    updated["updated_at"] = now
    updated["history"].append({
        "version": len(updated["history"]), "event": review.action, "reviewer": reviewer_email,
        "timestamp": now, "reason": review.comment, "human_edit": updated.get("human_edit"),
    })
    return updated


def apply_human_edit(block: dict, edit: LocalizationBlockEdit, reviewer_email: str) -> dict:
    if block.get("locked"):
        raise ValueError("Approved wording is locked")
    updated = {**block, "history": list(block.get("history", [])), "human_edit": edit.human_edit, "approval_status": "draft"}
    now = utc_now()
    updated["updated_at"] = now
    updated["history"].append({
        "version": len(updated["history"]), "event": "human_edit", "reviewer": reviewer_email,
        "timestamp": now, "reason": edit.comment, "human_edit": edit.human_edit,
    })
    return updated
