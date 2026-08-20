import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompareSelector } from '../../../components/CompareSelector';
import { JsonLd } from '../../../components/JsonLd';
import { allPairs } from '../../../lib/comparisons';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale, localePath } from '../../../lib/site';

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
    { '@type': 'CollectionPage', name: title, url: `https://kalqlater.com/${locale}/compare`, inLanguage: locale === 'hi' ? 'hi-IN' : 'en-IN' },
  ] }} /><CompareSelector locale={locale} />{locale === 'en' ? <ComparisonDirectory /> : null}</>;
}

/**
 * The selector remains the primary interaction, while these SSR links give
 * crawlers and keyboard users a complete, canonical comparison directory.
 */
function ComparisonDirectory() {
  const pairs = allPairs();
  const popular = ['intj-vs-entp', 'intj-vs-enfp', 'infj-vs-enfj', 'istj-vs-isfj', 'estp-vs-esfp'];
  const bySlug = new Map(pairs.map((pair) => [pair.slug, pair]));
  const label = (pair) => `${pair.first} vs ${pair.second}`;
  return <section aria-labelledby="all-personality-comparisons" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-brand-line bg-white p-7 shadow-[0_12px_36px_rgba(45,40,37,.05)] sm:p-9">
      <p className="section-kicker">Explore by pair</p>
      <h2 id="all-personality-comparisons" className="display-font mt-2 text-3xl text-brand-ink">Popular personality comparisons</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {popular.map((slug) => {
          const pair = bySlug.get(slug);
          return <Link key={slug} href={localePath('en', `compare/${slug}`)} className="button-secondary">{label(pair)}</Link>;
        })}
      </div>
      <details className="mt-9 border-t border-brand-line pt-7">
        <summary className="cursor-pointer font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">All personality comparisons</summary>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-subtle">Browse every unique pair of the 16 personality types. Each guide explores communication, decisions, relationships, work, conflict, and growth without a compatibility score.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((pair) => <Link key={pair.slug} href={localePath('en', `compare/${pair.slug}`)} className="rounded-xl border border-brand-line px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-teal hover:text-brand-teal">{label(pair)}</Link>)}
        </div>
      </details>
    </div>
  </section>;
}
