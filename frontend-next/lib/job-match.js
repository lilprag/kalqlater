export function jobMatchPresentation(match) {
  if (!match) return null;
  if (match.status === 'insufficient_profile' || !Number.isFinite(match.overall_score)) {
    return { kind: 'incomplete', label: 'Complete profile for match' };
  }
  return {
    kind: 'score',
    score: Math.max(0, Math.min(100, Math.round(match.overall_score))),
    label: 'profile match',
    evidence: Array.isArray(match.matched) ? match.matched.filter(Boolean).slice(0, 3).join(' · ') : '',
  };
}
