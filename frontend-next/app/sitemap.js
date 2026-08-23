import { localePath, siteUrl } from '../lib/site';
import { pageAlternates } from '../lib/metadata';
import { TYPE_ORDER } from '../lib/personality';
import { allPairs } from '../lib/comparisons';
import { publicLocalesForEntity, publishedLanguageLocales } from '../lib/locale-availability';

export default function sitemap() {
  const routes = [
    ['', null], ['privacy', null], ['terms', null], ['contact', null], ['types', null], ['compare', null], ['insights', null],
    ['insights/communication', 'insight:communication'], ['insights/conflict', 'insight:conflict'],
    ['insights/leadership', 'insight:leadership'], ['insights/learning', 'insight:learning'],
    ['community', 'community:directory'],
  ];
  const entry = (locale, path, priority, entityId) => ({
    url: `${siteUrl()}${localePath(locale, path)}`,
    changeFrequency: path ? 'monthly' : 'weekly', priority,
    alternates: { languages: pageAlternates(path, undefined, entityId) },
  });
  const base = routes.flatMap(([path, entityId]) => {
    const locales = entityId ? publicLocalesForEntity(entityId) : publishedLanguageLocales();
    return locales.map((locale) => entry(locale, path, path ? 0.6 : 1, entityId));
  });
  const personalities = TYPE_ORDER.flatMap((type) => publicLocalesForEntity(`personality-guide:${type.toLowerCase()}`)
    .map((locale) => entry(locale, `personality/${type.toLowerCase()}`, 0.8, `personality-guide:${type.toLowerCase()}`)));
  const careers = TYPE_ORDER.flatMap((type) => publicLocalesForEntity(`career-guide:${type.toLowerCase()}`)
    .map((locale) => entry(locale, `personality/${type.toLowerCase()}/careers`, 0.7, `career-guide:${type.toLowerCase()}`)));
  const comparisons = allPairs().flatMap((pair) => publicLocalesForEntity(`compare:${pair.slug}`)
    .map((locale) => entry(locale, `compare/${pair.slug}`, 0.7, `compare:${pair.slug}`)));
  const jobs = [entry('en', 'jobs', 0.6, undefined)];
  const careersHub = [{ ...entry('en', 'careers', 0.8, undefined), alternates: { languages: { en: `${siteUrl()}/en/careers`, 'x-default': `${siteUrl()}/en/careers` } } }];
  return [...base, ...careersHub, ...jobs, ...personalities, ...careers, ...comparisons];
}
