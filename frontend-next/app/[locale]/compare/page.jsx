import { notFound } from 'next/navigation';
import { CompareSelector } from '../../../components/CompareSelector';
import { JsonLd } from '../../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { LocalePackagePreview } from '../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../localization/runtime';

export const dynamicParams = true;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const packagePage = await loadLocalePage(locale, 'compare');
  if (packagePage) return localePreviewMetadata(locale, packagePage, 'compare');
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
  const packagePage = await loadLocalePage(locale, 'compare');
  if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path="compare" />;
  if (!isLocale(locale)) notFound();
  const title = locale === 'hi' ? 'पर्सनैलिटी तुलना' : 'Personality comparison';
  return <><JsonLd data={{ '@context': 'https://schema.org', '@graph': [
    breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: title, path: 'compare' }]),
    { '@type': 'CollectionPage', name: title, url: `https://kalqlater.com/${locale}/compare`, inLanguage: locale === 'hi' ? 'hi-IN' : 'en-IN' },
  ] }} /><CompareSelector locale={locale} /></>;
}
