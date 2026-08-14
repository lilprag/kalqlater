import { recommendationGraph } from './recommendation-graph.js';
import { RECOMMENDATION_SOURCE_CONTEXTS, resolveRecommendations } from './recommendation-resolver.js';

const SOURCE_ENTITY_TYPES = Object.freeze({
  result: null,
  'personality-guide': 'personality-guide',
  'career-guide': 'career-guide',
  compare: 'compare',
  insight: 'insight',
});

const ENTITY_PRESENTATION = Object.freeze({
  'personality-guide': Object.freeze({ path: (locale, key) => `/${locale}/personality/${key}` }),
  'career-guide': Object.freeze({ path: (locale, key) => `/${locale}/personality/${key}/careers` }),
  compare: Object.freeze({ path: (locale, key) => `/${locale}/compare/${key}` }),
  insight: Object.freeze({ path: (locale, key) => `/${locale}/insights/${key}` }),
  community: Object.freeze({ path: (locale) => `/${locale}/community` }),
  jobs: Object.freeze({ path: (locale) => `/${locale}/jobs` }),
  language: Object.freeze({ path: (locale) => `/${locale}` }),
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nodeById(graph, entityId) {
  return graph.nodes.find((node) => node.id === entityId) || null;
}

function validRequest(request, graph) {
  assert(request && typeof request === 'object' && !Array.isArray(request), 'Recommendation request must be an object');
  assert(RECOMMENDATION_SOURCE_CONTEXTS.includes(request.sourceType), `Unknown recommendation source type: ${request.sourceType}`);
  assert(request.mode === undefined || request.mode === 'public' || request.mode === 'preview', `Unknown recommendation mode: ${request.mode}`);
  assert(typeof request.locale === 'string' && graph.nodes.some((node) => Object.hasOwn(node.availability, request.locale)), `Unknown recommendation locale: ${request.locale}`);
  assert(typeof request.sourceEntityId === 'string' && request.sourceEntityId.length > 0, 'Recommendation source entity ID is required');
}

function presentationFor(candidate, presentation) {
  const target = candidate.targetEntity;
  const config = presentation[target.type];
  if (!config) return null;
  return Object.freeze({
    entityId: target.id,
    entityType: target.type,
    slug: target.key,
    path: config.path(candidate.locale, target.key),
    // Canonical key is intentionally used here; authored localized titles
    // belong to a later presentation consumer, not this internal API.
    title: target.key,
    relationshipType: candidate.relationshipType,
    reasonCode: candidate.reasonCode,
    priority: candidate.priority,
    weight: candidate.weight,
    availability: candidate.availability.target,
    locale: candidate.locale,
    eligibility: candidate.eligibility,
  });
}

function emptyResponse(request) {
  return Object.freeze({
    primary: null,
    secondary: Object.freeze([]),
    metadata: Object.freeze({
      sourceEntityId: request.sourceEntityId,
      sourceType: request.sourceType,
      locale: request.locale,
      mode: request.mode || 'public',
      resultCount: 0,
    }),
  });
}

/**
 * Internal application service. It adapts PR-005 domain candidates into safe
 * presentation metadata and caches immutable responses by explicit request.
 */
export function createRecommendationService({ graph = recommendationGraph, presentation = ENTITY_PRESENTATION } = {}) {
  assert(graph?.nodes && graph?.edges && graph?.outgoing, 'Invalid recommendation graph');
  const cache = new Map();
  return Object.freeze({
    get(request) {
      validRequest(request, graph);
      const mode = request.mode || 'public';
      const key = `${request.sourceType}|${request.sourceEntityId}|${request.locale}|${mode}`;
      if (cache.has(key)) return cache.get(key);

      const source = nodeById(graph, request.sourceEntityId);
      if (!source || (SOURCE_ENTITY_TYPES[request.sourceType] && source.type !== SOURCE_ENTITY_TYPES[request.sourceType])) {
        const response = emptyResponse({ ...request, mode });
        cache.set(key, response);
        return response;
      }
      const resolved = resolveRecommendations({
        sourceContext: request.sourceType,
        sourceEntityId: request.sourceEntityId,
        locale: request.locale,
        mode,
      }, graph);
      const candidates = [resolved.primary, ...resolved.secondary].filter(Boolean).map((candidate) => presentationFor(candidate, presentation)).filter(Boolean);
      const response = Object.freeze({
        primary: candidates[0] || null,
        secondary: Object.freeze(candidates.slice(1, 3)),
        metadata: Object.freeze({
          sourceEntityId: request.sourceEntityId,
          sourceType: request.sourceType,
          locale: request.locale,
          mode,
          resultCount: candidates.length,
        }),
      });
      cache.set(key, response);
      return response;
    },
  });
}

export const recommendationService = createRecommendationService();
