import { Suspense } from 'react'; import { notFound } from 'next/navigation'; import { AuthFlow } from '../../../components/AuthFlow'; import { isLocale } from '../../../lib/site';
const titles={en:'Log in',hi:'लॉग इन करें',fr:'Se connecter',ja:'ログイン'};export async function generateMetadata({params}){const{locale}=await params;return{title:`${titles[locale]||titles.en} | KalQLater`,robots:{index:false,follow:false}}}
export default async function Page({params}){const{locale}=await params;if(!isLocale(locale))notFound();return <Suspense><AuthFlow locale={locale} mode="login"/></Suspense>}
