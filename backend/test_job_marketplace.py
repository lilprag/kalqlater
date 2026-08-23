from datetime import datetime, timedelta, timezone

from job_marketplace import age_days, sitemap_job


def test_age_days_naive_posted_and_aware_now():
    posted = datetime(2026, 8, 1, 12, 0)
    at = datetime(2026, 8, 4, 12, 0, tzinfo=timezone.utc)
    assert age_days({"posted_at": posted}, at) == 3


def test_age_days_aware_posted_and_aware_now():
    posted = datetime(2026, 8, 1, 12, 0, tzinfo=timezone.utc)
    at = datetime(2026, 8, 4, 12, 0, tzinfo=timezone.utc)
    assert age_days({"posted_at": posted}, at) == 3


def test_age_days_naive_posted_and_naive_now():
    posted = datetime(2026, 8, 1, 12, 0)
    at = datetime(2026, 8, 4, 12, 0)
    assert age_days({"posted_at": posted}, at) == 3


def test_age_days_timezone_offset_posted():
    offset = timezone(timedelta(hours=5, minutes=30))
    posted = datetime(2026, 8, 1, 17, 30, tzinfo=offset)
    at = datetime(2026, 8, 4, 12, 0, tzinfo=timezone.utc)
    assert age_days({"posted_at": posted}, at) == 3


def test_age_days_future_timestamp_is_not_negative():
    posted = datetime(2026, 8, 5, 12, 0, tzinfo=timezone.utc)
    at = datetime(2026, 8, 4, 12, 0, tzinfo=timezone.utc)
    assert age_days({"posted_at": posted}, at) == 0


def test_sitemap_job_requires_active_dated_verified_inventory():
    stamp = datetime(2026, 8, 4, 12, 0, tzinfo=timezone.utc)
    eligible = {"slug": "example-role", "status": "active", "posted_at": stamp, "last_verified_at": stamp}
    assert sitemap_job(eligible) == {"slug": "example-role", "posted_at": stamp.isoformat(), "last_verified_at": stamp.isoformat()}
    for field in ("slug", "posted_at", "last_verified_at"):
        assert sitemap_job({**eligible, field: None}) is None
    assert sitemap_job({**eligible, "status": "possibly_closed"}) is None
    assert sitemap_job({**eligible, "status": "closed"}) is None
