import{JobsClient}from'../../../components/JobsClient';import{fetchJobs}from'../../../lib/jobs-api';
import{pageMetadata}from'../../../lib/metadata';
export const dynamic='force-dynamic';
const title='Fresh jobs and transparent matching | KalQLater',description='Browse recently verified external jobs and understand how each role matches your skills, experience, location and career preferences.';
export async function generateMetadata({params}){const{locale}=await params;if(locale!=='en')return{title,description,alternates:{canonical:`https://kalqlater.com/${locale}/jobs`},robots:{index:false,follow:true}};return pageMetadata({locale,path:'jobs',title,description,availableLocales:['en']})}
export default async function JobsPage({params}){const{locale}=await params;const data=await fetchJobs('?posted_within=30&limit=50');return <JobsClient locale={locale} initialJobs={data.items}/>}
