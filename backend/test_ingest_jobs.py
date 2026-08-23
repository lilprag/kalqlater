import sys

import requests

import ingest_jobs


def job(scope, status='active', misses=0, job_id='job-1'):
    return {'source_name':'lever','source_board':scope,'source_job_id':job_id,'status':status,'missing_checks':misses}


def test_successful_source_first_absence_marks_possibly_closed():
    assert ingest_jobs.missing_transition(job('lever:alpha'), {'lever:alpha'}, set()) == {'missing_checks':1,'status':'possibly_closed'}


def test_successful_source_second_absence_closes_job():
    assert ingest_jobs.missing_transition(job('lever:alpha','possibly_closed',1), {'lever:alpha'}, set()) == {'missing_checks':2,'status':'closed'}


def test_failed_source_preserves_active_job():
    assert ingest_jobs.missing_transition(job('lever:alpha'), set(), set()) is None


def test_repeated_failed_source_still_preserves_job():
    existing=job('lever:alpha')
    assert ingest_jobs.missing_transition(existing,set(),set()) is None
    assert ingest_jobs.missing_transition(existing,set(),set()) is None


def test_partial_failure_only_advances_successful_source():
    success=job('lever:alpha',job_id='a');failed=job('lever:beta',job_id='b')
    assert ingest_jobs.ingestion_status(2,1) == 'partial_success'
    assert ingest_jobs.missing_transition(success,{'lever:alpha'},set())['status'] == 'possibly_closed'
    assert ingest_jobs.missing_transition(failed,{'lever:alpha'},set()) is None


def test_lever_content_uses_only_reliable_source_headings():
    source={
        'descriptionPlain':'Team and product introduction.',
        'lists':[
            {'text':"What you'll do",'content':'Build and operate creator APIs.'},
            {'text':"Who you are",'content':'You have production Java experience.'},
            {'text':'Benefits','content':'Flexible leave and learning support.'},
        ],
        'additionalPlain':'Equal opportunity statement.',
    }
    description,responsibilities,requirements=ingest_jobs.lever_content(source)
    assert description == 'Team and product introduction. Benefits Flexible leave and learning support. Equal opportunity statement.'
    assert responsibilities == 'Build and operate creator APIs.'
    assert requirements == 'You have production Java experience.'


class FakeJobs:
    def bulk_write(self,*args,**kwargs):raise AssertionError('No writes expected')
    def find(self,*args,**kwargs):return []
    def count_documents(self,query):return 0
    def aggregate(self,*args,**kwargs):return []


class FakeRuns:
    def __init__(self):self.rows=[]
    def insert_one(self,row):self.rows.append(row)


class FakeDb:
    def __init__(self):self.jobs=FakeJobs();self.job_ingestion_runs=FakeRuns()


def test_all_sources_fail_records_failed_run_and_returns_nonzero(monkeypatch):
    database=FakeDb()
    class Client:
        def __getitem__(self,name):return database
    def fail(company):raise requests.ConnectionError('source unavailable')
    monkeypatch.setattr(ingest_jobs,'MongoClient',lambda url:Client())
    monkeypatch.setattr(ingest_jobs,'lever',fail);monkeypatch.setattr(ingest_jobs,'greenhouse',fail)
    monkeypatch.setattr(sys,'argv',['ingest_jobs.py'])
    monkeypatch.setenv('MONGO_URL','mongodb://example.invalid');monkeypatch.setenv('DB_NAME','test')
    assert ingest_jobs.main() == 1
    assert database.job_ingestion_runs.rows[0]['status'] == 'failed'
    assert database.job_ingestion_runs.rows[0]['sources_succeeded'] == 0
