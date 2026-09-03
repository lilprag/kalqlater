import { notFound } from 'next/navigation';
import { CareerGuide } from '../../../../../components/careers/CareerGuide';
import { CAREER_TYPES } from '../../../../../data/career-guides';
import { getCareerGuideContent } from '../../../../../localization/career-guide';
import { pageMetadata } from '../../../../../lib/metadata';
import { isCareerPreviewLocale, isLocale } from '../../../../../lib/site';
import { LocalePackagePreview } from '../../../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../../../localization/runtime';
import { CAREER_QUICK_WINS } from '../../../../../data/traffic-sprint';

export const dynamicParams = true;
export function generateStaticParams() { return ['en', 'hi'].flatMap((locale) => CAREER_TYPES.map((type) => ({ locale, type }))); }
export async function generateMetadata({ params }) { const { locale, type } = await params; const packagePage = await loadLocalePage(locale, `career:${String(type).toLowerCase()}`); if (packagePage) return localePreviewMetadata(locale, packagePage, `personality/${type}/careers`); const preview = isCareerPreviewLocale(locale, type); let guide; try { guide = (isLocale(locale) || preview) && getCareerGuideContent(locale, type); } catch { return {}; } if (!guide) return {}; if (locale === 'es') { const url = `https://kalqlater.com/es/personality/${guide.code.toLowerCase()}/careers`; return { title: { absolute: guide.title }, description: guide.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: 'KalQLater', title: guide.title, description: guide.description, url, locale: 'es_ES' }, twitter: { card: 'summary', title: guide.title, description: guide.description }, robots: { index: false, follow: false } }; } const sprint = locale === 'en' ? CAREER_QUICK_WINS[guide.code] : null; return pageMetadata({ locale, path: `personality/${type}/careers`, title: sprint?.title || guide.title, description: sprint?.description || guide.description, entityId: `career-guide:${type}` }); }
export default async function CareerPage({ params }) { const { locale, type } = await params; const packagePage = await loadLocalePage(locale, `career:${String(type).toLowerCase()}`); if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path={`personality/${type}/careers`} />; const preview = isCareerPreviewLocale(locale, type); let guide; try { guide = (isLocale(locale) || preview) && getCareerGuideContent(locale, type); } catch { notFound(); } if (!guide) notFound(); return <CareerGuide locale={locale} guide={guide} />; }
