import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createLocaleBootstrapPackage, localeBootstrapFiles, validateLocaleBootstrapPackage } from '../localization/bootstrap.js';

const packageData = createLocaleBootstrapPackage('de');
const files = localeBootstrapFiles('de');
assert.equal(packageData.pages.length, 167, 'Locale skeleton must include every Spanish-reference page family');
assert.equal(files.size, 169, 'manifest and validation files must be present');
assert.equal(packageData.validation.personalityGuides, 16);
assert.equal(packageData.validation.careerGuides, 16);
assert.equal(packageData.validation.compareGuides, 120);
assert.equal(files.get('compare/intj-vs-intp.json').route, '/de/compare/intj-vs-intp');
assert.equal(files.get('personality/intj.json').route, '/de/personality/intj');
assert.equal(files.get('career/intj.json').route, '/de/personality/intj/careers');
assert.equal(files.get('manifest.json').publication.sitemap, false, 'draft locales must not enter sitemap');
assert.equal(validateLocaleBootstrapPackage(packageData).validStructure, true);
assert.equal(validateLocaleBootstrapPackage(packageData).publishable, false, 'empty placeholders must fail closed');
assert(validateLocaleBootstrapPackage(packageData).missing.length > 0, 'missing native copy must be detected');
assert.throws(() => createLocaleBootstrapPackage('en'), /new locale/);
assert.throws(() => createLocaleBootstrapPackage('unknown'), /Unknown configured locale/);

const temporary = await mkdtemp(path.join(os.tmpdir(), 'kalqlater-locale-bootstrap-'));
const script = new URL('./bootstrap-locale.mjs', import.meta.url).pathname;
const first = spawnSync(process.execPath, [script, 'de', temporary], { encoding: 'utf8' });
assert.equal(first.status, 0, first.stderr);
assert.match(first.stdout, /169 created, 0 preserved/);
const manifestPath = path.join(temporary, 'de', 'manifest.json');
const before = await readFile(manifestPath, 'utf8');
await writeFile(manifestPath, `${before.replace('"draft"', '"human-authored"')}\n`);
const second = spawnSync(process.execPath, [script, 'de', temporary], { encoding: 'utf8' });
assert.equal(second.status, 0, second.stderr);
assert.match(second.stdout, /0 created, 169 preserved/);
assert.match(await readFile(manifestPath, 'utf8'), /human-authored/, 'repeat generation must never overwrite authored files');

console.log('Language Bootstrap Factory checks passed for Spanish-reference structure, routes, draft validation, missing-content detection, and idempotent generation.');
