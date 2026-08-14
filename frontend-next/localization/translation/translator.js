import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { localeBootstrapFiles } from '../bootstrap.js';
import { translationLimit } from './dictionary.js';
import { validatePreservedSyntax } from './placeholder.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isSafeValue(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0 && value.every(isSafeValue);
  if (value && typeof value === 'object') return Object.values(value).length > 0 && Object.values(value).every(isSafeValue);
  return false;
}

function setField(fields, fieldPath, entry, file) {
  assert(entry && typeof entry === 'object' && !Array.isArray(entry), `Invalid translation entry for ${file}:${fieldPath}`);
  assert(typeof entry.source === 'string', `Missing English source for ${file}:${fieldPath}`);
  assert(isSafeValue(entry.value), `Empty translation value for ${file}:${fieldPath}`);
  assert(typeof entry.value !== 'string' || entry.value.trim() !== entry.source.trim(), `English source copied without localization for ${file}:${fieldPath}`);
  if (typeof entry.value === 'string') assert(entry.value.length <= translationLimit(fieldPath), `Translation exceeds ${translationLimit(fieldPath)} characters for ${file}:${fieldPath}`);
  const syntax = validatePreservedSyntax(entry.source, typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value));
  assert(syntax.valid, `${file}:${fieldPath} ${syntax.errors.join('; ')}`);

  const keys = fieldPath.split('.').filter(Boolean);
  assert(keys.length > 0 && !keys.some((key) => ['id', 'route', 'status', 'manifest', 'publication'].includes(key)), `Protected field path: ${file}:${fieldPath}`);
  let target = fields;
  for (const key of keys.slice(0, -1)) {
    assert(target && typeof target === 'object' && !Array.isArray(target) && Object.hasOwn(target, key), `Unknown translation field: ${file}:${fieldPath}`);
    target = target[key];
  }
  const last = keys.at(-1);
  assert(target && typeof target === 'object' && Object.hasOwn(target, last), `Unknown translation field: ${file}:${fieldPath}`);
  target[last] = clone(entry.value);
}

export function applyTranslationDictionary(record, entries, file) {
  const next = clone(record);
  assert(next?.fields && typeof next.fields === 'object', `No translatable fields in ${file}`);
  for (const [fieldPath, entry] of Object.entries(entries || {})) setField(next.fields, fieldPath, entry, file);
  return next;
}

function standardJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/** Applies only reviewed dictionary values. It never generates copy. */
export async function translateLocalePackage({ locale, localesRoot, dictionary = {} }) {
  const expectedFiles = localeBootstrapFiles(locale);
  const writes = [];
  for (const [file] of expectedFiles) {
    const entries = dictionary[file];
    if (!entries || Object.keys(entries).length === 0) continue;
    assert(file !== 'manifest.json' && file !== 'validation.json', `Translations are allowed only in page fields: ${file}`);
    const absolutePath = path.join(localesRoot, locale, file);
    const raw = await readFile(absolutePath, 'utf8');
    const translated = applyTranslationDictionary(JSON.parse(raw), entries, file);
    const output = standardJson(translated);
    if (output !== raw) {
      await writeFile(absolutePath, output, 'utf8');
      writes.push(file);
    }
  }
  for (const file of Object.keys(dictionary)) assert(expectedFiles.has(file), `Unknown locale package file: ${file}`);
  return Object.freeze({ locale, filesWritten: Object.freeze(writes) });
}
