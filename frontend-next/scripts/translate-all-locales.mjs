import path from 'node:path';

import { localeRegistry } from '../lib/locales.js';
import { dictionaryForLocale } from '../localization/translation/dictionary.js';
import { translateLocalePackage } from '../localization/translation/translator.js';

const localesRoot = path.resolve('localization/locales');
const draftLocales = localeRegistry.filter((locale) => !['en', 'hi', 'es'].includes(locale.code));
const results = [];
for (const locale of draftLocales) {
  results.push(await translateLocalePackage({ locale: locale.code, localesRoot, dictionary: dictionaryForLocale(locale.code) }));
}
console.log(`Applied reviewed dictionaries for ${results.length} draft locales; ${results.reduce((count, result) => count + result.filesWritten.length, 0)} file(s) changed.`);
