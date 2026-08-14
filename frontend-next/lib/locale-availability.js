import { canonicalEntityId, contentEntityRegistry, resolveEntityAvailability } from './content-entities.js';
import { localeConfig } from './locales.js';
import { localeAllowsPreviewPage, localeRuntime } from '../localization/runtime-policy.js';

/**
 * PR-002 is the single route and SEO policy consumer for the PR-001 entity
 * registry. It deliberately contains no route rendering, API, or UI logic.
 */
function safeResolve(entityId, locale, registry = contentEntityRegistry) {
  try {
    return resolveEntityAvailability(registry, entityId, locale);
  } catch {
    return null;
  }
}

function normalizedLocale(locale) {
  return String(locale || '').trim().toLowerCase();
}

function normalizedPath(pathname, locale) {
  const prefix = `/${normalizedLocale(locale)}`;
  const path = String(pathname || '').trim().replace(/\/+$/, '') || prefix;
  if (path === prefix) return [];
  if (!path.startsWith(`${prefix}/`)) return null;
  return path.slice(prefix.length + 1).split('/').filter(Boolean).map((segment) => segment.toLowerCase());
}

function previewPageId(parts) {
  if (!parts?.length) return 'homepage';
  if (parts.length === 1 && ['community', 'jobs'].includes(parts[0])) return parts[0];
  if (parts.length === 1 && ['contact', 'privacy', 'terms'].includes(parts[0])) return `static:${parts[0]}`;
  if (parts.length === 3 && parts[0] === 'personality' && parts[2] === 'careers') return `career:${parts[1]}`;
  if (parts.length === 2 && parts[0] === 'personality') return `personality:${parts[1]}`;
  if (parts.length === 2 && parts[0] === 'compare') return `compare:${parts[1]}`;
  if (parts.length === 2 && parts[0] === 'insights') return `insight:${parts[1]}`;
  return null;
}

/** Resolve a localized pathname to its governing content entity. */
export function entityIdForLocaleRoute(locale, pathname) {
  const activeLocale = normalizedLocale(locale);
  if (!localeConfig(activeLocale)) return null;
  const parts = normalizedPath(pathname, activeLocale);
  if (parts === null) return null;
  if (parts.length === 0) return canonicalEntityId('language', activeLocale);

  if (parts[0] === 'personality' && /^[a-z]{4}$/.test(parts[1] || '')) {
    return canonicalEntityId(parts[2] === 'careers' && parts.length === 3 ? 'career-guide' : 'personality-guide', parts[1]);
  }
  if (parts[0] === 'compare' && /^[a-z]{4}-vs-[a-z]{4}$/.test(parts[1] || '') && parts.length === 2) {
    return canonicalEntityId('compare', parts[1]);
  }
  if (parts[0] === 'insights' && ['communication', 'conflict', 'leadership', 'learning'].includes(parts[1])) {
    return canonicalEntityId('insight', parts[1]);
  }
  if (parts[0] === 'community' && parts.length === 1) return canonicalEntityId('community', 'directory');
  if (parts[0] === 'jobs' && parts.length === 1) return canonicalEntityId('jobs', 'directory');
  return canonicalEntityId('language', activeLocale);
}

/**
 * Resolves the locale state for an explicit localized route. Unknown entities
 * fail closed instead of inheriting a language-level availability state.
 */
export function resolveLocaleRoute(locale, pathname, registry = contentEntityRegistry) {
  const activeLocale = normalizedLocale(locale);
  const entityId = entityIdForLocaleRoute(activeLocale, pathname);
  const resolution = entityId && safeResolve(entityId, activeLocale, registry);
  const routeParts = normalizedPath(pathname, activeLocale);
  const isLanguageRoot = routeParts?.length === 0;
  const isEntityPreviewRoute = entityId && !entityId.startsWith('language:');
  const runtime = localeRuntime(activeLocale);
  const previewPage = previewPageId(routeParts);
  const isAllowedPreviewPage = !runtime?.previewPageIds || localeAllowsPreviewPage(activeLocale, previewPage);
  const isPackagePreviewRoute = runtime?.packageSource === 'json-package' && Boolean(previewPage);
  const isPreview = resolution?.availability === 'preview' && (isLanguageRoot || isEntityPreviewRoute || isPackagePreviewRoute) && isAllowedPreviewPage;
  return Object.freeze({
    locale: activeLocale,
    entityId,
    availability: resolution?.availability || 'unavailable',
    isRoutable: Boolean(resolution?.isPublic || isPreview),
    isPublic: Boolean(resolution?.isPublic),
    isPreview,
  });
}

export function resolveEntityLocale(entityId, locale, registry = contentEntityRegistry) {
  const resolution = safeResolve(entityId, normalizedLocale(locale), registry);
  return Object.freeze({
    entityId,
    locale: normalizedLocale(locale),
    availability: resolution?.availability || 'unavailable',
    isRoutable: Boolean(resolution?.isRenderable),
    isPublic: Boolean(resolution?.isPublic),
    isPreview: resolution?.availability === 'preview',
  });
}

export function isPublishedEntityLocale(entityId, locale, registry = contentEntityRegistry) {
  return resolveEntityLocale(entityId, locale, registry).isPublic;
}

export function isPreviewEntityLocale(entityId, locale, registry = contentEntityRegistry) {
  return resolveEntityLocale(entityId, locale, registry).isPreview;
}

/** Public-only values are safe for navigation, sitemap, and hreflang output. */
export function publicLocalesForEntity(entityId, registry = contentEntityRegistry) {
  const entity = safeResolve(entityId, 'en', registry)?.entity || registry.byId[entityId];
  return Object.freeze(entity?.publishedLocales ? [...entity.publishedLocales] : []);
}

export function publishedLanguageLocales() {
  return Object.freeze(contentEntityRegistry.records
    .filter((entity) => entity.type === 'language')
    .filter((entity) => entity.publishedLocales.includes(entity.key))
    .map((entity) => entity.key)
    .sort());
}

/** Navigation never exposes preview, planned, unavailable, or deprecated routes. */
export function isNavigationVisible(locale, entityId) {
  return isPublishedEntityLocale(entityId, locale);
}

export function filterPublicNavigation(locale, items) {
  if (!isPublishedEntityLocale(`language:${normalizedLocale(locale)}`, normalizedLocale(locale))) return [];
  return items.filter((item) => !item.entityId || isNavigationVisible(locale, item.entityId));
}
