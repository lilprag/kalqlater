import { localeRegistry } from './locales.js';
import { TYPE_CODES } from '../data/types.js';

/**
 * Canonical entities are configuration records, not routes or APIs. Route
 * guards and recommendation delivery are deliberately later PRs.
 */
export const ENTITY_TYPES = Object.freeze([
  'personality-guide',
  'career-guide',
  'compare',
  'insight',
  'community',
  'jobs',
  'language',
]);

export const AVAILABILITY_STATES = Object.freeze([
  'published',
  'preview',
  'planned',
  'unavailable',
  'deprecated',
]);

export const PUBLICATION_STATES = Object.freeze([
  'draft',
  'in_review',
  'approved',
  'published',
  'deprecated',
]);

const AVAILABILITY_TRANSITIONS = Object.freeze({
  planned: Object.freeze(['preview', 'unavailable', 'deprecated']),
  preview: Object.freeze(['planned', 'published', 'unavailable', 'deprecated']),
  published: Object.freeze(['preview', 'deprecated']),
  unavailable: Object.freeze(['planned', 'preview', 'deprecated']),
  deprecated: Object.freeze([]),
});

const PUBLICATION_TRANSITIONS = Object.freeze({
  draft: Object.freeze(['in_review', 'deprecated']),
  in_review: Object.freeze(['draft', 'approved', 'deprecated']),
  approved: Object.freeze(['in_review', 'published', 'deprecated']),
  published: Object.freeze(['approved', 'deprecated']),
  deprecated: Object.freeze([]),
});

const TYPE_PATTERN = /^[a-z][a-z0-9-]*$/;
const KEY_PATTERN = /^[a-z0-9][a-z0-9/-]*$/;
const ID_PATTERN = /^([a-z][a-z0-9-]*):([a-z0-9][a-z0-9/-]*)$/;
const PUBLISHED = new Set(localeRegistry.filter((locale) => locale.published).map((locale) => locale.code));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sortedUnique(values, message) {
  assert(Array.isArray(values), message);
  const normalized = values.map((value) => String(value).trim());
  assert(normalized.every(Boolean), message);
  assert(new Set(normalized).size === normalized.length, message);
  return Object.freeze([...normalized].sort());
}

export function canonicalEntityId(type, key) {
  const normalizedType = String(type || '').trim().toLowerCase();
  const normalizedKey = String(key || '').trim().toLowerCase();
  assert(TYPE_PATTERN.test(normalizedType), `Invalid entity type: ${type}`);
  assert(KEY_PATTERN.test(normalizedKey), `Invalid canonical entity key: ${key}`);
  return `${normalizedType}:${normalizedKey}`;
}

export function parseCanonicalEntityId(id) {
  const normalized = String(id || '').trim().toLowerCase();
  const match = ID_PATTERN.exec(normalized);
  if (!match) throw new Error(`Invalid canonical entity ID: ${id}`);
  return Object.freeze({ id: normalized, type: match[1], key: match[2] });
}

export function isAvailabilityState(value) { return AVAILABILITY_STATES.includes(value); }
export function isPublicationState(value) { return PUBLICATION_STATES.includes(value); }

export function canTransitionAvailability(from, to) {
  return isAvailabilityState(from) && isAvailabilityState(to) && AVAILABILITY_TRANSITIONS[from].includes(to);
}

export function canTransitionPublication(from, to) {
  return isPublicationState(from) && isPublicationState(to) && PUBLICATION_TRANSITIONS[from].includes(to);
}

export function assertAvailabilityTransition(from, to) {
  assert(canTransitionAvailability(from, to), `Invalid availability transition: ${from} -> ${to}`);
}

export function assertPublicationTransition(from, to) {
  assert(canTransitionPublication(from, to), `Invalid publication transition: ${from} -> ${to}`);
}

function normalizeLocales(locales) {
  const configuredLocales = sortedUnique(locales.map((locale) => locale.code), 'Locale registry must contain unique locale codes');
  return Object.freeze({ configuredLocales, localeSet: new Set(configuredLocales) });
}

function normalizeAvailability(locales, availability) {
  assert(availability && typeof availability === 'object' && !Array.isArray(availability), 'Entity availability must be an object');
  const keys = Object.keys(availability).sort();
  assert(keys.length === locales.configuredLocales.length, 'Entity availability must explicitly define every configured locale');
  for (const locale of locales.configuredLocales) {
    assert(Object.hasOwn(availability, locale), `Entity availability is missing locale: ${locale}`);
    assert(isAvailabilityState(availability[locale]), `Invalid availability state for ${locale}: ${availability[locale]}`);
  }
  assert(keys.every((locale) => locales.localeSet.has(locale)), 'Entity availability includes an unknown locale');
  return Object.freeze(Object.fromEntries(keys.map((locale) => [locale, availability[locale]])));
}

function deriveLocaleLists(availability) {
  const entries = Object.entries(availability);
  return Object.freeze({
    availableLocales: Object.freeze(entries.filter(([, state]) => state === 'published' || state === 'preview').map(([locale]) => locale)),
    publishedLocales: Object.freeze(entries.filter(([, state]) => state === 'published').map(([locale]) => locale)),
    previewLocales: Object.freeze(entries.filter(([, state]) => state === 'preview').map(([locale]) => locale)),
    unavailableLocales: Object.freeze(entries.filter(([, state]) => state === 'unavailable').map(([locale]) => locale)),
    plannedLocales: Object.freeze(entries.filter(([, state]) => state === 'planned').map(([locale]) => locale)),
    deprecatedLocales: Object.freeze(entries.filter(([, state]) => state === 'deprecated').map(([locale]) => locale)),
  });
}

