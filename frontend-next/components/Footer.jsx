import Link from 'next/link';
import { COPY } from '../data/copy';
import { localePath, productionAppUrl } from '../lib/site';

export function Footer({ locale }) {
  const copy = COPY[locale];
  return <footer className="border-t border-brand-line bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="display-font text-xl font-bold">KalQLater</p><p className="mt-2 max-w-md text-sm text-brand-subtle">{copy.positioning}</p></div><nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-brand-subtle" aria-label="Footer navigation"><Link href={localePath(locale, 'privacy')} className="hover:text-brand-ink">{copy.links.privacy}</Link><Link href={localePath(locale, 'terms')} className="hover:text-brand-ink">{copy.links.terms}</Link><Link href={localePath(locale, 'contact')} className="hover:text-brand-ink">{copy.links.contact}</Link><a href={productionAppUrl('/test')} className="hover:text-brand-ink">{copy.nav.test}</a><a href={productionAppUrl('/community')} className="hover:text-brand-ink">{copy.nav.community}</a><a href={productionAppUrl('/community/jobs')} className="hover:text-brand-ink">{copy.nav.jobs}</a><Link href={localePath(locale === 'en' ? 'hi' : 'en')} lang={locale === 'en' ? 'hi' : 'en'} className="hover:text-brand-ink">{locale === 'en' ? 'हिंदी' : 'English'}</Link></nav><p className="text-xs text-brand-subtle">© {new Date().getFullYear()} KalQLater. {copy.links.allRights}</p></div></footer>;
}
