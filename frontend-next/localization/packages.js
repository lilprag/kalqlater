import { localeRegistry } from '../lib/locales.js';
import { PAGE_FAMILIES } from './content-registry.js';

export const CONTENT_STATUSES = Object.freeze(['draft', 'in_review', 'approved', 'published', 'deprecated', 'pending_update']);
export const REVIEW_GATES = Object.freeze(['terminology', 'editorial', 'seo', 'accessibility', 'localization_qa']);

const completeFamilies = Object.freeze(Object.fromEntries(PAGE_FAMILIES.map((family) => [family, 'published'])));
const pendingFamilies = Object.freeze(Object.fromEntries(PAGE_FAMILIES.map((family) => [family, 'draft'])));

/** One isolated package contract per locale; unapproved packages cannot be public. */
export const localePackages = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, Object.freeze({
  locale: locale.code,
  packagePath: `localization/locales/${locale.code}`,
  state: locale.published ? 'published' : 'draft',
  content: locale.published ? completeFamilies : pendingFamilies,
  review: Object.freeze(Object.fromEntries(REVIEW_GATES.map((gate) => [gate, locale.published ? 'approved' : 'pending']))),
  lastReviewedAt: null,
  sourceRevision: null,
})])));

export function pageFamilyStatus(locale, family) { return localePackages[locale]?.content?.[family] || null; }
export function isLocalePublishable(locale) {
  const candidate = localePackages[locale];
  return Boolean(candidate && candidate.state === 'published' && PAGE_FAMILIES.every((family) => candidate.content[family] === 'published') && REVIEW_GATES.every((gate) => candidate.review[gate] === 'approved'));
}

/** Localized routes are enabled only after package and all review gates pass. */
export function isPageAvailable(locale, family) { return isLocalePublishable(locale) && pageFamilyStatus(locale, family) === 'published'; }
