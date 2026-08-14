import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateAnalyticsEvent } from '../lib/analytics.js';
import { buildRelatedContentModel } from '../lib/related-content.js';

const item = (overrides = {}) => ({
  entityId: 'career-guide:intj', entityType: 'career-guide', slug: 'intj', path: '/en/personality/intj/careers',
  relationshipType: 'career_for', reasonCode: 'personality-guide:career_for', priority: 90, weight: 80,
  availability: 'published', locale: 'en', ...overrides,
});
const response = (primary, secondary = []) => ({ primary, secondary });
const fixtureService = (value) => ({ get: () => value });

const populated = buildRelatedContentModel({
  sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'en',
  service: fixtureService(response(item(), [item({ entityId: 'compare:intj-vs-entp', entityType: 'compare', slug: 'intj-vs-entp', path: '/en/compare/intj-vs-entp', relationshipType: 'compare_with' }), item({ entityId: 'insight:communication', entityType: 'insight', slug: 'communication', path: '/en/insights/communication', relationshipType: 'expands' })])),
});
assert.equal(populated.primary.label, 'INTJ — Career Guide');
assert.deepEqual(populated.secondary.map((entry) => entry.entityId), ['compare:intj-vs-entp', 'insight:communication']);
assert.equal(populated.secondary[1].label, 'Communication Insights', 'insight labels are authored, not English slugs');

const primaryOnly = buildRelatedContentModel({ sourceEntityId: 'career-guide:intj', sourceType: 'career-guide', locale: 'hi', service: fixtureService(response(item({ locale: 'hi', path: '/hi/personality/intj/careers' }))) });
assert.equal(primaryOnly.primary.label, 'INTJ — करियर गाइड');
assert.equal(primaryOnly.secondary.length, 0);
assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'en', service: fixtureService(response(null)) }), null, 'empty production graph produces no UI');

assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'es', service: fixtureService(response(item({ locale: 'es', path: '/es/personality/intj/careers', availability: 'preview' }))) }), null, 'public mode never exposes a preview target');
assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'es', mode: 'preview', service: fixtureService(response(item({ locale: 'es', path: '/es/personality/intj/careers', availability: 'preview' }))) }).primary.label, 'INTJ — Guía profesional');
assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'en', service: fixtureService(response(item({ locale: 'hi', path: '/hi/personality/intj/careers' }))) }), null, 'cross-locale targets fail closed');
assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'en', service: fixtureService(response(item({ path: '/es/personality/intj/careers' }))) }), null, 'invalid localized paths fail closed');
assert.equal(buildRelatedContentModel({ sourceEntityId: 'personality-guide:intj', sourceType: 'personality-guide', locale: 'en', service: fixtureService(response(item({ entityType: 'language', path: '/en' }))) }), null, 'unsupported presentation entities fail closed');

assert.deepEqual(validateAnalyticsEvent('recommendation_impressed', { source_type: 'personality-guide', target_type: 'career-guide', edge_kind: 'career_for', locale: 'en' }), { edge_kind: 'career_for', locale: 'en', source_type: 'personality-guide', target_type: 'career-guide' });
assert.throws(() => validateAnalyticsEvent('recommendation_clicked', { source_type: 'personality-guide', target_type: 'career-guide', edge_kind: 'career_for', locale: 'en', email: 'private@example.com' }), /privacy policy/);

const component = await readFile(new URL('../components/RelatedContent.jsx', import.meta.url), 'utf8');
const analytics = await readFile(new URL('../components/RelatedContentAnalytics.jsx', import.meta.url), 'utf8');
assert.match(component, /<section aria-labelledby=/, 'related content has landmark semantics');
assert.match(component, /<h2 /, 'related content has a visible heading');
assert.match(component, /lg:grid-cols/, 'related content has a responsive small-screen layout');
assert.match(component, /focus-visible:ring-2/, 'links have visible keyboard focus');
assert.match(analytics, /recommendation_impressed/);
assert.match(analytics, /recommendation_clicked/);
assert.equal(/window\.gtag|dataLayer/.test(analytics), false, 'component uses the central analytics dispatcher only');

console.log('Related Content checks passed for populated, primary-only, empty, locale-safe, preview-safe, semantic, responsive, and analytics-safe states.');
