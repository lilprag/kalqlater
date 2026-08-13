import { recommendationGraph } from './recommendation-graph.js';

export const RECOMMENDATION_SOURCE_CONTEXTS = Object.freeze([
  'result',
  'personality-guide',
  'career-guide',
  'compare',
  'insight',
]);

const CONTEXT_RELATIONSHIP_ORDER = Object.freeze({
  result: Object.freeze(['recommended_after', 'continue_to', 'related_to', 'expands']),
  'personality-guide': Object.freeze(['career_for', 'compare_with', 'expands', 'related_to', 'supports']),
  'career-guide': Object.freeze(['career_for', 'compare_with', 'expands', 'related_to', 'supports']),
  compare: Object.freeze(['compare_with', 'career_for', 'expands', 'related_to', 'contrasts_with']),
  insight: Object.freeze(['recommended_after', 'continue_to', 'expands', 'related_to', 'supports']),
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nodeById(graph, id) {
  return graph.nodes.find((node) => node.id === id) || null;
}

function availabilityAllows(state, mode) {
  return mode === 'preview' ? state === 'published' || state === 'preview' : state === 'published';
}

function publicationAllows(state, mode) {
  return mode === 'preview' ? state === 'approved' || state === 'published' : state === 'published';
}

function candidateFor({ edge, target, locale, sourceContext, mode }) {
  const edgeAvailability = edge.availability[locale];
  const targetAvailability = target.availability[locale];
  if (!availabilityAllows(edgeAvailability, mode) || !availabilityAllows(targetAvailability, mode)) return null;
  if (!publicationAllows(edge.publicationState, mode) || !publicationAllows(target.publicationState, mode)) return null;
  if (target.private === true || targetAvailability === 'deprecated' || targetAvailability === 'unavailable') return null;
  return Object.freeze({
    targetEntity: Object.freeze({ id: target.id, type: target.type, key: target.key }),
    relationshipType: edge.relationshipType,
    priority: edge.priority,
    weight: edge.weight,
    reasonCode: `${sourceContext}:${edge.relationshipType}`,
    locale,
    availability: Object.freeze({ edge: edgeAvailability, target: targetAvailability }),
    publication: Object.freeze({ edge: edge.publicationState, target: target.publicationState }),
    eligibility: Object.freeze({ mode, isPublic: mode === 'public', isPreview: mode === 'preview' }),
  });
}

function compareCandidates(sourceContext, left, right) {
  const order = CONTEXT_RELATIONSHIP_ORDER[sourceContext];
  const leftRelationshipIndex = order.indexOf(left.relationshipType);
  const rightRelationshipIndex = order.indexOf(right.relationshipType);
  if (leftRelationshipIndex !== rightRelationshipIndex) return leftRelationshipIndex - rightRelationshipIndex;
  if (left.priority !== right.priority) return right.priority - left.priority;
  if (left.weight !== right.weight) return right.weight - left.weight;
  return left.targetEntity.id.localeCompare(right.targetEntity.id);
}

/**
 * Resolves at most one primary and two secondary graph targets. It does not
 * produce copy, assign scores, infer preferences, or persist any state.
 */
export function resolveRecommendations({ sourceContext, sourceEntityId, locale, mode = 'public' }, graph = recommendationGraph) {
  assert(RECOMMENDATION_SOURCE_CONTEXTS.includes(sourceContext), `Unknown recommendation source context: ${sourceContext}`);
  assert(mode === 'public' || mode === 'preview', `Unknown recommendation mode: ${mode}`);
  assert(typeof locale === 'string' && locale.length > 0, 'Recommendation locale is required');
  assert(graph?.nodes && graph?.edges && graph?.outgoing, 'Invalid recommendation graph');

  const source = nodeById(graph, sourceEntityId);
  if (!source || !availabilityAllows(source.availability[locale], mode) || !publicationAllows(source.publicationState, mode)) {
    return Object.freeze({ primary: null, secondary: Object.freeze([]) });
  }

  const permittedRelationships = new Set(CONTEXT_RELATIONSHIP_ORDER[sourceContext]);
  const candidates = [];
  for (const edge of graph.outgoing[sourceEntityId] || []) {
    if (!permittedRelationships.has(edge.relationshipType) || edge.to === sourceEntityId) continue;
    const target = nodeById(graph, edge.to);
    if (!target) continue;
    const candidate = candidateFor({ edge, target, locale, sourceContext, mode });
    if (!candidate) continue;
    candidates.push(candidate);
  }
  candidates.sort((left, right) => compareCandidates(sourceContext, left, right));
  const targets = new Set();
  const deduplicated = candidates.filter((candidate) => {
    if (targets.has(candidate.targetEntity.id)) return false;
    targets.add(candidate.targetEntity.id);
    return true;
  });
  return Object.freeze({
    primary: deduplicated[0] || null,
    secondary: Object.freeze(deduplicated.slice(1, 3)),
  });
}
