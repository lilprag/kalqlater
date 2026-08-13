import { defaultLocale, isPublishedLocale, localeConfig, localeDirection, publishedLocales } from './locales.js';

export const locales = publishedLocales;
export { defaultLocale, localeConfig, localeDirection };

export function isLocale(value) { return isPublishedLocale(value); }
export function isHomepagePreviewLocale(value) { return value === 'es'; }
export function isPersonalityPreviewLocale(value, type) { return value === 'es' && ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'].includes(String(type).toLowerCase()); }
const comparisonOrder = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
// All 120 canonical Spanish comparison records are authored. Restrict preview
// routing to the canonical form so reverse and malformed URLs still fail closed.
export function isComparisonPreviewLocale(value, pair) {
  if (value !== 'es') return false;
  const match = /^([a-z]{4})-vs-([a-z]{4})$/i.exec(String(pair));
  return Boolean(match) && comparisonOrder.indexOf(match[1].toLowerCase()) >= 0 && comparisonOrder.indexOf(match[1].toLowerCase()) < comparisonOrder.indexOf(match[2].toLowerCase());
}

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
