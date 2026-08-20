export const ASSESSMENT_LOCALES = Object.freeze({
  communication: Object.freeze(['en', 'hi', 'fr']),
  conflict: Object.freeze(['en', 'hi']),
  leadership: Object.freeze(['en', 'hi']),
  learning: Object.freeze(['en', 'hi']),
});

export function isAssessmentLocaleSupported(analyzer, locale) {
  return ASSESSMENT_LOCALES[analyzer]?.includes(locale) || false;
}
