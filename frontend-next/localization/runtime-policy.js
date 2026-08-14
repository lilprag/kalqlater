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
const FRENCH_COMPARE_GUIDES = Object.freeze([
  'intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp',
].flatMap((first, index, types) => types.slice(index + 1).map((second) => `compare:${first}-vs-${second}`)));
const FRENCH_INSIGHTS = Object.freeze(['communication', 'conflict', 'leadership', 'learning'].map((insight) => `insight:${insight}`));
const FRENCH_PREVIEW_PAGES = Object.freeze([...FRENCH_PHASE_ONE_PAGES, ...FRENCH_PERSONALITY_GUIDES, ...FRENCH_CAREER_GUIDES, ...FRENCH_COMPARE_GUIDES, ...FRENCH_INSIGHTS]);
const JAPANESE_PREVIEW_PAGES = Object.freeze([
  'homepage', 'navigation', 'footer', 'shared-ui', 'metadata', 'json-ld',
  'community', 'jobs', 'static:contact', 'static:privacy', 'static:terms',
  'personality:intj', 'personality:intp', 'personality:entj', 'personality:entp',
  'personality:infj', 'personality:infp', 'personality:enfj', 'personality:enfp',
  'personality:istj', 'personality:isfj', 'personality:estj', 'personality:esfj',
  'personality:istp', 'personality:isfp', 'personality:estp', 'personality:esfp',
  'career:intj', 'career:intp', 'career:entj', 'career:entp',
  'career:infj', 'career:infp', 'career:enfj', 'career:enfp',
  'career:istj', 'career:isfj', 'career:estj', 'career:esfj',
  'career:istp', 'career:isfp', 'career:estp', 'career:esfp',
  'insight:communication', 'insight:conflict', 'insight:leadership', 'insight:learning',
  'compare:intj-vs-intp', 'compare:intj-vs-entj', 'compare:intj-vs-entp',
  'compare:intj-vs-infj', 'compare:intj-vs-infp', 'compare:intj-vs-enfj',
  'compare:intj-vs-enfp', 'compare:intj-vs-istj', 'compare:intj-vs-isfj',
  'compare:intj-vs-estj', 'compare:intj-vs-esfj', 'compare:intj-vs-istp',
  'compare:intj-vs-isfp', 'compare:intj-vs-estp', 'compare:intj-vs-esfp',
  ...Object.freeze([
    ['intp', ['entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['entj', ['entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['entp', ['infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['infj', ['infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['infp', ['enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['enfj', ['enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['enfp', ['istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
  ].flatMap(([first, seconds]) => seconds.map((second) => `compare:${first}-vs-${second}`))),
  ...Object.freeze([
    ['istj', ['isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['isfj', ['estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['estj', ['esfj', 'istp', 'isfp', 'estp', 'esfp']],
    ['esfj', ['istp', 'isfp', 'estp', 'esfp']],
    ['istp', ['isfp', 'estp', 'esfp']],
    ['isfp', ['estp', 'esfp']],
    ['estp', ['esfp']],
  ].flatMap(([first, seconds]) => seconds.map((second) => `compare:${first}-vs-${second}`))),
]);

/**
 * This is configuration, not a list of locale-specific code paths. Adding a
 * reviewed locale changes its lifecycle here; the loader and routes remain
 * exactly the same for every configured locale.
 */
export const localeRuntimeRegistry = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code,
  state: locale.published ? 'published' : ['es', 'fr', 'ja'].includes(locale.code) ? 'preview' : 'draft',
  packageSource: locale.published ? 'application' : locale.code === 'es' ? 'legacy-preview' : 'json-package',
  previewPageIds: locale.code === 'fr' ? FRENCH_PREVIEW_PAGES : locale.code === 'ja' ? JAPANESE_PREVIEW_PAGES : null,
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
