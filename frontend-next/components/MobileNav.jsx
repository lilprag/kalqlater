'use client';

import { useState } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { AuthMobileActions, useAuthStatus } from './AuthStatus';
import { NavigationLink } from './NavigationLink';
import { productionAppUrl } from '../lib/site';

export function MobileNav({ locale, links, copy }) {
  const [open, setOpen] = useState(false);
  const { status } = useAuthStatus();
  const closeMenu = () => setOpen(false);
  const menuLinks = status === 'authenticated' ? [...links, { label: copy.connections, href: productionAppUrl('/community/connections') }] : links;
  return <div className="xl:hidden"><button type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors hover:bg-brand-cream"><span className="sr-only">{open ? copy.close : copy.menu}</span>{open ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}</button>{open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-3 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-b-3xl border border-t-0 border-brand-line bg-white p-3 shadow-[0_20px_50px_rgba(45,40,37,.16)]"><div className="grid gap-1">{menuLinks.map((link) => <NavigationLink key={link.href} {...link} onClick={closeMenu} className="block rounded-2xl px-4 py-3 text-sm transition-colors" />)}</div><div className="mt-3 border-t border-brand-line pt-2"><AuthMobileActions copy={copy} closeMenu={closeMenu} /></div><div className="mt-3 border-t border-brand-line px-1 pt-3"><LocaleSwitcher locale={locale} /></div></nav>}</div>;
}
