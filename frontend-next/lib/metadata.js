import { localePath, siteUrl } from './site.js';
import { defaultLocale, localeConfig, publishedLocales } from './locales.js';
import { publicLocalesForEntity } from './locale-availability.js';
import { seoCopy } from './seo-content.js';

function absoluteLocaleUrl(locale, path) { return `${siteUrl()}${localePath(locale, path)}`; }

export function pageAlternates(path = '', availableLocales = publishedLocales, entityId) {
  const requestedLocales = entityId ? publicLocalesForEntity(entityId) : availableLocales;
  const locales = requestedLocales.filter((locale) => localeConfig(locale)?.published);
  if (!locales.includes(defaultLocale)) throw new Error(`Missing English equivalent for localized page: ${path || '/'}`);
  return {
    ...Object.fromEntries(locales.map((locale) => [localeConfig(locale).hreflang, absoluteLocaleUrl(locale, path)])),
    'x-default': absoluteLocaleUrl(defaultLocale, path),
  };
}

/** Single SEO contract for every localized, indexable page. */
export function buildLocalizedMetadata({ locale, path = '', title, description, availableLocales = publishedLocales, entityId, noIndex = false }) {
  const config = localeConfig(locale);
  if (!config?.published || !title || !description) throw new Error(`Missing localized metadata for ${locale}/${path}`);
  if (entityId && !publicLocalesForEntity(entityId).includes(locale)) {
    throw new Error(`Unpublished locale metadata is not allowed for ${entityId}/${locale}`);
  }
  const canonical = absoluteLocaleUrl(locale, path);
  const publicLocales = entityId ? publicLocalesForEntity(entityId) : availableLocales;
  const alternates = pageAlternates(path, publicLocales, entityId);
  const alternateLocale = publicLocales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => localeConfig(candidate)?.hreflang.replace('-', '_'))
    .filter(Boolean);
  return {
    title,
    description,
    alternates: { canonical, languages: alternates },
    openGraph: { type: 'website', siteName: 'KalQLater', title, description, url: canonical, locale: config.hreflang.replace('-', '_'), alternateLocale },
    twitter: { card: 'summary', title, description },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function pageMetadata({ locale, path = '', title, description, availableLocales, entityId, noIndex = false }) {
  if ((title === undefined) !== (description === undefined)) {
    throw new Error(`Localized metadata requires both title and description for ${locale}/${path}`);
  }
  const defaultCopy = title === undefined ? seoCopy(locale, 'home') : null;
  return buildLocalizedMetadata({ locale, path, title: title ?? defaultCopy.title, description: description ?? defaultCopy.description, availableLocales, entityId, noIndex });
}

export function breadcrumbJsonLd(locale, items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      item: `${siteUrl()}${localePath(locale, item.path || '')}`,
    })),
  };
}
