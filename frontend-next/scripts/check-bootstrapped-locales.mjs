import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { localeRegistry } from '../lib/locales.js';

const root = new URL('../localization/locales/', import.meta.url);
const generatedLocales = localeRegistry.filter((locale) => !['en', 'hi', 'es'].includes(locale.code));

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => entry.isDirectory()
    ? filesUnder(path.join(directory, entry.name)).then((items) => items.map((item) => path.join(entry.name, item)))
    : [entry.name]));
  return nested.flat();
}

function substantiveValues(value, pathName = '') {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return [];
  if (typeof value === 'string') return pathName.includes('fields') ? [pathName] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => substantiveValues(item, `${pathName}[${index}]`));
  return Object.entries(value || {}).flatMap(([key, item]) => substantiveValues(item, pathName ? `${pathName}.${key}` : key));
}

for (const locale of generatedLocales) {
  const directory = path.join(root.pathname, locale.code);
  const files = await filesUnder(directory);
  assert.equal(files.length, 169, `${locale.code}: expected complete bootstrap file set`);
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
  const validation = JSON.parse(await readFile(path.join(directory, 'validation.json'), 'utf8'));
  assert.equal(manifest.locale, locale.code);
  assert.equal(manifest.state, 'draft');
  assert.deepEqual(manifest.publication, { sitemap: false, hreflang: false, languageSelector: false, robots: 'noindex' });
  assert.equal(validation.requiredPageCount, 167);
  assert.equal(validation.noFallback, true);
  const records = await Promise.all(files.filter((file) => !['manifest.json', 'validation.json'].includes(file)).map(async (file) => JSON.parse(await readFile(path.join(directory, file), 'utf8'))));
  assert(records.every((record) => record.status === 'draft'), `${locale.code}: every page must remain a draft`);
  assert.equal(records.flatMap((record) => substantiveValues(record)).length, 0, `${locale.code}: substantive placeholders must remain null`);
}

console.log(`Bootstrapped locale checks passed for ${generatedLocales.length} draft locales and ${generatedLocales.length * 169} null-only package files.`);
