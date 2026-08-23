const comparable = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function distinctJobSection(primary, candidate) {
  const left = comparable(primary); const right = comparable(candidate);
  if (!right || left === right || (right.length >= 80 && left.includes(right))) return '';
  const leftWords = new Set(left.split(' ').filter(Boolean)); const rightWords = new Set(right.split(' ').filter(Boolean));
  const union = new Set([...leftWords, ...rightWords]);
  const overlap = [...leftWords].filter((word) => rightWords.has(word)).length / Math.max(1, union.size);
  return overlap >= 0.96 ? '' : String(candidate).trim();
}
