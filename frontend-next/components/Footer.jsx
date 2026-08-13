import Link from 'next/link';
import { COPY } from '../data/copy';
import { localePath, productionAppUrl } from '../lib/site';
import { BrandMark } from './BrandMark';

export function Footer({ locale }) {
  const copy = COPY[locale];
  const communication = copy.links.communicationInsights || (locale === 'hi' ? 'कम्युनिकेशन इनसाइट्स' : 'Communication Insights');
  const alternateLocale = locale === 'en' ? 'hi' : 'en';
  const alternateLabel = locale === 'en' ? 'हिंदी' : (locale === 'es' ? 'Inglés' : 'English');
  return <footer className="border-t border-brand-line bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="display-font inline-flex items-center gap-2 text-xl font-bold"><BrandMark className="h-8 w-8" />KalQLater</p><p className="mt-3 max-w-md text-sm leading-relaxed text-brand-subtle">{copy.positioning}</p></div><nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-brand-subtle" aria-label={locale === 'es' ? 'Navegación del pie de página' : 'Footer navigation'}><Link href={localePath(locale, 'insights')} className="hover:text-brand-ink">{copy.nav.insights}</Link><Link href={localePath(locale, 'insights/communication')} className="hover:text-brand-ink">{communication}</Link><Link href={localePath(locale, 'compare')} className="hover:text-brand-ink">{copy.nav.compare}</Link><Link href={localePath(locale, 'community')} className="hover:text-brand-ink">{copy.nav.community}</Link><Link href={localePath(locale, 'jobs')} className="hover:text-brand-ink">{copy.nav.jobs}</Link><Link href={localePath(locale, 'privacy')} className="hover:text-brand-ink">{copy.links.privacy}</Link><Link href={localePath(locale, 'terms')} className="hover:text-brand-ink">{copy.links.terms}</Link><Link href={localePath(locale, 'contact')} className="hover:text-brand-ink">{copy.links.contact}</Link><a href={productionAppUrl('/test')} className="hover:text-brand-ink">{copy.nav.test}</a><Link href={localePath(alternateLocale)} lang={alternateLocale} className="hover:text-brand-ink">{alternateLabel}</Link></nav><p className="text-xs text-brand-subtle">© {new Date().getFullYear()} KalQLater. {copy.links.allRights}</p></div></footer>;
}
