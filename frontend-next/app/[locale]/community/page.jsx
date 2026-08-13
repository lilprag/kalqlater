import { notFound } from 'next/navigation';
import { DiscoveryLanding } from '../../../components/DiscoveryLanding';
import { discoveryLandings } from '../../../data/discovery-landings';
import { pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }
export async function generateMetadata({ params }) { const { locale } = await params; const copy = isLocale(locale) ? discoveryLandings[locale].community : null; return copy ? pageMetadata({ locale, path: 'community', title: locale === 'hi' ? 'KalQLater कम्युनिटी: जुड़ें, खोजें और सहयोग करें' : 'KalQLater Community: Discover, Connect, Collaborate', description: copy.description, entityId: 'community:directory' }) : {}; }
export default async function CommunityLandingPage({ params }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <DiscoveryLanding locale={locale} kind="community" copy={discoveryLandings[locale].community} />; }
