const base=()=> (process.env.NEXT_PUBLIC_BACKEND_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
export const jobsApiUrl=(path='')=>`${base()}/api/jobs${path}`;
export async function fetchJobs(path='',options={}){const r=await fetch(jobsApiUrl(path),{...options,cache:options.cache||'no-store'});if(!r.ok)throw new Error(`Jobs API ${r.status}`);return r.json()}
