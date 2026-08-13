import { PAGE_FAMILIES } from '../content-registry.js';
import { REVIEW_GATES, isLocalePublishable, localePackages } from '../packages.js';

export function studioLocaleReport(locale) {
  const packageConfig = localePackages[locale];
  if (!packageConfig) throw new Error(`Unknown locale package: ${locale}`);
  const familyStatus = Object.fromEntries(PAGE_FAMILIES.map((family) => [family, packageConfig.content[family]]));
  return Object.freeze({
    locale,
    pageFamilies: familyStatus,
    reviewBacklog: REVIEW_GATES.filter((gate) => packageConfig.review[gate] !== 'approved'),
    pendingUpdates: PAGE_FAMILIES.filter((family) => packageConfig.content[family] === 'pending_update'),
    publishable: isLocalePublishable(locale),
  });
}
