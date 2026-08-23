from datetime import datetime, timezone, timedelta
from typing import List, Optional
from urllib.parse import urlparse
import re, uuid
from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from pydantic import BaseModel, ConfigDict, Field
from pymongo import ReturnDocument
from behavior_engine.timestamps import normalize_utc
from job_content import distinct_section, extract_job_skills

REMOTE={'remote','hybrid','onsite','flexible'}; NOTICE={'immediate','15_days','30_days','60_days','90_days','other'}
APP_STATUSES={'saved','started','applied','interview','offer','rejected','withdrawn','hired'}
def now(): return datetime.now(timezone.utc)
def iso(value): return value.isoformat() if isinstance(value,datetime) else value
def clean_list(values,limit=30): return list(dict.fromkeys(str(v).strip()[:80] for v in values if str(v).strip()))[:limit]

class CareerProfileInput(BaseModel):
    model_config=ConfigDict(extra='ignore',str_strip_whitespace=True)
    full_name:str=Field(...,min_length=1,max_length=120); current_job_title:str=Field(default='',max_length=140)
    years_experience:int=Field(default=0,ge=0,le=60); skills:List[str]=Field(default_factory=list,max_length=40)
    current_location:str=Field(default='',max_length=140); preferred_locations:List[str]=Field(default_factory=list,max_length=20)
    remote_preference:str='flexible'; target_roles:List[str]=Field(default_factory=list,max_length=20); industries:List[str]=Field(default_factory=list,max_length=20)
    salary_expectation_min:Optional[int]=Field(default=None,ge=0,le=1000000000); salary_currency:str=Field(default='USD',max_length=8)
    notice_period:str='other'; employment_status:str=Field(default='',max_length=80); open_to_work:bool=True
    linkedin_url:str=Field(default='',max_length=500); portfolio_url:str=Field(default='',max_length=500); resume_url:str=Field(default='',max_length=500)
    country:str=Field(default='',max_length=80); city:str=Field(default='',max_length=80); languages:List[str]=Field(default_factory=list,max_length=12)
    alert_frequency:str=Field(default='none',pattern='^(none|daily|weekly)$')

class ApplicationStatusInput(BaseModel): status:str

def validate_url(value):
    if not value:return ''
    p=urlparse(value); 
    if p.scheme not in {'http','https'} or not p.netloc: raise HTTPException(422,'Invalid URL')
    return value

def age_days(job,at=None):
    at=at or now(); posted=job.get('posted_at')
    if not posted:return 999
    if isinstance(posted,str):
        try: posted=datetime.fromisoformat(posted.replace('Z','+00:00'))
        except ValueError:return 999
    return max(0,(normalize_utc(at)-normalize_utc(posted)).days)

def career_identity(profile):
    """Map the existing community identity into the Jobs profile vocabulary."""
    if not profile:return {}
    links=profile.get('social_links') or {};city=profile.get('city','');country=profile.get('country','')
    return {'full_name':profile.get('display_name',''),'current_job_title':profile.get('profession',''),'years_experience':profile.get('years_experience',0),'skills':profile.get('skills',[]),'current_location':', '.join(x for x in (city,country) if x),'city':city,'country':country,'industries':profile.get('industries',[]),'languages':profile.get('languages',[]),'linkedin_url':links.get('linkedin',''),'portfolio_url':links.get('portfolio','')}

def profile_completeness(profile):
    checks={'name':profile.get('full_name'),'location':profile.get('current_location'),'current role':profile.get('current_job_title'),'experience':profile.get('years_experience') is not None,'skills':profile.get('skills'),'target roles':profile.get('target_roles'),'notice period':profile.get('notice_period') not in {None,'','other'},'work preference':profile.get('remote_preference')}
    missing=[label for label,value in checks.items() if not value]
    return {'percent':round(100*(len(checks)-len(missing))/len(checks)),'missing':missing}

def career_shared_update(payload):
    """Produce a safe partial community-profile update from shared Jobs fields."""
    data={}
    for source,target in [('full_name','display_name'),('current_job_title','profession'),('years_experience','years_experience'),('skills','skills'),('industries','industries'),('languages','languages'),('country','country'),('city','city')]:
        value=payload.get(source)
        if value not in (None,'',[]):data[target]=value
    links={'linkedin':payload.get('linkedin_url',''),'portfolio':payload.get('portfolio_url','')}
    data['_links']=links
    return data

def active_job_query(at=None):
    at=at or now(); return {'status':'active','$or':[{'posted_at':{'$gte':at-timedelta(days=30)}},{'last_verified_at':{'$gte':at-timedelta(days=2)},'posted_at':{'$gte':at-timedelta(days=90)}}]}

