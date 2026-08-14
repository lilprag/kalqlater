import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { localeBootstrapFiles } from '../localization/bootstrap.js';
import { validatePreservedSyntax } from '../localization/translation/placeholder.js';
import { applyTranslationDictionary, translateLocalePackage } from '../localization/translation/translator.js';
import { validateLocalePackage } from '../localization/translation/validator.js';

const root = await mkdtemp(path.join(os.tmpdir(), 'kalqlater-translation-'));
const localesRoot = path.join(root, 'locales');
const localeDirectory = path.join(localesRoot, 'fr');
await mkdir(localeDirectory, { recursive: true });
for (const [file, data] of localeBootstrapFiles('fr')) {
  const target = path.join(localeDirectory, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

try {
  const syntaxPass = validatePreservedSyntax('Hello {name}. Read [policy](/privacy) in `UTC` by 2026.', 'Bonjour {name}. Consultez [la politique](/privacy) en `UTC` avant 2026.');
  assert.equal(syntaxPass.valid, true);
  assert.equal(validatePreservedSyntax('Hello {name}', 'Bonjour {person}').valid, false);

  const record = JSON.parse(await readFile(path.join(localeDirectory, 'homepage.json'), 'utf8'));
  assert.throws(() => applyTranslationDictionary(record, { route: { source: '/fr', value: '/fr-ca' } }, 'homepage.json'), /Protected field path/);
  assert.throws(() => applyTranslationDictionary(record, { unknown: { source: 'Hello', value: 'Bonjour' } }, 'homepage.json'), /Unknown translation field/);
  assert.throws(() => applyTranslationDictionary(record, { 'seo.title': { source: 'Title', value: 'x'.repeat(71) } }, 'homepage.json'), /exceeds 70 characters/);
  assert.throws(() => applyTranslationDictionary(record, { h1: { source: 'English heading', value: 'English heading' } }, 'homepage.json'), /copied without localization/);

  const dictionary = {
    'homepage.json': {
      h1: { source: 'Know yourself, {name}', value: 'Conócete mejor, {name}' },
      'seo.title': { source: 'Personality guide', value: 'Guía de personalidad' },
    },
  };
  const first = await translateLocalePackage({ locale: 'fr', localesRoot, dictionary });
  assert.deepEqual(first.filesWritten, ['homepage.json']);
  const second = await translateLocalePackage({ locale: 'fr', localesRoot, dictionary });
  assert.deepEqual(second.filesWritten, []);
  const report = await validateLocalePackage({ locale: 'fr', localesRoot });
  assert.equal(report.publishReady, false);
  assert.equal(report.schemaErrors.length, 0);
  assert.equal(report.jsonErrors.length, 0);
  assert(report.missing.length > 0);
  assert.equal(report.englishResidue.length, 0);
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log('Translation pipeline checks passed: syntax contracts, protected fields, schema validation, incomplete-draft rejection, and idempotent writes.');
