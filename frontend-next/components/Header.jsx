import Link from 'next/link';
import { COPY } from '../data/copy';
import { localePath, productionAppUrl } from '../lib/site';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileNav } from './MobileNav';
import { BrandMark } from './BrandMark';
import { AuthConnectionsLink, AuthDesktopActions, AuthStatusProvider } from './AuthStatus';
import { NavigationLink } from './NavigationLink';
import { filterPublicNavigation } from '../lib/locale-availability';

export function Header({ locale }) {
  const copy = COPY[locale].nav;
  const links = filterPublicNavigation(locale, [
    { label: copy.home, href: localePath(locale), entityId: `language:${locale}` },
    { label: copy.test, href: productionAppUrl('/test') },
    { label: copy.types, href: productionAppUrl('/types') },
    { label: copy.insights, href: localePath(locale, 'insights'), entityId: `language:${locale}` },
    { label: copy.about, href: productionAppUrl('/about') },
    { label: copy.compare, href: localePath(locale, 'compare'), entityId: `language:${locale}` },
    { label: copy.community, href: localePath(locale, 'community'), entityId: 'community:directory' },
    { label: copy.jobs, href: localePath(locale, 'jobs'), entityId: 'jobs:directory' },
    { label: copy.contact, href: localePath(locale, 'contact'), entityId: `language:${locale}` },
  ]);
  return <AuthStatusProvider locale={locale}><header className="sticky top-0 z-40 h-16 border-b border-brand-line bg-white/80 backdrop-blur-xl"><div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"><Link href={localePath(locale)} className="display-font inline-flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-brand-ink transition-colors hover:text-brand-teal" aria-label={locale === 'es' ? 'Inicio de KalQLater' : 'KalQLater home'}><BrandMark className="h-9 w-9" />KalQLater</Link><nav className="hidden min-w-0 items-center gap-0.5 xl:flex" aria-label={locale === 'es' ? 'Navegación principal' : 'Primary navigation'}>{links.map((link) => <NavigationLink key={link.href} {...link} className="whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors" />)}<AuthConnectionsLink copy={copy} /></nav><div className="hidden shrink-0 items-center gap-2 xl:flex"><LocaleSwitcher locale={locale} /><AuthDesktopActions copy={copy} /></div><MobileNav locale={locale} links={links} copy={copy} /></div></header></AuthStatusProvider>;
}
