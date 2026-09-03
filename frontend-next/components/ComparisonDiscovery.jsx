import Link from 'next/link';

import { allPairs, pairSlug, parsePair } from '../lib/comparisons';
import { TYPE_ORDER } from '../lib/personality';
import { localePath } from '../lib/site';

export const COMPARE_HUB_FAQ = Object.freeze([
  ['Which MBTI types are most compatible?', 'No pairing is automatically the most compatible. Shared preferences may make some habits easier to recognise, while differences can add range. Communication, maturity, context, and choices matter more than a four-letter match.'],
  ['How should I read an MBTI compatibility chart?', 'Use the chart to open a two-type comparison, then examine communication, decisions, conflict, relationships, and work. It is a navigation tool—not a score or prediction.'],
  ['Can opposite personality types have a strong relationship?', 'Yes. Opposite preferences can create friction and complementarity. A strong relationship depends on how people understand differences, repair misunderstandings, and negotiate real needs.'],
  ['Does personality type predict relationship success?', 'No. Personality type cannot predict attraction, trust, safety, shared values, or relationship outcomes. It can only provide language for discussing some recurring preferences.'],
]);

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

function pairsForType(code) {
  return TYPE_ORDER.filter((candidate) => candidate !== code).map((candidate) => {
    const slug = pairSlug(code, candidate);
    const parsed = parsePair(slug);
    return { first: parsed.canonical[0], second: parsed.canonical[1], slug };
  });
}

