import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/metadata';
import { isLocale, localePath, productionAppUrl } from '../../../../lib/site';
import { personalityProfile, TYPE_ORDER, typeFaq, typeFromSlug } from '../../../../lib/personality';
import { pairSlug } from '../../../../lib/comparisons';

export function generateStaticParams() { return ['en', 'hi'].flatMap((locale) => TYPE_ORDER.map((code) => ({ locale, type: code.toLowerCase() }))); }
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale, type } = await params;
  const activeLocale = isLocale(locale) ? locale : 'en';
  const code = typeFromSlug(type);
  const profile = code && personalityProfile(code, activeLocale);
  if (!profile) return {};
  return pageMetadata({ locale: activeLocale, path: `personality/${profile.slug}`, title: `${profile.code} — ${profile.displayName}`, description: profile.shortSummary });
}

export default async function PersonalityPage({ params }) {
  const { locale, type } = await params;
  if (!isLocale(locale)) notFound();
  const code = typeFromSlug(type);
  const profile = code && personalityProfile(code, locale);
  if (!profile) notFound();

  const hi = locale === 'hi';
  const faq = typeFaq(profile, locale);
  const compareHref = localePath(locale, `compare/${pairSlug(code, profile.relatedTypes[0])}`);
  const labels = hi
    ? { summary: 'सारांश', traits: 'मुख्य विशेषताएँ', strengths: 'ताकत', growth: 'विकास के क्षेत्र', work: 'काम और करियर', communication: 'संवाद शैली', decisions: 'निर्णय लेने का तरीका', leadership: 'नेतृत्व शैली', learning: 'सीखने का अभ्यास', relationships: 'रिश्ते', stress: 'तनाव और विकास', tips: 'व्यावहारिक सुझाव', faq: 'अक्सर पूछे जाने वाले प्रश्न', related: 'संबंधित व्यक्तित्व', test: 'व्यक्तित्व टेस्ट दें', compare: 'तुलना देखें', disclaimer: 'यह आत्मचिंतन का साधन है, नैदानिक निदान या भर्ती निर्णय नहीं।' }
    : { summary: 'Summary', traits: 'Core traits', strengths: 'Strengths', growth: 'Growth areas', work: 'Work and career themes', communication: 'Communication style', decisions: 'Decision-making approach', leadership: 'Leadership style', learning: 'Learning through practice', relationships: 'Relationships', stress: 'Stress and growth', tips: 'Practical development tips', faq: 'Frequently asked questions', related: 'Related personality types', test: 'Take the personality test', compare: 'Explore a comparison', disclaimer: 'This is a reflection tool, not a clinical diagnosis or hiring decision.' };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: hi ? 'व्यक्तित्व' : 'Personality', path: 'personality' }, { name: `${profile.code} ${profile.displayName}`, path: `personality/${profile.slug}` }]),
      { '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) },
    ],
  };
  const insightCards = [[labels.communication, [profile.communication?.summary, profile.communication?.preferred, profile.communication?.conflict, profile.communication?.listening].filter(Boolean)], [labels.decisions, [profile.leadership?.summary]], [labels.leadership, [profile.leadership?.style, ...(profile.leadership?.strengths || [])]], [labels.learning, [profile.learningStyle]]];

  return <><JsonLd data={jsonLd} /><article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <header className="content-hero relative overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10" style={{ borderTopColor: profile.color, borderTopWidth: 5 }}>
      <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl" style={{ background: profile.color }} aria-hidden="true" />
      <div className="relative max-w-3xl"><p className="section-kicker">{profile.group}</p><p className="mt-7 text-sm font-semibold uppercase tracking-[.24em]" style={{ color: profile.color }}>{profile.code}</p><h1 className="display-font mt-2 text-4xl sm:text-6xl">{profile.displayName}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle sm:text-xl">{profile.shortSummary}</p><p className="mt-7 rounded-2xl bg-brand-cream/90 p-4 text-sm leading-relaxed text-brand-subtle">{labels.disclaimer}</p></div>
    </header>
    <section className="mt-10 max-w-4xl"><p className="section-kicker">{labels.summary}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'अपने पैटर्न को समझें' : 'Understand the pattern'}</h2><p className="mt-4 text-lg leading-relaxed text-brand-subtle">{profile.overview}</p></section>
    <CardGrid sections={[[labels.traits, profile.coreTraits], [labels.strengths, profile.strengths], [labels.growth, profile.growthAreas], [labels.stress, profile.stressPatterns]]} />
    <section className="content-card mt-8 rounded-[1.75rem] border border-brand-line bg-brand-ink p-7 text-white sm:p-8"><p className="section-kicker text-brand-sand">{labels.work}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'काम में आपकी स्वाभाविक शैली' : 'Your natural work style'}</h2><List items={profile.workStyle} dark /></section>
    <CardGrid sections={insightCards} />
    <section className="content-card mt-8 rounded-[1.75rem] border border-brand-line bg-white p-7 sm:p-8"><p className="section-kicker">{labels.relationships}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'रिश्तों में' : 'In relationships'}</h2><p className="mt-4 max-w-3xl leading-relaxed text-brand-subtle">{profile.relationshipStyle}</p></section>
    <section className="mt-8 rounded-[1.75rem] bg-brand-cream/70 p-7 sm:p-8"><p className="section-kicker">{labels.tips}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'अभ्यास में अंतर्दृष्टि' : 'Put insight into practice'}</h2><List items={profile.developmentTips} /></section>
    <section className="mt-10"><p className="section-kicker">{labels.faq}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'कुछ सामान्य सवाल' : 'A few common questions'}</h2><div className="mt-5 space-y-3">{faq.map((item) => <details key={item.q} className="content-card rounded-2xl border border-brand-line bg-white p-5"><summary className="cursor-pointer font-semibold text-brand-ink">{item.q}</summary><p className="mt-3 leading-relaxed text-brand-subtle">{item.a}</p></details>)}</div></section>
    <section className="mt-10"><p className="section-kicker">{labels.related}</p><div className="mt-4 flex flex-wrap gap-3">{profile.relatedTypes.map((item) => <Link key={item} href={localePath(locale, `personality/${item.toLowerCase()}`)} className="button-secondary min-h-0 px-4 py-2">{item}</Link>)}</div></section>
    <div className="mt-10 flex flex-wrap gap-3"><a href={productionAppUrl('/test')} className="button-primary">{labels.test}<span aria-hidden="true">→</span></a><Link href={compareHref} className="button-secondary">{labels.compare}</Link></div>
  </article></>;
}

function List({ items, dark = false }) { return <ul className="mt-5 grid gap-2 sm:grid-cols-2">{items.map((item) => <li key={item} className={dark ? 'rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/85' : 'rounded-2xl bg-white/80 px-4 py-3 text-brand-subtle'}>{item}</li>)}</ul>; }
function CardGrid({ sections }) { return <div className="mt-8 grid gap-5 md:grid-cols-2">{sections.map(([title, items]) => <section key={title} className="content-card rounded-[1.75rem] border border-brand-line bg-white p-6 sm:p-7"><p className="section-kicker">{title}</p><h2 className="display-font mt-2 text-2xl text-brand-ink">{title}</h2><List items={items} /></section>)}</div>; }
