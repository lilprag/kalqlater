import { localeRegistry } from '../lib/locales.js';

export const globalKgliStyle = Object.freeze({
  tone: ['professional', 'thoughtful', 'evidence-aware', 'friendly', 'reflective'],
  avoid: ['clinical claims', 'diagnostic language', 'deterministic predictions', 'literal translation', 'English residue'],
  reviewQuestion: 'Would a native reader believe this was originally authored for their market?',
});

const spanishStyleGuide = Object.freeze({
  formality: 'trato de tú, profesional y cercano',
  sentenceGuidance: 'Escribe con frases directas y naturales. Prioriza el ritmo del español internacional sobre el orden del inglés; evita calcos, gerundios innecesarios y anglicismos.',
  typography: 'Usa mayúsculas con moderación, comillas españolas solo cuando aporten claridad y una puntuación sencilla para lectura digital.',
  genderNeutrality: 'Prefiere formulaciones inclusivas y naturales sin duplicaciones que entorpezcan la lectura.',
  seo: 'Redacta títulos y descripciones según la intención de búsqueda en español; no traduzcas estructuras de SEO palabra por palabra.',
  status: 'native-edition-authoring-in-progress',
});

export const styleGuideByLocale = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code, direction: locale.dir, nativeName: locale.nativeName,
  formality: locale.code === 'es' ? spanishStyleGuide.formality : 'professional and warm',
  sentenceGuidance: locale.code === 'es' ? spanishStyleGuide.sentenceGuidance : 'Prefer natural local reading rhythm over source-language order.',
  typography: locale.code === 'es' ? spanishStyleGuide.typography : (locale.dir === 'rtl' ? 'Use RTL-safe punctuation, visual order, and neutral icon placement.' : 'Use local punctuation and typographic conventions.'),
  genderNeutrality: locale.code === 'es' ? spanishStyleGuide.genderNeutrality : 'Use the locale’s natural inclusive form without changing psychological meaning.',
  seo: locale.code === 'es' ? spanishStyleGuide.seo : 'Write for local search intent; never translate titles or descriptions word for word.',
  status: locale.code === 'es' ? spanishStyleGuide.status : (locale.published ? 'baseline-established' : 'requires-native-editorial-review'),
})])));
