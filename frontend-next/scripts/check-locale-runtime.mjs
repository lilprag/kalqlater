import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { localeBootstrapFiles } from '../localization/bootstrap.js';
import { loadLocale, loadLocalePage, localePreviewMetadata } from '../localization/runtime.js';
import { canTransitionLocaleRuntime, isRuntimePreviewLocale } from '../localization/runtime-policy.js';

function authored(value) {
  if (value === null) return 'Contenu localisé';
  if (Array.isArray(value)) return value.map(authored);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, authored(item)]));
  return value;
}

const root = await mkdtemp(path.join(os.tmpdir(), 'kalqlater-locale-runtime-'));
const localesRoot = path.join(root, 'locales');
const localeDirectory = path.join(localesRoot, 'fr');
await mkdir(localeDirectory, { recursive: true });
for (const [file, data] of localeBootstrapFiles('fr')) {
  const target = path.join(localeDirectory, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(authored(data), null, 2)}\n`, 'utf8');
}

try {
  const previewRuntime = { locale: 'fr', state: 'preview', packageSource: 'json-package' };
  const loaded = await loadLocale('fr', { localesRoot, runtime: previewRuntime });
  assert(loaded && loaded.source === 'json-package');
  assert.equal(loaded.report.publishReady, true);
  const homepage = await loadLocalePage('fr', 'homepage', { localesRoot, runtime: previewRuntime });
  assert.equal(homepage.fields.h1, 'Contenu localisé');
  assert.equal((await loadLocalePage('fr', 'personality:intj', { localesRoot, runtime: previewRuntime })).id, 'personality:intj');
  const metadata = localePreviewMetadata('fr', homepage);
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.alternates.canonical, 'https://kalqlater.com/fr');
  assert.equal(await loadLocale('fr', { localesRoot, runtime: { locale: 'fr', state: 'draft', packageSource: 'json-package' } }), null);
  assert.equal(canTransitionLocaleRuntime('draft', 'validated'), true);
  assert.equal(canTransitionLocaleRuntime('validated', 'preview'), true);
  assert.equal(canTransitionLocaleRuntime('preview', 'published'), true);
  assert.equal(canTransitionLocaleRuntime('draft', 'published'), false);
  assert.equal(isRuntimePreviewLocale('es'), true);
  assert.equal(isRuntimePreviewLocale('fr'), false);
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log('Generic locale runtime checks passed for complete-package SSR loading, preview metadata, lifecycle transitions, and draft fail-closed behaviour.');
