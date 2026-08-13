import assert from 'node:assert/strict';
import { createEntityRegistry } from '../lib/content-entities.js';
import { createRecommendationGraph } from '../lib/recommendation-graph.js';
import { resolveRecommendations } from '../lib/recommendation-resolver.js';

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
  entity('insight:conflict'),
  entity('community:directory'),
  entity('future-entity:extension'),
  entity('insight:planned', 'approved', availability({ en: 'planned', hi: 'planned', es: 'planned' })),
  entity('insight:retired', 'deprecated', availability({ en: 'deprecated', hi: 'deprecated', es: 'deprecated' })),
], { locales, entityTypes: ['personality-guide', 'career-guide', 'compare', 'insight', 'community', 'future-entity'] });

const edge = (from, to, relationshipType, priority, weight, states = availability(), publicationState = 'published') => ({
  from, to, relationshipType, priority, weight, publicationState, availability: states,
});
const graph = createRecommendationGraph([
  edge('insight:communication', 'personality-guide:intj', 'recommended_after', 80, 70),
  edge('insight:communication', 'insight:conflict', 'continue_to', 70, 80),
  edge('personality-guide:intj', 'career-guide:intj', 'career_for', 80, 40),
  edge('personality-guide:intj', 'compare:intj-vs-entp', 'compare_with', 70, 90),
  edge('personality-guide:intj', 'insight:communication', 'expands', 60, 99),
  edge('career-guide:intj', 'personality-guide:intj', 'career_for', 90, 50),
  edge('career-guide:intj', 'compare:intj-vs-entp', 'compare_with', 80, 50),
  edge('career-guide:intj', 'insight:communication', 'expands', 70, 50),
  edge('compare:intj-vs-entp', 'personality-guide:intj', 'compare_with', 90, 40),
  edge('compare:intj-vs-entp', 'career-guide:intj', 'career_for', 80, 40),
  edge('compare:intj-vs-entp', 'insight:communication', 'expands', 70, 40),
  edge('personality-guide:intj', 'career-guide:intj', 'related_to', 99, 99),
  edge('personality-guide:intj', 'insight:planned', 'expands', 100, 100, availability({ en: 'planned', hi: 'planned', es: 'planned' }), 'approved'),
  edge('personality-guide:intj', 'insight:retired', 'expands', 90, 90, availability({ en: 'deprecated', hi: 'deprecated', es: 'deprecated' }), 'deprecated'),
  edge('personality-guide:intj', 'future-entity:extension', 'supports', 10, 10),
], { entityRegistry: registry });

const assertOutput = (result, primary, secondary) => {
  assert.equal(result.primary?.targetEntity.id || null, primary);
  assert.deepEqual(result.secondary.map((item) => item.targetEntity.id), secondary);
  assert(result.secondary.length <= 2);
};

const resultContext = resolveRecommendations({ sourceContext: 'result', sourceEntityId: 'insight:communication', locale: 'en' }, graph);
assertOutput(resultContext, 'personality-guide:intj', ['insight:conflict']);
assert.equal(resultContext.primary.reasonCode, 'result:recommended_after');

const personality = resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }, graph);
assertOutput(personality, 'career-guide:intj', ['compare:intj-vs-entp', 'insight:communication']);
assert.equal(personality.primary.relationshipType, 'career_for');
assert.equal(personality.primary.priority, 80);
assert.equal(personality.primary.weight, 40);
assert.equal(personality.primary.locale, 'en');
assert.deepEqual(personality.primary.availability, { edge: 'published', target: 'published' });

assertOutput(resolveRecommendations({ sourceContext: 'career-guide', sourceEntityId: 'career-guide:intj', locale: 'hi' }, graph), 'personality-guide:intj', ['compare:intj-vs-entp', 'insight:communication']);
assertOutput(resolveRecommendations({ sourceContext: 'compare', sourceEntityId: 'compare:intj-vs-entp', locale: 'en' }, graph), 'personality-guide:intj', ['career-guide:intj', 'insight:communication']);
assertOutput(resolveRecommendations({ sourceContext: 'insight', sourceEntityId: 'insight:communication', locale: 'en' }, graph), 'personality-guide:intj', ['insight:conflict']);

const repeat = resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }, graph);
assert.deepEqual(repeat, personality, 'ordering is stable across runs');
assert.equal(personality.secondary.filter((item) => item.targetEntity.id === 'career-guide:intj').length, 0, 'deduplication keeps only the best edge target');
assert.equal(personality.secondary.some((item) => item.targetEntity.id === 'insight:planned' || item.targetEntity.id === 'insight:retired'), false, 'unpublished and deprecated targets are filtered');
assert.equal(personality.secondary.some((item) => item.targetEntity.id === 'future-entity:extension'), false, 'lower-order future edge does not displace configured editorial targets');

assertOutput(resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'es' }, graph), null, []);
const previewResult = resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'es', mode: 'preview' }, graph);
assertOutput(previewResult, 'career-guide:intj', ['compare:intj-vs-entp', 'insight:communication']);
assert.equal(previewResult.primary.eligibility.isPreview, true);

assertOutput(resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:missing', locale: 'en' }, graph), null, []);
assertOutput(resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'fr' }, graph), null, []);
assertOutput(resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'future-entity:extension', locale: 'en' }, graph), null, []);

const futureGraph = createRecommendationGraph([
  edge('personality-guide:intj', 'future-entity:extension', 'expands', 80, 80),
], { entityRegistry: registry });
assertOutput(resolveRecommendations({ sourceContext: 'personality-guide', sourceEntityId: 'personality-guide:intj', locale: 'en' }, futureGraph), 'future-entity:extension', []);
assert.throws(() => resolveRecommendations({ sourceContext: 'unknown', sourceEntityId: 'personality-guide:intj', locale: 'en' }, graph), /Unknown recommendation source context/);
assert.throws(() => resolveRecommendations({ sourceContext: 'insight', sourceEntityId: 'insight:communication', locale: 'en', mode: 'private' }, graph), /Unknown recommendation mode/);

console.log('Recommendation resolver checks passed for contexts, availability, stable ordering, deduplication, and fail-closed eligibility.');
