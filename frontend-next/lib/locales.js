/**
 * International locale registry. Entries can be prepared before publication,
 * but only `published` locales may create routes, sitemaps, or hreflang tags.
 */
export const localeRegistry = Object.freeze([
  ['ar', 'ar', 'Arabic', 'العربية', 'rtl'], ['hy', 'hy', 'Armenian', 'Հայերեն', 'ltr'],
  ['az', 'az', 'Azerbaijani', 'Azərbaycanca', 'ltr'], ['bn', 'bn', 'Bengali', 'বাংলা', 'ltr'],
  ['bg', 'bg', 'Bulgarian', 'Български', 'ltr'], ['zh-hans', 'zh-CN', 'Chinese Simplified', '简体中文', 'ltr'],
  ['zh-hant', 'zh-TW', 'Chinese Traditional', '繁體中文', 'ltr'], ['hr', 'hr', 'Croatian', 'Hrvatski', 'ltr'],
  ['cs', 'cs', 'Czech', 'Čeština', 'ltr'], ['da', 'da', 'Danish', 'Dansk', 'ltr'],
  ['nl', 'nl', 'Dutch', 'Nederlands', 'ltr'], ['en', 'en', 'English', 'English', 'ltr', true],
  ['et', 'et', 'Estonian', 'Eesti', 'ltr'], ['fa', 'fa', 'Farsi', 'فارسی', 'rtl'],
  ['fi', 'fi', 'Finnish', 'Suomi', 'ltr'], ['fr', 'fr', 'French', 'Français', 'ltr', true],
  ['de', 'de', 'German', 'Deutsch', 'ltr'], ['ka', 'ka', 'Georgian', 'ქართული', 'ltr'],
  ['el', 'el', 'Greek', 'Ελληνικά', 'ltr'], ['he', 'he', 'Hebrew', 'עברית', 'rtl'],
  ['hi', 'hi', 'Hindi', 'हिन्दी', 'ltr', true], ['hu', 'hu', 'Hungarian', 'Magyar', 'ltr'],
  ['is', 'is', 'Icelandic', 'Íslenska', 'ltr'], ['id', 'id', 'Indonesian', 'Bahasa Indonesia', 'ltr'],
  ['it', 'it', 'Italian', 'Italiano', 'ltr'], ['ja', 'ja', 'Japanese', '日本語', 'ltr', true],
  ['kk', 'kk', 'Kazakh', 'Қазақша', 'ltr'], ['ko', 'ko', 'Korean', '한국어', 'ltr'],
  ['lv', 'lv', 'Latvian', 'Latviešu', 'ltr'], ['lt', 'lt', 'Lithuanian', 'Lietuvių', 'ltr'],
  ['ms', 'ms', 'Malay', 'Bahasa Melayu', 'ltr'], ['mn', 'mn', 'Mongolian', 'Монгол', 'ltr'],
  ['no', 'no', 'Norwegian', 'Norsk', 'ltr'], ['pl', 'pl', 'Polish', 'Polski', 'ltr'],
  ['pt-pt', 'pt-PT', 'Portuguese Portugal', 'Português (Portugal)', 'ltr'], ['pt-br', 'pt-BR', 'Portuguese Brazil', 'Português (Brasil)', 'ltr'],
  ['ro', 'ro', 'Romanian', 'Română', 'ltr'], ['ru', 'ru', 'Russian', 'Русский', 'ltr'],
  ['sr', 'sr', 'Serbian', 'Српски', 'ltr'], ['sk', 'sk', 'Slovak', 'Slovenčina', 'ltr'],
  ['sl', 'sl', 'Slovenian', 'Slovenščina', 'ltr'], ['es', 'es', 'Spanish', 'Español', 'ltr'],
  ['sw', 'sw', 'Swahili', 'Kiswahili', 'ltr'], ['sv', 'sv', 'Swedish', 'Svenska', 'ltr'],
  ['th', 'th', 'Thai', 'ไทย', 'ltr'], ['tr', 'tr', 'Turkish', 'Türkçe', 'ltr'],
  ['uk', 'uk', 'Ukrainian', 'Українська', 'ltr'], ['uz', 'uz', 'Uzbek', 'Oʻzbekcha', 'ltr'],
  ['vi', 'vi', 'Vietnamese', 'Tiếng Việt', 'ltr'],
].map(([code, hreflang, englishName, nativeName, dir, published = false]) => Object.freeze({
  code, hreflang, englishName, nativeName, dir, published, sitemap: published, seoAvailable: published,
})));

export const localeByCode = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code, locale])));
export const publishedLocales = Object.freeze(localeRegistry.filter((locale) => locale.published).map((locale) => locale.code));
export const defaultLocale = 'en';

export function localeConfig(locale) { return localeByCode[locale] || null; }
export function isConfiguredLocale(locale) { return Boolean(localeConfig(locale)); }
export function isPublishedLocale(locale) { return publishedLocales.includes(locale); }
export function localeDirection(locale) { return localeConfig(locale)?.dir || 'ltr'; }
