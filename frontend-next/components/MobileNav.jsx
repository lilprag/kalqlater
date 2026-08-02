'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LocaleSwitcher } from './LocaleSwitcher';

export function MobileNav({ locale, links, login, signup, copy }) {
  const [open, setOpen] = useState(false);
  return <div className="md:hidden"><button type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold">{open ? copy.close : copy.menu}</button>{open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-4 top-20 z-50 rounded-3xl border border-brand-line bg-white p-4 shadow-xl"><div className="grid gap-1">{links.map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-medium hover:bg-brand-cream">{link.label}</Link>)}</div><div className="mt-3 flex items-center gap-3 border-t border-brand-line pt-3"><LocaleSwitcher locale={locale} /><a href={login} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold">{copy.login}</a><a href={signup} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white">{copy.signup}</a></div></nav>}</div>;
}
