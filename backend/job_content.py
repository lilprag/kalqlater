"""Conservative normalization for externally sourced job content."""
from difflib import SequenceMatcher
import re


def _comparison_text(value):
    return re.sub(r"\W+", " ", str(value or "").lower()).strip()


def distinct_section(primary, candidate, threshold=0.96):
    """Return candidate only when it adds materially distinct source content."""
    left, right = _comparison_text(primary), _comparison_text(candidate)
    if not right or left == right:
        return ""
    if left and len(right) >= 80 and right in left:
        return ""
    if left and SequenceMatcher(None, left, right).ratio() >= threshold:
        return ""
    return str(candidate).strip()


SKILL_PATTERNS = (
    ("Ruby on Rails", r"\bruby\s+on\s+rails\b|\brails\b"),
    ("JavaScript", r"\bjavascript\b"),
    ("TypeScript", r"\btypescript\b"),
    ("Node.js", r"\bnode(?:\.js|js)\b"),
    ("Java", r"\bjava\b"),
    ("Ruby", r"\bruby\b"),
    ("Python", r"\bpython\b"),
    ("React", r"\breact(?:\.js|js)?\b"),
    ("Go", r"\bgolang\b|\bgo\s+(?:programming|services|development)\b"),
    ("C++", r"(?<!\w)c\+\+(?!\w)"),
    ("C#", r"(?<!\w)c#(?!\w)"),
    (".NET", r"(?<!\w)\.net\b"),
    ("GCP", r"\bgcp\b|\bgoogle cloud(?: platform)?\b"),
    ("AWS", r"\baws\b|\bamazon web services\b"),
    ("Azure", r"\bmicrosoft azure\b|\bazure\b"),
    ("MySQL", r"\bmysql\b"),
    ("PostgreSQL", r"\bpostgres(?:ql)?\b"),
    ("SQL", r"\bsql\b"),
    ("APIs", r"\bapis?\b"),
    ("Distributed systems", r"\bdistributed systems?\b"),
    ("Kubernetes", r"\bkubernetes\b|\bk8s\b"),
    ("Docker", r"\bdocker\b"),
    ("Terraform", r"\bterraform\b"),
    ("Machine learning", r"\bmachine learning\b"),
    ("Figma", r"\bfigma\b"),
    ("Salesforce", r"\bsalesforce\b"),
    ("CRM", r"\bcrm\b|\bcustomer relationship management\b"),
    ("SEO", r"\bseo\b|\bsearch engine optimi[sz]ation\b"),
    ("Analytics", r"\banalytics\b"),
    ("Social media", r"\bsocial media\b"),
    ("Brand strategy", r"\bbrand strategy\b"),
    ("Content strategy", r"\bcontent strategy\b"),
    ("Marketing strategy", r"\bmarketing strategy\b"),
    ("Paid media", r"\bpaid media\b"),
    ("Google Ads", r"\bgoogle ads\b|\bgoogle adwords\b"),
    ("Meta Ads", r"\bmeta ads\b|\bfacebook ads\b"),
    ("Performance marketing", r"\bperformance marketing\b"),
    ("Indirect tax", r"\bindirect tax\b"),
    ("Sales tax", r"\bsales tax\b"),
    ("Accounting", r"\baccounting\b"),
    ("NetSuite", r"\bnetsuite\b"),
    ("ONESOURCE", r"\bonesource\b"),
    ("Project management", r"\bproject management\b"),
    ("Stakeholder management", r"\bstakeholder management\b"),
)


def extract_job_skills(title, body):
    source = f"{title or ''} {body or ''}"
    skills = [label for label, pattern in SKILL_PATTERNS if re.search(pattern, source, re.IGNORECASE)]
    if "Ruby on Rails" in skills and "Ruby" in skills:
        skills.remove("Ruby")
    return skills
