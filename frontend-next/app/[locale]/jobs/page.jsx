import { notFound } from 'next/navigation';
import { DiscoveryLanding } from '../../../components/DiscoveryLanding';
import { discoveryLandings } from '../../../data/discovery-landings';
import { pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }
export async function generateMetadata({ params }) { const { locale } = await params; const copy = isLocale(locale) ? discoveryLandings[locale].jobs : null; return copy ? pageMetadata({ locale, path: 'jobs', title: locale === 'hi' ? 'KalQLater जॉब्स: संदर्भ के साथ अवसर खोजें' : 'KalQLater Jobs: Explore Opportunities with Context', description: copy.description }) : {}; }
export default async function JobsLandingPage({ params }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <DiscoveryLanding locale={locale} kind="jobs" copy={discoveryLandings[locale].jobs} />; }
