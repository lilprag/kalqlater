import { localeRegistry } from '../lib/locales.js';

export const LOCALE_RUNTIME_STATES = Object.freeze(['draft', 'validated', 'preview', 'published', 'deprecated']);

const TRANSITIONS = Object.freeze({
  draft: Object.freeze(['validated', 'deprecated']),
  validated: Object.freeze(['draft', 'preview', 'deprecated']),
  preview: Object.freeze(['validated', 'published', 'deprecated']),
  published: Object.freeze(['preview', 'deprecated']),
  deprecated: Object.freeze([]),
});

// Preview is deliberately page-scoped. A locale can be reviewed without
// making unfinished page families routable or eligible for public discovery.
const FRENCH_PHASE_ONE_PAGES = Object.freeze([
  'homepage', 'navigation', 'footer', 'shared-ui', 'metadata', 'json-ld',
  'community', 'jobs', 'static:contact', 'static:privacy', 'static:terms',
]);
const FRENCH_PERSONALITY_GUIDES = Object.freeze([
  'intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp',
].map((type) => `personality:${type}`));
const FRENCH_CAREER_GUIDES = Object.freeze([
  'intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp',
].map((type) => `career:${type}`));
const FRENCH_PREVIEW_PAGES = Object.freeze([...FRENCH_PHASE_ONE_PAGES, ...FRENCH_PERSONALITY_GUIDES, ...FRENCH_CAREER_GUIDES]);

/**
 * This is configuration, not a list of locale-specific code paths. Adding a
 * reviewed locale changes its lifecycle here; the loader and routes remain
 * exactly the same for every configured locale.
 */
export const localeRuntimeRegistry = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code,
  state: locale.published ? 'published' : ['es', 'fr'].includes(locale.code) ? 'preview' : 'draft',
  packageSource: locale.published ? 'application' : locale.code === 'es' ? 'legacy-preview' : 'json-package',
  previewPageIds: locale.code === 'fr' ? FRENCH_PREVIEW_PAGES : null,
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

export function localeAllowsPreviewPage(locale, pageId) {
  const runtime = localeRuntime(locale);
  return runtime?.state === 'preview' && (!runtime.previewPageIds || runtime.previewPageIds.includes(pageId));
}