function normalizeRecord(record, locales, entityTypes) {
  assert(record && typeof record === 'object' && !Array.isArray(record), 'Entity record must be an object');
  const parsed = parseCanonicalEntityId(record.id);
  assert(entityTypes.has(parsed.type), `Unknown entity type: ${parsed.type}`);
  assert(record.type === parsed.type, `Entity type does not match canonical ID: ${record.id}`);
  assert(record.key === parsed.key, `Entity key does not match canonical ID: ${record.id}`);
  assert(isPublicationState(record.publicationState), `Invalid publication state: ${record.publicationState}`);
  const availability = normalizeAvailability(locales, record.availability);
  const localeLists = deriveLocaleLists(availability);
  if (record.publicationState === 'published') {
    assert(localeLists.publishedLocales.length > 0, `Published entity requires a published locale: ${record.id}`);
  }
  return Object.freeze({ id: parsed.id, type: parsed.type, key: parsed.key, publicationState: record.publicationState, availability, ...localeLists });
}

export function createEntityRegistry(records, options = {}) {
  const locales = normalizeLocales(options.locales || localeRegistry);
  const entityTypes = new Set(options.entityTypes || ENTITY_TYPES);
  for (const type of entityTypes) assert(TYPE_PATTERN.test(type), `Invalid registered entity type: ${type}`);
  assert(Array.isArray(records), 'Entity registry records must be an array');
  const normalized = records.map((record) => normalizeRecord(record, locales, entityTypes));
  const ids = normalized.map((record) => record.id);
  assert(new Set(ids).size === ids.length, 'Entity registry contains duplicate canonical IDs');
  const byId = Object.freeze(Object.fromEntries(normalized.map((record) => [record.id, record])));
  return Object.freeze({ records: Object.freeze(normalized), byId, configuredLocales: locales.configuredLocales, entityTypes: Object.freeze([...entityTypes].sort()) });
}

export function getEntity(registry, id) {
  assert(registry?.byId, 'Invalid entity registry');
  const parsed = parseCanonicalEntityId(id);
  const entity = registry.byId[parsed.id];
  assert(entity, `Unknown content entity: ${parsed.id}`);
  return entity;
}

export function resolveEntityAvailability(registry, id, locale) {
  assert(registry?.configuredLocales, 'Invalid entity registry');
  const normalizedLocale = String(locale || '').trim().toLowerCase();
  assert(registry.configuredLocales.includes(normalizedLocale), `Unknown locale: ${locale}`);
  const entity = getEntity(registry, id);
  const availability = entity.availability[normalizedLocale];
  return Object.freeze({
    entity,
    locale: normalizedLocale,
    availability,
    isRenderable: availability === 'published' || availability === 'preview',
    isPublic: availability === 'published',
  });
}

function availabilityFor({ published = [], preview = [], deprecated = [] }) {
  const record = Object.fromEntries(localeRegistry.map((locale) => [locale.code, 'planned']));
  for (const locale of published) record[locale] = 'published';
  for (const locale of preview) record[locale] = 'preview';
  for (const locale of deprecated) record[locale] = 'deprecated';
  return Object.freeze(record);
}

function entity(type, key, publicationState, localeAvailability) {
  return Object.freeze({ id: canonicalEntityId(type, key), type, key, publicationState, availability: localeAvailability });
}

const publicLocales = Object.freeze([...PUBLISHED]);
const spanishPreview = Object.freeze(['es']);
const canonicalPairs = Object.freeze(TYPE_CODES.flatMap((first, index) => TYPE_CODES.slice(index + 1).map((second) => `${first.toLowerCase()}-vs-${second.toLowerCase()}`)));
const personalityEntities = TYPE_CODES.map((type) => entity('personality-guide', type.toLowerCase(), 'published', availabilityFor({ published: publicLocales, preview: spanishPreview })));
const careerEntities = TYPE_CODES.map((type) => entity('career-guide', type.toLowerCase(), 'published', availabilityFor({ published: publicLocales, preview: spanishPreview })));
const compareEntities = canonicalPairs.map((slug) => entity('compare', slug, 'published', availabilityFor({ published: publicLocales, preview: spanishPreview })));
const insightEntities = ['communication', 'conflict', 'leadership', 'learning'].map((key) => entity('insight', key, 'published', availabilityFor({ published: publicLocales })));
const platformEntities = [
  entity('community', 'directory', 'published', availabilityFor({ published: publicLocales })),
  entity('jobs', 'directory', 'published', availabilityFor({ published: publicLocales })),
  ...localeRegistry.map((locale) => entity('language', locale.code, locale.published ? 'published' : locale.code === 'es' ? 'approved' : 'draft', availabilityFor({ published: locale.published ? [locale.code] : [], preview: locale.code === 'es' ? [locale.code] : [] }))),
];

export const contentEntityRegistry = createEntityRegistry([
  ...personalityEntities,
  ...careerEntities,
  ...compareEntities,
  ...insightEntities,
  ...platformEntities,
]);
