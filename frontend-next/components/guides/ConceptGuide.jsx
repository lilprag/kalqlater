import Link from 'next/link';

import { JsonLd } from '../JsonLd';
import { breadcrumbJsonLd } from '../../lib/metadata';
import { localePath, siteUrl } from '../../lib/site';
import { pairSlug } from '../../lib/comparisons';

export function ConceptGuide({ guide, slug }) {
  const path = `guides/${slug}`;
  const faqSchema = {
    '@type': 'FAQPage',
    inLanguage: 'en',
    mainEntity: guide.faqs.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
  const webPage = {
    '@type': 'WebPage',
    name: guide.title,
    description: guide.description,
    url: `${siteUrl()}${localePath('en', path)}`,
    inLanguage: 'en',
  };

  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      breadcrumbJsonLd('en', [{ name: 'KalQLater' }, { name: 'Personality guides', path: 'types' }, { name: guide.heading, path }]),
      webPage,
      faqSchema,
    ] }} />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href="/en">KalQLater</Link><span aria-hidden="true"> / </span><Link href="/en/types">Personality types</Link><span aria-hidden="true"> / </span>{guide.heading}</nav>
      <header className="content-hero relative mt-5 overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10 lg:p-12">
        <span className="absolute -right-14 -top-16 h-64 w-64 rounded-full bg-brand-plum/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-4xl"><p className="section-kicker">{guide.eyebrow}</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-6xl">{guide.heading}</h1><p className="mt-5 text-lg leading-relaxed text-brand-subtle">{guide.intro}</p></div>
      </header>

      <section aria-labelledby="quick-answer" className="mt-10 rounded-[2rem] bg-brand-ink p-7 text-white sm:p-9">
        <p className="section-kicker text-brand-sand">Quick answer</p><h2 id="quick-answer" className="display-font mt-2 text-3xl">The distinction in one minute</h2><p className="mt-4 max-w-4xl text-lg leading-relaxed text-white/85">{guide.quick}</p>
      </section>

      <section aria-labelledby="side-by-side" className="mt-14">
        <p className="section-kicker">Side by side</p><h2 id="side-by-side" className="display-font mt-2 text-3xl text-brand-ink">How the preferences differ</h2>
        <div className={`mt-6 grid gap-5 ${guide.columns.length > 2 ? 'md:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-2'}`}>{guide.columns.map((column, index) => <article key={column.title} className={`rounded-[2rem] p-6 sm:p-7 ${index % 2 ? 'border border-brand-line bg-white' : 'bg-brand-cream'}`}><h3 className="display-font text-2xl text-brand-ink">{column.title}</h3><p className="mt-3 leading-relaxed text-brand-subtle">{column.body}</p><ul className="mt-5 space-y-2 text-sm text-brand-ink">{column.points.map((point) => <li key={point} className="flex gap-2"><span aria-hidden="true" className="text-brand-teal">●</span><span>{point}</span></li>)}</ul></article>)}</div>
      </section>

      <section aria-labelledby="real-life" className="mt-14 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
        <p className="section-kicker">In real life</p><h2 id="real-life" className="display-font mt-2 text-3xl text-brand-ink">Where the distinction may show up</h2>
        <div className="mt-7 grid gap-x-8 gap-y-7 lg:grid-cols-2">{guide.sections.map(([title, body], index) => <article key={title} className="border-l-2 border-brand-teal pl-5"><p className="text-xs font-bold text-brand-plum">0{index + 1}</p><h3 className="mt-1 text-xl font-semibold text-brand-ink">{title}</h3><p className="mt-2 leading-relaxed text-brand-subtle">{body}</p></article>)}</div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-[2rem] bg-brand-teal p-7 text-white sm:p-9"><p className="section-kicker text-brand-sand">Scenario</p><h2 className="display-font mt-2 text-3xl">{guide.scenario[0]}</h2><p className="mt-4 leading-relaxed text-white/85">{guide.scenario[1]}</p></article>
        <aside className="rounded-[2rem] bg-brand-sand/30 p-7 sm:p-9"><p className="section-kicker">Common misconception</p><h2 className="display-font mt-2 text-3xl text-brand-ink">A useful correction</h2><p className="mt-4 leading-relaxed text-brand-subtle">{guide.myth}</p></aside>
      </section>

      <section aria-labelledby="related-types" className="mt-14"><p className="section-kicker">Continue exploring</p><h2 id="related-types" className="display-font mt-2 text-3xl text-brand-ink">See the preferences in complete type profiles</h2><div className="mt-6 flex flex-wrap gap-3">{guide.relatedTypes.map((type) => <Link key={type} href={localePath('en', `personality/${type.toLowerCase()}`)} className="button-secondary">{type} personality</Link>)}<Link href={localePath('en', 'compare')} className="button-secondary">MBTI compatibility chart</Link></div><div className="mt-5 flex flex-wrap gap-3">{guide.relatedTypes.slice(0, 3).map((type, index, types) => index < types.length - 1 ? <Link key={type} href={localePath('en', `compare/${pairSlug(type, types[index + 1])}`)} className="text-sm font-semibold text-brand-teal underline underline-offset-4">Compare {type} and {types[index + 1]}</Link> : null)}</div></section>

      <section aria-labelledby="guide-faq" className="mt-14"><p className="section-kicker">FAQ</p><h2 id="guide-faq" className="display-font mt-2 text-3xl text-brand-ink">Questions about this personality preference</h2><div className="mt-6 space-y-3">{guide.faqs.map(([question, answer]) => <details key={question} className="rounded-2xl border border-brand-line bg-white p-5"><summary className="cursor-pointer font-semibold text-brand-ink">{question}</summary><p className="mt-4 max-w-3xl leading-relaxed text-brand-subtle">{answer}</p></details>)}</div></section>

      <section className="mt-14 rounded-[2rem] bg-brand-ink p-8 text-white"><h2 className="display-font text-3xl">Use type as a question, not a verdict.</h2><p className="mt-4 max-w-3xl text-white/75">Read the full profiles, compare two patterns, and test any insight against your own behaviour and context.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/en/types" className="button-light">Explore all personality types</Link><Link href="/en/compare" className="button-dark-outline">Compare two types</Link></div></section>
    </main>
  </>;
}
