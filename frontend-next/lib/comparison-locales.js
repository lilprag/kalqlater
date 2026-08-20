export const SUPPORTED_COMPARE_LOCALES = Object.freeze(['en', 'hi', 'fr', 'ja']);
export const PACKAGE_REQUIRED_COMPARE_LOCALES = Object.freeze(['fr', 'ja']);

export function isSupportedCompareLocale(locale) {
  return SUPPORTED_COMPARE_LOCALES.includes(String(locale || '').trim().toLowerCase());
}

export function requiresLocalizedComparisonPackage(locale) {
  return PACKAGE_REQUIRED_COMPARE_LOCALES.includes(String(locale || '').trim().toLowerCase());
}
