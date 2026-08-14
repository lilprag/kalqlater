const VARIABLE = /\{[A-Za-z_][A-Za-z0-9_-]*\}/g;
const MARKDOWN_LINK = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
const HTML_TAG = /<\/?[A-Za-z][^>]*>/g;
const CODE_SPAN = /`[^`]*`/g;
const NUMBER = /\b\d+(?:[.,]\d+)?\b/g;
const MARKDOWN_STRUCTURE = /^(?:#{1,6}\s|[-+*]\s|\d+\.\s)|\*\*|__|~~|```/gm;

function matches(value, expression) {
  return Array.from(String(value || '').matchAll(expression), (match) => match[0]);
}

function linkTargets(value) {
  return Array.from(String(value || '').matchAll(MARKDOWN_LINK), (match) => match[1]);
}

function sameItems(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

/** Returns the immutable syntax tokens that authored copy must retain exactly. */
export function immutableSyntax(value) {
  return Object.freeze({
    variables: Object.freeze(matches(value, VARIABLE)),
    markdownLinks: Object.freeze(linkTargets(value)),
    htmlTags: Object.freeze(matches(value, HTML_TAG)),
    code: Object.freeze(matches(value, CODE_SPAN)),
    numbers: Object.freeze(matches(value, NUMBER)),
    markdownStructure: Object.freeze(matches(value, MARKDOWN_STRUCTURE)),
  });
}

/**
 * Native editors may rewrite wording, but variables, destinations, markup,
 * code spans, and numeric facts are product contracts rather than copy.
 */
export function validatePreservedSyntax(source, translation) {
  const expected = immutableSyntax(source);
  const received = immutableSyntax(translation);
  const errors = Object.entries(expected)
    .filter(([key, items]) => !sameItems(items, received[key]))
    .map(([key]) => `Immutable ${key} changed`);
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}

export function containsPlaceholder(value) {
  return immutableSyntax(value).variables.length > 0;
}
