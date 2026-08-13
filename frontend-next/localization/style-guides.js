import { localeRegistry } from '../lib/locales.js';

export const globalKgliStyle = Object.freeze({
  tone: ['professional', 'thoughtful', 'evidence-aware', 'friendly', 'reflective'],
  avoid: ['clinical claims', 'diagnostic language', 'deterministic predictions', 'literal translation', 'English residue'],
  reviewQuestion: 'Would a native reader believe this was originally authored for their market?',
});

export const styleGuideByLocale = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code, direction: locale.dir, nativeName: locale.nativeName,
  formality: 'professional and warm', sentenceGuidance: 'Prefer natural local reading rhythm over source-language order.',
  typography: locale.dir === 'rtl' ? 'Use RTL-safe punctuation, visual order, and neutral icon placement.' : 'Use local punctuation and typographic conventions.',
  genderNeutrality: 'Use the locale’s natural inclusive form without changing psychological meaning.',
  seo: 'Write for local search intent; never translate titles or descriptions word for word.',
  status: locale.published ? 'baseline-established' : 'requires-native-editorial-review',
})])));
