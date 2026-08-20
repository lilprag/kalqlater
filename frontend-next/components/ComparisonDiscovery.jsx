import Link from 'next/link';

import { allPairs, pairSlug, parsePair } from '../lib/comparisons';
import { TYPE_ORDER } from '../lib/personality';
import { localePath } from '../lib/site';

const COPY = Object.freeze({
  en: Object.freeze({
    eyebrow: 'Explore by pair',
    popular: 'Popular personality comparisons',
    all: 'All personality comparisons',
    directoryBody: 'Browse every unique pair of the 16 personality types. Each guide explores communication, decisions, relationships, work, conflict, and growth without a compatibility score.',
    personalityTitle: (type) => `Compare ${type} with other personality types`,
    personalityBody: 'Explore every canonical pairing for practical context on communication, relationships, decisions, work, conflict, and growth.',
    related: 'Related personality comparisons',
    label: (first, second) => `${first} vs ${second}`,
  }),
  fr: Object.freeze({
    eyebrow: 'Explorer par duo',
    popular: 'Comparaisons de personnalités populaires',
    all: 'Toutes les comparaisons de personnalités',
    directoryBody: 'Parcourez les 120 duos uniques formés par les 16 types de personnalité. Chaque guide aborde la communication, les décisions, les relations, le travail, les désaccords et l’évolution, sans score de compatibilité.',
    personalityTitle: (type) => `Comparer ${type} avec les autres types de personnalité`,
    personalityBody: 'Explorez chaque duo canonique pour mieux comprendre la communication, les relations, les décisions, le travail, les désaccords et les pistes d’évolution.',
    related: 'Comparaisons de personnalités associées',
    label: (first, second) => `${first} et ${second}`,
  }),
  ja: Object.freeze({
    eyebrow: '組み合わせから探す',
    popular: 'よく読まれているパーソナリティ比較',
    all: 'すべてのパーソナリティ比較',
    directoryBody: '16タイプから生まれる120通りの組み合わせを一覧で見られます。相性を数値で決めつけず、コミュニケーション、意思決定、人間関係、仕事、対立、成長の視点から丁寧に見つめます。',
    personalityTitle: (type) => `${type}をほかのパーソナリティタイプと比較`,
    personalityBody: 'コミュニケーション、人間関係、意思決定、仕事、対立、成長の視点から、15タイプとの組み合わせを見つめられます。',
    related: '関連するパーソナリティ比較',
    label: (first, second) => `${first}と${second}`,
  }),
});

function localeCopy(locale) {
  return COPY[locale] || null;
}

function PairLinks({ locale, pairs, className = 'button-secondary' }) {
  const copy = localeCopy(locale);
  if (!copy) return null;
  return pairs.map((pair) => <Link key={pair.slug} href={localePath(locale, `compare/${pair.slug}`)} className={className}>{copy.label(pair.first, pair.second)}</Link>);
}

/** Complete SSR directory of the 120 unique canonical pairs. */
export function ComparisonDirectory({ locale }) {
  const copy = localeCopy(locale);
  if (!copy) return null;
  const headingId = locale === 'en' ? 'all-personality-comparisons' : `all-personality-comparisons-${locale}`;
  const pairs = allPairs();
  const popularSlugs = ['intj-vs-entp', 'intj-vs-enfp', 'infj-vs-enfj', 'istj-vs-isfj', 'estp-vs-esfp'];
  const bySlug = new Map(pairs.map((pair) => [pair.slug, pair]));
  const popular = popularSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
  return <section aria-labelledby={headingId} className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-brand-line bg-white p-7 shadow-[0_12px_36px_rgba(45,40,37,.05)] sm:p-9">
      <p className="section-kicker">{copy.eyebrow}</p>
      <h2 id={headingId} className="display-font mt-2 text-3xl text-brand-ink">{copy.popular}</h2>
      <div className="mt-6 flex flex-wrap gap-3"><PairLinks locale={locale} pairs={popular} /></div>
      <details className="mt-9 border-t border-brand-line pt-7">
        <summary className="cursor-pointer font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">{copy.all}</summary>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-subtle">{copy.directoryBody}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><PairLinks locale={locale} pairs={pairs} className="rounded-xl border border-brand-line px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-teal hover:text-brand-teal" /></div>
      </details>
    </div>
  </section>;
}

/** Fifteen canonical pair links for a localized personality guide. */
export function PersonalityComparisonDirectory({ locale, type }) {
  const copy = localeCopy(locale);
  const code = String(type || '').toUpperCase();
  if (!copy || !TYPE_ORDER.includes(code)) return null;
  const pairs = TYPE_ORDER.filter((candidate) => candidate !== code).map((candidate) => {
    const slug = pairSlug(code, candidate);
    const parsed = parsePair(slug);
    return { first: parsed.canonical[0], second: parsed.canonical[1], slug };
  });
  return <section aria-labelledby={`compare-${code.toLowerCase()}-${locale}`} className="mt-14 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
    <p className="section-kicker">{copy.eyebrow}</p>
    <h2 id={`compare-${code.toLowerCase()}-${locale}`} className="display-font mt-2 text-3xl text-brand-ink">{copy.personalityTitle(code)}</h2>
    <p className="mt-3 max-w-3xl text-brand-subtle">{copy.personalityBody}</p>
    <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><PairLinks locale={locale} pairs={pairs} className="rounded-xl border border-brand-line px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-teal hover:text-brand-teal" /></div>
  </section>;
}

/** Deterministic related pairs derived from the current pair, with no invented editorial copy. */
export function RelatedComparisonLinks({ locale, pair }) {
  const copy = localeCopy(locale);
  const parsed = parsePair(String(pair || '').replace(/^compare:/, ''));
  if (!copy || !parsed) return null;
  const [first, second] = parsed.canonical;
  const related = allPairs().filter((item) => item.slug !== parsed.slug && (item.first === first || item.second === first || item.first === second || item.second === second)).slice(0, 4);
  return <section className="mt-14 rounded-[2rem] bg-brand-sand/25 p-7 sm:p-9">
    <p className="section-kicker">{copy.related}</p>
    <div className="mt-5 flex flex-wrap gap-3"><PairLinks locale={locale} pairs={related} /></div>
  </section>;
}
