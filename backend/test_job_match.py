from job_content import extract_job_skills
from job_marketplace import match_job


MARKETING_JOB = {
    "title": "Social Strategy Manager",
    "department": "Marketing",
    "description": "Lead social media, paid media, analytics and brand strategy.",
    "skills": ["Social media", "Paid media", "Analytics", "Brand strategy"],
    "work_mode": "remote",
    "location_text": "Remote, United States",
}
BACKEND_JOB = {
    "title": "Senior Backend Engineer, Podcast",
    "department": "Engineering",
    "description": "Build Java APIs and distributed systems using GCP, AWS and MySQL.",
    "skills": ["Java", "APIs", "Distributed systems", "GCP", "AWS", "MySQL"],
    "work_mode": "hybrid",
    "location_text": "London, United Kingdom",
}
TAX_JOB = {
    "title": "U.S. Indirect Tax Manager",
    "department": "Tax and Accounting",
    "description": "Own indirect tax, sales tax and accounting workflows in NetSuite and ONESOURCE.",
    "skills": ["Indirect tax", "Sales tax", "Accounting", "NetSuite", "ONESOURCE"],
    "work_mode": "onsite",
    "location_text": "Denver, United States",
}

GROWTH_PROFILE = {"current_job_title": "Growth Marketer", "target_roles": ["Growth Marketing Manager"], "skills": ["Analytics", "SEO", "Google Ads", "Meta Ads"], "remote_preference": "remote", "preferred_locations": ["Remote"]}
BACKEND_PROFILE = {"current_job_title": "Backend Engineer", "target_roles": ["Backend Engineer"], "skills": ["Java", "APIs", "Distributed systems", "AWS", "MySQL"], "remote_preference": "hybrid", "preferred_locations": ["London"]}
TAX_PROFILE = {"current_job_title": "Tax Accountant", "target_roles": ["Indirect Tax Manager"], "skills": ["Indirect tax", "Sales tax", "Accounting", "NetSuite"], "remote_preference": "onsite", "preferred_locations": ["Denver"]}


def score(profile, job):
    return match_job(profile, job)["overall_score"]


def test_relevant_jobs_outrank_unrelated_jobs_for_each_candidate():
    assert score(GROWTH_PROFILE, MARKETING_JOB) > score(GROWTH_PROFILE, BACKEND_JOB)
    assert score(GROWTH_PROFILE, MARKETING_JOB) > score(GROWTH_PROFILE, TAX_JOB)
    assert score(BACKEND_PROFILE, BACKEND_JOB) > score(BACKEND_PROFILE, MARKETING_JOB)
    assert score(BACKEND_PROFILE, BACKEND_JOB) > score(BACKEND_PROFILE, TAX_JOB)
    assert score(TAX_PROFILE, TAX_JOB) > score(TAX_PROFILE, MARKETING_JOB)
    assert score(TAX_PROFILE, TAX_JOB) > score(TAX_PROFILE, BACKEND_JOB)


def test_incomplete_profile_has_no_fabricated_percentage():
    result = match_job({"full_name": "Candidate", "email": "candidate@example.com"}, BACKEND_JOB)
    assert result["status"] == "insufficient_profile"
    assert result["overall_score"] is None


def test_query_and_personality_do_not_change_match_score():
    assert score(GROWTH_PROFILE, {**MARKETING_JOB, "search_query": "growth marketing"}) == score(GROWTH_PROFILE, {**MARKETING_JOB, "search_query": "backend"})
    assert score({**GROWTH_PROFILE, "assessment_context": {"personality_type": "INTJ"}}, MARKETING_JOB) == score({**GROWTH_PROFILE, "assessment_context": {"personality_type": "ESFP"}}, MARKETING_JOB)


def test_explanations_only_name_supporting_evidence():
    result = match_job(BACKEND_PROFILE, BACKEND_JOB)
    assert result["matched"][0] == "Target role"
    assert "matched skills" in result["explanation"]
    assert "Personality type is never used" in result["explanation"]


def test_explicit_growth_and_tax_skills_are_extracted_conservatively():
    assert extract_job_skills("Growth Marketer", "Performance marketing with Google Ads and Meta Ads.") == ["Google Ads", "Meta Ads", "Performance marketing"]
    assert extract_job_skills(TAX_JOB["title"], TAX_JOB["description"]) == ["Indirect tax", "Sales tax", "Accounting", "NetSuite", "ONESOURCE"]
