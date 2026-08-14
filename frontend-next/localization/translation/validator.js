import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { localeBootstrapFiles } from '../bootstrap.js';
import { translationLimit } from './dictionary.js';
import { validatePreservedSyntax } from './placeholder.js';

const ENGLISH_WORDS = /\b(the|and|with|your|you|for|from|this|that|about|personality|career|compare|community|jobs|insight|learn|start|continue|privacy|terms|contact)\b/gi;

function leafValues(value, currentPath = '') {
  if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [[currentPath, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => leafValues(item, `${currentPath}[${index}]`));
  return Object.entries(value || {}).flatMap(([key, item]) => leafValues(item, currentPath ? `${currentPath}.${key}` : key));
}

function compareContract(actual, expected, currentPath = '', insideFields = false) {
  if (expected === null) {
    if (actual === undefined) return [`Missing key: ${currentPath}`];
    return [];
  }
  if (!expected || typeof expected !== 'object') return actual === expected ? [] : [`Contract changed: ${currentPath}`];
  if (!actual || typeof actual !== 'object' || Array.isArray(actual)) return [`Invalid object: ${currentPath}`];
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);
  const errors = actualKeys.filter((key) => !expectedKeys.includes(key)).map((key) => `Extra key: ${currentPath ? `${currentPath}.` : ''}${key}`);
  if (actualKeys.join('\u0000') !== expectedKeys.join('\u0000')) errors.push(`Key order changed: ${currentPath || 'root'}`);
  for (const key of expectedKeys) errors.push(...compareContract(actual[key], expected[key], currentPath ? `${currentPath}.${key}` : key, insideFields || key === 'fields'));
  return errors;
}

function fieldProblems(fields, file) {
  const missing = [];
  const englishResidue = [];
  for (const [fieldPath, value] of leafValues(fields)) {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) missing.push(`${file}:fields.${fieldPath}`);
    if (typeof value === 'string') {
      for (const match of value.matchAll(ENGLISH_WORDS)) englishResidue.push(`${file}:fields.${fieldPath}:${match[0]}`);
    }
  }
  return { missing, englishResidue };
}

function countWords(fields) {
  return leafValues(fields)
    .filter(([, value]) => typeof value === 'string')
    .reduce((total, [, value]) => total + (value.trim().match(/\S+/g)?.length || 0), 0);
}

function isStandardJson(raw, parsed) {
  return raw === `${JSON.stringify(parsed, null, 2)}\n`;
}

/** Validates a draft package against the frozen bootstrap schema, fail-closed. */
export async function validateLocalePackage({ locale, localesRoot, dictionary = {} }) {
  const expectedFiles = localeBootstrapFiles(locale);
  const root = path.join(localesRoot, locale);
  const jsonErrors = [];
  const schemaErrors = [];
  const missing = [];
  const englishResidue = [];
  const placeholderErrors = [];
  let words = 0;
  let fieldCount = 0;
  const files = [];
  for (const [file, expected] of expectedFiles) {
    const absolutePath = path.join(root, file);
    let raw;
    let parsed;
    try {
      raw = await readFile(absolutePath, 'utf8');
      parsed = JSON.parse(raw);
    } catch (error) {
      jsonErrors.push(`${file}: ${error.message}`);
      continue;
    }
    files.push(file);
    if (!isStandardJson(raw, parsed)) schemaErrors.push(`Non-standard JSON formatting: ${file}`);
    schemaErrors.push(...compareContract(parsed, expected, '', false).map((error) => `${file}: ${error}`));
    if (parsed.fields) {
      fieldCount += leafValues(parsed.fields).length;
      const problems = fieldProblems(parsed.fields, file);
      missing.push(...problems.missing);
      englishResidue.push(...problems.englishResidue);
      words += countWords(parsed.fields);
    }
    for (const [fieldPath, entry] of Object.entries(dictionary[file] || {})) {
      if (!entry || typeof entry.source !== 'string' || typeof entry.value !== 'string') {
        placeholderErrors.push(`${file}:${fieldPath}: invalid dictionary entry`);
        continue;
      }
      const syntax = validatePreservedSyntax(entry.source, entry.value);
      placeholderErrors.push(...syntax.errors.map((error) => `${file}:${fieldPath}: ${error}`));
      if (entry.value.trim() === entry.source.trim()) englishResidue.push(`${file}:fields.${fieldPath}: unchanged English source`);
      if (entry.value.length > translationLimit(fieldPath)) placeholderErrors.push(`${file}:${fieldPath}: exceeds ${translationLimit(fieldPath)} characters`);
    }
  }
  const actualFiles = await readdir(root, { recursive: true });
  const actualJsonFiles = actualFiles.filter((file) => file.endsWith('.json')).sort();
  const expectedJsonFiles = [...expectedFiles.keys()].sort();
  for (const file of actualJsonFiles.filter((file) => !expectedFiles.has(file))) schemaErrors.push(`Unexpected JSON file: ${file}`);
  for (const file of expectedJsonFiles.filter((file) => !actualJsonFiles.includes(file))) schemaErrors.push(`Missing required file: ${file}`);
  const completeFields = missing.length === 0;
  const publishReady = completeFields && jsonErrors.length === 0 && schemaErrors.length === 0 && englishResidue.length === 0 && placeholderErrors.length === 0;
  return Object.freeze({
    locale,
    files: files.length,
    expectedFiles: expectedFiles.size,
    words,
    missing: Object.freeze(missing),
    englishResidue: Object.freeze(englishResidue),
    placeholderErrors: Object.freeze(placeholderErrors),
    jsonErrors: Object.freeze(jsonErrors),
    schemaErrors: Object.freeze(schemaErrors),
    completion: fieldCount === 0 ? 0 : Math.round(((fieldCount - missing.length) / fieldCount) * 100),
    publishReady,
  });
}

export function assertPublishReady(report) {
  if (!report.publishReady) throw new Error(`${report.locale} is not publishable: ${report.missing.length} missing, ${report.englishResidue.length} English residue, ${report.placeholderErrors.length} placeholder errors, ${report.schemaErrors.length} schema errors`);
  return report;
}
