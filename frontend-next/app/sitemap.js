import { localePath, siteUrl } from '../lib/site';
import { publishedLocales } from '../lib/locales';
import { pageAlternates } from '../lib/metadata';
import { TYPE_ORDER } from '../lib/personality';
import { allPairs } from '../lib/comparisons';

export default function sitemap() {
  const routes = ['', 'privacy', 'terms', 'contact', 'compare', 'insights', 'insights/communication', 'insights/conflict', 'insights/leadership', 'insights/learning', 'community', 'jobs'];
  const entry = (locale, path, priority) => ({
    url: `${siteUrl()}${localePath(locale, path)}`,
    lastModified: new Date(), changeFrequency: path ? 'monthly' : 'weekly', priority,
    alternates: { languages: pageAlternates(path) },
  });
  const base = publishedLocales.flatMap((locale) => routes.map((path) => entry(locale, path, path ? 0.6 : 1)));
  const personalities = publishedLocales.flatMap((locale) => TYPE_ORDER.map((type) => entry(locale, `personality/${type.toLowerCase()}`, 0.8)));
  const careers = publishedLocales.flatMap((locale) => TYPE_ORDER.map((type) => entry(locale, `personality/${type.toLowerCase()}/careers`, 0.7)));
  const comparisons = publishedLocales.flatMap((locale) => allPairs().map((pair) => entry(locale, `compare/${pair.slug}`, 0.7)));
  return [...base, ...personalities, ...careers, ...comparisons];
}
