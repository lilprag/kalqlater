const AUTH_TOKEN_KEY = 'kalqlater_auth_token';
const CSRF_COOKIE = 'kalqlater_csrf';
const LOCALES = new Set(['en', 'hi', 'fr', 'ja']);
const SAFE_QUERY_KEYS = new Set(['apply', 'save', 'claim']);

export function authBackendUrl(value = process.env.NEXT_PUBLIC_BACKEND_URL) {
  const configured = String(value || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:8000';
  throw new Error('NEXT_PUBLIC_BACKEND_URL is required for authentication outside development.');
}

export function safeReturnTarget(value, locale = 'en', fallback = `/${locale}/dashboard`) {
  if (!LOCALES.has(locale) || typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || [...value].some((character) => character === '\\' || character.charCodeAt(0) < 32)) return fallback;
  let parsed;
  try { parsed = new URL(value, 'https://kalqlater.com'); } catch { return fallback; }
  if (parsed.origin !== 'https://kalqlater.com') return fallback;
  const parts = parsed.pathname.split('/').filter(Boolean);
  const localized = LOCALES.has(parts[0]) && parts[0] === locale;
  const currentAllowed = localized && ['dashboard', 'jobs', 'insights', 'community'].includes(parts[1]);
  const legacyCommunity = parts[0] === 'community' && ['member', 'connections', 'me', 'profile'].includes(parts[1]);
  if (!currentAllowed && !legacyCommunity) return fallback;
  const safeQuery = new URLSearchParams();
  for (const [key, item] of parsed.searchParams) if (SAFE_QUERY_KEYS.has(key) && item === '1') safeQuery.set(key, item);
  return `${parsed.pathname}${safeQuery.size ? `?${safeQuery}` : ''}`;
}

export function insightClaimContinuation(locale, analyzer, resultId) {
  if (!LOCALES.has(locale) || !['communication', 'conflict', 'leadership', 'learning'].includes(analyzer) || !/^[a-zA-Z0-9-]{8,128}$/.test(resultId || '')) return null;
  return `/${locale}/insights/${analyzer}/result/${resultId}?claim=1`;
}

export function personalityClaimContinuation() {
  // The current localized personality result has no durable backend identifier.
  // Returning null prevents an auth flow from implying ownership that does not exist.
  return null;
}

export function csrfToken(documentRef = typeof document === 'undefined' ? null : document) {
  const stored = typeof window === 'undefined' ? '' : window.sessionStorage.getItem(CSRF_COOKIE) || '';
  if (stored) return stored;
  const match = documentRef?.cookie?.split('; ').find((item) => item.startsWith(`${CSRF_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(CSRF_COOKIE.length + 1)) : '';
}

export function authHeaders({ mutation = false } = {}) {
  const token = typeof window === 'undefined' ? '' : window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(mutation && csrfToken() ? { 'X-CSRF-Token': csrfToken() } : {}) };
}

export async function authRequest(path, options = {}) {
  return fetch(`${authBackendUrl()}/api/auth${path}`, { ...options, credentials: 'include', headers: { ...authHeaders({ mutation: !['GET', 'HEAD'].includes(options.method || 'GET') }), ...(options.headers || {}) } });
}

export function persistCompatibilityToken(token, csrf = '') {
  if (typeof window !== 'undefined' && token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (typeof window !== 'undefined' && csrf) window.sessionStorage.setItem(CSRF_COOKIE, csrf);
}

export function persistCsrf(csrf = '') {
  if (typeof window !== 'undefined' && csrf) window.sessionStorage.setItem(CSRF_COOKIE, csrf);
}

export function clearCompatibilityToken() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(AUTH_TOKEN_KEY);
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(CSRF_COOKIE);
}
