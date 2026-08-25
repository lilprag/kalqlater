import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd';
import { comparisonContent } from '../../../../lib/comparison-content';
import { requiresLocalizedComparisonPackage } from '../../../../lib/comparison-locales';
import { allPairs, comparisonProfile, parsePair } from '../../../../lib/comparisons';
import { getComparisonContent, spanishComparisonSlugs } from '../../../../localization/compare-guide';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/metadata';
import { getPersonalityUrl, personalityProfile } from '../../../../lib/personality';
import { isComparisonPreviewLocale, isLocale, localePath, productionAppUrl } from '../../../../lib/site';
import { RelatedContent } from '../../../../components/RelatedContent';
import { schemaLanguage } from '../../../../lib/locales';
import { LocalePackagePreview } from '../../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../../localization/runtime';
import { priorityComparison } from '../../../../lib/priority-comparisons';
import { testComparison } from '../../../../lib/test-comparisons';
import { ComparisonPairSilos } from '../../../../components/ComparisonDiscovery';

export function generateStaticParams() {
  return ['en', 'hi'].flatMap((locale) => allPairs().map((pair) => ({ locale, pair: pair.slug }))).concat(spanishComparisonSlugs.map((pair) => ({ locale: 'es', pair })));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { locale, pair } = await params;
  const parsed = parsePair(pair);
  const packagePage = await loadLocalePage(locale, `compare:${requiresLocalizedComparisonPackage(locale) && parsed ? parsed.slug : String(pair).toLowerCase()}`);
  if (packagePage) return localePreviewMetadata(locale, packagePage, `compare/${pair}`);
  if (requiresLocalizedComparisonPackage(locale)) return { robots: { index: false, follow: false } };
  const preview = isComparisonPreviewLocale(locale, pair);
  if ((!isLocale(locale) && !preview) || !parsed) return {};
  if (preview) {
    try {
      const localized = getComparisonContent('es', parsed.canonical[0], parsed.canonical[1]);
      const url = `https://kalqlater.com/es/compare/${parsed.slug}`;
      return { title: { absolute: localized.seo.title }, description: localized.seo.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: 'KalQLater', title: localized.seo.title, description: localized.seo.description, url, locale: 'es_ES' }, twitter: { card: 'summary', title: localized.seo.title, description: localized.seo.description }, robots: { index: false, follow: false } };
    } catch { return {}; }
  }
  const first = personalityProfile(parsed.canonical[0], locale);
  const second = personalityProfile(parsed.canonical[1], locale);
  const hi = locale === 'hi';
  const priority = locale === 'en' ? testComparison(parsed.canonical[0], parsed.canonical[1]) || priorityComparison(parsed.canonical[0], parsed.canonical[1]) : null;
  return pageMetadata({
    locale,
    path: `compare/${parsed.slug}`,
    title: hi
      ? `${first.code} और ${second.code}: संगतता, रिश्ता और तुलना`
      : priority?.title || `${first.code} vs ${second.code}: Personality, Relationships & Compatibility`,
    description: hi
      ? `${first.displayName} और ${second.displayName} रिश्ते, दोस्ती, काम, संवाद, मतभेद और विकास में कैसे साथ आ सकते हैं—प्रतिशत के बिना व्यावहारिक मार्गदर्शन।`
      : priority?.description || `Compare ${first.code} and ${second.code} personality types across communication, decision-making, relationships, work style, conflict, and growth.`,
    entityId: `compare:${parsed.slug}`,
  });
}

