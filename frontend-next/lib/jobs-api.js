export function jobsBackendUrl({backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL,nodeEnv=process.env.NODE_ENV}={}){
  const configured=(backendUrl||'').trim().replace(/\/$/,'');
  if(configured)return configured;
  if(nodeEnv==='development')return 'http://127.0.0.1:8000';
  throw new Error('NEXT_PUBLIC_BACKEND_URL is required for KalQLater Jobs outside development.');
}
export const jobsApiUrl=(path='',environment)=>`${jobsBackendUrl(environment)}/api/jobs${path}`;
export async function fetchJobs(path='',options={}){const r=await fetch(jobsApiUrl(path),{...options,cache:options.cache||'no-store'});if(!r.ok)throw new Error(`Jobs API ${r.status}`);return r.json()}
