import { defaultLocale, isPublishedLocale, localeConfig, localeDirection, publishedLocales } from './locales.js';

export const locales = publishedLocales;
export { defaultLocale, localeConfig, localeDirection };

export function isLocale(value) { return isPublishedLocale(value); }
export function isHomepagePreviewLocale(value) { return value === 'es'; }

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://kalqlater.com').replace(/\/$/, '');
}

export function localePath(locale, path = '') {
  const suffix = path ? `/${path.replace(/^\//, '')}` : '';
  return `/${locale}${suffix}`;
}

export function productionAppUrl(path = '') {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
