import path from 'node:path';

import { dictionaryForLocale } from '../localization/translation/dictionary.js';
import { translateLocalePackage } from '../localization/translation/translator.js';

const locale = String(process.argv[2] || '').trim().toLowerCase();
if (!locale) throw new Error('Usage: npm run translate:locale -- <locale>');

const result = await translateLocalePackage({
  locale,
  localesRoot: path.resolve('localization/locales'),
  dictionary: dictionaryForLocale(locale),
});
console.log(`${result.locale}: applied ${result.filesWritten.length} reviewed translation file(s).`);
