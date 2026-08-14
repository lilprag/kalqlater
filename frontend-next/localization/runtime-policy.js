import { localeRegistry } from '../lib/locales.js';

export const LOCALE_RUNTIME_STATES = Object.freeze(['draft', 'validated', 'preview', 'published', 'deprecated']);

const TRANSITIONS = Object.freeze({
  draft: Object.freeze(['validated', 'deprecated']),
  validated: Object.freeze(['draft', 'preview', 'deprecated']),
  preview: Object.freeze(['validated', 'published', 'deprecated']),
  published: Object.freeze(['preview', 'deprecated']),
  deprecated: Object.freeze([]),
});

/**
 * This is configuration, not a list of locale-specific code paths. Adding a
 * reviewed locale changes its lifecycle here; the loader and routes remain
 * exactly the same for every configured locale.
 */
export const localeRuntimeRegistry = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code,
  state: locale.published ? 'published' : locale.code === 'es' ? 'preview' : 'draft',
  packageSource: locale.published ? 'application' : locale.code === 'es' ? 'legacy-preview' : 'json-package',
})])));

export function localeRuntime(locale) {
  return localeRuntimeRegistry[String(locale || '').trim().toLowerCase()] || null;
}

export function canTransitionLocaleRuntime(from, to) {
  return LOCALE_RUNTIME_STATES.includes(from) && LOCALE_RUNTIME_STATES.includes(to) && TRANSITIONS[from].includes(to);
}

export function isRuntimePreviewLocale(locale) {
  return localeRuntime(locale)?.state === 'preview';
}

export function isRuntimePublishedLocale(locale) {
  return localeRuntime(locale)?.state === 'published';
}
