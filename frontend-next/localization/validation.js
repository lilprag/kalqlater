const universalTerms = new Set(['kalqlater', 'intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp', 'ai', 'api']);

/** Heuristic only: native editorial review remains the publication authority. */
export function suspiciousEnglishResidue(value, locale) {
  if (locale === 'en' || typeof value !== 'string') return [];
  const words = value.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
  return words.filter((word) => !universalTerms.has(word) && word.length > 2);
}

export function validateLocalizedBlock({ locale, id, value, status }) {
  if (!id || !value || !status) throw new Error(`${locale}: incomplete localized content block`);
  if (status === 'published' && suspiciousEnglishResidue(value, locale).length) {
    throw new Error(`${locale}/${id}: suspicious English residue in published content`);
  }
}
