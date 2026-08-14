import path from 'node:path';

import { localeRegistry } from '../lib/locales.js';
import { dictionaryForLocale } from '../localization/translation/dictionary.js';
import { assertPublishReady, validateLocalePackage } from '../localization/translation/validator.js';

const strict = process.argv.includes('--publish-ready');
const localesRoot = path.resolve('localization/locales');
const locales = localeRegistry.filter((locale) => !['en', 'hi', 'es'].includes(locale.code));
const reports = await Promise.all(locales.map((locale) => validateLocalePackage({ locale: locale.code, localesRoot, dictionary: dictionaryForLocale(locale.code) })));
for (const report of reports) console.log(`${report.locale}: ${report.completion}% complete, ${report.missing.length} missing field(s), ${report.englishResidue.length} English-residue finding(s), publish-ready=${report.publishReady}`);
if (strict) reports.forEach(assertPublishReady);
console.log(`Translation validation completed for ${reports.length} draft locale package(s).`);
