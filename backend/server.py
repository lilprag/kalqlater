from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
import os
import logging
import hmac
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Dict, Optional
import uuid
import re
import bcrypt
import jwt
from urllib.parse import urlparse
import asyncio
import html
import requests
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="KalQLater API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class SubmissionCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    type_code: str = Field(..., min_length=4, max_length=4)
    percentages: Dict[str, int]
    answers: List[int]
    language: str = "hi"


class Submission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type_code: str
    percentages: Dict[str, int]
    answers: List[int]
    language: str = "hi"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubmissionResponse(BaseModel):
    id: str
    type_code: str
    percentages: Dict[str, int]
    created_at: datetime


class CountResponse(BaseModel):
    total: int


class ContactSubmission(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=150)
    message: str = Field(..., min_length=1, max_length=5000)
    website: str = Field(default="", max_length=0)  # Honeypot: real users leave this blank.
    started_at: int = Field(..., ge=0)


CONTACT_RATE_LIMIT = {}
CONTACT_MIN_DELAY_MS = 1500
CONTACT_MAX_PER_HOUR = 5
CONTACT_TO_EMAIL = os.environ.get("CONTACT_TO_EMAIL", "nikhil.s.workz@gmail.com")
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET must be configured")
JWT_ALGORITHM = "HS256"
RESERVED_USERNAMES = {"admin", "support", "contact", "about", "privacy", "terms", "compare", "community", "api", "kalqlater"}
VALID_TYPES = {"INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"}
VALID_VISIBILITY = {"Public profile", "Community members only", "Hidden profile"}
VALID_AVAILABILITY = {"Actively looking", "Open to opportunities", "Just exploring", "Not currently available"}
SOCIAL_KEYS = {"linkedin", "x", "instagram", "github", "portfolio", "website"}
JOB_REMOTE_MODES = {"Remote", "Hybrid", "On-site"}
JOB_EMPLOYMENT_TYPES = {"Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"}
JOB_APPLICATION_METHODS = {"external_url", "public_email", "connection", "multiple"}
JOB_STATUSES = {"draft", "active", "closed"}
JOB_VISIBILITIES = {"public", "members_only"}
JOB_CATEGORIES = {"Product Management", "Strategy", "Entrepreneurship", "Growth Marketing", "Data Science", "Software Engineering", "Research", "Design", "Operations", "Sales", "Writing", "Education", "Finance", "Healthcare", "Human Resources", "Customer Success"}
JOB_RATE_LIMIT = {}
JOB_MAX_POSTS_PER_HOUR = 10
QA_CLEANUP_RATE_LIMIT = {}
QA_CLEANUP_MAX_PER_HOUR = 12

class SignupPayload(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=10, max_length=128)

class LoginPayload(SignupPayload): pass
class ResetRequest(BaseModel): email: EmailStr
class ResetPassword(BaseModel): token: str = Field(..., min_length=20, max_length=512); password: str = Field(..., min_length=10, max_length=128)
class CommunityProfilePayload(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)
    display_name: str = Field(..., min_length=1, max_length=80)
    username: str = Field(..., min_length=3, max_length=30)
    personality_type: str = Field(..., min_length=4, max_length=4)
    bio: str = Field(..., min_length=1, max_length=280)
    country: str = Field(..., min_length=1, max_length=80)
    city: str = Field(..., min_length=1, max_length=80)
    languages: List[str] = Field(..., min_length=1, max_length=12)
    profession: str = Field(..., min_length=1, max_length=100)
    skills: List[str] = Field(..., min_length=1, max_length=20)
    industries: List[str] = Field(..., min_length=1, max_length=12)
    years_experience: int = Field(..., ge=0, le=60)
    connection_intents: List[str] = Field(..., min_length=1, max_length=9)
    availability: str
    social_links: Dict[str, str] = Field(default_factory=dict)
    visible_social_links: List[str] = Field(default_factory=list, max_length=6)
    visibility: str
    publish_consent: bool

class ConnectionCreatePayload(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)
    recipient_username: str = Field(..., min_length=3, max_length=30)
    message: str = Field(default="", max_length=300)

class JobPayload(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)
    title: str = Field(..., min_length=2, max_length=140)
    company_name: str = Field(..., min_length=2, max_length=140)
    company_website: str = Field(default="", max_length=300)
    company_logo_url: str = Field(default="", max_length=300)
    description: str = Field(..., min_length=20, max_length=8000)
    responsibilities: str = Field(default="", max_length=5000)
    requirements: str = Field(default="", max_length=5000)
    location: str = Field(default="", max_length=140)
    country: str = Field(default="", max_length=80)
    city: str = Field(default="", max_length=80)
    remote_mode: str
    employment_type: str
    experience_min: Optional[int] = Field(default=None, ge=0, le=60)
    experience_max: Optional[int] = Field(default=None, ge=0, le=60)
    salary_min: Optional[int] = Field(default=None, ge=0, le=100000000)
    salary_max: Optional[int] = Field(default=None, ge=0, le=100000000)
    salary_currency: str = Field(default="", max_length=8)
    salary_period: str = Field(default="", max_length=20)
    skills: List[str] = Field(..., min_length=1, max_length=20)
    industries: List[str] = Field(default_factory=list, max_length=12)
    recommended_personality_types: List[str] = Field(default_factory=list, max_length=16)
    career_categories: List[str] = Field(..., min_length=1, max_length=8)
    application_method: str
    application_url: str = Field(default="", max_length=300)
    application_email: str = Field(default="", max_length=254)
    allow_connection_application: bool = False
    status: str = "active"
    visibility: str = "public"
    expires_at: Optional[str] = Field(default=None, max_length=40)

class JobStatusPayload(BaseModel):
    status: str

