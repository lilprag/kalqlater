const SAFE_LEGACY_RESPONSE_HEADERS = [
  'cache-control',
  'content-security-policy',
  'content-type',
  'location',
  'vary',
  'www-authenticate',
];

/**
 * Build headers for a legacy response whose body has passed through fetch().
 * Representation and hop-by-hop headers are intentionally omitted: fetch may
 * decode the body before Next sends it onward, making the original encoding,
 * length, entity tag, and transport metadata invalid.
 */
export function legacyResponseHeaders(upstreamHeaders) {
  const headers = new Headers();
  for (const name of SAFE_LEGACY_RESPONSE_HEADERS) {
    const value = upstreamHeaders.get(name);
    if (value) headers.set(name, value);
  }

  const cookies = typeof upstreamHeaders.getSetCookie === 'function'
    ? upstreamHeaders.getSetCookie()
    : upstreamHeaders.get('set-cookie') ? [upstreamHeaders.get('set-cookie')] : [];
  for (const cookie of cookies) headers.append('set-cookie', cookie);
  return headers;
}
