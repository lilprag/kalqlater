import assert from 'node:assert/strict';
import { createEntityRegistry } from '../lib/content-entities.js';
import {
  RECOMMENDATION_RELATIONSHIP_TYPES,
  createRecommendationGraph,
  getIncomingEdges,
  getOutgoingEdges,
  recommendationGraph,
} from '../lib/recommendation-graph.js';

const locales = [{ code: 'en' }, { code: 'es' }, { code: 'hi' }];
const entity = (id, publicationState, availability) => {
  const [type, key] = id.split(':');
  return { id, type, key, publicationState, availability };
};
const registry = createEntityRegistry([
  entity('future-entity:source', 'published', { en: 'published', es: 'preview', hi: 'published' }),
  entity('future-entity:target', 'published', { en: 'published', es: 'preview', hi: 'published' }),
  entity('future-entity:planned', 'approved', { en: 'planned', es: 'planned', hi: 'planned' }),
], { locales, entityTypes: ['future-entity'] });
const edge = {
  from: 'future-entity:source', to: 'future-entity:target', relationshipType: 'continue_to',
  weight: 60, priority: 20, publicationState: 'published', availability: { en: 'published', es: 'preview', hi: 'published' },
};

const graph = createRecommendationGraph([edge], { entityRegistry: registry });
assert.equal(graph.nodes.length, 3, 'all registry entities are graph nodes');
assert.equal(graph.edges.length, 1);
assert.equal(getOutgoingEdges(graph, 'future-entity:source').length, 1);
assert.equal(getIncomingEdges(graph, 'future-entity:target').length, 1);
assert.equal(getIncomingEdges(graph, 'future-entity:source').length, 0);
assert(RECOMMENDATION_RELATIONSHIP_TYPES.includes('career_for'));
assert(RECOMMENDATION_RELATIONSHIP_TYPES.includes('compare_with'));
assert.equal(recommendationGraph.edges.length, 0, 'production graph intentionally has no recommendation delivery configuration yet');

assert.throws(() => createRecommendationGraph([{ ...edge, to: 'future-entity:source' }], { entityRegistry: registry }), /self-reference/);
assert.throws(() => createRecommendationGraph([{ ...edge, to: 'future-entity:unknown' }], { entityRegistry: registry }), /Unknown content entity/);
assert.throws(() => createRecommendationGraph([{ ...edge, relationshipType: 'invented' }], { entityRegistry: registry }), /Unknown relationship type/);
assert.throws(() => createRecommendationGraph([{ ...edge, weight: -1 }], { entityRegistry: registry }), /Invalid relationship weight/);
assert.throws(() => createRecommendationGraph([{ ...edge, priority: 101 }], { entityRegistry: registry }), /Invalid relationship priority/);
assert.throws(() => createRecommendationGraph([{ ...edge, availability: { en: 'published', es: 'preview' } }], { entityRegistry: registry }), /explicitly define every configured locale/);
assert.throws(() => createRecommendationGraph([{ ...edge, availability: { en: 'published', es: 'preview', hi: 'bogus' } }], { entityRegistry: registry }), /Invalid relationship availability/);
assert.throws(() => createRecommendationGraph([{ ...edge, availability: { en: 'published', es: 'published', hi: 'published' } }], { entityRegistry: registry }), /conflicts/);
assert.throws(() => createRecommendationGraph([{ ...edge, publicationState: 'published', to: 'future-entity:planned', availability: { en: 'published', es: 'planned', hi: 'published' } }], { entityRegistry: registry }), /Published relationship requires/);
assert.throws(() => createRecommendationGraph([edge, edge], { entityRegistry: registry }), /duplicate edges/);
assert.throws(() => createRecommendationGraph([
  edge,
  { ...edge, from: 'future-entity:target', to: 'future-entity:source' },
], { entityRegistry: registry }), /Prohibited continue_to relationship cycle/);

const allowedCycle = createRecommendationGraph([
  { ...edge, relationshipType: 'related_to' },
  { ...edge, from: 'future-entity:target', to: 'future-entity:source', relationshipType: 'related_to' },
], { entityRegistry: registry });
assert.equal(allowedCycle.edges.length, 2, 'non-directional relationships may be cyclic');

console.log('Recommendation graph checks passed for nodes, typed edges, availability, publication, and prohibited cycles.');
