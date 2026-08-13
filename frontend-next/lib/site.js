import { defaultLocale, isPublishedLocale, localeConfig, localeDirection, publishedLocales } from './locales.js';

export const locales = publishedLocales;
export { defaultLocale, localeConfig, localeDirection };

export function isLocale(value) { return isPublishedLocale(value); }
export function isHomepagePreviewLocale(value) { return value === 'es'; }
export function isPersonalityPreviewLocale(value, type) { return value === 'es' && ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'].includes(String(type).toLowerCase()); }
export function isComparisonPreviewLocale(value, pair) { return value === 'es' && ['intj-vs-intp', 'intj-vs-entj', 'intj-vs-entp', 'intj-vs-infj', 'intj-vs-infp', 'intj-vs-enfj', 'intj-vs-enfp', 'intj-vs-istj', 'intj-vs-isfj', 'intj-vs-estj', 'intj-vs-esfj', 'intj-vs-istp', 'intj-vs-isfp', 'intj-vs-estp', 'intj-vs-esfp', 'infj-vs-enfp'].includes(String(pair).toLowerCase()); }

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
