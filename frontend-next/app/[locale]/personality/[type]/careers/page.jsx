import { notFound } from 'next/navigation';
import { CareerGuide } from '../../../../../components/careers/CareerGuide';
import { CAREER_TYPES } from '../../../../../data/career-guides';
import { getCareerGuideContent } from '../../../../../localization/career-guide';
import { pageMetadata } from '../../../../../lib/metadata';
import { isCareerPreviewLocale, isLocale } from '../../../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].flatMap((locale) => CAREER_TYPES.map((type) => ({ locale, type }))); }
export async function generateMetadata({ params }) { const { locale, type } = await params; const preview = isCareerPreviewLocale(locale, type); let guide; try { guide = (isLocale(locale) || preview) && getCareerGuideContent(locale, type); } catch { return {}; } if (!guide) return {}; if (locale === 'es') { const url = `https://kalqlater.com/es/personality/${guide.code.toLowerCase()}/careers`; return { title: { absolute: guide.title }, description: guide.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: 'KalQLater', title: guide.title, description: guide.description, url, locale: 'es_ES' }, twitter: { card: 'summary', title: guide.title, description: guide.description }, robots: { index: false, follow: false } }; } return pageMetadata({ locale, path: `personality/${type}/careers`, title: guide.title, description: guide.description, entityId: `career-guide:${type}` }); }
export default async function CareerPage({ params }) { const { locale, type } = await params; const preview = isCareerPreviewLocale(locale, type); let guide; try { guide = (isLocale(locale) || preview) && getCareerGuideContent(locale, type); } catch { notFound(); } if (!guide) notFound(); return <CareerGuide locale={locale} guide={guide} />; }