class JobApplyIntent(BaseModel):
    method: str = Field(..., min_length=3, max_length=30)

class QAAccountCreatePayload(SignupPayload):
    """Server-only disposable-account creation; never exposed to the frontend."""

class QACleanupPayload(BaseModel):
    user_id: str = Field(..., min_length=36, max_length=36)

def clean_text(value, limit): return value.strip()[:limit]
def validate_profile(payload):
    username = payload.username.lower()
    if not re.fullmatch(r"[a-z0-9_-]{3,30}", username) or username in RESERVED_USERNAMES: raise HTTPException(422, "Username is unavailable")
    if payload.personality_type.upper() not in VALID_TYPES or payload.visibility not in VALID_VISIBILITY or payload.availability not in VALID_AVAILABILITY: raise HTTPException(422, "Invalid profile value")
    if payload.visibility == "Public profile" and not payload.publish_consent: raise HTTPException(422, "Publishing consent is required")
    payload.social_links = {key: normalize_http_url(value) for key, value in payload.social_links.items() if isinstance(value, str) and value.strip()}
    if any(key not in SOCIAL_KEYS or urlparse(url).scheme not in {"http", "https"} or not urlparse(url).netloc for key, url in payload.social_links.items()): raise HTTPException(422, "Invalid social link")
    payload.visible_social_links = [key for key in payload.visible_social_links if key in payload.social_links]
    if any(key not in payload.social_links for key in payload.visible_social_links): raise HTTPException(422, "Invalid visible social link")
    return username
def public_profile(doc):
    text = lambda value: html.unescape(value) if isinstance(value, str) else value
    return {"display_name":text(doc["display_name"]),"username":doc["username"],"personality_type":doc["personality_type"],"bio":text(doc["bio"]),"country":text(doc["country"]),"city":text(doc["city"]),"languages":[text(value) for value in doc["languages"]],"profession":text(doc["profession"]),"skills":[text(value) for value in doc["skills"]],"industries":[text(value) for value in doc["industries"]],"years_experience":doc["years_experience"],"connection_intents":doc["connection_intents"],"availability":doc["availability"],"social_links":{key:doc["social_links"][key] for key in doc["visible_social_links"]},"created_at":doc["created_at"],"updated_at":doc["updated_at"]}

def valid_http_url(value):
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc) and not bool(re.search(r"\s", value))

def normalize_http_url(value):
    """Accept a human-entered domain while preserving HTTP(S)-only server validation."""
    value = value.strip()
    if not value:
        return ""
    candidate = value if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", value) else f"https://{value}"
    parsed = urlparse(candidate)
    if not valid_http_url(candidate) or parsed.hostname is None or ("." not in parsed.hostname and parsed.hostname != "localhost"):
        raise HTTPException(422, "Invalid URL")
    return candidate

def clean_job_list(values, limit):
    return list(dict.fromkeys(clean_text(value, limit) for value in values if isinstance(value, str) and clean_text(value, limit)))

def parse_expiry(value):
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.astimezone(timezone.utc).isoformat()
    except ValueError:
        raise HTTPException(422, "Invalid expiry date")

def validate_job(payload):
    if payload.remote_mode not in JOB_REMOTE_MODES or payload.employment_type not in JOB_EMPLOYMENT_TYPES:
        raise HTTPException(422, "Invalid job value")
    if payload.application_method not in JOB_APPLICATION_METHODS or payload.status not in JOB_STATUSES or payload.visibility not in JOB_VISIBILITIES:
        raise HTTPException(422, "Invalid job value")
    if payload.experience_min is not None and payload.experience_max is not None and payload.experience_min > payload.experience_max:
        raise HTTPException(422, "Minimum experience cannot exceed maximum experience")
    if payload.salary_min is not None and payload.salary_max is not None and payload.salary_min > payload.salary_max:
        raise HTTPException(422, "Minimum salary cannot exceed maximum salary")
    for field in ("company_website", "company_logo_url", "application_url"):
        setattr(payload, field, normalize_http_url(getattr(payload, field)))
    payload.application_email = payload.application_email.strip().lower()
    if payload.application_email and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", payload.application_email):
        raise HTTPException(422, "Invalid application email")
    if payload.application_method == "external_url" and not payload.application_url:
        raise HTTPException(422, "An application URL is required")
    if payload.application_method == "public_email" and not payload.application_email:
        raise HTTPException(422, "An application email is required")
    if payload.application_method == "connection" and not payload.allow_connection_application:
        raise HTTPException(422, "Connection applications must be enabled")
    payload.skills = clean_job_list(payload.skills, 50)
    payload.industries = clean_job_list(payload.industries, 50)
    payload.career_categories = clean_job_list(payload.career_categories, 60)
    payload.recommended_personality_types = list(dict.fromkeys(value.upper() for value in payload.recommended_personality_types))
    if any(value not in VALID_TYPES for value in payload.recommended_personality_types):
        raise HTTPException(422, "Invalid recommended personality type")
    if not payload.skills or not payload.career_categories or any(value not in JOB_CATEGORIES for value in payload.career_categories):
        raise HTTPException(422, "Invalid job categories or skills")
    payload.expires_at = parse_expiry(payload.expires_at)

def job_is_expired(job):
    if not job.get("expires_at"):
        return False
    try:
        return datetime.fromisoformat(job["expires_at"].replace("Z", "+00:00")) <= datetime.now(timezone.utc)
    except ValueError:
        return True