ROLE_STOP_WORDS={'a','an','and','associate','director','engineer','head','junior','lead','manager','of','principal','senior','specialist','the'}
ROLE_FAMILIES={
    'marketing':{'brand','content','crm','growth','marketing','paid','performance','seo','social'},
    'backend':{'api','backend','distributed','platform','server','software'},
    'tax':{'accountant','accounting','fiscal','tax'},
}

def _terms(value): return {x for x in re.findall(r'[a-z0-9+#.]+',str(value or '').lower()) if x not in ROLE_STOP_WORDS}
def _normalized_skill(value): return re.sub(r'[^a-z0-9+#]+','',str(value or '').lower())

def _role_relevance(profile,job):
    targets=clean_list([*profile.get('target_roles',[]),profile.get('current_job_title','')]);job_terms=_terms(job.get('title',''))
    if not targets or not job_terms:return None
    best=0
    for target in targets:
        target_terms=_terms(target)
        if not target_terms:continue
        overlap=len(target_terms&job_terms)/max(len(target_terms),len(job_terms))
        same_family=any(target_terms&family and job_terms&family for family in ROLE_FAMILIES.values())
        best=max(best,overlap,0.8 if same_family else 0)
    return best

def _skill_relevance(profile,job):
    profile_skills={_normalized_skill(x) for x in profile.get('skills',[]) if _normalized_skill(x)}
    job_skills={_normalized_skill(x) for x in job.get('skills',[]) if _normalized_skill(x)}
    if not profile_skills or not job_skills:return None,set()
    matched=profile_skills&job_skills
    return 2*len(matched)/(len(profile_skills)+len(job_skills)),matched

def match_job(profile,job):
    if not profile:return None
    if not clean_list([*profile.get('target_roles',[]),profile.get('current_job_title','')]) and len(clean_list(profile.get('skills',[])))<2:
        return {'status':'insufficient_profile','overall_score':None,'components':{},'matched':[],'explanation':'Complete your target roles or add at least two skills for a reliable match.'}
    signals=[];components={};evidence=[]
    role=_role_relevance(profile,job)
    if role is not None:signals.append((45,role));components['target_role']=round(role*100)
    skills,matched_skills=_skill_relevance(profile,job)
    if skills is not None:
        signals.append((35,skills));components['skills']=round(skills*100)
        if matched_skills:evidence.append(f"{len(matched_skills)} matched skill{'s' if len(matched_skills)!=1 else ''}")
    years=profile.get('years_experience');lo,hi=job.get('experience_min'),job.get('experience_max')
    if years is not None and (lo is not None or hi is not None):
        experience=1 if lo is None or years>=lo else max(0,1-(lo-years)*.25)
        if hi is not None and years>hi+4:experience=max(.6,experience-(years-hi-4)*.05)
        signals.append((10,experience));components['experience']=round(experience*100)
        if experience>=.8:evidence.append('Experience range')
    locations={str(x).strip().lower() for x in [*profile.get('preferred_locations',[]),profile.get('current_location','')] if str(x).strip()};job_location=str(job.get('location_text') or '').strip().lower()
    if locations and job_location:
        location=float(any(place in job_location or job_location in place for place in locations));signals.append((5,location));components['location']=round(location*100)
        if location:evidence.append('Location')
    pref=profile.get('remote_preference');mode=job.get('work_mode')
    if pref not in {None,'','flexible'} and mode not in {None,'','unknown'}:
        work_mode=float(pref==mode);signals.append((5,work_mode));components['work_mode']=round(work_mode*100)
        if work_mode:evidence.append('Work mode')
    industries={str(x).strip().lower() for x in profile.get('industries',[]) if str(x).strip()};job_industry=' '.join(str(job.get(x) or '').lower() for x in ('industry','department'))
    if industries and job_industry.strip():
        industry=float(any(x in job_industry for x in industries));signals.append((5,industry));components['industry']=round(industry*100)
        if industry:evidence.append('Industry')
    score=round(100*sum(weight*value for weight,value in signals)/sum(weight for weight,_ in signals)) if signals else 0
    if role and role>=.8:evidence.insert(0,'Target role')
    explanation=', '.join(evidence)+'.' if evidence else 'No strong profile evidence matches this role yet.'
    return {'status':'scored','overall_score':score,'components':components,'matched':evidence,'explanation':explanation+' Personality type is never used as a hiring filter.'}

