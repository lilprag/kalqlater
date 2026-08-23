from job_content import distinct_section, extract_job_skills
from job_marketplace import public_job


def test_duplicate_and_near_duplicate_sections_are_suppressed():
    description = "Build reliable creator APIs and distributed systems. " * 12
    assert distinct_section(description, description) == ""
    assert distinct_section(description, description + " ") == ""
    assert distinct_section(f"Introduction. {description} Closing.", description) == ""
    assert distinct_section(description, "Five years of production Java experience.") != ""


def test_spotify_style_explicit_technology_extraction_is_conservative():
    body = "Build APIs and distributed systems using Java, JavaScript, Ruby on Rails, GCP, AWS and MySQL. Work with data and design partners to support growth."
    skills = extract_job_skills("Senior Backend Engineer", body)
    assert skills == ["Ruby on Rails", "JavaScript", "Java", "GCP", "AWS", "MySQL", "APIs", "Distributed systems"]
    assert not {"Growth", "Data", "Design"} & set(skills)


def test_non_engineering_explicit_skills_only():
    skills = extract_job_skills("Social Strategy Manager", "Lead social media, brand strategy, content strategy and stakeholder management for global campaigns.")
    assert skills == ["Social media", "Brand strategy", "Content strategy", "Stakeholder management"]


def test_existing_inactive_record_is_normalized_without_changing_status():
    description = "A complete source description. " * 10
    result = public_job({"id": "job-1", "title": "Backend Engineer", "status": "closed", "description": description, "requirements_text": description, "posted_at": None, "skills": ["Growth", "Data"]})
    assert result["status"] == "closed"
    assert result["description"] == description
    assert result["requirements_text"] == ""
    assert result["skills"] == []
