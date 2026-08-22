"""Import fresh public ATS jobs. Usage: python ingest_jobs.py [--dry-run] [--debug]."""
import argparse, hashlib, html, json, os, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
from behavior_engine.timestamps import normalize_utc

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
def skills_for(title,body):
    known=['SEO','CRM','SQL','Python','JavaScript','React','Node.js','TypeScript','Analytics','Figma','Product Marketing','Performance Marketing','Growth','Data','Design']
    return [x for x in known if x.lower() in f'{title} {body}'.lower()]
def parse_ts(value):
    if value is None:return None
    try:
        if isinstance(value,(int,float)):return datetime.fromtimestamp(value/1000,tz=timezone.utc)
        return normalize_utc(datetime.fromisoformat(str(value).replace('Z','+00:00')))
    except (ValueError,TypeError,OSError):return None
def lever(company):
    url=f'https://api.lever.co/v0/postings/{company["token"]}?mode=json';res=requests.get(url,timeout=25);res.raise_for_status();out=[]
    for j in res.json():
        posted=parse_ts(j.get('createdAt')); desc=text(' '.join([j.get('descriptionPlain',''),j.get('additionalPlain','')]+[x.get('content','') for x in j.get('lists',[])])); title=j.get('text','').strip()
        if not posted or normalize_utc(NOW())-normalize_utc(posted)>timedelta(days=30) or not KEYWORDS.search(f'{title} {desc}'):continue
        loc=(j.get('categories')or{}).get('location',''); jid=str(j.get('id')); apply=j.get('applyUrl') or j.get('hostedUrl')
        out.append({'id':str(hashlib.sha256(f'lever:{jid}'.encode()).hexdigest()[:32]),'slug':slug(company['name'],title,jid),'title':title,'company_name':company['name'],'company_logo_url':None,'description':desc,'requirements_text':desc,'skills':skills_for(title,desc),'department':(j.get('categories')or{}).get('team'),'industry':None,'employment_type':(j.get('categories')or{}).get('commitment'),'experience_min':None,'experience_max':None,'country':'','city':None,'location_text':loc,'work_mode':mode(loc,j.get('workplaceType','')),'salary_min':None,'salary_max':None,'salary_currency':None,'posted_at':posted,'expires_at':None,'source_type':'external','source_name':'lever','source_job_id':jid,'source_url':j.get('hostedUrl'),'application_mode':'external_redirect','external_apply_url':apply,'status':'active'})
    return out
def greenhouse(company):
    url=f'https://boards-api.greenhouse.io/v1/boards/{company["token"]}/jobs?content=true';res=requests.get(url,timeout=25);res.raise_for_status();out=[]
    for j in res.json().get('jobs',[]):
        # Greenhouse exposes updated_at, not a trustworthy posted date. Keep it null rather than fabricate freshness.
        title=j.get('title','').strip();desc=text(j.get('content',''))
        if not KEYWORDS.search(f'{title} {desc}'):continue
        loc=(j.get('location')or{}).get('name','');jid=str(j.get('id'))
        out.append({'id':str(hashlib.sha256(f'greenhouse:{company["token"]}:{jid}'.encode()).hexdigest()[:32]),'slug':slug(company['name'],title,jid),'title':title,'company_name':company['name'],'company_logo_url':None,'description':desc,'requirements_text':desc,'skills':skills_for(title,desc),'department':None,'industry':None,'employment_type':None,'experience_min':None,'experience_max':None,'country':'','city':None,'location_text':loc,'work_mode':mode(loc),'salary_min':None,'salary_max':None,'salary_currency':None,'posted_at':None,'expires_at':None,'source_type':'external','source_name':'greenhouse','source_job_id':f'{company["token"]}:{jid}','source_url':j.get('absolute_url'),'application_mode':'external_redirect','external_apply_url':j.get('absolute_url'),'status':'possibly_closed'})
    return out
def debug(db):
    n=NOW();b=[('<=7 days',n-timedelta(days=7),None),('8-14 days',n-timedelta(days=14),n-timedelta(days=7)),('15-30 days',n-timedelta(days=30),n-timedelta(days=14))]
    report={'total':db.jobs.count_documents({}),'active':db.jobs.count_documents({'status':'active'}),'possibly_closed':db.jobs.count_documents({'status':'possibly_closed'}),'closed':db.jobs.count_documents({'status':'closed'}),'>30 days':db.jobs.count_documents({'posted_at':{'$lt':n-timedelta(days=30)}}),'sources':list(db.jobs.aggregate([{'$group':{'_id':'$source_name','count':{'$sum':1}}}]))}
    for label,start,end in b:report[label]=db.jobs.count_documents({'posted_at':{'$gte':start,**({'$lt':end} if end else {})}})
    print(json.dumps(report,default=str,indent=2))
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--dry-run',action='store_true');ap.add_argument('--debug',action='store_true');a=ap.parse_args()
    if a.debug:
        client=MongoClient(os.environ['MONGO_URL']);return debug(client[os.environ['DB_NAME']])
    companies=json.loads((ROOT/'job_sources.json').read_text());seen=set();records=[]
    for c in companies:
        try:records.extend(lever(c) if c['source']=='lever' else greenhouse(c))
        except requests.RequestException as e:print(f'SKIP {c["name"]}: {e}')
    stamp=NOW();ops=[]
    for j in records:
        seen.add((j['source_name'],j['source_job_id']));j.update({'last_seen_at':stamp,'last_verified_at':stamp,'missing_checks':0});ops.append(UpdateOne({'source_name':j['source_name'],'source_job_id':j['source_job_id']},{'$set':j,'$setOnInsert':{'first_seen_at':stamp}},upsert=True))
    if a.dry_run:
        ages=[max(0,(normalize_utc(stamp)-normalize_utc(x['posted_at'])).days) for x in records if x.get('posted_at')]
        print(json.dumps({'fetched':len(records),'fresh_with_posted_date':len(ages),'<=7_days':sum(x<=7 for x in ages),'8_14_days':sum(8<=x<=14 for x in ages),'15_30_days':sum(15<=x<=30 for x in ages),'>30_days':sum(x>30 for x in ages),'undated_non_active':sum(not x.get('posted_at') for x in records)},indent=2));return
    client=MongoClient(os.environ['MONGO_URL']);db=client[os.environ['DB_NAME']]
    if ops:db.jobs.bulk_write(ops,ordered=False)
    for old in db.jobs.find({'source_type':'external','status':{'$in':['active','possibly_closed']}}):
        if (old.get('source_name'),old.get('source_job_id')) in seen:continue
        misses=old.get('missing_checks',0)+1;db.jobs.update_one({'_id':old['_id']},{'$set':{'missing_checks':misses,'status':'closed' if misses>=2 else 'possibly_closed'}})
    db.job_ingestion_runs.insert_one({'started_at':stamp,'finished_at':NOW(),'records_seen':len(records),'sources':len(companies)});debug(db)
if __name__=='__main__':main()
