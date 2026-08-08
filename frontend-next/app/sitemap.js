import { localePath, siteUrl } from '../lib/site';
import { TYPE_ORDER } from '../lib/personality';
import { allPairs } from '../lib/comparisons';

export default function sitemap() {
  const routes = ['', 'privacy', 'terms', 'contact', 'insights', 'insights/communication'];
  const locales = ['en', 'hi'];
  const base = locales.flatMap((locale) => routes.map((path) => ({
    url: `${siteUrl()}${localePath(locale, path)}`,
    lastModified: new Date(), changeFrequency: path ? 'monthly' : 'weekly', priority: path ? 0.6 : 1,
  })));
  const personalities = locales.flatMap((locale) => TYPE_ORDER.map((type) => ({ url: `${siteUrl()}${localePath(locale, `personality/${type.toLowerCase()}`)}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })));
  const careers = locales.flatMap((locale) => TYPE_ORDER.map((type) => ({ url: `${siteUrl()}${localePath(locale, `personality/${type.toLowerCase()}/careers`)}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })));
  const comparisons = locales.flatMap((locale) => allPairs().map((pair) => ({ url: `${siteUrl()}${localePath(locale, `compare/${pair.slug}`)}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })));
  // These public hybrid routes retain their existing non-localized canonical
  // URLs until their legacy application is migrated.
  const hybridPublicRoutes = ['community', 'community/jobs'].map((path) => ({
    url: `${siteUrl()}/${path}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6,
  }));
  return [...base, ...personalities, ...careers, ...comparisons, ...hybridPublicRoutes];
}
