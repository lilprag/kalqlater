import { isLocalePublishable } from './packages.js';

/**
 * Preview is intentionally closed until a locale passes every publication gate.
 * Editors preview a production-equivalent locale only through an authenticated
 * editorial environment supplied by deployment configuration.
 */
export function previewEligibility(locale, editorialAccess = false) {
  return { allowed: Boolean(editorialAccess && isLocalePublishable(locale)), locale };
}
