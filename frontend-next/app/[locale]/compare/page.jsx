import { notFound } from 'next/navigation';
import { CompareSelector } from '../../../components/CompareSelector';
import { pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: 'compare',
    title: locale === 'hi' ? 'पर्सनैलिटी तुलना: रिश्ते, संवाद और विकास' : 'Personality Comparison: Relationships, Communication & Growth',
    description: locale === 'hi' ? 'दो व्यक्तित्व प्रकार चुनें और रिश्तों, दोस्ती, संवाद, निर्णय, सहयोग और विकास में उनके संभावित डायनामिक को देखें।' : 'Choose two personality types to explore their potential dynamics in relationships, friendship, communication, decisions, collaboration, and growth.',
  });
}

export default async function LocalizedCompareSelectorPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CompareSelector locale={locale} />;
}
