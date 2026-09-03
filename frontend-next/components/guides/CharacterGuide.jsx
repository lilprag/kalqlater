import Link from 'next/link';

import { JsonLd } from '../JsonLd';
import { breadcrumbJsonLd } from '../../lib/metadata';
import { localePath, siteUrl } from '../../lib/site';
import { PersonalityExploreNav } from '../GuideDiscovery';

export function CharacterGuide({ code, guide }) {
  const slug = code.toLowerCase();
  const path = `personality/${slug}/characters`;
  const faqSchema = { '@type': 'FAQPage', inLanguage: 'en', mainEntity: guide.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      breadcrumbJsonLd('en', [{ name: 'KalQLater' }, { name: `${code} personality`, path: `personality/${slug}` }, { name: `${code} characters`, path }]),
      { '@type': 'CollectionPage', name: guide.title, description: guide.description, url: `${siteUrl()}${localePath('en', path)}`, inLanguage: 'en' },
      faqSchema,
    ] }} />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href="/en">KalQLater</Link><span aria-hidden="true"> / </span><Link href={`/en/personality/${slug}`}>{code} personality</Link><span aria-hidden="true"> / </span>Characters</nav>
      <header className="relative mt-5 overflow-hidden rounded-[2rem] bg-brand-ink p-8 text-white sm:p-11 lg:p-14"><span aria-hidden="true" className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-teal/40 blur-3xl" /><div className="relative max-w-4xl"><p className="section-kicker text-brand-sand">Fictional character interpretations</p><h1 className="display-font mt-3 text-4xl sm:text-6xl">{guide.heading}</h1><p className="mt-5 text-lg leading-relaxed text-white/80">{guide.intro}</p></div></header>
      <PersonalityExploreNav code={code} current="characters" />

      <section className="mt-10 rounded-[2rem] bg-brand-cream p-7 sm:p-9"><p className="section-kicker">Quick answer</p><h2 className="display-font mt-2 text-3xl text-brand-ink">What makes a {code} character interpretation credible?</h2><p className="mt-4 max-w-4xl text-lg leading-relaxed text-brand-subtle">{guide.quick}</p><p className="mt-4 max-w-4xl border-l-2 border-brand-plum pl-4 text-sm text-brand-subtle">These are editorial interpretations of fictional behaviour, not official classifications or claims about actors and creators.</p></section>

      <section aria-labelledby={`${slug}-examples`} className="mt-14"><p className="section-kicker">Character examples</p><h2 id={`${slug}-examples`} className="display-font mt-2 text-3xl text-brand-ink">Five characters often read as {code}</h2><div className="mt-7 grid gap-5 lg:grid-cols-2">{guide.characters.map(([name, work, evidence, limit], index) => <article key={name} className={`rounded-[2rem] p-7 ${index % 3 === 0 ? 'bg-brand-teal text-white' : 'border border-brand-line bg-white'}`}><p className={`text-xs font-bold uppercase tracking-wide ${index % 3 === 0 ? 'text-brand-sand' : 'text-brand-plum'}`}>{work}</p><h3 className={`display-font mt-2 text-3xl ${index % 3 === 0 ? 'text-white' : 'text-brand-ink'}`}>{name}</h3><p className={`mt-4 leading-relaxed ${index % 3 === 0 ? 'text-white/85' : 'text-brand-subtle'}`}>{evidence}</p><div className={`mt-5 border-t pt-4 ${index % 3 === 0 ? 'border-white/25' : 'border-brand-line'}`}><p className={`text-xs font-bold uppercase tracking-wide ${index % 3 === 0 ? 'text-brand-sand' : 'text-brand-teal'}`}>Where the reading is limited</p><p className={`mt-2 text-sm ${index % 3 === 0 ? 'text-white/75' : 'text-brand-subtle'}`}>{limit}</p></div></article>)}</div></section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]"><article className="rounded-[2rem] bg-brand-sand/30 p-7 sm:p-9"><p className="section-kicker">Shared pattern</p><h2 className="display-font mt-2 text-3xl text-brand-ink">What to look for across a story</h2><ol className="mt-6 space-y-3">{guide.patterns.map((pattern, index) => <li key={pattern} className="flex gap-4 rounded-2xl bg-white p-4"><span className="font-bold text-brand-teal">0{index + 1}</span><span className="text-brand-ink">{pattern}</span></li>)}</ol></article><aside className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">Common misunderstanding</p><h2 className="display-font mt-2 text-3xl text-brand-ink">A trope is not a type</h2><p className="mt-5 leading-relaxed text-brand-subtle">{guide.misunderstanding}</p><Link href={`/en/personality/${slug}`} className="button-primary mt-7">Read the complete {code} profile</Link></aside></section>

      <section className="mt-14"><p className="section-kicker">Compare interpretations</p><h2 className="display-font mt-2 text-3xl text-brand-ink">Where nearby type readings diverge</h2><div className="mt-6 flex flex-wrap gap-3">{guide.related.map((pair) => <Link key={pair} href={`/en/compare/${pair}`} className="button-secondary">{pair.split('-vs-').map((type) => type.toUpperCase()).join(' vs ')}</Link>)}<Link href="/en/compare" className="button-secondary">All 120 comparisons</Link></div></section>

      <section aria-labelledby={`${slug}-faq`} className="mt-14"><p className="section-kicker">FAQ</p><h2 id={`${slug}-faq`} className="display-font mt-2 text-3xl text-brand-ink">Questions about typing fictional characters</h2><div className="mt-6 space-y-3">{guide.faqs.map(([question, answer]) => <details key={question} className="rounded-2xl border border-brand-line bg-white p-5"><summary className="cursor-pointer font-semibold text-brand-ink">{question}</summary><p className="mt-4 max-w-3xl leading-relaxed text-brand-subtle">{answer}</p></details>)}</div></section>

      <section className="mt-14 rounded-[2rem] bg-brand-teal p-8 text-white"><h2 className="display-font text-3xl">Move from fiction to reflection.</h2><p className="mt-4 max-w-3xl text-white/80">Characters can make a pattern memorable. Your own context, choices, and development matter more than resemblance to a fictional example.</p><div className="mt-7 flex flex-wrap gap-3"><Link href={`/en/personality/${slug}`} className="button-light">Explore {code}</Link><Link href={`/en/personality/${slug}/careers`} className="button-dark-outline">Explore {code} careers</Link></div></section>
    </main>
  </>;
}
