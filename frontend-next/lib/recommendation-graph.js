import {
  AVAILABILITY_STATES,
  PUBLICATION_STATES,
  contentEntityRegistry,
  getEntity,
  isAvailabilityState,
  isPublicationState,
} from './content-entities.js';

/** @typedef {'related_to'|'continue_to'|'learn_before'|'learn_after'|'recommended_after'|'supports'|'expands'|'contrasts_with'|'similar_to'|'career_for'|'compare_with'} RecommendationRelationshipType */

export const RECOMMENDATION_RELATIONSHIP_TYPES = Object.freeze([
  'related_to',
  'continue_to',
  'learn_before',
  'learn_after',
  'recommended_after',
  'supports',
  'expands',
  'contrasts_with',
  'similar_to',
  'career_for',
  'compare_with',
]);

const PROHIBITED_CYCLE_TYPES = new Set(['learn_before', 'learn_after', 'continue_to', 'recommended_after']);
const RELATIONSHIP_TYPE_SET = new Set(RECOMMENDATION_RELATIONSHIP_TYPES);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeLocaleAvailability(availability, locales) {
  assert(availability && typeof availability === 'object' && !Array.isArray(availability), 'Relationship locale availability must be an object');
  const keys = Object.keys(availability).sort();
  assert(keys.length === locales.length, 'Relationship availability must explicitly define every configured locale');
  for (const locale of locales) {
    assert(Object.hasOwn(availability, locale), `Relationship availability is missing locale: ${locale}`);
    assert(isAvailabilityState(availability[locale]), `Invalid relationship availability for ${locale}: ${availability[locale]}`);
  }
  assert(keys.every((locale) => locales.includes(locale)), 'Relationship availability includes an unknown locale');
  return Object.freeze(Object.fromEntries(keys.map((locale) => [locale, availability[locale]])));
}

function assertPublicationCompatibility(source, target, publicationState, availability) {
  assert(isPublicationState(publicationState), `Invalid relationship publication state: ${publicationState}`);
  if (publicationState === 'published') {
    assert(source.publicationState === 'published' && target.publicationState === 'published', 'Published relationship requires published source and target entities');
  }
  for (const [locale, state] of Object.entries(availability)) {
    if (state === 'published') {
      assert(source.availability[locale] === 'published' && target.availability[locale] === 'published', `Published relationship conflicts with entity availability for ${locale}`);
    }
    if (state === 'preview') {
      assert(['published', 'preview'].includes(source.availability[locale]) && ['published', 'preview'].includes(target.availability[locale]), `Preview relationship conflicts with entity availability for ${locale}`);
    }
  }
}

function normalizeEdge(edge, registry) {
  assert(edge && typeof edge === 'object' && !Array.isArray(edge), 'Relationship edge must be an object');
  const source = getEntity(registry, edge.from);
  const target = getEntity(registry, edge.to);
  assert(source.id !== target.id, `Relationship edge cannot self-reference: ${source.id}`);
  assert(RELATIONSHIP_TYPE_SET.has(edge.relationshipType), `Unknown relationship type: ${edge.relationshipType}`);
  assert(Number.isInteger(edge.weight) && edge.weight >= 0 && edge.weight <= 100, `Invalid relationship weight: ${edge.weight}`);
  assert(Number.isInteger(edge.priority) && edge.priority >= 0 && edge.priority <= 100, `Invalid relationship priority: ${edge.priority}`);
  const availability = normalizeLocaleAvailability(edge.availability, registry.configuredLocales);
  assertPublicationCompatibility(source, target, edge.publicationState, availability);
  return Object.freeze({
    id: `${source.id}|${edge.relationshipType}|${target.id}`,
    from: source.id,
    to: target.id,
    relationshipType: edge.relationshipType,
    weight: edge.weight,
    priority: edge.priority,
    publicationState: edge.publicationState,
    availability,
  });
}

function assertAcyclic(edges) {
  for (const type of PROHIBITED_CYCLE_TYPES) {
    const adjacency = new Map();
    for (const edge of edges.filter((candidate) => candidate.relationshipType === type)) {
      adjacency.set(edge.from, [...(adjacency.get(edge.from) || []), edge.to]);
    }
    const visiting = new Set();
    const visited = new Set();
    const visit = (node) => {
      if (visiting.has(node)) throw new Error(`Prohibited ${type} relationship cycle detected at ${node}`);
      if (visited.has(node)) return;
      visiting.add(node);
      for (const next of adjacency.get(node) || []) visit(next);
      visiting.delete(node);
      visited.add(node);
    };
    for (const node of adjacency.keys()) visit(node);
  }
}

function indexedEdges(edges, property) {
  const map = new Map();
  for (const edge of edges) map.set(edge[property], [...(map.get(edge[property]) || []), edge]);
  return Object.freeze(Object.fromEntries([...map.entries()].map(([id, values]) => [id, Object.freeze(values)])));
}

/**
 * Builds and validates a graph. It deliberately has no traversal ranking,
 * recommendation generation, route handling, or UI behavior.
 */
export function createRecommendationGraph(edges, { entityRegistry = contentEntityRegistry } = {}) {
  assert(entityRegistry?.records && entityRegistry?.configuredLocales, 'Invalid content entity registry');
  assert(Array.isArray(edges), 'Recommendation graph edges must be an array');
  const normalized = edges.map((edge) => normalizeEdge(edge, entityRegistry));
  const ids = normalized.map((edge) => edge.id);
  assert(new Set(ids).size === ids.length, 'Recommendation graph contains duplicate edges');
  assertAcyclic(normalized);
  return Object.freeze({
    nodes: entityRegistry.records,
    edges: Object.freeze(normalized),
    incoming: indexedEdges(normalized, 'to'),
    outgoing: indexedEdges(normalized, 'from'),
    relationshipTypes: RECOMMENDATION_RELATIONSHIP_TYPES,
    availabilityStates: AVAILABILITY_STATES,
    publicationStates: PUBLICATION_STATES,
  });
}

export function getIncomingEdges(graph, entityId) {
  assert(graph?.incoming, 'Invalid recommendation graph');
  return graph.incoming[entityId] || Object.freeze([]);
}

export function getOutgoingEdges(graph, entityId) {
  assert(graph?.outgoing, 'Invalid recommendation graph');
  return graph.outgoing[entityId] || Object.freeze([]);
}

/** Domain configuration only. Population and delivery belong to later PRs. */
export const recommendationGraph = createRecommendationGraph([]);
