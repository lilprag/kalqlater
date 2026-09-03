import Link from 'next/link';

import { CHARACTER_GUIDES, GUIDE_DISCOVERY } from '../data/traffic-sprint';

export function HomeGuideDiscovery() {
  return <section aria-labelledby="home-personality-guides" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="section-kicker">Learn the framework</p><h2 id="home-personality-guides" className="display-font section-title mt-3">Explore Personality Guides</h2><p className="mt-4 max-w-2xl leading-relaxed text-brand-subtle">Understand the ideas behind the four-letter types, then use them to ask better questions about your own patterns.</p></div><Link href="/en/guides" className="button-secondary shrink-0">All Personality Guides</Link></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{GUIDE_DISCOVERY.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}<Link href="/en/compare" className="rounded-[2rem] bg-brand-ink p-6 text-white transition hover:-translate-y-1 hover:shadow-lg"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-sand">Compare</p><h3 className="display-font mt-3 text-2xl">Compare Personality Types</h3><p className="mt-3 text-sm leading-relaxed text-white/75">Explore communication, decisions, conflict, relationships, and work across any two types.</p><span className="mt-5 inline-flex text-sm font-semibold text-brand-sand">Open comparisons <span aria-hidden="true">→</span></span></Link></div>
  </section>;
}

export function TypesGuideDiscovery() {
  return <section aria-labelledby="learn-personality-basics" className="mt-16 rounded-[2rem] bg-brand-sand/25 p-7 sm:p-9"><p className="section-kicker">Learn the basics</p><h2 id="learn-personality-basics" className="display-font mt-2 text-3xl text-brand-ink">Understand the letters before choosing a type</h2><p className="mt-3 max-w-3xl text-brand-subtle">These short guides explain the preference pairs behind all 16 profiles.</p><div className="mt-6 grid gap-3 md:grid-cols-3">{GUIDE_DISCOVERY.map((guide) => <Link key={guide.slug} href={`/en/guides/${guide.slug}`} className="rounded-2xl border border-brand-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-teal"><h3 className="font-semibold text-brand-ink">{guide.label}</h3><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{guide.description}</p><span className="mt-4 inline-flex text-sm font-semibold text-brand-teal">Read guide <span aria-hidden="true">→</span></span></Link>)}</div><Link href="/en/guides" className="button-secondary mt-6">All Personality Guides</Link></section>;
}

export function PersonalityExploreNav({ code, current = 'overview' }) {
  const slug = code.toLowerCase();
  const items = [
    current !== 'overview' ? [`${code} Personality`, `/en/personality/${slug}`] : null,
    current !== 'careers' ? [`${code} Careers`, `/en/personality/${slug}/careers`] : null,
    current !== 'characters' && CHARACTER_GUIDES[code] ? [`${code} Characters`, `/en/personality/${slug}/characters`] : null,
    [`Compare ${code}`, '/en/compare'],
    ['Personality Guides', '/en/guides'],
  ].filter(Boolean);
  return <nav aria-label={`Explore ${code}`} className="mt-6 rounded-2xl border border-brand-line bg-white p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><p className="shrink-0 text-sm font-bold text-brand-ink">Explore {code}</p><div className="flex flex-wrap gap-2">{items.map(([label, href]) => <Link key={href} href={href} className="rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink transition hover:text-brand-teal">{label}</Link>)}</div></div></nav>;
}

export function GuidePageNavigation({ currentSlug }) {
  return <nav aria-label="Explore personality guides" className="mt-6 rounded-2xl border border-brand-line bg-white p-4"><div className="flex flex-wrap gap-2"><Link href="/en/guides" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white">All Personality Guides</Link>{GUIDE_DISCOVERY.filter(({ slug }) => slug !== currentSlug).map((guide) => <Link key={guide.slug} href={`/en/guides/${guide.slug}`} className="rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink hover:text-brand-teal">{guide.label}</Link>)}<Link href="/en/compare" className="rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink hover:text-brand-teal">Compare Personality Types</Link><Link href="/en/test" className="rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink hover:text-brand-teal">Take the assessment</Link></div></nav>;
}

export function GuidesHub() {
  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href="/en">KalQLater</Link><span aria-hidden="true"> / </span>Personality Guides</nav><header className="content-hero relative mt-5 overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10 lg:p-12"><span aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-brand-teal/20 blur-3xl" /><div className="relative max-w-4xl"><p className="section-kicker">Personality education</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-6xl">Personality Guides</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-brand-subtle">Understand the concepts behind personality types, preferences, communication and comparison.</p></div></header><section aria-labelledby="available-personality-guides" className="mt-12"><p className="section-kicker">Available guides</p><h2 id="available-personality-guides" className="display-font mt-2 text-3xl text-brand-ink">Start with the four-letter framework</h2><div className="mt-7 grid gap-5 lg:grid-cols-3">{GUIDE_DISCOVERY.map((guide) => <GuideCard key={guide.slug} guide={guide} large />)}</div></section><section aria-labelledby="put-guides-to-use" className="mt-14 rounded-[2rem] bg-brand-ink p-7 text-white sm:p-10"><p className="section-kicker text-brand-sand">Continue exploring</p><h2 id="put-guides-to-use" className="display-font mt-2 text-3xl">Put the concepts into context</h2><p className="mt-4 max-w-3xl text-white/75">Read complete type profiles, compare two patterns, or reflect on your own preferences through the assessment.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/en/types" className="button-light">Personality Types</Link><Link href="/en/compare" className="button-dark-outline">Compare Personality Types</Link><Link href="/en/test" className="button-dark-outline">Personality assessment</Link></div></section></main>;
}

function GuideCard({ guide, large = false }) {
  return <Link href={`/en/guides/${guide.slug}`} className={`rounded-[2rem] border border-brand-line bg-white p-6 transition hover:-translate-y-1 hover:border-brand-teal hover:shadow-lg ${large ? 'sm:p-8' : ''}`}><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-plum">Personality guide</p><h3 className={`display-font mt-3 text-brand-ink ${large ? 'text-3xl' : 'text-2xl'}`}>{guide.label}</h3><p className="mt-3 text-sm leading-relaxed text-brand-subtle">{guide.description}</p><span className="mt-5 inline-flex text-sm font-semibold text-brand-teal">Read guide <span aria-hidden="true">→</span></span></Link>;
}