def public_job(job, include_application=True):
    safe = {key: job.get(key) for key in ["id", "owner_username", "title", "company_name", "company_website", "company_logo_url", "description", "responsibilities", "requirements", "location", "country", "city", "remote_mode", "employment_type", "experience_min", "experience_max", "salary_min", "salary_max", "salary_currency", "salary_period", "skills", "industries", "recommended_personality_types", "career_categories", "application_method", "allow_connection_application", "status", "visibility", "created_at", "updated_at", "expires_at"]}
    if include_application:
        if job.get("application_method") in {"external_url", "multiple"} and job.get("application_url"):
            safe["application_url"] = job["application_url"]
        if job.get("application_method") in {"public_email", "multiple"} and job.get("application_email"):
            safe["application_email"] = job["application_email"]
    return safe

async def optional_user(request):
    try:
        return await current_user(request.headers.get("authorization"))
    except HTTPException:
        return None

def enforce_job_post_rate_limit(request: Request, user_id: str):
    """Small in-process guard against accidental or scripted job-post bursts."""
    now = datetime.now(timezone.utc).timestamp()
    key = f"{user_id}:{request.client.host if request.client else 'unknown'}"
    attempts = [stamp for stamp in JOB_RATE_LIMIT.get(key, []) if stamp > now - 3600]
    if len(attempts) >= JOB_MAX_POSTS_PER_HOUR:
        raise HTTPException(429, "Please wait before posting another job")
    JOB_RATE_LIMIT[key] = attempts + [now]

async def job_viewer_context(job, user):
    context = {"is_owner": bool(user and job["owner_id"] == user["id"]), "connection_status": "none"}
    if not user or context["is_owner"]:
        return context
    connection = await db.community_connections.find_one({"pair_key": connection_pair_key(user["id"], job["owner_id"])})
    if connection and connection["status"] == "accepted": context["connection_status"] = "connected"
    elif connection and connection["status"] == "pending": context["connection_status"] = "outgoing_pending" if connection["requester_user_id"] == user["id"] else "incoming_pending"
    return context

def connection_pair_key(first_user_id, second_user_id):
    return ":".join(sorted([first_user_id, second_user_id]))

def member_summary(profile):
    """Only fields appropriate for another member in connection responses."""
    return {
        "username": profile["username"],
        "display_name": html.unescape(profile["display_name"]),
        "personality_type": profile["personality_type"],
        "profession": html.unescape(profile["profession"]),
        "city": html.unescape(profile["city"]),
        "country": html.unescape(profile["country"]),
        "skills": [html.unescape(skill) for skill in profile.get("skills", [])[:3]],
        "profile_url": f"/community/member/{profile['username']}",
    }

async def eligible_profile_for_user(user_id):
    return await db.community_profiles.find_one({
        "owner_id": user_id,
        "visibility": {"$in": ["Public profile", "Community members only"]},
    })

async def connection_response(connection, viewer_user_id):
    other_user_id = connection["recipient_user_id"] if connection["requester_user_id"] == viewer_user_id else connection["requester_user_id"]
    other_profile = await db.community_profiles.find_one({"owner_id": other_user_id})
    if not other_profile:
        # This should only be possible after a profile is deleted. Do not leak IDs.
        raise HTTPException(404, "Connection member is unavailable")
    return {
        "connection_id": connection["id"],
        "status": connection["status"],
        "direction": "outgoing" if connection["requester_user_id"] == viewer_user_id else "incoming",
        "message": connection.get("message", "") if connection["requester_user_id"] != viewer_user_id else connection.get("message", ""),
        "created_at": connection["created_at"],
        "updated_at": connection["updated_at"],
        "responded_at": connection.get("responded_at"),
        "member": member_summary(other_profile),
    }
def token_for(user_id): return jwt.encode({"sub":user_id,"exp":datetime.now(timezone.utc).timestamp()+60*60*24*7}, JWT_SECRET, algorithm=JWT_ALGORITHM)
async def current_user(authorization: Optional[str] = Header(None)):
    try:
        token = authorization.split(" ",1)[1]; user_id = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])["sub"]
    except Exception: raise HTTPException(401, "Authentication required")
    user = await db.community_users.find_one({"id":user_id})
    if not user: raise HTTPException(401, "Authentication required")
    return user

def require_qa_cleanup_secret(request: Request, x_qa_cleanup_secret: Optional[str] = Header(None)):
    """Gate QA-only lifecycle tools behind a configured server secret and rate limit."""
    configured_secret = os.environ.get("QA_CLEANUP_SECRET")
    if not configured_secret or not x_qa_cleanup_secret or not hmac.compare_digest(configured_secret, x_qa_cleanup_secret):
        # A 404 avoids advertising an administrative surface when it is not configured.
        raise HTTPException(404, "Not found")
    now = datetime.now(timezone.utc).timestamp()
    client_ip = request.client.host if request.client else "unknown"
    attempts = [stamp for stamp in QA_CLEANUP_RATE_LIMIT.get(client_ip, []) if stamp > now - 3600]
    if len(attempts) >= QA_CLEANUP_MAX_PER_HOUR:
        raise HTTPException(429, "Please wait before trying again")
    QA_CLEANUP_RATE_LIMIT[client_ip] = attempts + [now]

