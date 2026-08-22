export function jobPostingSchema(job,locale){
  if(job.status!=='active')return null;
  return{'@context':'https://schema.org','@type':'JobPosting',title:job.title,description:job.description,datePosted:job.posted_at||undefined,validThrough:job.expires_at||undefined,employmentType:job.employment_type,hiringOrganization:{'@type':'Organization',name:job.company_name},jobLocationType:job.work_mode==='remote'?'TELECOMMUTE':undefined,url:`https://kalqlater.com/${locale}/jobs/${job.slug}`,directApply:false};
}
