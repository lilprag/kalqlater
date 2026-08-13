import { defaultLocale, localeConfig, localeDirection } from './locales.js';
import { isPreviewEntityLocale, isPublishedEntityLocale, publishedLanguageLocales } from './locale-availability.js';

export const locales = publishedLanguageLocales();
export { defaultLocale, localeConfig, localeDirection };

export function isLocale(value) {
  const locale = String(value || '').toLowerCase();
  return isPublishedEntityLocale(`language:${locale}`, locale);
}

export function isHomepagePreviewLocale(value) {
  const locale = String(value || '').toLowerCase();
  return isPreviewEntityLocale(`language:${locale}`, locale);
}

export function isPersonalityPreviewLocale(value, type) {
  const locale = String(value || '').toLowerCase();
  return isPreviewEntityLocale(`personality-guide:${String(type || '').toLowerCase()}`, locale);
}

export function isCareerPreviewLocale(value, type) {
  const locale = String(value || '').toLowerCase();
  return isPreviewEntityLocale(`career-guide:${String(type || '').toLowerCase()}`, locale);
}

const comparisonOrder = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
export function isComparisonPreviewLocale(value, pair) {
  const locale = String(value || '').toLowerCase();
  const match = /^([a-z]{4})-vs-([a-z]{4})$/i.exec(String(pair));
  return Boolean(match)
    && comparisonOrder.indexOf(match[1].toLowerCase()) >= 0
    && comparisonOrder.indexOf(match[1].toLowerCase()) < comparisonOrder.indexOf(match[2].toLowerCase())
    && isPreviewEntityLocale(`compare:${String(pair).toLowerCase()}`, locale);
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
