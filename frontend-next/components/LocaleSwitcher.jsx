'use client';

import { usePathname, useRouter } from 'next/navigation';
import { publishedLanguageLocales } from '../lib/locale-availability';
import { localeConfig } from '../lib/locales';

function equivalentPath(pathname, locale) {
  const suffix = String(pathname || '').replace(/^\/[a-z-]+(?=\/|$)/, '') || '';
  const hasEquivalent = /^$|^\/(?:personality\/[a-z]{4}(?:\/careers)?|compare(?:\/[a-z]{4}-vs-[a-z]{4})?|insights(?:\/(?:communication|conflict|leadership|learning))?|community|jobs|contact|privacy|terms)$/.test(suffix);
  return hasEquivalent ? `/${locale}${suffix}` : `/${locale}`;
}

export function LocaleSwitcher({ locale, availableLocales = publishedLanguageLocales() }) {
  const pathname = usePathname();
  const router = useRouter();
  if (!publishedLanguageLocales().includes(locale)) return null;
  if (availableLocales.length < 2) return null;
  const order = ['en', 'hi', 'fr', 'ja'];
  const visibleLocales = order.filter((candidate) => availableLocales.includes(candidate));
  const languageLabel = locale === 'fr' ? 'Langue' : 'Language';
  return <label className="inline-flex h-10 items-center rounded-full border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-teal hover:bg-brand-cream"><span className="sr-only">{languageLabel}</span><select aria-label={languageLabel} className="max-w-28 bg-transparent outline-none" value={locale} onChange={(event) => router.push(equivalentPath(pathname, event.target.value))}>{visibleLocales.map((candidate) => <option key={candidate} value={candidate}>{localeConfig(candidate)?.nativeName || candidate}</option>)}</select></label>;
}
