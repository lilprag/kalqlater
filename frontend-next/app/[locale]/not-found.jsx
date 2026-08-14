import Link from 'next/link';
import { headers } from 'next/headers';

import { loadLocaleChrome, loadLocalePage } from '../../localization/runtime';

export const dynamic = 'force-dynamic';

/** Locale-segment fallback keeps preview payloads free of another locale's copy. */
export default async function LocaleNotFound() {
  const locale = (await headers()).get('x-kalqlater-locale') || 'en';
  const shared = await loadLocalePage(locale, 'shared-ui');
  const chrome = shared ? await loadLocaleChrome(locale) : null;
  const copy = shared && chrome ? {
    title: shared.fields.notFound,
    body: shared.fields.networkError,
    home: chrome.navigation.home,
    href: `/${locale}`,
  } : {
    title: 'Page not found',
    body: 'The page you requested is not available in this preview.',
    home: 'Return home',
    href: '/en',
  };
  return <main className="mx-auto max-w-2xl px-4 py-28 text-center"><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-teal">404</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-md text-brand-subtle">{copy.body}</p><Link href={copy.href} className="mt-8 inline-flex rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">{copy.home}</Link></main>;
}
