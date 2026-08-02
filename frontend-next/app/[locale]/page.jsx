import Link from 'next/link';
import { COPY } from '../../data/copy';
import { pageMetadata } from '../../lib/metadata';
import { isLocale, localePath, productionAppUrl, siteUrl } from '../../lib/site';
import { JsonLd } from '../../components/JsonLd';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale: isLocale(locale) ? locale : 'en' });
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : 'en';
  const copy = COPY[activeLocale];
  const websiteSchema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', name: 'KalQLater', url: siteUrl(), inLanguage: ['en-IN', 'hi-IN'] },
      { '@type': 'Organization', name: 'KalQLater', url: siteUrl() },
    ],
  };
  return <><JsonLd data={websiteSchema} /><section className="relative overflow-hidden border-b border-brand-line bg-brand-bg"><div className="absolute -right-28 top-0 h-72 w-72 rounded-full bg-brand-sand/30 blur-3xl" /><div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" /><div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">{copy.hero.eyebrow}</p><h1 className="display-font mt-5 max-w-4xl text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{copy.hero.title}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-subtle">{copy.hero.body}</p><div className="mt-9 flex flex-wrap gap-3"><a href={productionAppUrl('/test')} className="rounded-full bg-brand-teal px-6 py-3.5 font-semibold text-white shadow-[0_8px_30px_rgb(31,108,125,0.25)] hover:bg-[#164E59]">{copy.hero.cta}</a><a href={productionAppUrl('/types')} className="rounded-full border border-brand-line bg-white px-6 py-3.5 font-semibold hover:border-brand-teal">{copy.hero.secondary}</a></div></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="display-font text-3xl sm:text-4xl">{copy.positioningTitle}</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{copy.benefits.map(([title, body]) => <article key={title} className="surface-shadow rounded-[2rem] border border-brand-line bg-white p-7"><h3 className="display-font text-2xl">{title}</h3><p className="mt-4 leading-relaxed text-brand-subtle">{body}</p></article>)}</div></section><section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div className="rounded-[2rem] bg-brand-ink px-7 py-10 text-white sm:px-10"><h2 className="display-font text-3xl">{copy.positioningTitle}</h2><p className="mt-4 max-w-3xl leading-relaxed text-white/75">{copy.positioning}</p><div className="mt-7 flex flex-wrap gap-4"><a href={productionAppUrl('/community')} className="rounded-full bg-white px-5 py-3 font-semibold text-brand-ink">{copy.nav.community}</a><a href={productionAppUrl('/community/jobs')} className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white">{copy.nav.jobs}</a><Link href={localePath(activeLocale, 'contact')} className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white">{copy.nav.contact}</Link></div></div></section></>;
}