async def cleanup_qa_account(user_id: str):
    """Idempotently remove records owned by an explicitly marked disposable QA account."""
    user = await db.community_users.find_one({"id": user_id})
    empty_counts = {"users": 0, "profiles": 0, "jobs": 0, "job_apply_intents": 0, "connections": 0, "posts": 0, "comments": 0, "reactions": 0, "notifications": 0, "invitations": 0, "messages": 0, "conversations": 0}
    if not user:
        return {"success": True, "deleted": empty_counts}
    if not user.get("is_qa_account"):
        raise HTTPException(404, "Not found")

    owned_jobs = [job["id"] async for job in db.community_jobs.find({"owner_id": user_id}, {"_id": 0, "id": 1})]
    counts = empty_counts
    if owned_jobs:
        counts["job_apply_intents"] = (await db.community_job_apply_intents.delete_many({"job_id": {"$in": owned_jobs}})).deleted_count
        counts["jobs"] = (await db.community_jobs.delete_many({"id": {"$in": owned_jobs}})).deleted_count

    counts["job_apply_intents"] += (await db.community_job_apply_intents.delete_many({"viewer_id": user_id})).deleted_count
    counts["connections"] = (await db.community_connections.delete_many({"$or": [{"requester_user_id": user_id}, {"recipient_user_id": user_id}]})).deleted_count
    # These collections are optional today. Deleting only records directly owned by the QA user preserves shared content.
    for collection, label in [("community_posts", "posts"), ("community_comments", "comments"), ("community_reactions", "reactions"), ("community_notifications", "notifications"), ("community_invitations", "invitations"), ("community_messages", "messages")]:
        counts[label] = (await db[collection].delete_many({"owner_id": user_id})).deleted_count
    counts["conversations"] = (await db.community_conversations.delete_many({"participant_ids": user_id})).deleted_count
    counts["profiles"] = (await db.community_profiles.delete_many({"owner_id": user_id})).deleted_count
    counts["users"] = (await db.community_users.delete_many({"id": user_id, "is_qa_account": True})).deleted_count
    logger.info("QA cleanup completed for account %s: %s", user_id, counts)
    return {"success": True, "deleted": counts}


def send_contact_email(payload: ContactSubmission, submitted_at: datetime):
    """Deliver a contact message through Resend without exposing provider errors."""
    api_key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("CONTACT_FROM_EMAIL")
    if not api_key or not sender:
        raise RuntimeError("Contact email delivery is not configured")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "from": sender,
            "to": [CONTACT_TO_EMAIL],
            "reply_to": str(payload.email),
            "subject": f"New Contact Form Submission - KalQLater: {payload.subject}",
            "text": (
                f"Name: {payload.name}\nEmail: {payload.email}\nSubject: {payload.subject}\n\n"
                f"Message:\n{payload.message}\n\nTimestamp: {submitted_at.isoformat()}"
            ),
        },
        timeout=15,
    )
    if not response.ok:
        logger.warning("Resend rejected contact email with status %s", response.status_code)
        raise RuntimeError("Contact email delivery failed")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "KalQLater API is running", "status": "ok"}


@api_router.post("/submissions", response_model=SubmissionResponse)
async def create_submission(payload: SubmissionCreate):
    if len(payload.type_code) != 4:
        raise HTTPException(status_code=400, detail="Invalid type_code")
    sub = Submission(**payload.model_dump())
    doc = sub.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.submissions.insert_one(doc)
    return SubmissionResponse(
        id=sub.id,
        type_code=sub.type_code,
        percentages=sub.percentages,
        created_at=sub.created_at,
    )


