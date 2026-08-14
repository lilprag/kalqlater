import path from 'node:path';

import { localeRegistry } from '../lib/locales.js';
import { dictionaryForLocale } from '../localization/translation/dictionary.js';
import { writeTranslationReports } from '../localization/translation/reporter.js';
import { validateLocalePackage } from '../localization/translation/validator.js';

const localesRoot = path.resolve('localization/locales');
const locales = localeRegistry.filter((locale) => !['en', 'hi', 'es'].includes(locale.code));
const reports = await Promise.all(locales.map((locale) => validateLocalePackage({ locale: locale.code, localesRoot, dictionary: dictionaryForLocale(locale.code) })));
const summary = await writeTranslationReports({ reports, reportsDirectory: path.resolve('reports') });
console.log(`Wrote translation readiness reports for ${summary.locales.length} locales; ${summary.publishReady.length} locale(s) are publish-ready.`);
