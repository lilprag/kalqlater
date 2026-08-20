import { getRelationshipIntelligence } from '../data/comparison';
import { TYPE_ORDER, typeFromSlug, typeSlug } from './personality';

export function canonicalPair(first, second) {
  const left = String(first || '').trim().toUpperCase();
  const right = String(second || '').trim().toUpperCase();
  if (!TYPE_ORDER.includes(left) || !TYPE_ORDER.includes(right) || left === right) return null;
  return [left, right].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
}
export function pairSlug(first, second) { const pair = canonicalPair(first, second); return pair ? `${typeSlug(pair[0])}-vs-${typeSlug(pair[1])}` : null; }
export function parsePair(value) {
  const match = /^([a-z]{4})-vs-([a-z]{4})$/i.exec(value || '');
  if (!match) return null;
  const first = typeFromSlug(match[1]); const second = typeFromSlug(match[2]);
  const canonical = canonicalPair(first, second);
  return canonical ? { first, second, canonical, slug: pairSlug(first, second), isCanonical: value.toLowerCase() === pairSlug(first, second) } : null;
}
export function allPairs() { return TYPE_ORDER.flatMap((first, index) => TYPE_ORDER.slice(index + 1).map((second) => ({ first, second, slug: pairSlug(first, second) }))); }
export function comparisonProfile(first, second, locale) { return getRelationshipIntelligence(first, second, locale); }
