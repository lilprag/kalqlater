import Link from 'next/link';
import { notFound } from 'next/navigation';

import { loadLocaleChrome } from '../localization/runtime.js';
import { localePath } from '../lib/site';
import { isRuntimePublishedLocale, localeAllowsPreviewPage } from '../localization/runtime-policy.js';
import { LocaleSwitcher } from './LocaleSwitcher';
import { AuthDesktopActions, AuthStatusProvider } from './AuthStatus';

// The product application has no localized Next.js assessment or type-index
// route. Do not advertise package-local paths that fail closed at runtime.
const NAVIGATION_KEYS = Object.freeze(['home', 'takeTest', 'types', 'insights', 'compare', 'community', 'jobs', 'contact']);
const FOOTER_KEYS = Object.freeze(['insights', 'communication', 'compare', 'community', 'jobs', 'privacy', 'terms', 'contact', 'takeTest']);
const PAGE_FOR_LINK = Object.freeze({ home: 'homepage', community: 'community', jobs: 'jobs', contact: 'static:contact', privacy: 'static:privacy', terms: 'static:terms' });
const AUTH_COPY = Object.freeze({ fr: { login: 'Se connecter', signup: 'Créer un compte', checking: 'Vérification du compte…', profile: 'Mon profil', logout: 'Se déconnecter' }, ja: { login: 'ログイン', signup: 'アカウント作成', checking: 'アカウントを確認中…', profile: 'プロフィール', logout: 'ログアウト' } });

function destination(locale, key) {
  const paths = { home: '', takeTest: 'test', types: 'types', insights: 'insights', compare: 'compare', community: 'community', jobs: 'jobs', contact: 'contact', communication: 'insights/communication', privacy: 'privacy', terms: 'terms' };
  return localePath(locale, paths[key]);
}

/** Chrome for complete JSON locale packages in preview or public publication. */
export async function GenericLocaleChrome({ locale, children }) {
  const chrome = await loadLocaleChrome(locale);
  if (!chrome) notFound();
  const published = isRuntimePublishedLocale(locale);
  const visible = (key, values) => values.filter((item) => chrome[key][item] && (published || (PAGE_FOR_LINK[item] && localeAllowsPreviewPage(locale, PAGE_FOR_LINK[item]))));
  return <AuthStatusProvider locale={locale}><header className="sticky top-0 z-40 border-b border-brand-line bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6"><Link href={localePath(locale)} className="display-font text-xl font-bold text-brand-ink">KalQLater</Link><nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-subtle" aria-label="KalQLater">{visible('navigation', NAVIGATION_KEYS).map((key) => <Link key={key} href={destination(locale, key)}>{chrome.navigation[key]}</Link>)}</nav>{published ? <><LocaleSwitcher locale={locale} /><AuthDesktopActions copy={AUTH_COPY[locale]} /></> : null}</div></header><main id="main-content" className="min-h-[60vh]">{children}</main><footer className="border-t border-brand-line bg-white"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><p className="max-w-xl text-sm leading-relaxed text-brand-subtle">{chrome.footer.description}</p><nav className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-brand-subtle" aria-label="KalQLater">{visible('footer', FOOTER_KEYS).map((key) => <Link key={key} href={destination(locale, key)}>{chrome.footer[key]}</Link>)}</nav></div></footer></AuthStatusProvider>;
}
