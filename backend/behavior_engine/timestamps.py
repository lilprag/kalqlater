"""UTC normalization for persisted Behavior Engine timestamps."""

from __future__ import annotations

from datetime import datetime, timezone


def normalize_utc(value: datetime) -> datetime:
    """Interpret Mongo's naive BSON datetimes as UTC and return aware UTC."""
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)
