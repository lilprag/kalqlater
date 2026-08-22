import{JobsClient}from'../../../components/JobsClient';import{fetchJobs}from'../../../lib/jobs-api';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const{locale}=await params;return{title:'Fresh jobs and transparent matching | KalQLater',description:'Browse recently verified external jobs and understand how each role matches your skills, experience, location and career preferences.',alternates:{canonical:`https://kalqlater.com/${locale}/jobs`}}}
export default async function JobsPage({params}){const{locale}=await params;let data={items:[]};try{data=await fetchJobs('?posted_within=30&limit=50')}catch{data={items:[]}}return <JobsClient locale={locale} initialJobs={data.items}/>}
