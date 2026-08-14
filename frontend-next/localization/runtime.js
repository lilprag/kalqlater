import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { localeBootstrapFiles } from './bootstrap.js';
import { dictionaryForLocale } from './translation/dictionary.js';
import { validateLocalePackage } from './translation/validator.js';
import { localeRuntime } from './runtime-policy.js';

const LOCALES_ROOT = path.join(process.cwd(), 'localization', 'locales');

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pathForPageId(pageId) {
  if (pageId === 'homepage') return 'homepage.json';
  if (pageId === 'navigation') return 'navigation.json';
  if (pageId === 'footer') return 'footer.json';
  if (pageId === 'shared-ui') return 'shared-ui.json';
  if (pageId === 'community' || pageId === 'jobs') return `${pageId}.json`;
  if (pageId.startsWith('static:')) return `static/${pageId.slice('static:'.length)}.json`;
  if (pageId.startsWith('personality:')) return `personality/${pageId.slice('personality:'.length)}.json`;
  if (pageId.startsWith('career:')) return `career/${pageId.slice('career:'.length)}.json`;
  if (pageId.startsWith('compare:')) return `compare/${pageId.slice('compare:'.length)}.json`;
  if (pageId.startsWith('insight:')) return `insight/${pageId.slice('insight:'.length)}.json`;
  return null;
}

async function readPackageFiles(locale, localesRoot = LOCALES_ROOT) {
  const expected = localeBootstrapFiles(locale);
  const entries = await Promise.all([...expected.keys()].map(async (file) => [file, JSON.parse(await readFile(path.join(localesRoot, locale, file), 'utf8'))]));
  return new Map(entries);
}

/**
 * Loads a complete reviewed JSON locale package. Draft and partially-authored
 * packages resolve to null, so they can never leak through SSR or navigation.
 */
export async function loadLocale(locale, options = {}) {
  const normalized = String(locale || '').trim().toLowerCase();
  const runtime = options.runtime || localeRuntime(normalized);
  if (!runtime || !['preview', 'published'].includes(runtime.state)) return null;
  if (runtime.packageSource === 'application') return Object.freeze({ locale: normalized, state: runtime.state, source: 'application', pages: null });
  if (runtime.packageSource === 'legacy-preview') return Object.freeze({ locale: normalized, state: runtime.state, source: 'legacy-preview', pages: null });
  if (runtime.packageSource !== 'json-package') return null;
  const localesRoot = options.localesRoot || LOCALES_ROOT;
  let report;
  try {
    report = await validateLocalePackage({ locale: normalized, localesRoot, dictionary: dictionaryForLocale(normalized) });
  } catch {
    return null;
  }
  if (!report.publishReady) return null;
  try {
    const files = await readPackageFiles(normalized, localesRoot);
    const pages = Object.freeze(Object.fromEntries([...files.entries()].filter(([file]) => !['manifest.json', 'validation.json'].includes(file)).map(([, page]) => [page.id, page])));
    return Object.freeze({ locale: normalized, state: runtime.state, source: 'json-package', manifest: files.get('manifest.json'), validation: files.get('validation.json'), pages, report });
  } catch {
    return null;
  }
}

export async function loadLocalePage(locale, pageId, options = {}) {
  const packageData = await loadLocale(locale, options);
  if (!packageData || packageData.source !== 'json-package') return null;
  if (pageId === 'insights' || pageId === 'compare') {
    const metadata = packageData.pages.metadata?.fields?.[pageId];
    return metadata ? Object.freeze({ id: 'insights', route: `/${packageData.locale}/insights`, fields: Object.freeze({ h1: metadata.title, body: metadata.description, seo: metadata, jsonLd: packageData.pages['json-ld']?.fields || {} }), locale: packageData.locale, state: packageData.state }) : null;
  }
  const expectedFile = pathForPageId(pageId);
  const page = packageData.pages[pageId];
  return expectedFile && page?.fields && isObject(page.fields) ? Object.freeze({ ...page, locale: packageData.locale, state: packageData.state }) : null;
}

export async function loadLocaleChrome(locale, options = {}) {
  const packageData = await loadLocale(locale, options);
  if (!packageData || packageData.source !== 'json-package') return null;
  const navigation = packageData.pages.navigation?.fields;
  const footer = packageData.pages.footer?.fields;
  return isObject(navigation) && isObject(footer) ? Object.freeze({ navigation, footer }) : null;
}

export function localePreviewMetadata(locale, page, pagePath = '') {
  const seo = page?.fields?.seo;
  if (!seo?.title || !seo?.description) return null;
  const url = `https://kalqlater.com/${locale}${pagePath ? `/${pagePath.replace(/^\//, '')}` : ''}`;
  return {
    title: { absolute: seo.title }, description: seo.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName: 'KalQLater', title: seo.ogTitle || seo.title, description: seo.ogDescription || seo.description, url, locale },
    twitter: { card: 'summary', title: seo.twitterTitle || seo.title, description: seo.twitterDescription || seo.description },
    robots: { index: false, follow: false },
  };
}
