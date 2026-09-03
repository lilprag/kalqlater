import Link from 'next/link';
import { COPY } from '../data/copy';
import { localePath } from '../lib/site';
import { BrandMark } from './BrandMark';
import { filterPublicNavigation, publishedLanguageLocales } from '../lib/locale-availability';
import { localeConfig } from '../lib/locales';

export function Footer({ locale }) {
  const copy = COPY[locale];
  const communication = copy.links.communicationInsights || (locale === 'hi' ? 'कम्युनिकेशन इनसाइट्स' : 'Communication Insights');
  const alternateLocales = publishedLanguageLocales().filter((candidate) => candidate !== locale);
  const links = filterPublicNavigation(locale, [
    ...(locale === 'en' ? [{ label: 'Personality Guides', href: localePath('en', 'guides') }] : []),
    { label: copy.nav.insights, href: localePath(locale, 'insights'), entityId: `language:${locale}` },
    { label: communication, href: localePath(locale, 'insights/communication'), entityId: 'insight:communication' },
    { label: copy.nav.compare, href: localePath(locale, 'compare'), entityId: `language:${locale}` },
    { label: copy.nav.community, href: localePath(locale, 'community'), entityId: 'community:directory' },
    { label: copy.nav.jobs, href: localePath(locale, 'jobs'), entityId: 'jobs:directory' },
    { label: copy.links.privacy, href: localePath(locale, 'privacy'), entityId: `language:${locale}` },
    { label: copy.links.terms, href: localePath(locale, 'terms'), entityId: `language:${locale}` },
    { label: copy.links.contact, href: localePath(locale, 'contact'), entityId: `language:${locale}` },
    { label: copy.nav.test, href: localePath(locale, 'test') },
  ]);
  return <footer className="border-t border-brand-line bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="display-font inline-flex items-center gap-2 text-xl font-bold"><BrandMark className="h-8 w-8" />KalQLater</p><p className="mt-3 max-w-md text-sm leading-relaxed text-brand-subtle">{copy.positioning}</p></div><nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-brand-subtle" aria-label={locale === 'es' ? 'Navegación del pie de página' : 'Footer navigation'}>{links.map((link) => <Link key={link.href} href={link.href} className="hover:text-brand-ink">{link.label}</Link>)}{alternateLocales.map((candidate) => <Link key={candidate} href={localePath(candidate)} lang={candidate} className="hover:text-brand-ink">{localeConfig(candidate)?.nativeName}</Link>)}</nav><p className="text-xs text-brand-subtle">© {new Date().getFullYear()} KalQLater. {copy.links.allRights}</p></div></footer>;
}
