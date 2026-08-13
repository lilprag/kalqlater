import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ANALYTICS_EVENT_NAMES,
  analyticsEnabled,
  createAnalyticsDispatcher,
  createGa4Adapter,
  createProductionAnalyticsAdapter,
  normalizeAnalyticsRoute,
  validateAnalyticsEvent,
} from '../lib/analytics.js';

assert(ANALYTICS_EVENT_NAMES.includes('page_view'), 'page_view must be registered');
assert(ANALYTICS_EVENT_NAMES.includes('bookmark_created'), 'future event registry must be extensible');
assert.deepEqual(validateAnalyticsEvent('guide_view', { type: 'intj', locale: 'en' }), { locale: 'en', type: 'intj' });
assert.throws(() => validateAnalyticsEvent('unknown_event', {}), /Unknown analytics event/);
assert.throws(() => validateAnalyticsEvent('guide_view', { type: 'intj', locale: 'en', email: 'person@example.com' }), /privacy policy/);
assert.throws(() => validateAnalyticsEvent('guide_view', { type: 'intj', locale: 'en', note: 'free text' }), /not allowed/);
assert.throws(() => validateAnalyticsEvent('guide_view', { type: 'not-a-type', locale: 'en' }), /invalid/);
assert.throws(() => validateAnalyticsEvent('page_view', { route: '/en?email=person@example.com', locale: 'en' }), /invalid/);
assert.equal(normalizeAnalyticsRoute('/en/insights/leadership/session/abc123def4567890?email=person@example.com'), '/en/insights/leadership/session/:id');
assert.equal(normalizeAnalyticsRoute('/en/community/member/alice'), '/en/community/:id/:id', 'arbitrary route text is never retained');

assert.equal(analyticsEnabled({ environment: 'production', enabled: true, measurementId: 'G-TEST' }), true);
assert.equal(analyticsEnabled({ environment: 'development', enabled: true, measurementId: 'G-TEST' }), false);
assert.equal(analyticsEnabled({ environment: 'production', enabled: false, measurementId: 'G-TEST' }), false);
assert.equal(analyticsEnabled({ environment: 'production', enabled: true, measurementId: '' }), false);

const sent = [];
const production = createAnalyticsDispatcher({
  environment: 'production', enabled: true, adapter: { dispatch: (name, properties) => sent.push({ name, properties }) },
});
assert.equal(production.dispatch('guide_view', { type: 'intj', locale: 'en' }).status, 'sent');
assert.equal(production.dispatch('guide_view', { type: 'intj', locale: 'en' }).status, 'duplicate');
assert.deepEqual(sent, [{ name: 'guide_view', properties: { locale: 'en', type: 'intj' } }]);

const developmentLogs = [];
const development = createAnalyticsDispatcher({ environment: 'development', enabled: true, logger: { info: (...args) => developmentLogs.push(args) } });
assert.equal(development.dispatch('compare_view', { pair: 'intj-vs-entp', locale: 'hi' }).status, 'disabled');
assert.equal(developmentLogs.length, 1, 'development emits safe validated logs only');
assert.equal(development.dispatch('compare_view', { pair: 'intj-vs-entp', locale: 'hi' }).status, 'duplicate');

const disabled = createAnalyticsDispatcher({ environment: 'production', enabled: false, adapter: { dispatch: () => { throw new Error('disabled adapter must not run'); } } });
assert.equal(disabled.dispatch('insight_view', { insight: 'learning', locale: 'en' }).status, 'disabled');

const createdScripts = [];
const events = [];
const documentRef = {
  head: { appendChild: (node) => createdScripts.push(node) },
  createElement: () => ({}),
  getElementById: () => createdScripts.find((node) => node.id === 'ga4-gtag-script') || null,
};
const windowRef = { dataLayer: [], gtag: (...args) => events.push(args) };
const ga4 = createGa4Adapter('G-TEST', documentRef, windowRef);
const sameGa4 = createGa4Adapter('G-TEST', documentRef, windowRef);
assert.equal(ga4.name, 'ga4');
assert.equal(sameGa4.name, 'ga4');
assert.equal(createdScripts.length, 1, 'GA4 adapter injects one script');
ga4.dispatch('page_view', { route: '/en', locale: 'en' });
assert.deepEqual(events.at(-1), ['event', 'page_view', { route: '/en', locale: 'en' }]);
assert.equal(createProductionAnalyticsAdapter({ provider: 'ga4', measurementId: 'G-TEST', documentRef, windowRef }).name, 'ga4');
assert.throws(() => createProductionAnalyticsAdapter({ provider: 'unknown', measurementId: 'G-TEST', documentRef, windowRef }), /Unknown analytics provider/);

const analyticsComponent = await readFile(new URL('../components/Analytics.jsx', import.meta.url), 'utf8');
assert.equal(/window\.gtag|dataLayer/.test(analyticsComponent), false, 'components must not call analytics providers directly');

console.log('Analytics privacy checks passed for event registry, validation, adapters, modes, and duplicate prevention.');
