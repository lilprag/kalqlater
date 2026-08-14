import { notFound } from 'next/navigation';
import { DiscoveryLanding } from '../../../components/DiscoveryLanding';
import { discoveryLandings } from '../../../data/discovery-landings';
import { pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { LocalePackagePreview } from '../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../localization/runtime';

export const dynamicParams = true;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }
export async function generateMetadata({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'jobs'); if (packagePage) return localePreviewMetadata(locale, packagePage, 'jobs'); const copy = isLocale(locale) ? discoveryLandings[locale].jobs : null; return copy ? pageMetadata({ locale, path: 'jobs', title: locale === 'hi' ? 'KalQLater जॉब्स: संदर्भ के साथ अवसर खोजें' : 'KalQLater Jobs: Explore Opportunities with Context', description: copy.description, entityId: 'jobs:directory' }) : {}; }
export default async function JobsLandingPage({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'jobs'); if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path="jobs" />; if (!isLocale(locale)) notFound(); return <DiscoveryLanding locale={locale} kind="jobs" copy={discoveryLandings[locale].jobs} />; }
