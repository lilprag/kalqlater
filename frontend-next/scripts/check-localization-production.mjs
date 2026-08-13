import { localeRegistry, publishedLocales } from '../lib/locales.js';
import { PAGE_FAMILIES, contentIds, masterContentRegistry } from '../localization/content-registry.js';
import { CONTENT_STATUSES, REVIEW_GATES, isLocalePublishable, localePackages } from '../localization/packages.js';
import { styleGuideByLocale } from '../localization/style-guides.js';
import { terminologyByLocale, terminologyConcepts } from '../localization/terminology.js';
import { suspiciousEnglishResidue, validateLocalizedBlock } from '../localization/validation.js';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const published = localeRegistry.filter((locale) => locale.published);
const editorialTerminologyLocales = new Set(['es']);

assert(localeRegistry.length === 49, `expected 49 configured locales, got ${localeRegistry.length}`);
assert(new Set(localeRegistry.map((locale) => locale.code)).size === localeRegistry.length, 'locale codes must be unique');
assert(new Set(localeRegistry.map((locale) => locale.hreflang)).size === localeRegistry.length, 'hreflang codes must be unique');
assert(new Set(contentIds).size === contentIds.length, 'master content IDs must be unique');
assert(masterContentRegistry.every((block) => PAGE_FAMILIES.includes(block.family) && /^[A-Z][A-Z0-9_.{}-]+$/.test(block.id)), 'invalid master content registry ID');
assert(JSON.stringify(publishedLocales) === JSON.stringify(['en', 'hi']), 'Phase 1 must not publish additional locales');

for (const locale of localeRegistry) {
  const packageConfig = localePackages[locale.code];
  assert(packageConfig?.packagePath.endsWith(`/${locale.code}`), `${locale.code}: missing isolated package path`);
  assert(PAGE_FAMILIES.every((family) => CONTENT_STATUSES.includes(packageConfig.content[family])), `${locale.code}: missing page-family status`);
  assert(REVIEW_GATES.every((gate) => ['pending', 'approved'].includes(packageConfig.review[gate])), `${locale.code}: invalid review gate`);
  assert(styleGuideByLocale[locale.code]?.direction === locale.dir, `${locale.code}: missing direction-aware style guide`);
  assert(terminologyByLocale[locale.code], `${locale.code}: missing terminology dictionary`);
  if (!locale.published) {
    assert(!isLocalePublishable(locale.code), `${locale.code}: unpublished locale must not be public`);
    const glossary = terminologyByLocale[locale.code];
    if (editorialTerminologyLocales.has(locale.code)) {
      assert(glossary.status === 'approved' && terminologyConcepts.every((term) => glossary.values[term]), `${locale.code}: authored terminology must be complete before content drafting`);
    } else {
      assert(glossary.status === 'draft' && Object.keys(glossary.values).length === 0, `${locale.code}: unreviewed package must not contain inherited English terminology`);
    }
  }
}
for (const locale of published) {
  assert(isLocalePublishable(locale.code), `${locale.code}: published locale must satisfy every publication gate`);
  const glossary = terminologyByLocale[locale.code];
  assert(glossary.status === 'approved', `${locale.code}: published terminology requires editorial approval`);
  assert(terminologyConcepts.every((term) => glossary.values[term]), `${locale.code}: incomplete approved terminology`);
}
for (const rtl of ['ar', 'fa', 'he']) assert(localeRegistry.find((locale) => locale.code === rtl)?.dir === 'rtl', `${rtl}: RTL direction required`);
assert(suspiciousEnglishResidue('Explore your personality with a clear guide.', 'es').length > 0, 'English-residue detection must flag foreign English prose');
assert(suspiciousEnglishResidue('KalQLater INTJ AI', 'es').length === 0, 'universal terms must remain allowed');
let missingBlockFailed = false;
try { validateLocalizedBlock({ locale: 'fr', id: 'HOME.HERO.TITLE', value: '', status: 'published' }); } catch { missingBlockFailed = true; }
assert(missingBlockFailed, 'missing localized content must fail publication validation');
console.log(`Localization production checks passed: ${localeRegistry.length} configured locales, ${published.length} publishable locales, ${contentIds.length} master content IDs.`);
