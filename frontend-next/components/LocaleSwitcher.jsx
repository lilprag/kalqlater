'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publishedLanguageLocales } from '../lib/locale-availability';

export function LocaleSwitcher({ locale, availableLocales = publishedLanguageLocales() }) {
  const pathname = usePathname();
  if (!publishedLanguageLocales().includes(locale)) return null;
  if (availableLocales.length < 2) return null;
  const targetLocale = availableLocales.find((candidate) => candidate !== locale) || locale;
  const target = pathname.replace(/^\/[a-z-]+(?=\/|$)/, `/${targetLocale}`);
  const title = targetLocale === 'hi' ? 'Switch to Hindi' : 'Switch to English';
  return <Link href={target || `/${targetLocale}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-teal hover:bg-brand-cream" aria-label={title}><span className={locale === 'hi' ? 'font-bold text-brand-teal' : 'text-brand-subtle'}>हिं</span><span className="text-brand-line">|</span><span className={locale === 'en' ? 'font-bold text-brand-teal' : 'text-brand-subtle'}>EN</span></Link>;
}
