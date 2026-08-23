"""Import fresh public ATS jobs. Usage: python ingest_jobs.py [--dry-run] [--debug]."""
import argparse, hashlib, html, json, os, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
from behavior_engine.timestamps import normalize_utc
from job_content import extract_job_skills

ROOT=Path(__file__).parent; load_dotenv(ROOT/'.env'); NOW=lambda:datetime.now(timezone.utc)
KEYWORDS=re.compile(r'growth|marketing|seo|crm|retention|product|analytics|design|software|engineer|developer|data',re.I)
def text(value):return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',value or ''))).strip()
def slug(company,title,job_id):
    base=re.sub(r'[^a-z0-9]+','-',f'{company}-{title}'.lower()).strip('-')[:90];return f'{base}-{hashlib.sha1(str(job_id).encode()).hexdigest()[:8]}'
def mode(location,workplace=''):
    s=f'{location} {workplace}'.lower()
    if 'remote' in s:return 'remote'
    if 'hybrid' in s:return 'hybrid'
    if s.strip():return 'onsite'
    return 'unknown'
def skills_for(title,body):return extract_job_skills(title,body)
def lever_content(job):
    about=[job.get('descriptionPlain','')];responsibilities=[];requirements=[]
    for item in job.get('lists',[]):
        heading=text(item.get('text',''));content=item.get('content','')
        if re.search(r"requirements?|qualifications?|what (?:we(?:'re| are) looking for|you(?:'ll| will) need)|who you are|you have",heading,re.I):requirements.append(content)
        elif re.search(r"responsibilities|what you(?:'ll| will) do|your role|in this role",heading,re.I):responsibilities.append(content)
        else:about.extend([heading,content])
    about.append(job.get('additionalPlain',''))
    return text(' '.join(about)),text(' '.join(responsibilities)),text(' '.join(requirements))
def parse_ts(value):
    if value is None:return None
    try:
        if isinstance(value,(int,float)):return datetime.fromtimestamp(value/1000,tz=timezone.utc)
        return normalize_utc(datetime.fromisoformat(str(value).replace('Z','+00:00')))
    except (ValueError,TypeError,OSError):return None
def source_scope(company):return f'{company["source"]}:{company["token"]}'
def lever(company):
    scope=source_scope(company);url=f'https://api.lever.co/v0/postings/{company["token"]}?mode=json';res=requests.get(url,timeout=25);res.raise_for_status();out=[]
    for j in res.json():
        posted=parse_ts(j.get('createdAt'));desc,responsibilities,requirements=lever_content(j);full_text=' '.join(x for x in (desc,responsibilities,requirements) if x);title=j.get('text','').strip()
        if not posted or normalize_utc(NOW())-normalize_utc(posted)>timedelta(days=30) or not KEYWORDS.search(f'{title} {full_text}'):continue
        loc=(j.get('categories')or{}).get('location','');jid=str(j.get('id'));apply=j.get('applyUrl') or j.get('hostedUrl')
        out.append({'id':str(hashlib.sha256(f'lever:{jid}'.encode()).hexdigest()[:32]),'slug':slug(company['name'],title,jid),'title':title,'company_name':company['name'],'company_logo_url':None,'description':desc,'responsibilities_text':responsibilities,'requirements_text':requirements,'skills':skills_for(title,full_text),'department':(j.get('categories')or{}).get('team'),'industry':None,'employment_type':(j.get('categories')or{}).get('commitment'),'experience_min':None,'experience_max':None,'country':'','city':None,'location_text':loc,'work_mode':mode(loc,j.get('workplaceType','')),'salary_min':None,'salary_max':None,'salary_currency':None,'posted_at':posted,'expires_at':None,'source_type':'external','source_name':'lever','source_board':scope,'source_job_id':jid,'source_url':j.get('hostedUrl'),'application_mode':'external_redirect','external_apply_url':apply,'status':'active'})
    return out
def greenhouse(company):
    scope=source_scope(company);url=f'https://boards-api.greenhouse.io/v1/boards/{company["token"]}/jobs?content=true';res=requests.get(url,timeout=25);res.raise_for_status();out=[]
    for j in res.json().get('jobs',[]):
        # Greenhouse exposes updated_at, not a trustworthy posted date. Keep it null rather than fabricate freshness.
        title=j.get('title','').strip();desc=text(j.get('content',''))
        if not KEYWORDS.search(f'{title} {desc}'):continue
        loc=(j.get('location')or{}).get('name','');jid=str(j.get('id'))
        out.append({'id':str(hashlib.sha256(f'greenhouse:{company["token"]}:{jid}'.encode()).hexdigest()[:32]),'slug':slug(company['name'],title,jid),'title':title,'company_name':company['name'],'company_logo_url':None,'description':desc,'requirements_text':'','skills':skills_for(title,desc),'department':None,'industry':None,'employment_type':None,'experience_min':None,'experience_max':None,'country':'','city':None,'location_text':loc,'work_mode':mode(loc),'salary_min':None,'salary_max':None,'salary_currency':None,'posted_at':None,'expires_at':None,'source_type':'external','source_name':'greenhouse','source_board':scope,'source_job_id':f'{company["token"]}:{jid}','source_url':j.get('absolute_url'),'application_mode':'external_redirect','external_apply_url':j.get('absolute_url'),'status':'possibly_closed'})
    return out