def public_job(job,profile=None):
    x={k:iso(v) for k,v in job.items() if k not in {'_id'}}
    description=x.get('description','');responsibilities=distinct_section(description,x.get('responsibilities_text',''));requirements=distinct_section(description,x.get('requirements_text',''))
    if responsibilities:requirements=distinct_section(responsibilities,requirements)
    x['responsibilities_text']=responsibilities;x['requirements_text']=requirements
    x['skills']=extract_job_skills(x.get('title',''),description)
    x['posted_age_days']=age_days(job);x['match']=match_job(profile,{**job,'skills':x['skills']});return x

def sitemap_job(job):
    """Use a stricter contract than browsing so crawlers only receive verified URLs."""
    if job.get('status')!='active' or not job.get('slug') or not job.get('posted_at') or not job.get('last_verified_at'):return None
    return {'slug':job['slug'],'posted_at':iso(job['posted_at']),'last_verified_at':iso(job['last_verified_at'])}

def create_job_marketplace_router(db,current_user):
    r=APIRouter(prefix='/jobs',tags=['job-marketplace'])
    async def unified_profile(user_id):
        career=await db.career_profiles.find_one({'candidate_id':user_id},{'_id':0}) or {}
        community=await db.community_profiles.find_one({'owner_id':user_id},{'_id':0}) or {}
        merged={**career_identity(community),**career}
        merged['has_community_profile']=bool(community);merged['has_career_profile']=bool(career)
        merged['username']=community.get('username','');merged['profile_visibility']=community.get('visibility','')
        merged['assessment_context']={'personality_type':community.get('personality_type')}
        merged['completeness']=profile_completeness(merged)
        return merged
    @r.get('/career-profile')
    async def get_profile(user=Depends(current_user)):
        return await unified_profile(user['id'])
    @r.put('/career-profile')
    async def put_profile(payload:CareerProfileInput,user=Depends(current_user)):
        if payload.remote_preference not in REMOTE or payload.notice_period not in NOTICE: raise HTTPException(422,'Invalid career preference')
        data=payload.model_dump(); data.update({'candidate_id':user['id'],'skills':clean_list(data['skills'],40),'preferred_locations':clean_list(data['preferred_locations'],20),'target_roles':clean_list(data['target_roles'],20),'industries':clean_list(data['industries'],20),'languages':clean_list(data['languages'],12),'linkedin_url':validate_url(data['linkedin_url']),'portfolio_url':validate_url(data['portfolio_url']),'resume_url':validate_url(data['resume_url']),'updated_at':now()})
        existing=await db.career_profiles.find_one({'candidate_id':user['id']}); data['created_at']=existing.get('created_at') if existing else now()
        community=await db.community_profiles.find_one({'owner_id':user['id']})
        if community:
            shared=career_shared_update(data);links={**(community.get('social_links') or {}),**shared.pop('_links')}
            shared.update({'social_links':links,'updated_at':now().isoformat()})
            await db.community_profiles.update_one({'owner_id':user['id']},{'$set':shared})
        doc=await db.career_profiles.find_one_and_update({'candidate_id':user['id']},{'$set':data},upsert=True,return_document=ReturnDocument.AFTER); doc.pop('_id',None)
        doc['has_community_profile']=bool(community);doc['has_career_profile']=True;doc['completeness']=profile_completeness(doc)
        return doc
    @r.get('')
    async def jobs(request:Request,keyword:Optional[str]=None,location:Optional[str]=None,work_mode:Optional[str]=None,experience:Optional[int]=None,department:Optional[str]=None,posted_within:int=Query(30,ge=1,le=30),limit:int=Query(50,ge=1,le=100),authorization:Optional[str]=Header(None)):
        q=active_job_query(); q['posted_at']={'$gte':now()-timedelta(days=posted_within)}
        if keyword:q['$text']={'$search':keyword}
        if location:q['location_text']={'$regex':re.escape(location),'$options':'i'}
        if work_mode:q['work_mode']=work_mode
        if department:q['department']={'$regex':re.escape(department),'$options':'i'}
        if experience is not None:q['$and']=[{'$or':[{'experience_min':None},{'experience_min':{'$lte':experience}}]},{'$or':[{'experience_max':None},{'experience_max':{'$gte':experience}}]}]
        profile=None
        if authorization or request.cookies:
            try:u=await current_user(request,authorization);profile=await unified_profile(u['id'])
            except HTTPException:pass
        docs=await db.jobs.find(q,{'_id':0}).sort([('posted_at',-1),('last_verified_at',-1)]).limit(limit).to_list(limit)
        items=[public_job(x,profile) for x in docs]; items.sort(key=lambda x:(((x.get('match')or{}).get('overall_score') or 0),-x['posted_age_days']),reverse=True)
        return {'items':items,'total':len(items)}
    @r.get('/sitemap')
    async def sitemap_jobs():
        docs=await db.jobs.find(active_job_query(),{'_id':0,'slug':1,'status':1,'posted_at':1,'last_verified_at':1}).sort([('last_verified_at',-1),('posted_at',-1)]).limit(50000).to_list(50000)
        items=[item for item in (sitemap_job(doc) for doc in docs) if item]
        return {'items':items,'total':len(items)}
    @r.get('/saved')
    async def saved(user=Depends(current_user)):
        rows=await db.saved_jobs.find({'candidate_id':user['id']},{'_id':0}).sort('saved_at',-1).to_list(200); ids=[x['job_id'] for x in rows]; jobs=await db.jobs.find({'id':{'$in':ids}},{'_id':0}).to_list(200); by={x['id']:x for x in jobs}; return [public_job(by[i]) for i in ids if i in by]
    @r.post('/{job_id}/save')
    async def save(job_id:str,user=Depends(current_user)):
        if not await db.jobs.find_one({'id':job_id,'status':'active'}):raise HTTPException(404,'Job unavailable')
        await db.saved_jobs.update_one({'candidate_id':user['id'],'job_id':job_id},{'$setOnInsert':{'id':str(uuid.uuid4()),'candidate_id':user['id'],'job_id':job_id,'saved_at':now()}},upsert=True); return {'saved':True}
    @r.delete('/{job_id}/save')
    async def unsave(job_id:str,user=Depends(current_user)): await db.saved_jobs.delete_one({'candidate_id':user['id'],'job_id':job_id}); return {'saved':False}
    @r.get('/applications')
    async def applications(user=Depends(current_user)):
        rows=await db.job_applications.find({'candidate_id':user['id']},{'_id':0}).sort('updated_at',-1).to_list(200); jobs=await db.jobs.find({'id':{'$in':[x['job_id'] for x in rows]}},{'_id':0}).to_list(200); by={x['id']:x for x in jobs}; return [{**x,'job':public_job(by[x['job_id']]) if x['job_id'] in by else None} for x in rows]
    @r.post('/{job_id}/apply')
    async def apply(job_id:str,user=Depends(current_user)):
        job=await db.jobs.find_one({'id':job_id,'status':'active'}); 
        if not job or job.get('application_mode')!='external_redirect' or not job.get('external_apply_url'):raise HTTPException(404,'Application unavailable')
        stamp=now(); doc=await db.job_applications.find_one_and_update({'candidate_id':user['id'],'job_id':job_id},{'$setOnInsert':{'id':str(uuid.uuid4()),'candidate_id':user['id'],'job_id':job_id,'status':'started','started_at':stamp,'source':job.get('source_name')},'$set':{'updated_at':stamp}},upsert=True,return_document=ReturnDocument.AFTER); return {'application_id':doc['id'],'redirect_url':job['external_apply_url']}
    @r.patch('/applications/{application_id}')
    async def application_status(application_id:str,payload:ApplicationStatusInput,user=Depends(current_user)):
        if payload.status not in APP_STATUSES:raise HTTPException(422,'Invalid status')
        stamp=now(); setv={'status':payload.status,'updated_at':stamp};
        if payload.status=='applied':setv['applied_at']=stamp
        doc=await db.job_applications.find_one_and_update({'id':application_id,'candidate_id':user['id']},{'$set':setv},return_document=ReturnDocument.AFTER)
        if not doc:raise HTTPException(404,'Application not found')
        doc.pop('_id',None);return doc
    @r.get('/{slug}')
    async def detail(slug:str):
        job=await db.jobs.find_one({'slug':slug},{'_id':0});
        if not job:raise HTTPException(404,'Job not found')
        return public_job(job)
    return r

async def ensure_job_marketplace_indexes(db):
    await db.career_profiles.create_index('candidate_id',unique=True);await db.jobs.create_index([('source_name',1),('source_job_id',1)],unique=True);await db.jobs.create_index('slug',unique=True);await db.jobs.create_index([('status',1),('posted_at',-1)]);await db.jobs.create_index([('title','text'),('description','text'),('skills','text')]);await db.saved_jobs.create_index([('candidate_id',1),('job_id',1)],unique=True);await db.job_applications.create_index([('candidate_id',1),('job_id',1)],unique=True)
