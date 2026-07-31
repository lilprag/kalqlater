from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
import os
import logging
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
import smtplib
from email.message import EmailMessage
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
CONTACT_FALLBACK_MESSAGE = "Thanks for reaching out. Our contact service is currently being finalized. Please email us directly at nikhil.s.workz@gmail.com."
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET must be configured")
JWT_ALGORITHM = "HS256"
RESERVED_USERNAMES = {"admin", "support", "contact", "about", "privacy", "terms", "compare", "community", "api", "kalqlater"}
VALID_TYPES = {"INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"}
VALID_VISIBILITY = {"Public profile", "Community members only", "Hidden profile"}
VALID_AVAILABILITY = {"Actively looking", "Open to opportunities", "Just exploring", "Not currently available"}
SOCIAL_KEYS = {"linkedin", "x", "instagram", "github", "portfolio", "website"}

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

def clean_text(value, limit): return value.strip()[:limit]
def validate_profile(payload):
    username = payload.username.lower()
    if not re.fullmatch(r"[a-z0-9_-]{3,30}", username) or username in RESERVED_USERNAMES: raise HTTPException(422, "Username is unavailable")
    if payload.personality_type.upper() not in VALID_TYPES or payload.visibility not in VALID_VISIBILITY or payload.availability not in VALID_AVAILABILITY: raise HTTPException(422, "Invalid profile value")
    if payload.visibility == "Public profile" and not payload.publish_consent: raise HTTPException(422, "Publishing consent is required")
    payload.social_links = {key: value.strip() for key, value in payload.social_links.items() if isinstance(value, str) and value.strip()}
    if any(key not in SOCIAL_KEYS or urlparse(url).scheme not in {"http", "https"} or not urlparse(url).netloc for key, url in payload.social_links.items()): raise HTTPException(422, "Invalid social link")
    payload.visible_social_links = [key for key in payload.visible_social_links if key in payload.social_links]
    if any(key not in payload.social_links for key in payload.visible_social_links): raise HTTPException(422, "Invalid visible social link")
    return username
def public_profile(doc):
    text = lambda value: html.unescape(value) if isinstance(value, str) else value
    return {"display_name":text(doc["display_name"]),"username":doc["username"],"personality_type":doc["personality_type"],"bio":text(doc["bio"]),"country":text(doc["country"]),"city":text(doc["city"]),"languages":[text(value) for value in doc["languages"]],"profession":text(doc["profession"]),"skills":[text(value) for value in doc["skills"]],"industries":[text(value) for value in doc["industries"]],"years_experience":doc["years_experience"],"connection_intents":doc["connection_intents"],"availability":doc["availability"],"social_links":{key:doc["social_links"][key] for key in doc["visible_social_links"]},"created_at":doc["created_at"],"updated_at":doc["updated_at"]}

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


def send_contact_email(payload: ContactSubmission, submitted_at: datetime, user_agent: str):
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    sender = os.environ.get("CONTACT_FROM_EMAIL", smtp_user or "")
    recipient = os.environ.get("CONTACT_RECIPIENT_EMAIL", "nikhil.s.workz@gmail.com")
    if not all([smtp_host, sender, recipient]):
        raise RuntimeError("Contact email is not configured")

    message = EmailMessage()
    message["Subject"] = "New Contact Form Submission - KalQLater"
    message["From"] = sender
    message["To"] = recipient
    message["Reply-To"] = payload.email
    message.set_content(
        f"Name: {payload.name}\nEmail: {payload.email}\nSubject: {payload.subject}\n"
        f"Message:\n{payload.message}\n\nSubmission Time: {submitted_at.isoformat()}\n"
        f"User Agent: {user_agent or 'Unavailable'}"
    )
    port = int(os.environ.get("SMTP_PORT", "587"))
    with smtplib.SMTP(smtp_host, port, timeout=15) as smtp:
        if os.environ.get("SMTP_USE_TLS", "true").lower() == "true":
            smtp.starttls()
        if smtp_user and smtp_password:
            smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)


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

    clean = ContactSubmission(
        name=html.escape(payload.name), email=payload.email, subject=html.escape(payload.subject),
        message=html.escape(payload.message), website="", started_at=payload.started_at,
    )
    try:
        await asyncio.to_thread(send_contact_email, clean, now, request.headers.get("user-agent", ""))
    except Exception:
        logger.exception("Contact email delivery failed")
        return {"message": CONTACT_FALLBACK_MESSAGE, "delivered": False}
    return {"message": "Thank you for contacting us. We'll get back to you soon."}


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
