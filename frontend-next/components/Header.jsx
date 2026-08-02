import Link from 'next/link';
import { COPY } from '../data/copy';
import { localePath, productionAppUrl } from '../lib/site';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileNav } from './MobileNav';
import { BrandMark } from './BrandMark';

export function Header({ locale }) {
  const copy = COPY[locale].nav;
  const appLinks = [
    { label: copy.home, href: localePath(locale) },
    { label: copy.test, href: productionAppUrl('/test') },
    { label: copy.compare, href: productionAppUrl('/compare') },
    { label: copy.community, href: productionAppUrl('/community') },
    { label: copy.jobs, href: productionAppUrl('/community/jobs') },
    { label: copy.contact, href: localePath(locale, 'contact') },
  ];
  const login = productionAppUrl('/login');
  const signup = productionAppUrl('/signup');
  return <header className="sticky top-0 z-40 border-b border-brand-line/80 bg-brand-bg/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><Link href={localePath(locale)} className="display-font inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-brand-ink" aria-label="KalQLater home"><BrandMark className="hidden h-9 w-9 sm:inline-flex" />KalQLater</Link><nav className="hidden items-center gap-5 text-sm font-medium text-brand-subtle md:flex" aria-label="Primary navigation">{appLinks.map((link) => <Link key={link.label} href={link.href} className="rounded-full px-2 py-1 transition-colors hover:bg-brand-cream hover:text-brand-ink">{link.label}</Link>)}</nav><div className="hidden items-center gap-2 md:flex"><LocaleSwitcher locale={locale} /><a href={login} className="rounded-full px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-cream">{copy.login}</a><a href={signup} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,108,125,.18)] transition-all hover:-translate-y-0.5 hover:bg-[#164E59]">{copy.signup}</a></div><MobileNav locale={locale} links={appLinks} login={login} signup={signup} copy={copy} /></div></header>;
}
