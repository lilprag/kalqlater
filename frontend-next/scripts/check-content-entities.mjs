import assert from 'node:assert/strict';
import {
  AVAILABILITY_STATES,
  ENTITY_TYPES,
  PUBLICATION_STATES,
  assertAvailabilityTransition,
  assertPublicationTransition,
  canonicalEntityId,
  contentEntityRegistry,
  createEntityRegistry,
  getEntity,
  parseCanonicalEntityId,
  resolveEntityAvailability,
} from '../lib/content-entities.js';
import { localeRegistry } from '../lib/locales.js';

const locales = [
  { code: 'en' },
  { code: 'es' },
  { code: 'hi' },
];
const states = { en: 'published', es: 'preview', hi: 'planned' };
const record = { id: 'future-entity:example', type: 'future-entity', key: 'example', publicationState: 'published', availability: states };
const registry = createEntityRegistry([record], { locales, entityTypes: [...ENTITY_TYPES, 'future-entity'] });

assert.equal(canonicalEntityId('Personality-Guide', 'INTJ'), 'personality-guide:intj');
assert.deepEqual(parseCanonicalEntityId('COMPARE:intj-vs-enfp'), { id: 'compare:intj-vs-enfp', type: 'compare', key: 'intj-vs-enfp' });
for (const value of ['', 'type:', ':key', 'type:bad key', 'Type:Key:Other']) assert.throws(() => parseCanonicalEntityId(value), /Invalid canonical entity ID/);
assert.throws(() => getEntity(registry, 'future-entity:missing'), /Unknown content entity/);
assert.throws(() => resolveEntityAvailability(registry, 'future-entity:example', 'fr'), /Unknown locale/);
assert.throws(() => createEntityRegistry([{ ...record, availability: { en: 'published', es: 'preview' } }], { locales, entityTypes: [...ENTITY_TYPES, 'future-entity'] }), /explicitly define every configured locale/);
assert.throws(() => createEntityRegistry([{ ...record, availability: { ...states, fr: 'published' } }], { locales, entityTypes: [...ENTITY_TYPES, 'future-entity'] }), /explicitly define every configured locale/);
assert.throws(() => createEntityRegistry([{ ...record, availability: { ...states, es: 'unknown' } }], { locales, entityTypes: [...ENTITY_TYPES, 'future-entity'] }), /Invalid availability state/);
assert.throws(() => createEntityRegistry([{ ...record, id: 'unknown:example', type: 'unknown', key: 'example' }], { locales }), /Unknown entity type/);
assert.throws(() => createEntityRegistry([record, record], { locales, entityTypes: [...ENTITY_TYPES, 'future-entity'] }), /duplicate canonical IDs/);
assert.deepEqual(resolveEntityAvailability(registry, record.id, 'en').availability, 'published');
assert.equal(resolveEntityAvailability(registry, record.id, 'en').isPublic, true);
assert.equal(resolveEntityAvailability(registry, record.id, 'es').isRenderable, true);
assert.equal(resolveEntityAvailability(registry, record.id, 'hi').isRenderable, false);
assert.throws(() => assertAvailabilityTransition('published', 'planned'), /Invalid availability transition/);
assert.doesNotThrow(() => assertAvailabilityTransition('preview', 'published'));
assert.throws(() => assertPublicationTransition('draft', 'published'), /Invalid publication transition/);
assert.doesNotThrow(() => assertPublicationTransition('approved', 'published'));
assert.deepEqual(AVAILABILITY_STATES, ['published', 'preview', 'planned', 'unavailable', 'deprecated']);
assert.deepEqual(PUBLICATION_STATES, ['draft', 'in_review', 'approved', 'published', 'deprecated']);
assert.equal(contentEntityRegistry.records.length, 16 + 16 + 120 + 4 + 2 + localeRegistry.length);
assert.equal(getEntity(contentEntityRegistry, 'personality-guide:intj').publishedLocales.includes('en'), true);
assert.equal(resolveEntityAvailability(contentEntityRegistry, 'personality-guide:intj', 'es').availability, 'preview');
assert.equal(resolveEntityAvailability(contentEntityRegistry, 'insight:communication', 'es').availability, 'planned');
assert.equal(resolveEntityAvailability(contentEntityRegistry, 'language:es', 'es').availability, 'preview');

console.log(`Content entity contract checks passed for ${contentEntityRegistry.records.length} configured entities.`);