@api_router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: str):
    doc = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Submission not found")
    if isinstance(doc.get('created_at'), str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return SubmissionResponse(
        id=doc['id'],
        type_code=doc['type_code'],
        percentages=doc['percentages'],
        created_at=doc['created_at'],
    )


@api_router.get("/submissions/count/total", response_model=CountResponse)
async def submissions_count():
    # Include a synthetic base so trust indicator looks credible for new sites.
    real = await db.submissions.count_documents({})
    return CountResponse(total=real + 128473)


@api_router.get("/stats/types")
async def type_stats():
    pipeline = [
        {"$group": {"_id": "$type_code", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    cursor = db.submissions.aggregate(pipeline)
    results = []
    async for row in cursor:
        results.append({"type_code": row["_id"], "count": row["count"]})
    return {"types": results}


@api_router.post("/auth/signup")
async def signup(payload: SignupPayload):
    email = str(payload.email).lower()
    if await db.community_users.find_one({"email": email}): raise HTTPException(409, "Account already exists")
    user = {"id":str(uuid.uuid4()), "email":email, "password_hash":bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode(), "created_at":datetime.now(timezone.utc).isoformat()}
    await db.community_users.insert_one(user)
    return {"token":token_for(user["id"]), "user":{"email":email}}

@api_router.post("/admin/qa-accounts")
async def create_qa_account(payload: QAAccountCreatePayload, request: Request, x_qa_cleanup_secret: Optional[str] = Header(None)):
    require_qa_cleanup_secret(request, x_qa_cleanup_secret)
    email = str(payload.email).lower()
    if await db.community_users.find_one({"email": email}):
        raise HTTPException(409, "Account already exists")
    user = {"id": str(uuid.uuid4()), "email": email, "password_hash": bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode(), "created_at": datetime.now(timezone.utc).isoformat(), "is_qa_account": True}
    await db.community_users.insert_one(user)
    logger.info("Disposable QA account created: %s", user["id"])
    return {"token": token_for(user["id"]), "user": {"id": user["id"], "email": email}}

@api_router.post("/admin/qa-cleanup")
async def qa_cleanup(payload: QACleanupPayload, request: Request, x_qa_cleanup_secret: Optional[str] = Header(None)):
    require_qa_cleanup_secret(request, x_qa_cleanup_secret)
    return await cleanup_qa_account(payload.user_id)

@api_router.post("/auth/login")
async def login(payload: LoginPayload):
    user = await db.community_users.find_one({"email":str(payload.email).lower()})
    if not user or not bcrypt.checkpw(payload.password.encode(), user["password_hash"].encode()): raise HTTPException(401, "Invalid email or password")
    return {"token":token_for(user["id"]), "user":{"email":user["email"]}}

@api_router.post("/auth/forgot-password")
async def forgot_password(payload: ResetRequest):
    user = await db.community_users.find_one({"email":str(payload.email).lower()})
    if user:
        reset = jwt.encode({"sub":user["id"],"purpose":"reset","exp":datetime.now(timezone.utc).timestamp()+3600}, JWT_SECRET, algorithm=JWT_ALGORITHM)
        await db.community_users.update_one({"id":user["id"]},{"$set":{"reset_token":reset}})
    return {"message":"If an account exists, a reset link will be sent."}

@api_router.post("/auth/reset-password")
async def reset_password(payload: ResetPassword):
    try: data=jwt.decode(payload.token,JWT_SECRET,algorithms=[JWT_ALGORITHM]); assert data.get("purpose")=="reset"
    except Exception: raise HTTPException(400,"Invalid or expired reset link")
    user=await db.community_users.find_one({"id":data["sub"],"reset_token":payload.token})
    if not user: raise HTTPException(400,"Invalid or expired reset link")
    await db.community_users.update_one({"id":user["id"]},{"$set":{"password_hash":bcrypt.hashpw(payload.password.encode(),bcrypt.gensalt()).decode()},"$unset":{"reset_token":""}})
    return {"message":"Password updated"}

@api_router.get("/community/me")
async def community_me(user=Depends(current_user)):
    profile=await db.community_profiles.find_one({"owner_id":user["id"]},{"_id":0,"owner_id":0})
    return {"email":user["email"],"profile":profile}

@api_router.get("/community/username/{username}")
async def username_available(username: str):
    normalized=username.lower()
    return {"available":bool(re.fullmatch(r"[a-z0-9_-]{3,30}",normalized)) and normalized not in RESERVED_USERNAMES and not await db.community_profiles.find_one({"username":normalized})}

@api_router.get("/community/profiles")
async def directory(request: Request, page:int=1, limit:int=18, search:Optional[str]=None, type:Optional[str]=None, intent:Optional[str]=None, country:Optional[str]=None, city:Optional[str]=None, profession:Optional[str]=None, industry:Optional[str]=None, skill:Optional[str]=None, language:Optional[str]=None, availability:Optional[str]=None, min_experience:Optional[int]=None, max_experience:Optional[int]=None, sort:Optional[str]="newest"):
    limit=max(1,min(limit,50)); authenticated=False
    try: await current_user(request.headers.get("authorization")); authenticated=True
    except HTTPException: pass
    query={"visibility":{"$in":["Public profile","Community members only"] if authenticated else ["Public profile"]}}
    for field,value in [("personality_type",type),("connection_intents",intent),("country",country),("city",city),("profession",profession),("industries",industry),("skills",skill),("languages",language),("availability",availability)]:
        if value: query[field]={"$regex":re.escape(value),"$options":"i"}
    if search: query["$or"]=[{field:{"$regex":re.escape(search),"$options":"i"}} for field in ["display_name","username","profession","skills","industries","city","country"]]
    if min_experience is not None or max_experience is not None: query["years_experience"]={**({"$gte":min_experience} if min_experience is not None else {}),**({"$lte":max_experience} if max_experience is not None else {})}
    sort_field,sort_order={"oldest":("created_at",1),"updated":("updated_at",-1),"az":("display_name",1),"za":("display_name",-1)}.get(sort,("created_at",-1))
    cursor=db.community_profiles.find(query,{"_id":0,"owner_id":0,"visibility":0,"publish_consent":0}).sort(sort_field,sort_order).skip((page-1)*limit).limit(limit)
    items=[public_profile(doc) async for doc in cursor]
    return {"items":items,"page":page,"has_more":len(items)==limit}

@api_router.get("/community/profiles/{username}")
async def profile_by_username(username:str, request:Request):
    doc=await db.community_profiles.find_one({"username":username.lower()})
    if not doc: raise HTTPException(404,"Profile unavailable")
    authenticated=False
    try: await current_user(request.headers.get("authorization")); authenticated=True
    except HTTPException: pass
    if doc["visibility"]=="Hidden profile" or (doc["visibility"]=="Community members only" and not authenticated): raise HTTPException(404,"Profile unavailable")
    return public_profile(doc)

@api_router.post("/community/profile")
async def create_profile(payload:CommunityProfilePayload,user=Depends(current_user)):
    if await db.community_profiles.find_one({"owner_id":user["id"]}): raise HTTPException(409,"A profile already exists")
    username=validate_profile(payload)
    if await db.community_profiles.find_one({"username":username}): raise HTTPException(409,"Username is unavailable")
    now=datetime.now(timezone.utc).isoformat(); data=payload.model_dump(); data.update({"owner_id":user["id"],"username":username,"personality_type":payload.personality_type.upper(),"created_at":now,"updated_at":now})
    for field in ["display_name","bio","country","city","profession"]: data[field]=clean_text(data[field],280)
    data["languages"]=[clean_text(x,40) for x in data["languages"]]; data["skills"]=[clean_text(x,50) for x in data["skills"]]; data["industries"]=[clean_text(x,50) for x in data["industries"]]
    await db.community_profiles.insert_one(data); return public_profile(data)

@api_router.put("/community/profile")
async def update_profile(payload:CommunityProfilePayload,user=Depends(current_user)):
    existing=await db.community_profiles.find_one({"owner_id":user["id"]})
    if not existing: raise HTTPException(404,"Profile not found")
    username=validate_profile(payload); conflict=await db.community_profiles.find_one({"username":username,"owner_id":{"$ne":user["id"]}})
    if conflict: raise HTTPException(409,"Username is unavailable")
    data=payload.model_dump(); data.update({"username":username,"personality_type":payload.personality_type.upper(),"updated_at":datetime.now(timezone.utc).isoformat()})
    await db.community_profiles.update_one({"owner_id":user["id"]},{"$set":data}); return public_profile({**existing,**data})

@api_router.post("/community/profile/deactivate")
async def deactivate_profile(user=Depends(current_user)):
    await db.community_profiles.update_one({"owner_id":user["id"]},{"$set":{"visibility":"Hidden profile","updated_at":datetime.now(timezone.utc).isoformat()}}); return {"message":"Profile deactivated"}

@api_router.delete("/community/profile")
async def delete_profile(user=Depends(current_user)):
    await db.community_profiles.delete_one({"owner_id":user["id"]}); return {"message":"Profile deleted"}

@api_router.post("/community/connections", status_code=201)
async def create_connection(payload: ConnectionCreatePayload, user=Depends(current_user)):
    requester_profile = await eligible_profile_for_user(user["id"])
    if not requester_profile:
        raise HTTPException(403, "Create a visible community profile before connecting")

    username = payload.recipient_username.lower()
    if not re.fullmatch(r"[a-z0-9_-]{3,30}", username):
        raise HTTPException(422, "Invalid recipient")
    recipient_profile = await db.community_profiles.find_one({
        "username": username,
        "visibility": {"$in": ["Public profile", "Community members only"]},
    })
    if not recipient_profile:
        raise HTTPException(404, "Member is unavailable for connections")
    if recipient_profile["owner_id"] == user["id"]:
        raise HTTPException(422, "You cannot connect with yourself")

    now = datetime.now(timezone.utc).isoformat()
    pair_key = connection_pair_key(user["id"], recipient_profile["owner_id"])
    connection = {
        "id": str(uuid.uuid4()),
        "pair_key": pair_key,
        "requester_user_id": user["id"],
        "recipient_user_id": recipient_profile["owner_id"],
        "requester_username": requester_profile["username"],
        "recipient_username": recipient_profile["username"],
        "status": "pending",
        "message": payload.message,
        "created_at": now,
        "updated_at": now,
        "responded_at": None,
    }
    try:
        await db.community_connections.insert_one(connection)
    except DuplicateKeyError:
        existing = await db.community_connections.find_one({"pair_key": pair_key})
        if not existing:
            raise HTTPException(409, "This connection is already being updated")
        if existing["status"] == "accepted":
            raise HTTPException(409, "You are already connected")
        if existing["status"] == "pending":
            if existing["requester_user_id"] == user["id"]:
                raise HTTPException(409, "Connection request already sent")
            raise HTTPException(409, "This member has already sent you a connection request")
        # A declined or cancelled request can be renewed, while preserving a single pair record.
        connection["id"] = existing["id"]
        renewed = await db.community_connections.find_one_and_update(
            {"pair_key": pair_key, "status": {"$in": ["declined", "cancelled"]}},
            {"$set": {key: value for key, value in connection.items() if key not in {"id", "pair_key"}}},
            return_document=ReturnDocument.AFTER,
        )
        if not renewed:
            raise HTTPException(409, "This connection is already being updated")
        connection = renewed
    return await connection_response(connection, user["id"])

@api_router.get("/community/connections/status/{username}")
async def connection_status(username: str, user=Depends(current_user)):
    profile = await db.community_profiles.find_one({"username": username.lower()})
    if not profile or profile["owner_id"] == user["id"]:
        return {"status": "none"}
    connection = await db.community_connections.find_one({"pair_key": connection_pair_key(user["id"], profile["owner_id"])})
    if not connection or connection["status"] in {"declined", "cancelled"}:
        return {"status": "none"}
    if connection["status"] == "accepted":
        return {"status": "connected", "connection_id": connection["id"]}
    direction = "outgoing_pending" if connection["requester_user_id"] == user["id"] else "incoming_pending"
    return {"status": direction, "connection_id": connection["id"]}

async def list_connections(user_id, status, direction, page, limit):
    limit = max(1, min(limit, 50))
    query = {"status": status}
    if direction == "incoming": query["recipient_user_id"] = user_id
    elif direction == "outgoing": query["requester_user_id"] = user_id
    else: query["$or"] = [{"requester_user_id": user_id}, {"recipient_user_id": user_id}]
    cursor = db.community_connections.find(query, {"_id": 0}).sort("updated_at", -1).skip((page - 1) * limit).limit(limit)
    items = []
    async for connection in cursor:
        try:
            items.append(await connection_response(connection, user_id))
        except HTTPException:
            # A deleted profile is not exposed through a historical connection.
            continue
    return {"items": items, "page": page, "has_more": len(items) == limit}

@api_router.get("/community/connections/incoming")
async def incoming_connections(page: int = 1, limit: int = 18, user=Depends(current_user)):
    return await list_connections(user["id"], "pending", "incoming", max(1, page), limit)

@api_router.get("/community/connections/outgoing")
async def outgoing_connections(page: int = 1, limit: int = 18, user=Depends(current_user)):
    return await list_connections(user["id"], "pending", "outgoing", max(1, page), limit)

@api_router.get("/community/connections/accepted")
async def accepted_connections(page: int = 1, limit: int = 18, user=Depends(current_user)):
    return await list_connections(user["id"], "accepted", "accepted", max(1, page), limit)

@api_router.get("/community/connections/pending-count")
async def pending_connection_count(user=Depends(current_user)):
    count = await db.community_connections.count_documents({"recipient_user_id": user["id"], "status": "pending"})
    return {"count": count}

async def update_connection_status(connection_id, user_id, action):
    if not re.fullmatch(r"[0-9a-f-]{36}", connection_id):
        raise HTTPException(404, "Connection request not found")
    now = datetime.now(timezone.utc).isoformat()
    if action in {"accept", "decline"}:
        next_status = "accepted" if action == "accept" else "declined"
        query = {"id": connection_id, "recipient_user_id": user_id, "status": "pending"}
        updates = {"status": next_status, "updated_at": now, "responded_at": now}
    else:
        query = {"id": connection_id, "requester_user_id": user_id, "status": "pending"}
        updates = {"status": "cancelled", "updated_at": now, "responded_at": now}
    connection = await db.community_connections.find_one_and_update(
        query, {"$set": updates}, return_document=ReturnDocument.AFTER,
    )
    if not connection:
        raise HTTPException(404, "Connection request is unavailable")
    return await connection_response(connection, user_id)

@api_router.post("/community/connections/{connection_id}/accept")
async def accept_connection(connection_id: str, user=Depends(current_user)):
    return await update_connection_status(connection_id, user["id"], "accept")

@api_router.post("/community/connections/{connection_id}/decline")
async def decline_connection(connection_id: str, user=Depends(current_user)):
    return await update_connection_status(connection_id, user["id"], "decline")

@api_router.post("/community/connections/{connection_id}/cancel")
async def cancel_connection(connection_id: str, user=Depends(current_user)):
    return await update_connection_status(connection_id, user["id"], "cancel")

@api_router.get("/community/jobs")
async def list_jobs(request: Request, page:int=1, limit:int=18, search:Optional[str]=None, type:Optional[str]=None, career:Optional[str]=None, skill:Optional[str]=None, industry:Optional[str]=None, country:Optional[str]=None, city:Optional[str]=None, remote_mode:Optional[str]=None, employment_type:Optional[str]=None, sort:Optional[str]="newest"):
    viewer = await optional_user(request)
    limit = max(1, min(limit, 50)); page = max(1, page)
    visibility = ["public", "members_only"] if viewer else ["public"]
    now = datetime.now(timezone.utc).isoformat()
    query = {"status": "active", "visibility": {"$in": visibility}, "$or": [{"expires_at": None}, {"expires_at": {"$gt": now}}]}
    for field, value in [("recommended_personality_types", type), ("career_categories", career), ("skills", skill), ("industries", industry), ("country", country), ("city", city), ("remote_mode", remote_mode), ("employment_type", employment_type)]:
        if value: query[field] = {"$regex": re.escape(value), "$options": "i"}
    if career and "," in career:
        query["career_categories"] = {"$in": [item.strip() for item in career.split(",") if item.strip()]}
    if search:
        query["$and"] = [{"$or": [{field: {"$regex": re.escape(search), "$options": "i"}} for field in ["title", "company_name", "description", "skills", "career_categories", "location"]]}]
    sort_field, sort_order = {"oldest": ("created_at", 1), "closing_soon": ("expires_at", 1), "relevance": ("updated_at", -1)}.get(sort, ("created_at", -1))
    cursor = db.community_jobs.find(query, {"_id": 0, "owner_id": 0, "application_count": 0, "view_count": 0}).sort(sort_field, sort_order).skip((page - 1) * limit).limit(limit)
    items = [public_job(job, include_application=False) async for job in cursor]
    return {"items": items, "page": page, "has_more": len(items) == limit}

@api_router.get("/community/jobs/mine")
async def my_jobs(page:int=1, limit:int=18, user=Depends(current_user)):
    limit = max(1, min(limit, 50)); page = max(1, page)
    cursor = db.community_jobs.find({"owner_id": user["id"]}, {"_id": 0, "owner_id": 0}).sort("updated_at", -1).skip((page - 1) * limit).limit(limit)
    return {"items": [public_job(job) async for job in cursor], "page": page, "has_more": False}

@api_router.get("/community/jobs/{job_id}")
async def get_job(job_id: str, request: Request):
    if not re.fullmatch(r"[0-9a-f-]{36}", job_id): raise HTTPException(404, "Job unavailable")
    job = await db.community_jobs.find_one({"id": job_id})
    if not job: raise HTTPException(404, "Job unavailable")
    viewer = await optional_user(request)
    context = await job_viewer_context(job, viewer)
    visible = job["visibility"] == "public" or viewer
    if not visible or (job["status"] != "active" or job_is_expired(job)) and not context["is_owner"]:
        raise HTTPException(404, "Job unavailable")
    await db.community_jobs.update_one({"id": job_id}, {"$inc": {"view_count": 1}})
    owner = await db.community_profiles.find_one({"owner_id": job["owner_id"]})
    result = public_job(job)
    result["owner"] = {"username": job["owner_username"], "display_name": html.unescape(owner.get("display_name", job["owner_username"])), "personality_type": owner.get("personality_type"), "profession": html.unescape(owner.get("profession", ""))} if owner else {"username": job["owner_username"]}
    result.update(context)
    return result

@api_router.post("/community/jobs", status_code=201)
async def create_job(payload: JobPayload, request: Request, user=Depends(current_user)):
    profile = await db.community_profiles.find_one({"owner_id": user["id"]})
    if not profile: raise HTTPException(403, "Create a community profile before posting a job")
    validate_job(payload)
    enforce_job_post_rate_limit(request, user["id"])
    now = datetime.now(timezone.utc).isoformat()
    data = payload.model_dump()
    for field, limit in [("title", 140), ("company_name", 140), ("description", 8000), ("responsibilities", 5000), ("requirements", 5000), ("location", 140), ("country", 80), ("city", 80)]: data[field] = clean_text(data[field], limit)
    data.update({"id": str(uuid.uuid4()), "owner_id": user["id"], "owner_username": profile["username"], "created_at": now, "updated_at": now, "application_count": 0, "view_count": 0})
    await db.community_jobs.insert_one(data)
    return public_job(data)

@api_router.put("/community/jobs/{job_id}")
async def update_job(job_id: str, payload: JobPayload, user=Depends(current_user)):
    validate_job(payload)
    existing = await db.community_jobs.find_one({"id": job_id})
    if not existing: raise HTTPException(404, "Job unavailable")
    if existing["owner_id"] != user["id"]: raise HTTPException(403, "You can only edit your own job")
    data = payload.model_dump(); data["updated_at"] = datetime.now(timezone.utc).isoformat()
    for field, limit in [("title", 140), ("company_name", 140), ("description", 8000), ("responsibilities", 5000), ("requirements", 5000), ("location", 140), ("country", 80), ("city", 80)]: data[field] = clean_text(data[field], limit)
    await db.community_jobs.update_one({"id": job_id, "owner_id": user["id"]}, {"$set": data})
    return public_job({**existing, **data})

@api_router.delete("/community/jobs/{job_id}")
async def delete_job(job_id: str, user=Depends(current_user)):
    existing = await db.community_jobs.find_one({"id": job_id})
    if not existing:
        raise HTTPException(404, "Job unavailable")
    if existing["owner_id"] != user["id"]:
        raise HTTPException(403, "You can only delete your own job")
    await db.community_job_apply_intents.delete_many({"job_id": job_id})
    await db.community_feed_posts.delete_many({"job_id": job_id})
    await db.community_job_invitations.delete_many({"job_id": job_id})
    await db.community_jobs.delete_one({"id": job_id, "owner_id": user["id"]})
    return {"success": True, "message": "Job deleted"}

@api_router.patch("/community/jobs/{job_id}/status")
async def update_job_status(job_id: str, payload: JobStatusPayload, user=Depends(current_user)):
    if payload.status not in {"active", "closed"}: raise HTTPException(422, "Invalid job status")
    existing = await db.community_jobs.find_one({"id": job_id})
    if not existing: raise HTTPException(404, "Job unavailable")
    if existing["owner_id"] != user["id"]: raise HTTPException(403, "You can only update your own job")
    job = await db.community_jobs.find_one_and_update({"id": job_id, "owner_id": user["id"]}, {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc).isoformat()}}, return_document=ReturnDocument.AFTER)
    return public_job(job)

@api_router.post("/community/jobs/{job_id}/apply-intent")
async def job_apply_intent(job_id: str, payload: JobApplyIntent, request: Request, user=Depends(current_user)):
    job = await db.community_jobs.find_one({"id": job_id, "status": "active"})
    if not job or job_is_expired(job): raise HTTPException(404, "Job unavailable")
    method = payload.method
    allowed = {"external_url": bool(job.get("application_url")), "public_email": bool(job.get("application_email")), "connection": bool(job.get("allow_connection_application"))}
    if not allowed.get(method): raise HTTPException(422, "This application option is unavailable")
    await db.community_jobs.update_one({"id": job_id}, {"$inc": {"application_count": 1}})
    await db.community_job_apply_intents.insert_one({"id": str(uuid.uuid4()), "job_id": job_id, "viewer_id": user["id"], "method": method, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}

@api_router.post("/contact")
async def submit_contact(payload: ContactSubmission, request: Request):
    if payload.website:
        raise HTTPException(status_code=400, detail="Unable to submit this form")
    now = datetime.now(timezone.utc)
    now_ms = int(now.timestamp() * 1000)
    if now_ms - payload.started_at < CONTACT_MIN_DELAY_MS:
        raise HTTPException(status_code=400, detail="Unable to submit this form")
    client_ip = request.client.host if request.client else "unknown"
    window_start = now.timestamp() - 3600
    attempts = [stamp for stamp in CONTACT_RATE_LIMIT.get(client_ip, []) if stamp > window_start]
    if len(attempts) >= CONTACT_MAX_PER_HOUR:
        raise HTTPException(status_code=429, detail="Please try again later")
    CONTACT_RATE_LIMIT[client_ip] = attempts + [now.timestamp()]

    try:
        await asyncio.to_thread(send_contact_email, payload, now)
    except Exception:
        logger.exception("Contact email delivery failed")
        raise HTTPException(status_code=502, detail="We could not send your message right now. Please try again later.")
    return {"message": "Thank you for contacting us. We'll get back to you soon.", "delivered": True}


app.include_router(api_router)

CORS_ORIGINS = tuple(
    origin.strip().rstrip("/")
    for origin in os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip() and origin.strip() != "*"
)
if not CORS_ORIGINS:
    raise RuntimeError("CORS_ORIGINS must contain at least one explicit origin")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=list(CORS_ORIGINS),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


@app.on_event("startup")
async def initialize_community_indexes():
    await db.community_users.create_index("email", unique=True)
    await db.community_profiles.create_index("owner_id", unique=True)
    await db.community_profiles.create_index("username", unique=True)
    await db.community_profiles.create_index([("visibility", 1), ("created_at", -1)])
    await db.community_connections.create_index("pair_key", unique=True)
    await db.community_connections.create_index([("requester_user_id", 1), ("status", 1), ("updated_at", -1)])
    await db.community_connections.create_index([("recipient_user_id", 1), ("status", 1), ("updated_at", -1)])
    await db.community_jobs.create_index([("status", 1), ("created_at", -1)])
    await db.community_jobs.create_index([("recommended_personality_types", 1), ("status", 1)])
    await db.community_jobs.create_index([("career_categories", 1), ("status", 1)])
    await db.community_jobs.create_index([("owner_id", 1), ("status", 1)])
    await db.community_jobs.create_index([("country", 1), ("city", 1), ("remote_mode", 1)])
    await db.community_jobs.create_index("expires_at")
    await db.community_job_apply_intents.create_index([("job_id", 1), ("created_at", -1)])
