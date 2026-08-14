import { TYPE_CODES } from '../data/types.js';
import { localeConfig } from '../lib/locales.js';

const INSIGHTS = Object.freeze(['communication', 'conflict', 'leadership', 'learning']);
const STATIC_PAGES = Object.freeze(['contact', 'privacy', 'terms']);
const EMPTY = null;

function assert(condition, message) { if (!condition) throw new Error(message); }
function canonicalLocale(value) { return String(value || '').trim().toLowerCase(); }
function record(id, route, fields) { return Object.freeze({ id, route, status: 'draft', fields: Object.freeze(fields) }); }
function textFields(keys) { return Object.freeze(Object.fromEntries(keys.map((key) => [key, EMPTY]))); }

/**
 * Produces a source-copy-free editorial package. It is intentionally not a
 * runtime locale adapter: a package remains unavailable until native content,
 * review, and the existing publication contract approve it.
 */
export function createLocaleBootstrapPackage(locale) {
  const code = canonicalLocale(locale);
  const config = localeConfig(code);
  assert(config, `Unknown configured locale: ${locale}`);
  assert(!['en', 'hi', 'es'].includes(code), `Bootstrap is for a new locale, not ${code}`);
  const route = (suffix = '') => `/${code}${suffix}`;
  const pairs = TYPE_CODES.flatMap((first, index) => TYPE_CODES.slice(index + 1).map((second) => `${first.toLowerCase()}-vs-${second.toLowerCase()}`));
  const packageManifest = Object.freeze({
    schemaVersion: 1, locale: code, nativeName: config.nativeName, direction: config.dir,
    state: 'draft', sourceLocale: 'es', generatedBy: 'language-bootstrap-factory',
    publication: Object.freeze({ sitemap: false, hreflang: false, languageSelector: false, robots: 'noindex' }),
  });
  const sharedSeo = textFields(['title', 'description', 'ogTitle', 'ogDescription', 'twitterTitle', 'twitterDescription', 'keywords']);
  const pages = [
    record('homepage', route(), { ...textFields(['eyebrow', 'h1', 'body', 'primaryCta', 'secondaryCta', 'trustLine', 'features', 'dimensions', 'insights', 'community', 'finalCta', 'footer']), seo: sharedSeo, jsonLd: textFields(['websiteName', 'organizationName']) }),
    record('navigation', null, textFields(['home', 'takeTest', 'types', 'insights', 'compare', 'community', 'jobs', 'contact', 'login', 'signup', 'menuOpen', 'menuClose', 'languageLabel'])),
    record('footer', null, textFields(['description', 'insights', 'communication', 'compare', 'community', 'jobs', 'privacy', 'terms', 'contact', 'takeTest', 'copyright'])),
    record('shared-ui', null, textFields(['loading', 'empty', 'success', 'retry', 'back', 'next', 'networkError', 'notFound', 'validationError'])),
    record('metadata', null, { homepage: sharedSeo, personality: sharedSeo, career: sharedSeo, compare: sharedSeo, insights: sharedSeo, community: sharedSeo, jobs: sharedSeo, static: sharedSeo }),
    record('json-ld', null, textFields(['breadcrumbHome', 'websiteName', 'organizationName', 'collectionPageName', 'faqQuestion', 'faqAnswer'])),
    ...TYPE_CODES.map((type) => record(`personality:${type.toLowerCase()}`, route(`/personality/${type.toLowerCase()}`), { ...textFields(['displayName', 'summary', 'overview', 'coreTraits', 'strengths', 'growthAreas', 'communication', 'relationships', 'friendship', 'romance', 'family', 'teamwork', 'workStyle', 'leadership', 'learning', 'stress', 'recommendations', 'faqs', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'faq']) })),
    ...TYPE_CODES.map((type) => record(`career:${type.toLowerCase()}`, route(`/personality/${type.toLowerCase()}/careers`), { ...textFields(['hero', 'lens', 'skill', 'roles', 'settings', 'formats', 'skills', 'stages', 'industries', 'faqs', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'faq']) })),
    ...pairs.map((pair) => record(`compare:${pair}`, route(`/compare/${pair}`), { ...textFields(['eyebrow', 'helper', 'intro', 'snapshot', 'sections', 'misconceptions', 'percentage', 'faqs', 'ui']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'faq']) })),
    ...INSIGHTS.map((insight) => record(`insight:${insight}`, route(`/insights/${insight}`), { ...textFields(['eyebrow', 'h1', 'promise', 'dimensions', 'examples', 'howItWorks', 'faqs', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'faq']) })),
    record('community', route('/community'), { ...textFields(['h1', 'body', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'collectionPage']) }),
    record('jobs', route('/jobs'), { ...textFields(['h1', 'body', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb', 'collectionPage']) }),
    ...STATIC_PAGES.map((page) => record(`static:${page}`, route(`/${page}`), { ...textFields(['h1', 'body', 'ctas']), seo: sharedSeo, jsonLd: textFields(['breadcrumb']) })),
  ];
  return Object.freeze({ manifest: packageManifest, pages: Object.freeze(pages), validation: Object.freeze({ requiredPageCount: pages.length, personalityGuides: 16, careerGuides: 16, compareGuides: 120, insights: INSIGHTS.length, requiredPublicationState: 'draft', noFallback: true }) });
}

export function localeBootstrapFiles(locale) {
  const data = createLocaleBootstrapPackage(locale);
  const files = new Map();
  files.set('manifest.json', data.manifest);
  files.set('validation.json', data.validation);
  for (const page of data.pages) {
    const [family, key] = page.id.split(':');
    const filename = key ? `${family}/${key}.json` : `${family}.json`;
    files.set(filename, page);
  }
  return files;
}

function missingValues(value, path = '') {
  if (value === null) return [path];
  if (Array.isArray(value)) return value.flatMap((item, index) => missingValues(item, `${path}[${index}]`));
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, item]) => missingValues(item, path ? `${path}.${key}` : key));
}

/** Draft placeholders are incomplete by design; publication validation must fail closed. */
export function validateLocaleBootstrapPackage(data) {
  assert(data?.manifest && Array.isArray(data.pages) && data.validation, 'Invalid locale bootstrap package');
  const missing = data.pages.flatMap((page) => missingValues(page.fields, page.id));
  return Object.freeze({ validStructure: data.pages.length === data.validation.requiredPageCount, publishable: false, missing: Object.freeze(missing) });
}
