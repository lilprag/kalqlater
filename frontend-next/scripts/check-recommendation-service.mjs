import assert from 'node:assert/strict';
import { createEntityRegistry } from '../lib/content-entities.js';
import { createRecommendationGraph } from '../lib/recommendation-graph.js';
import { createRecommendationService, recommendationService } from '../lib/recommendation-service.js';

const locales = [{ code: 'en' }, { code: 'hi' }, { code: 'es' }];
const availability = ({ en = 'published', hi = 'published', es = 'preview' } = {}) => ({ en, hi, es });
const entity = (id, publicationState = 'published', states = availability()) => {
  const [type, key] = id.split(':');
  return { id, type, key, publicationState, availability: states };
};
const registry = createEntityRegistry([
  entity('personality-guide:intj'),
  entity('career-guide:intj'),
  entity('compare:intj-vs-entp'),
  entity('insight:communication'),
  entity('insight:planned', 'approved', availability({ en: 'planned', hi: 'planned', es: 'planned' })),
  entity('insight:retired', 'deprecated', availability({ en: 'deprecated', hi: 'deprecated', es: 'deprecated' })),
  entity('future-entity:extension'),
], { locales, entityTypes: ['personality-guide', 'career-guide', 'compare', 'insight', 'future-entity'] });
const edge = (from, to, relationshipType, priority, weight, states = availability(), publicationState = 'published') => ({
  from, to, relationshipType, priority, weight, publicationState, availability: states,
});
const graph = createRecommendationGraph([
  edge('personality-guide:intj', 'career-guide:intj', 'career_for', 90, 50),
  edge('personality-guide:intj', 'compare:intj-vs-entp', 'compare_with', 80, 50),
  edge('personality-guide:intj', 'insight:communication', 'expands', 70, 50),
  edge('personality-guide:intj', 'career-guide:intj', 'related_to', 99, 99),
  edge('personality-guide:intj', 'insight:planned', 'expands', 100, 100, availability({ en: 'planned', hi: 'planned', es: 'planned' }), 'approved'),
  edge('personality-guide:intj', 'insight:retired', 'expands', 90, 90, availability({ en: 'deprecated', hi: 'deprecated', es: 'deprecated' }), 'deprecated'),
  edge('personality-guide:intj', 'future-entity:extension', 'supports', 60, 60),
], { entityRegistry: registry });
const service = createRecommendationService({ graph });

const publicResponse = service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' });
assert.equal(publicResponse.primary.entityId, 'career-guide:intj');
assert.equal(publicResponse.primary.entityType, 'career-guide');
assert.equal(publicResponse.primary.slug, 'intj');
assert.equal(publicResponse.primary.path, '/en/personality/intj/careers');
assert.equal(publicResponse.primary.title, 'intj');
assert.equal(publicResponse.primary.relationshipType, 'career_for');
assert.equal(publicResponse.primary.reasonCode, 'personality-guide:career_for');
assert.equal(publicResponse.primary.availability, 'published');
assert.deepEqual(publicResponse.secondary.map((item) => item.entityId), ['compare:intj-vs-entp', 'insight:communication']);
assert.equal(publicResponse.metadata.resultCount, 3);
assert.strictEqual(service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }), publicResponse, 'cache returns the immutable stable response');
assert.equal(Object.isFrozen(publicResponse), true);

const previewResponse = service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'es', mode: 'preview' });
assert.equal(previewResponse.primary.availability, 'preview');
assert.equal(previewResponse.primary.path, '/es/personality/intj/careers');
assert.equal(service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'es' }).primary, null, 'public mode never exposes preview targets');
assert.equal(publicResponse.secondary.some((item) => item.entityId === 'insight:planned' || item.entityId === 'insight:retired'), false, 'publication and availability filtering is preserved');
assert.equal(publicResponse.secondary.filter((item) => item.entityId === 'career-guide:intj').length, 0, 'resolver deduplication is preserved');

assert.equal(service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:missing', locale: 'en' }).primary, null, 'missing entity fails closed');
assert.equal(service.get({ sourceType: 'career-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }).primary, null, 'source type mismatch fails closed');
assert.throws(() => service.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'fr' }), /Unknown recommendation locale/);
assert.throws(() => service.get({ sourceType: 'unknown', sourceEntityId: 'personality-guide:intj', locale: 'en' }), /Unknown recommendation source type/);
assert.equal(recommendationService.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }).primary.entityId, 'career-guide:intj', 'production graph exposes the approved Personality-to-Career relationship');

const futureGraph = createRecommendationGraph([
  edge('personality-guide:intj', 'future-entity:extension', 'expands', 80, 80),
], { entityRegistry: registry });
const futureResponse = createRecommendationService({ graph: futureGraph }).get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' });
assert.equal(futureResponse.primary, null, 'unknown presentation configuration fails closed');
const futureService = createRecommendationService({
  graph: futureGraph,
  presentation: { 'future-entity': { path: (locale, key) => `/${locale}/future/${key}` } },
});
assert.equal(futureService.get({ sourceType: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }).primary.path, '/en/future/extension', 'future entity presentation configuration is supported');

console.log('Recommendation service checks passed for valid responses, modes, caching, presentation safety, and fail-closed behavior.');
