import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd';
import { insightsHubCopy } from '../../../data/insights-hub';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { schemaLanguage } from '../../../lib/locales';
import { isLocale, localePath } from '../../../lib/site';

export const dynamicParams = true;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }
export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const seo = locale === 'fr'
    ? ['Perspectives KalQLater : au-delà de la personnalité', 'Explorez les outils de réflexion KalQLater sur la communication, les décisions, le travail et les relations au quotidien.']
    : locale === 'ja'
      ? ['KalQLaterインサイト：パーソナリティの、その先へ', 'コミュニケーション、意思決定、仕事、人とのつながりを振り返るKalQLaterの実践的なツールをご覧ください。']
      : locale === 'hi'
        ? ['KalQLater इनसाइट्स: पर्सनैलिटी से आगे', 'संवाद, निर्णय, काम और जुड़ाव की रोज़मर्रा की आदतों पर विचार करने के लिए KalQLater के इनसाइट्स साधन देखें।']
        : ['KalQLater Insights: Go Beyond Personality', 'Explore KalQLater reflection tools for everyday communication, decision-making, work, and connection patterns.'];
  return pageMetadata({
    locale,
    path: 'insights',
    title: seo[0], description: seo[1],
  });
}

export default async function InsightsHubPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = insightsHubCopy[locale];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: c.eyebrow, path: 'insights' }]),
      {
        '@type': 'CollectionPage', name: c.eyebrow,
        description: c.body,
        url: `https://kalqlater.com${localePath(locale, 'insights')}`,
        inLanguage: schemaLanguage(locale),
      },
    ],
  };
  return <><JsonLd data={jsonLd} /><main className="overflow-hidden">
    <section className="hero-shell relative"><div aria-hidden="true" className="hero-blob hero-blob-saffron" /><div aria-hidden="true" className="hero-blob hero-blob-teal" /><div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"><nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link><span aria-hidden="true"> / </span>{c.eyebrow}</nav><p className="eyebrow-pill mt-7"><span aria-hidden="true">✦</span>{c.eyebrow}</p><h1 className="display-font mt-6 max-w-3xl text-5xl leading-[.98] tracking-tight text-brand-ink sm:text-6xl">{c.title}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-subtle">{c.body}</p></div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><div className="grid items-stretch gap-7 sm:grid-cols-2 xl:grid-cols-4"><InsightCard dark title={c.liveTitle} body={c.liveBody} cta={c.explore} href={localePath(locale, 'insights/communication')} live={c.live} /><InsightCard title={c.conflictTitle} body={c.conflictBody} cta={c.conflictExplore} href={localePath(locale, 'insights/conflict')} live={c.live} /><InsightCard title={c.leadershipTitle} body={c.leadershipBody} cta={c.leadershipExplore} href={localePath(locale, 'insights/leadership')} live={c.live} /><InsightCard title={c.learningTitle} body={c.learningBody} cta={c.learningExplore} href={localePath(locale, 'insights/learning')} live={c.live} /></div></section>
    <section className="dimension-section"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"><p className="section-kicker">{c.comingSoon}</p><h2 className="display-font mt-3 max-w-3xl text-4xl text-brand-ink">{c.plannedTitle}</h2><p className="mt-4 max-w-2xl leading-relaxed text-brand-subtle">{c.plannedBody}</p><div className="mt-8 grid gap-4 md:grid-cols-3">{c.planned.map(([title, body], index) => <article key={title} className={`dimension-card p-6 ${index === 1 ? 'dimension-saffron' : index === 2 ? 'dimension-plum' : 'dimension-teal'}`}><span aria-hidden="true" className="dimension-orb" /><p className="relative text-xs font-bold uppercase tracking-[.18em] text-brand-teal">{c.comingSoon}</p><h3 className="display-font relative mt-4 text-3xl text-brand-ink">{title}</h3><p className="relative mt-3 leading-relaxed text-brand-subtle">{body}</p></article>)}</div></div></section>
  </main></>;
}

function InsightCard({ dark = false, title, body, cta, href, live }) {
  return <article className={`flex min-w-0 flex-col rounded-[2rem] p-7 sm:p-8 ${dark ? 'bg-brand-ink text-white shadow-[0_24px_70px_rgba(45,40,37,.16)]' : 'border border-brand-line bg-white'}`}><p className={`section-kicker ${dark ? 'text-brand-sand' : ''}`}>{live}</p><h2 className={`display-font mt-3 break-words text-3xl leading-tight ${dark ? 'text-white' : 'text-brand-ink'}`}>{title}</h2><p className={`mt-4 grow break-words leading-relaxed ${dark ? 'text-white/80' : 'text-brand-subtle'}`}>{body}</p><Link href={href} className={`${dark ? 'button-light' : 'button-secondary'} mt-7 inline-flex w-full justify-center text-center`}>{cta}<span aria-hidden="true">→</span></Link></article>;
}
