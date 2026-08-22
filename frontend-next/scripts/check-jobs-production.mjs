import assert from 'node:assert/strict';
import { jobPostingSchema } from '../lib/job-seo.js';
import { jobsApiUrl, jobsBackendUrl } from '../lib/jobs-api.js';

const job={status:'active',slug:'example-role',title:'Example role',description:'Example',company_name:'Example',work_mode:'remote'};
assert.equal(jobPostingSchema(job,'en')['@type'],'JobPosting');
assert.equal(jobPostingSchema({...job,status:'possibly_closed'},'en'),null);
assert.equal(jobPostingSchema({...job,status:'closed'},'en'),null);
assert.equal(jobsBackendUrl({nodeEnv:'production',backendUrl:'https://kalqlater.onrender.com'}),'https://kalqlater.onrender.com');
assert.equal(jobsApiUrl('',{nodeEnv:'production',backendUrl:'https://kalqlater.onrender.com'}),'https://kalqlater.onrender.com/api/jobs');
assert.equal(jobsBackendUrl({nodeEnv:'development'}),'http://127.0.0.1:8000');
assert.throws(()=>jobsBackendUrl({nodeEnv:'production'}),/NEXT_PUBLIC_BACKEND_URL/);
console.log('Jobs production safeguards: PASS');
