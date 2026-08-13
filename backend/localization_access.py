"""Fail-closed server authorization for the private localization workbench."""

from __future__ import annotations

import re
from typing import Optional

from fastapi import HTTPException


_EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def localization_reviewer_allowlist(raw_value: Optional[str]) -> frozenset[str]:
    """Parse comma-separated reviewer addresses and reject malformed entries."""
    entries = [entry.strip().lower() for entry in (raw_value or "").split(",") if entry.strip()]
    if any(not _EMAIL_PATTERN.fullmatch(entry) for entry in entries):
        raise ValueError("LOCALIZATION_REVIEWER_EMAILS contains an invalid email")
    return frozenset(entries)


def is_localization_reviewer(email: str, raw_allowlist: Optional[str]) -> bool:
    """Missing or malformed configuration must never grant access."""
    try:
        allowed = localization_reviewer_allowlist(raw_allowlist)
    except ValueError:
        return False
    return bool(allowed) and email.strip().lower() in allowed


def require_localization_reviewer(email: str, raw_allowlist: Optional[str]) -> None:
    if not is_localization_reviewer(email, raw_allowlist):
        raise HTTPException(403, "Reviewer access required")
