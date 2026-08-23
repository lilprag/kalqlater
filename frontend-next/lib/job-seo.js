export function jobPostingSchema(job,locale){
  if(job.status!=='active'||!job.slug||!job.title||!job.description||!job.company_name||!job.posted_at)return null;
  const remote=job.work_mode==='remote';
  const address=job.city||job.country?{'@type':'PostalAddress',addressLocality:job.city||undefined,addressCountry:job.country||undefined}:null;
  return{'@context':'https://schema.org','@type':'JobPosting',title:job.title,description:job.description,datePosted:job.posted_at||undefined,validThrough:job.expires_at||undefined,employmentType:job.employment_type||undefined,hiringOrganization:{'@type':'Organization',name:job.company_name},jobLocation:!remote&&address?{'@type':'Place',address}:undefined,jobLocationType:remote?'TELECOMMUTE':undefined,applicantLocationRequirements:remote&&job.country?{'@type':'Country',name:job.country}:undefined,url:`https://kalqlater.com/${locale}/jobs/${job.slug}`,directApply:false};
}
