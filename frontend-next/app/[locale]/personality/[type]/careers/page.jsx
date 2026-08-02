import { notFound } from 'next/navigation';
import { CareerGuide } from '../../../../../components/careers/CareerGuide';
import { CAREER_TYPES, careerGuide } from '../../../../../data/career-guides';
import { pageMetadata } from '../../../../../lib/metadata';
import { isLocale } from '../../../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].flatMap((locale) => CAREER_TYPES.map((type) => ({ locale, type }))); }
export async function generateMetadata({ params }) { const { locale, type } = await params; const guide = isLocale(locale) && careerGuide(type, locale); return guide ? pageMetadata({ locale, path: `personality/${type}/careers`, title: guide.title, description: guide.description }) : {}; }
export default async function CareerPage({ params }) { const { locale, type } = await params; const guide = isLocale(locale) && careerGuide(type, locale); if (!guide) notFound(); return <CareerGuide locale={locale} guide={guide} />; }