export default async function ComparisonPage({ params }) {
  const { locale, pair } = await params;
  const parsed = parsePair(pair);
  if (requiresLocalizedComparisonPackage(locale) && parsed && !parsed.isCanonical) permanentRedirect(localePath(locale, `compare/${parsed.slug}`));
  const packagePage = await loadLocalePage(locale, `compare:${requiresLocalizedComparisonPackage(locale) && parsed ? parsed.slug : String(pair).toLowerCase()}`);
  if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path={`compare/${pair}`} />;
  if (requiresLocalizedComparisonPackage(locale)) notFound();
  const preview = isComparisonPreviewLocale(locale, pair);
  if (!isLocale(locale) && !preview) notFound();
  if (!parsed) notFound();
  if (!parsed.isCanonical) permanentRedirect(localePath(locale, `compare/${parsed.slug}`));

  const [firstCode, secondCode] = parsed.canonical;
  let first; let second; let content;
  if (preview) {
    try { const localized = getComparisonContent('es', firstCode, secondCode); first = localized.first; second = localized.second; content = localized.content; } catch { notFound(); }
  } else {
    first = personalityProfile(firstCode, locale); second = personalityProfile(secondCode, locale);
    const insight = comparisonProfile(firstCode, secondCode, locale);
    content = comparisonContent({ firstProfile: first, secondProfile: second, insight, locale });
  }
  const hi = locale === 'hi';
  const es = locale === 'es';
  const copy = es ? content.ui : null;
  const related = allPairs().filter((item) => item.slug !== parsed.slug && (item.first === firstCode || item.second === firstCode || item.first === secondCode || item.second === secondCode)).slice(0, 4);
  const faqSchema = { '@type': 'FAQPage', inLanguage: schemaLanguage(locale), mainEntity: content.faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: hi ? 'तुलना' : es ? 'Comparar personalidades' : 'Compare', path: 'compare' }, { name: `${firstCode} vs ${secondCode}`, path: `compare/${parsed.slug}` }]),
    faqSchema,
  ] };

  return <><JsonLd data={jsonLd} /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link><span aria-hidden="true"> / </span><Link href={localePath(locale, 'compare')}>{hi ? 'तुलना' : es ? 'Comparar' : 'Compare'}</Link>{locale === 'en' ? <><span aria-hidden="true"> / </span><span>{firstCode} comparisons</span></> : null}<span aria-hidden="true"> / </span>{firstCode} {hi ? 'और' : es ? 'y' : 'and'} {secondCode}</nav>
    <header className="relative mt-5 overflow-hidden rounded-[2rem] bg-brand-ink p-7 text-white shadow-[0_24px_70px_rgba(45,40,37,.2)] sm:p-10 lg:p-14">
      <span aria-hidden="true" className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-brand-teal/35 blur-3xl" /><span aria-hidden="true" className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-brand-plum/35 blur-3xl" />
      <div className="relative"><p className="section-kicker text-brand-sand">{content.eyebrow}</p><h1 className="display-font mt-4 text-4xl leading-tight sm:text-6xl">{hi || es ? <>{first.code} <span className="text-brand-sand">{hi ? 'और' : 'y'}</span> {second.code}</> : content.title || <>{first.code} vs {second.code} Personality Comparison</>}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">{content.helper}</p><p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70">{content.intro}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><TypePanel profile={first} align="left" /><TypePanel profile={second} align="right" /></div>
      </div>
    </header>

    {content.experiment === 'test-b' ? <TestComparisonOverview content={content} first={firstCode} second={secondCode} /> : <section className="mt-12"><Header eyebrow={hi ? 'एक नज़र में' : es ? copy.snapshot : 'Quick snapshot'} title={hi ? 'इस जोड़ी के लिए उपयोगी संकेत' : es ? copy.signals : 'Useful signals for this pair'} /><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{content.snapshot.map((item) => <article key={item.title} className="rounded-3xl border border-brand-line bg-white p-5 shadow-[0_12px_36px_rgba(45,40,37,.05)]"><span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-cream text-lg text-brand-teal">{item.icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-brand-teal">{item.title}</p><h2 className="display-font mt-2 text-2xl text-brand-ink">{item.label}</h2><p className="mt-3 text-sm leading-relaxed text-brand-subtle">{item.text}</p></article>)}</div></section>}

    <section className="mt-14 grid gap-5 lg:grid-cols-2">{content.sections.map(([title, body, practice], index) => <article key={title} className={`rounded-[1.75rem] border p-6 sm:p-8 ${index === 0 ? 'border-brand-teal/30 bg-brand-teal/5' : index === 5 ? 'border-brand-saffron/30 bg-brand-sand/20' : 'border-brand-line bg-white'}`}><p className="section-kicker">{String(index + 1).padStart(2, '0')}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{title}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{body}</p><p className="mt-5 rounded-2xl bg-white/80 p-4 text-sm leading-relaxed text-brand-ink">{practice}</p></article>)}</section>

    <section className="mt-14 rounded-[2rem] bg-brand-ink p-7 text-white sm:p-9"><Header eyebrow={hi ? 'नंबर के बजाय' : es ? copy.instead : 'Instead of a number'} title={content.percentage} body={content.percentageText} light /></section>

    <section className="mt-14"><Header eyebrow={hi ? 'मिथक और वास्तविकता' : es ? copy.myths : 'Myth and reality'} title={hi ? 'टाइप लेबल के आगे देखें' : es ? copy.beyond : 'Look beyond the type label'} /><div className="mt-6 grid gap-4 lg:grid-cols-3">{content.misconceptions.map(([myth, reality]) => <article key={myth} className="rounded-3xl bg-brand-cream p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-plum">{hi ? 'मिथक' : es ? copy.myth : 'Myth'}</p><p className="mt-2 font-semibold text-brand-ink">{myth}</p><p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-brand-teal">{hi ? 'वास्तविकता' : es ? copy.reality : 'Reality'}</p><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{reality}</p></article>)}</div></section>

    <section className="mt-14"><Header eyebrow={hi ? 'खोज-आधारित प्रश्न' : es ? copy.questions : 'Search-driven questions'} title={hi ? 'अक्सर पूछे जाने वाले सवाल' : es ? copy.questions : 'Frequently asked questions'} /><div className="mt-6 space-y-3">{content.faq.map(([question, answer]) => <details key={question} className="rounded-2xl border border-brand-line bg-white p-5"><summary className="cursor-pointer font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">{question}</summary><p className="mt-4 max-w-4xl leading-relaxed text-brand-subtle">{answer}</p></details>)}</div></section>

    <section className="mt-14 rounded-[2rem] bg-brand-sand/25 p-7 sm:p-9"><Header eyebrow={hi ? 'और खोजें' : es ? copy.explore : 'Explore more'} title={hi ? 'इस तुलना को आगे बढ़ाएं' : es ? copy.further : 'Take this comparison further'} /><div className="mt-6 flex flex-wrap gap-3"><Link href={getPersonalityUrl(first.code, locale)} className="button-secondary">{first.code} {first.displayName}</Link><Link href={getPersonalityUrl(second.code, locale)} className="button-secondary">{second.code} {second.displayName}</Link><Link href={localePath(locale, `personality/${first.slug}/careers`)} className="button-secondary">{hi ? `${first.code} करियर गाइड` : es ? `${first.code} ${copy.career}` : `${first.code} Career Guide`}</Link><Link href={localePath(locale, `personality/${second.slug}/careers`)} className="button-secondary">{hi ? `${second.code} करियर गाइड` : es ? `${second.code} ${copy.career}` : `${second.code} Career Guide`}</Link>{!es && <><Link href={localePath(locale, 'insights/communication')} className="button-secondary">{hi ? 'कम्युनिकेशन इनसाइट्स' : 'Communication Insights'}</Link><Link href={localePath(locale, 'insights')} className="button-secondary">{hi ? 'इनसाइट्स हब' : 'Insights Hub'}</Link></>}</div>
      <div className="mt-8"><p className="section-kicker">{hi ? 'संबंधित तुलनाएँ' : es ? copy.related : 'Related comparisons'}</p><div className="mt-4 flex flex-wrap gap-3">{related.filter((item) => !es || isComparisonPreviewLocale('es', item.slug)).map((item) => <Link key={item.slug} href={localePath(locale, `compare/${item.slug}`)} className="button-secondary">{item.first} {hi ? 'और' : es ? 'y' : 'and'} {item.second}</Link>)}</div></div>
    </section>
    <ComparisonPairSilos locale={locale} first={firstCode} second={secondCode} currentSlug={parsed.slug} />
    <RelatedContent sourceEntityId={`compare:${parsed.slug}`} sourceType="compare" locale={locale} mode={preview ? 'preview' : 'public'} />
    <section className="mt-14 rounded-[2rem] bg-brand-teal p-8 text-white"><h2 className="display-font text-3xl sm:text-4xl">{hi ? 'पैटर्न समझें। अगली बातचीत चुनें।' : es ? copy.pattern : 'Understand the pattern. Choose the next conversation.'}</h2><p className="mt-4 max-w-2xl text-white/80">{hi ? 'यह आत्मचिंतन है, किसी रिश्ते, क्षमता या भविष्य का निश्चित फैसला नहीं।' : es ? copy.reflection : 'This is a reflection tool, not a verdict on a relationship, ability, or future.'}</p><div className="mt-7 flex flex-wrap gap-3"><a href={productionAppUrl('/test')} className="button-light">{hi ? 'पर्सनैलिटी टेस्ट दें' : es ? copy.test : 'Take the personality test'}</a>{!es && <Link href={localePath(locale, 'compare')} className="button-dark-outline">{hi ? 'दूसरी तुलना देखें' : 'Explore another comparison'}</Link>}</div></section>
  </main></>;
}

function Header({ eyebrow, title, body, light = false }) {
  return <div className="max-w-4xl"><p className={`section-kicker ${light ? 'text-brand-sand' : ''}`}>{eyebrow}</p><h2 className={`display-font mt-2 text-3xl sm:text-4xl ${light ? 'text-white' : 'text-brand-ink'}`}>{title}</h2>{body ? <p className={`mt-4 leading-relaxed ${light ? 'text-white/80' : 'text-brand-subtle'}`}>{body}</p> : null}</div>;
}

function TypePanel({ profile, align }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/10 p-5 ${align === 'right' ? 'sm:text-right' : ''}`}><p className="text-xs font-bold tracking-[.16em] text-brand-sand">{profile.code}</p><p className="display-font mt-2 text-2xl">{profile.displayName}</p><p className="mt-2 text-sm leading-relaxed text-white/75">{profile.shortSummary}</p></div>;
}

function TestComparisonOverview({ content, first, second }) {
  return <><section className="mt-12 rounded-[2rem] border border-brand-teal/25 bg-brand-teal/5 p-7 sm:p-9"><p className="section-kicker">Quick answer</p><h2 className="display-font mt-2 text-3xl text-brand-ink">How are {first} and {second} different?</h2><p className="mt-4 max-w-4xl leading-relaxed text-brand-subtle">{content.quickAnswer}</p></section><section className="mt-14"><Header eyebrow="At a glance" title={`${first} and ${second} comparison`} /><div className="mt-6 overflow-hidden rounded-[1.75rem] border border-brand-line bg-white"><div className="hidden grid-cols-[.8fr_1fr_1fr] bg-brand-ink px-5 py-4 text-sm font-semibold text-white sm:grid"><span>Dimension</span><span>{first}</span><span>{second}</span></div><div>{content.comparison.map(([dimension, firstText, secondText]) => <article key={dimension} className="grid gap-3 border-t border-brand-line p-5 first:border-t-0 sm:grid-cols-[.8fr_1fr_1fr]"><h3 className="font-semibold text-brand-ink">{dimension}</h3><p className="text-sm leading-relaxed text-brand-subtle"><span className="mr-2 font-semibold text-brand-teal sm:hidden">{first}:</span>{firstText}</p><p className="text-sm leading-relaxed text-brand-subtle"><span className="mr-2 font-semibold text-brand-plum sm:hidden">{second}:</span>{secondText}</p></article>)}</div></div></section></>;
}
