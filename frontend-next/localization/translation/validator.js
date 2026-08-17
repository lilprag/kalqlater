import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { localeBootstrapFiles } from '../bootstrap.js';
import { translationLimit } from './dictionary.js';
import { validatePreservedSyntax } from './placeholder.js';

const ENGLISH_WORDS = /\b(the|and|with|your|you|for|from|this|that|about|personality|career|compare|community|jobs|insight|learn|start|continue|privacy|terms|contact)\b/gi;
const LOCALE_COGNATES = Object.freeze({ fr: new Set(['contact']) });

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
  if (currentPath === 'fields' && actual.editorial !== undefined && actual.__structuredCompare === true) {
    const editorial = actual.editorial;
    const valid = editorial && Array.isArray(editorial.sections) && editorial.sections.length === 17 && editorial.sections.every((section) => typeof section?.id === 'string' && typeof section?.title === 'string' && typeof section?.body === 'string') && Array.isArray(editorial.faqs) && editorial.faqs.length >= 4 && editorial.faqs.length <= 6 && editorial.faqs.every((faq) => typeof faq?.question === 'string' && typeof faq?.answer === 'string') && Array.isArray(editorial.relatedLinks) && editorial.relatedLinks.length === 6 && editorial.relatedLinks.every((link) => typeof link?.label === 'string' && typeof link?.href === 'string');
    if (!valid) return [`Invalid structured editorial content: ${currentPath}.editorial`];
    actual = { ...actual };
    delete actual.editorial;
    delete actual.__structuredCompare;
  }
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);
  const errors = actualKeys.filter((key) => !expectedKeys.includes(key)).map((key) => `Extra key: ${currentPath ? `${currentPath}.` : ''}${key}`);
  if (actualKeys.join('\u0000') !== expectedKeys.join('\u0000')) errors.push(`Key order changed: ${currentPath || 'root'}`);
  for (const key of expectedKeys) errors.push(...compareContract(actual[key], expected[key], currentPath ? `${currentPath}.${key}` : key, insideFields || key === 'fields'));
  return errors;
}

function structuredCompare(page, locale) {
  const editorial = page?.fields?.editorial;
  if (!String(page?.id || '').startsWith('compare:') || !editorial) return null;
  const valid = Array.isArray(editorial.sections) && editorial.sections.length === 17 && new Set(editorial.sections.map((item) => item?.id)).size === 17 && editorial.sections.every((item) => typeof item?.id === 'string' && typeof item?.title === 'string' && item.title.trim() && typeof item?.body === 'string' && item.body.trim()) && Array.isArray(editorial.faqs) && editorial.faqs.length >= 4 && editorial.faqs.length <= 6 && new Set(editorial.faqs.map((item) => item?.question)).size === editorial.faqs.length && editorial.faqs.every((item) => typeof item?.question === 'string' && item.question.trim() && typeof item?.answer === 'string' && item.answer.trim()) && Array.isArray(editorial.relatedLinks) && editorial.relatedLinks.length === 6 && editorial.relatedLinks.every((item) => typeof item?.label === 'string' && item.label.trim() && new RegExp(`^/${locale}/(?:personality/[a-z]{4}(?:/careers)?|insights/(?:communication|conflict|leadership|learning))$`).test(item?.href || '') && !item.href.endsWith('/start'));
  return valid ? editorial : null;
}

function fieldProblems(fields, file, locale, structured = false) {
  const missing = [];
  const englishResidue = [];
  for (const [fieldPath, value] of leafValues(fields)) {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) missing.push(`${file}:fields.${fieldPath}`);
    if (typeof value === 'string' && !(structured && /^editorial\.relatedLinks\[\d+\]\.href$/.test(fieldPath))) {
      for (const match of value.matchAll(ENGLISH_WORDS)) {
        if (!LOCALE_COGNATES[locale]?.has(match[0].toLowerCase())) englishResidue.push(`${file}:fields.${fieldPath}:${match[0]}`);
      }
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
export async function validateLocalePackage({ locale, localesRoot, dictionary = {}, requiredPageIds = null }) {
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
    const editorial = structuredCompare(parsed, locale);
    const contractActual = editorial ? { ...parsed, fields: { ...parsed.fields, __structuredCompare: true } } : parsed;
    schemaErrors.push(...compareContract(contractActual, expected, '', false).map((error) => `${file}: ${error}`));
    if (parsed.fields && (!requiredPageIds || requiredPageIds.includes(parsed.id))) {
      fieldCount += leafValues(parsed.fields).length;
      const problems = fieldProblems(parsed.fields, file, locale, Boolean(editorial));
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
