import { localeRegistry } from '../lib/locales.js';
import { PAGE_FAMILIES, contentIds } from '../localization/content-registry.js';
import { REVIEW_GATES, isLocalePublishable, localePackages } from '../localization/packages.js';

const rows = localeRegistry.map((locale) => {
  const packageConfig = localePackages[locale.code];
  const familiesComplete = PAGE_FAMILIES.filter((family) => packageConfig.content[family] === 'published').length;
  const reviewsApproved = REVIEW_GATES.filter((gate) => packageConfig.review[gate] === 'approved').length;
  return { locale: locale.code, nativeName: locale.nativeName, contentBlocks: contentIds.length, familiesComplete, totalFamilies: PAGE_FAMILIES.length, reviewsApproved, totalReviews: REVIEW_GATES.length, publishable: isLocalePublishable(locale.code) };
});
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), configuredLocales: rows.length, masterContentBlocks: contentIds.length, publishReadyLocales: rows.filter((row) => row.publishable).length, locales: rows }, null, 2));
