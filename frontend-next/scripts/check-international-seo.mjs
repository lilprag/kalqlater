import { localeConfig, localeRegistry, publishedLocales } from '../lib/locales.js';
import { buildLocalizedMetadata, pageAlternates } from '../lib/metadata.js';

const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(localeRegistry.length === 49, `expected 49 configured target locales, found ${localeRegistry.length}`);
assert(JSON.stringify(publishedLocales) === JSON.stringify(['en', 'fr', 'hi', 'ja']), 'only English, French, Hindi, and Japanese may be published');
for (const locale of localeRegistry) {
  assert(locale.code && locale.hreflang && locale.englishName && locale.nativeName, `${locale.code}: incomplete locale registry entry`);
  assert(['ltr', 'rtl'].includes(locale.dir), `${locale.code}: invalid direction`);
}
for (const locale of ['ar', 'fa', 'he']) assert(localeConfig(locale)?.dir === 'rtl', `${locale}: must be RTL-ready`);
assert(localeConfig('pt-br')?.hreflang === 'pt-BR', 'Brazilian Portuguese hreflang must retain its region');
assert(localeConfig('pt-pt')?.hreflang === 'pt-PT', 'Portuguese Portugal hreflang must retain its region');
assert(localeConfig('zh-hans')?.hreflang === 'zh-CN', 'Simplified Chinese hreflang must be explicit');
assert(localeConfig('zh-hant')?.hreflang === 'zh-TW', 'Traditional Chinese hreflang must be explicit');

const allAlternates = pageAlternates('personality/intj');
assert(Object.keys(allAlternates).join(',') === 'en,fr,hi,ja,x-default', 'published page hreflang cluster must contain only public locales and x-default');
assert(allAlternates['x-default'].endsWith('/en/personality/intj'), 'x-default must point to English');
const englishOnly = pageAlternates('future-page', ['en']);
assert(Object.keys(englishOnly).join(',') === 'en,x-default', 'page-specific availability must not add unavailable locales');

const hi = buildLocalizedMetadata({ locale: 'hi', path: 'insights', title: 'पर्सनैलिटी से आगे', description: 'व्यवहार पर केंद्रित आत्मचिंतन अनुभव खोजें।' });
assert(hi.alternates.canonical.endsWith('/hi/insights'), 'Hindi canonical must self-reference');
assert(hi.openGraph.url === hi.alternates.canonical, 'localized og:url must equal canonical');
assert(hi.openGraph.title === hi.title && hi.twitter.title === hi.title, 'OG and Twitter must use localized title');
assert(hi.openGraph.description === hi.description && hi.twitter.description === hi.description, 'OG and Twitter must use localized description');
assert(hi.alternates.languages.hi.endsWith('/hi/insights'), 'Hindi hreflang must use Hindi URL');
let missingCopyFailed = false;
try { buildLocalizedMetadata({ locale: 'fr', path: 'insights', title: '', description: '' }); } catch { missingCopyFailed = true; }
assert(missingCopyFailed, 'unpublished or untranslated locales must fail rather than fall back to English');

console.log('International SEO registry and metadata architecture checks passed.');
