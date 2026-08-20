import { notFound } from 'next/navigation';
import { CompareSelector } from '../../../components/CompareSelector';
import { ComparisonDirectory } from '../../../components/ComparisonDiscovery';
import { JsonLd } from '../../../components/JsonLd';
import { localeConfig } from '../../../lib/locales';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

export const dynamicParams = true;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const seo = locale === 'fr'
    ? ['Comparaison de personnalités : relations, communication et évolution', 'Choisissez deux types de personnalité pour explorer leurs dynamiques possibles dans la communication, les décisions, la collaboration et l’évolution.']
    : locale === 'ja'
      ? ['パーソナリティ比較：関係性・コミュニケーション・成長', '二つのパーソナリティタイプを選び、コミュニケーション、意思決定、協働、成長に表れうる関わり方を見つめます。']
      : locale === 'hi'
        ? ['पर्सनैलिटी तुलना: रिश्ते, संवाद और विकास', 'दो व्यक्तित्व प्रकार चुनें और रिश्तों, दोस्ती, संवाद, निर्णय, सहयोग और विकास में उनके संभावित डायनामिक को देखें।']
        : ['Personality Comparison: Relationships, Communication & Growth', 'Choose two personality types to explore their potential dynamics in relationships, friendship, communication, decisions, collaboration, and growth.'];
  return pageMetadata({
    locale,
    path: 'compare',
    title: seo[0], description: seo[1],
  });
}

export default async function LocalizedCompareSelectorPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const title = locale === 'hi' ? 'पर्सनैलिटी तुलना' : locale === 'fr' ? 'Comparaison de personnalités' : locale === 'ja' ? 'パーソナリティ比較' : 'Personality comparison';
  return <><JsonLd data={{ '@context': 'https://schema.org', '@graph': [
    breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: title, path: 'compare' }]),
    { '@type': 'CollectionPage', name: title, url: `https://kalqlater.com/${locale}/compare`, inLanguage: localeConfig(locale)?.hreflang || locale },
  ] }} /><CompareSelector locale={locale} />{['en', 'fr', 'ja'].includes(locale) ? <ComparisonDirectory locale={locale} /> : null}</>;
}
