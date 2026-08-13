import { defaultLocale, isPublishedLocale, localeConfig, localeDirection, publishedLocales } from './locales.js';

export const locales = publishedLocales;
export { defaultLocale, localeConfig, localeDirection };

export function isLocale(value) { return isPublishedLocale(value); }
export function isHomepagePreviewLocale(value) { return value === 'es'; }
export function isPersonalityPreviewLocale(value, type) { return value === 'es' && ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'].includes(String(type).toLowerCase()); }
const spanishComparisonPreviewPairs = new Set(['intj-vs-intp','intj-vs-entj','intj-vs-entp','intj-vs-infj','intj-vs-infp','intj-vs-enfj','intj-vs-enfp','intj-vs-istj','intj-vs-isfj','intj-vs-estj','intj-vs-esfj','intj-vs-istp','intj-vs-isfp','intj-vs-estp','intj-vs-esfp','infj-vs-enfp','intp-vs-entj','intp-vs-entp','intp-vs-infj','intp-vs-infp','intp-vs-enfj','intp-vs-enfp','intp-vs-istj','intp-vs-isfj','intp-vs-estj','intp-vs-esfj','intp-vs-istp','intp-vs-isfp','intp-vs-estp','intp-vs-esfp','entj-vs-entp','entj-vs-infj','entj-vs-infp','entj-vs-enfj','entj-vs-enfp','entj-vs-istj','entj-vs-isfj','entj-vs-estj','entj-vs-esfj','entj-vs-istp','entj-vs-isfp','entj-vs-estp','entj-vs-esfp','entp-vs-infj','entp-vs-infp','entp-vs-enfj','entp-vs-enfp','entp-vs-istj','entp-vs-isfj','entp-vs-estj','entp-vs-esfj','entp-vs-istp','entp-vs-isfp','entp-vs-estp','entp-vs-esfp','infj-vs-infp','infj-vs-enfj','infj-vs-istj','infj-vs-isfj','infj-vs-estj','infj-vs-esfj','infj-vs-istp','infj-vs-isfp','infj-vs-estp','infj-vs-esfp','infp-vs-enfj','infp-vs-enfp','infp-vs-istj','infp-vs-isfj','infp-vs-estj','infp-vs-esfj','infp-vs-istp']);
export function isComparisonPreviewLocale(value, pair) { return value === 'es' && spanishComparisonPreviewPairs.has(String(pair).toLowerCase()); }

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