/** Complete SSR directory of the 120 unique canonical pairs. */
export function ComparisonDirectory({ locale }) {
  const copy = localeCopy(locale);
  if (!copy) return null;
  const headingId = locale === 'en' ? 'all-personality-comparisons' : `all-personality-comparisons-${locale}`;
  const pairs = allPairs();
  const popularSlugs = ['infj-vs-isfj', 'enfj-vs-isfj', 'entp-vs-esfp', 'entp-vs-infj', 'infp-vs-isfp'];
  const bySlug = new Map(pairs.map((pair) => [pair.slug, pair]));
  const popular = popularSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
  if (locale === 'en') return <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath('en')}>KalQLater</Link><span aria-hidden="true"> / </span>MBTI compatibility</nav>
    <header className="content-hero relative mt-5 overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10"><span className="absolute -right-14 -top-16 h-64 w-64 rounded-full bg-brand-plum/20 blur-3xl" aria-hidden="true" /><div className="relative"><p className="section-kicker">Personality comparison directory</p><h1 className="display-font mt-3 text-4xl sm:text-6xl">MBTI Compatibility and Personality Type Comparisons</h1><p className="mt-5 max-w-4xl text-lg leading-relaxed text-brand-subtle">Compare any two of the 16 personality types across communication, decisions, conflict, relationships, and work. This MBTI compatibility chart leads to practical pair guides without assigning a score or predicting whether two people will succeed together.</p></div></header>

    <section aria-labelledby="compatibility-answer" className="mt-10 rounded-[2rem] bg-brand-ink p-7 text-white sm:p-9"><p className="section-kicker text-brand-sand">Quick answer</p><h2 id="compatibility-answer" className="display-font mt-2 text-3xl">What does MBTI compatibility really mean?</h2><p className="mt-4 max-w-4xl text-lg leading-relaxed text-white/85">Personality compatibility is not a ranking of good and bad matches. Similar preferences can make habits easier to recognise; different preferences can broaden a pair’s perspective. The useful question is how two people communicate, decide, recover from conflict, and adapt to the setting they share.</p></section>

    <section aria-labelledby="featured-comparisons" className="mt-12 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">Search-led starting points</p><h2 id="featured-comparisons" className="display-font mt-2 text-3xl text-brand-ink">Frequently searched personality comparisons</h2><p className="mt-3 max-w-3xl text-brand-subtle">These pair topics showed the strongest comparison demand in the sprint keyword dataset. Each link uses the one canonical order for that pair.</p><div className="mt-6 flex flex-wrap gap-3"><PairLinks locale="en" pairs={['infp-vs-isfp', 'infj-vs-enfj', 'infp-vs-enfp', 'intp-vs-infp', 'entp-vs-enfp'].map((slug) => bySlug.get(slug)).filter(Boolean)} /></div></section>

    <section aria-labelledby="compatibility-matrix" className="mt-14"><p className="section-kicker">Compatibility and comparison matrix</p><h2 id="compatibility-matrix" className="display-font mt-2 text-3xl text-brand-ink">Compare all 16 personality types</h2><p className="mt-3 max-w-4xl text-brand-subtle">Choose the cell where two types meet. Every unique pair appears once, so the matrix contains all 120 canonical Compare V3 guides and no reverse-order duplicate destinations.</p><div className="mt-7 overflow-x-auto rounded-[2rem] border border-brand-line bg-white"><table className="min-w-[980px] w-full border-collapse text-center text-xs"><caption className="sr-only">Matrix linking every unique pair of the 16 personality types</caption><thead><tr className="bg-brand-cream"><th scope="col" className="sticky left-0 z-10 bg-brand-cream p-3 text-left text-brand-ink">Type</th>{TYPE_ORDER.map((type) => <th key={type} scope="col" className="p-3 text-brand-ink">{type}</th>)}</tr></thead><tbody>{TYPE_ORDER.map((row, rowIndex) => <tr key={row} className="border-t border-brand-line"><th scope="row" className="sticky left-0 z-10 bg-white p-3 text-left font-bold text-brand-ink">{row}</th>{TYPE_ORDER.map((column, columnIndex) => <td key={column} className={`border-l border-brand-line p-2 ${columnIndex <= rowIndex ? 'bg-brand-sand/15 text-brand-subtle' : ''}`}>{columnIndex > rowIndex ? <Link href={localePath('en', `compare/${pairSlug(row, column)}`)} aria-label={`Compare ${row} and ${column}`} className="inline-flex min-h-9 min-w-10 items-center justify-center rounded-lg font-semibold text-brand-teal underline-offset-2 hover:bg-brand-cream hover:underline">{column}</Link> : <span aria-hidden="true">—</span>}</td>)}</tr>)}</tbody></table></div></section>

    <section aria-labelledby="compatibility-dimensions" className="mt-14 rounded-[2rem] bg-brand-sand/25 p-7 sm:p-9"><p className="section-kicker">Beyond a match label</p><h2 id="compatibility-dimensions" className="display-font mt-2 text-3xl text-brand-ink">Five dimensions that shape a pairing</h2><div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{[
      ['Communication', 'How each person gives context, listens, and makes an intention explicit.'],
      ['Decisions', 'Which evidence, values, pace, and trade-offs each person tends to prioritise.'],
      ['Conflict', 'What creates friction, how stress changes delivery, and what repair requires.'],
      ['Relationships', 'How care, trust, closeness, independence, and expectations are expressed.'],
      ['Work', 'How a pair coordinates planning, execution, feedback, ownership, and change.'],
    ].map(([title, body], index) => <article key={title} className="rounded-2xl bg-white p-5"><p className="text-xs font-bold text-brand-plum">0{index + 1}</p><h3 className="mt-2 font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{body}</p></article>)}</div></section>

    <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><article className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">How to use the pair guides</p><h2 className="display-font mt-2 text-3xl text-brand-ink">Turn a type contrast into a useful conversation</h2><ol className="mt-6 space-y-4">{['Read the shared foundation before focusing on differences.', 'Choose the context that matters now: relationship, friendship, work, or conflict.', 'Treat each pattern as a hypothesis and compare it with real behaviour.', 'Agree on one concrete adjustment instead of declaring a person compatible or incompatible.'].map((step, index) => <li key={step} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-teal text-sm font-bold text-white">{index + 1}</span><span className="pt-1 text-brand-subtle">{step}</span></li>)}</ol></article><aside className="rounded-[2rem] bg-brand-teal p-7 text-white sm:p-9"><p className="section-kicker text-brand-sand">Personality education</p><h2 className="display-font mt-2 text-3xl">Understand the Personality Dimensions</h2><p className="mt-4 text-white/80">If the four-letter codes are new, learn what each preference means before interpreting a pair.</p><div className="mt-6 flex flex-col items-start gap-3"><Link href="/en/guides" className="button-light">All Personality Guides</Link><Link href="/en/guides/mbti-letters-meaning" className="button-dark-outline">MBTI Letters Meaning</Link><Link href="/en/guides/sensing-vs-intuition" className="button-dark-outline">Sensing vs Intuition</Link><Link href="/en/guides/thinking-vs-feeling" className="button-dark-outline">Thinking vs Feeling</Link></div></aside></section>

    <section aria-labelledby="character-interpretations" className="mt-14 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">Personality in stories</p><h2 id="character-interpretations" className="display-font mt-2 text-3xl text-brand-ink">Explore fictional character interpretations</h2><p className="mt-3 max-w-3xl text-brand-subtle">Use recurring choices and motivations as evidence—not appearance, a single trope, or claims of official typing.</p><div className="mt-6 flex flex-wrap gap-3">{['INTP', 'INTJ', 'ENFJ', 'ISTP'].map((type) => <Link key={type} href={`/en/personality/${type.toLowerCase()}/characters`} className="button-secondary">{type} characters</Link>)}</div></section>

    <section aria-labelledby="compare-faq" className="mt-14"><p className="section-kicker">FAQ</p><h2 id="compare-faq" className="display-font mt-2 text-3xl text-brand-ink">Questions about MBTI compatibility</h2><div className="mt-6 space-y-3">{COMPARE_HUB_FAQ.map(([question, answer]) => <details key={question} className="rounded-2xl border border-brand-line bg-white p-5"><summary className="cursor-pointer font-semibold text-brand-ink">{question}</summary><p className="mt-4 max-w-4xl leading-relaxed text-brand-subtle">{answer}</p></details>)}</div></section>
  </main>;
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
  const pairs = pairsForType(code);
  return <section aria-labelledby={`compare-${code.toLowerCase()}-${locale}`} className="mt-14 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
    <p className="section-kicker">{copy.eyebrow}</p>
    <h2 id={`compare-${code.toLowerCase()}-${locale}`} className="display-font mt-2 text-3xl text-brand-ink">{copy.personalityTitle(code)}</h2>
    <p className="mt-3 max-w-3xl text-brand-subtle">{copy.personalityBody}</p>
    <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><PairLinks locale={locale} pairs={pairs} className="rounded-xl border border-brand-line px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-teal hover:text-brand-teal" /></div>
  </section>;
}

/** Two compact same-type link groups for canonical comparison pages. */
export function ComparisonPairSilos({ locale, first, second, currentSlug }) {
  if (!localeCopy(locale)) return null;
  const related = (code) => pairsForType(code).filter((pair) => pair.slug !== currentSlug).slice(0, 4);
  return <section className="mt-14 grid gap-5 lg:grid-cols-2" aria-label={locale === 'en' ? 'More comparisons by personality type' : undefined}>{[first, second].map((type) => <article key={type} className="rounded-[1.75rem] border border-brand-line bg-white p-6 sm:p-8"><p className="section-kicker">{locale === 'en' ? `More ${type}` : localeCopy(locale).related}</p><h2 className="display-font mt-2 text-2xl text-brand-ink">{localeCopy(locale).personalityTitle(type)}</h2><div className="mt-5 flex flex-wrap gap-2"><PairLinks locale={locale} pairs={related(type)} /></div></article>)}</section>;
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