def ingestion_status(attempted,succeeded):
    if not succeeded:return 'failed'
    return 'success' if succeeded==attempted else 'partial_success'
def missing_transition(job,successful_scopes,seen):
    """Return the confirmed-missing update, or None when this source was not verified."""
    if job.get('source_board') not in successful_scopes or (job.get('source_name'),job.get('source_job_id')) in seen:return None
    misses=job.get('missing_checks',0)+1
    return {'missing_checks':misses,'status':'closed' if misses>=2 else 'possibly_closed'}
def debug(db):
    n=NOW();b=[('<=7 days',n-timedelta(days=7),None),('8-14 days',n-timedelta(days=14),n-timedelta(days=7)),('15-30 days',n-timedelta(days=30),n-timedelta(days=14))]
    report={'total':db.jobs.count_documents({}),'active':db.jobs.count_documents({'status':'active'}),'possibly_closed':db.jobs.count_documents({'status':'possibly_closed'}),'closed':db.jobs.count_documents({'status':'closed'}),'>30 days':db.jobs.count_documents({'posted_at':{'$lt':n-timedelta(days=30)}}),'sources':list(db.jobs.aggregate([{'$group':{'_id':'$source_name','count':{'$sum':1}}}]))}
    for label,start,end in b:report[label]=db.jobs.count_documents({'posted_at':{'$gte':start,**({'$lt':end} if end else {})}})
    print(json.dumps(report,default=str,indent=2));return report
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--dry-run',action='store_true');ap.add_argument('--debug',action='store_true');a=ap.parse_args()
    if a.debug:
        client=MongoClient(os.environ['MONGO_URL']);debug(client[os.environ['DB_NAME']]);return 0
    companies=json.loads((ROOT/'job_sources.json').read_text());seen=set();records=[];successful_scopes=set();source_results=[]
    for company in companies:
        scope=source_scope(company)
        try:
            fetched=lever(company) if company['source']=='lever' else greenhouse(company);records.extend(fetched);successful_scopes.add(scope);source_results.append({'source':scope,'status':'success','jobs_fetched':len(fetched)});print(f'OK {company["name"]}: {len(fetched)} jobs')
        except requests.RequestException as error:
            source_results.append({'source':scope,'status':'failed','jobs_fetched':0,'error':type(error).__name__});print(f'SKIP {company["name"]}: {error}')
    stamp=NOW();status=ingestion_status(len(companies),len(successful_scopes));ops=[]
    for job in records:
        seen.add((job['source_name'],job['source_job_id']));job.update({'last_seen_at':stamp,'last_verified_at':stamp,'missing_checks':0});ops.append(UpdateOne({'source_name':job['source_name'],'source_job_id':job['source_job_id']},{'$set':job,'$setOnInsert':{'first_seen_at':stamp}},upsert=True))
    if a.dry_run:
        ages=[max(0,(normalize_utc(stamp)-normalize_utc(x['posted_at'])).days) for x in records if x.get('posted_at')]
        print(json.dumps({'status':status,'sources_attempted':len(companies),'sources_succeeded':len(successful_scopes),'sources_failed':len(companies)-len(successful_scopes),'source_results':source_results,'fetched':len(records),'fresh_with_posted_date':len(ages),'<=7_days':sum(x<=7 for x in ages),'8_14_days':sum(8<=x<=14 for x in ages),'15_30_days':sum(15<=x<=30 for x in ages),'>30_days':sum(x>30 for x in ages),'undated_non_active':sum(not x.get('posted_at') for x in records)},indent=2));return 1 if status=='failed' else 0
    client=MongoClient(os.environ['MONGO_URL']);db=client[os.environ['DB_NAME']]
    if ops:db.jobs.bulk_write(ops,ordered=False)
    for old in db.jobs.find({'source_type':'external','status':{'$in':['active','possibly_closed']}}):
        update=missing_transition(old,successful_scopes,seen)
        if update:db.jobs.update_one({'_id':old['_id']},{'$set':update})
    counts={name:db.jobs.count_documents({'status':name}) for name in ('active','possibly_closed','closed')}
    run={'started_at':stamp,'finished_at':NOW(),'status':status,'sources_attempted':len(companies),'sources_succeeded':len(successful_scopes),'sources_failed':len(companies)-len(successful_scopes),'source_results':source_results,'jobs_fetched':len(records),'jobs_active':counts['active'],'jobs_possibly_closed':counts['possibly_closed'],'jobs_closed':counts['closed']}
    db.job_ingestion_runs.insert_one(run);debug(db);return 1 if status=='failed' else 0
if __name__=='__main__':raise SystemExit(main())
