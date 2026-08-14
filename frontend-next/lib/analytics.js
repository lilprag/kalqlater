import { localeConfig } from './locales.js';
import { TYPE_CODES } from '../data/types.js';

/** @typedef {'page_view'|'assessment_started'|'assessment_completed'|'guide_view'|'career_view'|'compare_view'|'insight_view'|'journey_continue'|'language_changed'|'bookmark_created'} AnalyticsEventName */

const TYPE_SET = new Set(TYPE_CODES.map((type) => type.toLowerCase()));
const INSIGHT_SET = new Set(['communication', 'conflict', 'leadership', 'learning']);
const RECOMMENDATION_ENTITY_TYPE_SET = new Set(['personality-guide', 'career-guide', 'compare', 'insight', 'community', 'jobs', 'language']);
const RECOMMENDATION_RELATIONSHIP_SET = new Set(['related_to', 'continue_to', 'learn_before', 'learn_after', 'recommended_after', 'supports', 'expands', 'contrasts_with', 'similar_to', 'career_for', 'compare_with']);
const ENTITY_ID_PATTERN = /^[a-z][a-z0-9-]*:[a-z0-9][a-z0-9/-]*$/;
const ROUTE_PATTERN = /^\/[a-z0-9:/-]*$/;
const PAIR_PATTERN = /^[a-z]{4}-vs-[a-z]{4}$/;
const BANNED_PROPERTY_PATTERN = /(name|email|phone|ip|address|answer|response|message|text|token|password|session|result|user|profile|identifier)/i;
const SAFE_ROUTE_SEGMENTS = new Set(['about', 'careers', 'community', 'compare', 'contact', 'dashboard', 'editorial', 'forgot-password', 'insights', 'jobs', 'learning', 'leadership', 'localization', 'login', 'personality', 'privacy', 'report', 'reset-password', 'result', 'results', 'session', 'signup', 'start', 'terms', 'test', 'types']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isLocale(value) {
  return Boolean(localeConfig(value));
}

function isType(value) {
  return TYPE_SET.has(value);
}

function isInsight(value) {
  return INSIGHT_SET.has(value);
}

function isEntityId(value) {
  return ENTITY_ID_PATTERN.test(value);
}

function isPair(value) {
  return PAIR_PATTERN.test(value);
}

function isRoute(value) {
  return ROUTE_PATTERN.test(value) && !value.includes('//');
}

const string = (validator) => (value) => typeof value === 'string' && validator(value);

/**
 * The event registry is the privacy allowlist. Any property absent from a
 * definition is rejected before it can reach a provider or development log.
 */
export const ANALYTICS_EVENT_REGISTRY = Object.freeze({
  page_view: Object.freeze({ route: string(isRoute), locale: string(isLocale) }),
  assessment_started: Object.freeze({ analyzer: string(isInsight), locale: string(isLocale) }),
  assessment_completed: Object.freeze({ analyzer: string(isInsight), locale: string(isLocale) }),
  guide_view: Object.freeze({ type: string(isType), locale: string(isLocale) }),
  career_view: Object.freeze({ type: string(isType), locale: string(isLocale) }),
  compare_view: Object.freeze({ pair: string(isPair), locale: string(isLocale) }),
  insight_view: Object.freeze({ insight: string(isInsight), locale: string(isLocale) }),
  journey_continue: Object.freeze({ from_entity: string(isEntityId), to_entity: string(isEntityId), locale: string(isLocale) }),
  language_changed: Object.freeze({ from_locale: string(isLocale), to_locale: string(isLocale) }),
  bookmark_created: Object.freeze({ entity_id: string(isEntityId), locale: string(isLocale) }),
  recommendation_impressed: Object.freeze({ source_type: string((value) => RECOMMENDATION_ENTITY_TYPE_SET.has(value)), target_type: string((value) => RECOMMENDATION_ENTITY_TYPE_SET.has(value)), edge_kind: string((value) => RECOMMENDATION_RELATIONSHIP_SET.has(value)), locale: string(isLocale) }),
  recommendation_clicked: Object.freeze({ source_type: string((value) => RECOMMENDATION_ENTITY_TYPE_SET.has(value)), target_type: string((value) => RECOMMENDATION_ENTITY_TYPE_SET.has(value)), edge_kind: string((value) => RECOMMENDATION_RELATIONSHIP_SET.has(value)), locale: string(isLocale) }),
});

export const ANALYTICS_EVENT_NAMES = Object.freeze(Object.keys(ANALYTICS_EVENT_REGISTRY));
export const ANALYTICS_PROVIDERS = Object.freeze(['ga4']);

export function normalizeAnalyticsRoute(pathname) {
  const path = String(pathname || '').split(/[?#]/, 1)[0] || '/';
  const segments = path.split('/').filter(Boolean).map((segment, index, all) => {
    const previous = all[index - 1];
    if (previous === 'session' || previous === 'result') return ':id';
    const normalized = segment.toLowerCase();
    if (index === 0 && isLocale(normalized)) return normalized;
    if (SAFE_ROUTE_SEGMENTS.has(normalized) || isType(normalized) || isInsight(normalized) || isPair(normalized)) return normalized;
    return ':id';
  });
  const normalized = `/${segments.join('/')}`.replace(/\/$/, '') || '/';
  assert(isRoute(normalized), 'Analytics route is invalid');
  return normalized;
}

export function validateAnalyticsEvent(name, properties) {
  assert(Object.hasOwn(ANALYTICS_EVENT_REGISTRY, name), `Unknown analytics event: ${name}`);
  assert(properties && typeof properties === 'object' && !Array.isArray(properties), 'Analytics properties must be an object');
  const definition = ANALYTICS_EVENT_REGISTRY[name];
  const keys = Object.keys(properties);
  for (const key of keys) {
    assert(!BANNED_PROPERTY_PATTERN.test(key), `Analytics property is blocked by privacy policy: ${key}`);
    assert(Object.hasOwn(definition, key), `Analytics property is not allowed for ${name}: ${key}`);
  }
  assert(keys.length === Object.keys(definition).length, `Analytics event ${name} has an incomplete or unexpected property set`);
  for (const key of keys) {
    assert(definition[key](properties[key]), `Analytics property is invalid for ${name}: ${key}`);
  }
  return Object.freeze(Object.fromEntries(keys.sort().map((key) => [key, properties[key]])));
}

export function analyticsEnabled({ environment, enabled, measurementId }) {
  return environment === 'production' && enabled === true && typeof measurementId === 'string' && measurementId.trim().length > 0;
}

export function createAnalyticsDispatcher({ adapter = null, enabled = false, environment = 'development', logger = null } = {}) {
  const sent = new Set();
  const canDispatch = enabled && environment === 'production' && adapter && typeof adapter.dispatch === 'function';
  return Object.freeze({
    dispatch(name, properties) {
      const safeProperties = validateAnalyticsEvent(name, properties);
      const fingerprint = `${name}:${JSON.stringify(safeProperties)}`;
      if (sent.has(fingerprint)) return Object.freeze({ status: 'duplicate', name, properties: safeProperties });
      sent.add(fingerprint);
      if (canDispatch) {
        adapter.dispatch(name, safeProperties);
        return Object.freeze({ status: 'sent', name, properties: safeProperties });
      }
      if (environment !== 'production' && logger && typeof logger.info === 'function') {
        logger.info('[analytics:development]', { name, properties: safeProperties });
      }
      return Object.freeze({ status: 'disabled', name, properties: safeProperties });
    },
  });
}

/** Production GA4 adapter. No application component calls gtag directly. */
export function createGa4Adapter(measurementId, documentRef = typeof document === 'undefined' ? null : document, windowRef = typeof window === 'undefined' ? null : window) {
  assert(typeof measurementId === 'string' && measurementId.trim(), 'A GA4 measurement ID is required');
  assert(documentRef && windowRef, 'GA4 requires a browser environment');
  const id = measurementId.trim();
  windowRef.dataLayer = windowRef.dataLayer || [];
  windowRef.gtag = windowRef.gtag || function gtag() { windowRef.dataLayer.push(arguments); };
  if (!documentRef.getElementById('ga4-gtag-script')) {
    const script = documentRef.createElement('script');
    script.id = 'ga4-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    documentRef.head.appendChild(script);
    windowRef.gtag('js', new Date());
    windowRef.gtag('config', id, { send_page_view: false });
  }
  return Object.freeze({
    name: 'ga4',
    dispatch(name, properties) {
      windowRef.gtag('event', name, properties);
    },
  });
}

export function createProductionAnalyticsAdapter({ provider = 'ga4', measurementId, documentRef, windowRef } = {}) {
  assert(ANALYTICS_PROVIDERS.includes(provider), `Unknown analytics provider: ${provider}`);
  if (provider === 'ga4') return createGa4Adapter(measurementId, documentRef, windowRef);
  throw new Error(`Unsupported analytics provider: ${provider}`);
}
