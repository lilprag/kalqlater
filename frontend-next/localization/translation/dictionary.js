/**
 * Checked-in, human-authored locale dictionaries belong here. This module is
 * deliberately data-only: the production site never imports it and no model
 * or network provider is involved in authoring.
 *
 * A dictionary is keyed by the locale-package file name and then by a path
 * relative to that file's `fields` object. Each value records the reviewed
 * English source alongside its native replacement so immutable syntax can be
 * verified before it is written.
 */
export const AUTHORED_TRANSLATIONS = Object.freeze({});

/** Character limits protect metadata and compact UI slots while keeping long-form editorial fields unconstrained in practice. */
export const TRANSLATION_LIMITS = Object.freeze({
  'seo.title': 70,
  'seo.description': 180,
  'seo.ogTitle': 95,
  'seo.ogDescription': 220,
  'seo.twitterTitle': 95,
  'seo.twitterDescription': 220,
  default: 12000,
});

export function translationLimit(fieldPath) {
  return TRANSLATION_LIMITS[fieldPath] || TRANSLATION_LIMITS.default;
}

export function translationEntry(source, value) {
  return Object.freeze({ source, value });
}

export function dictionaryForLocale(locale) {
  return AUTHORED_TRANSLATIONS[String(locale || '').trim().toLowerCase()] || Object.freeze({});
}
