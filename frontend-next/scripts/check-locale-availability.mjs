import assert from 'node:assert/strict';
import { createEntityRegistry } from '../lib/content-entities.js';
import {
  entityIdForLocaleRoute,
  filterPublicNavigation,
  isNavigationVisible,
  publicLocalesForEntity,
  publishedLanguageLocales,
  resolveEntityLocale,
  resolveLocaleRoute,
} from '../lib/locale-availability.js';
import { pageAlternates } from '../lib/metadata.js';

const locales = [
  { code: 'en', hreflang: 'en', published: true },
  { code: 'es', hreflang: 'es', published: false },
  { code: 'fr', hreflang: 'fr', published: false },
  { code: 'de', hreflang: 'de', published: false },
];
const fixture = createEntityRegistry([{
  id: 'future-entity:example', type: 'future-entity', key: 'example', publicationState: 'approved', availability: {
    en: 'published', es: 'preview', fr: 'planned', de: 'unavailable',
  },
}, {
  id: 'future-entity:retired', type: 'future-entity', key: 'retired', publicationState: 'deprecated', availability: {
    en: 'deprecated', es: 'deprecated', fr: 'deprecated', de: 'deprecated',
  },
}], { locales, entityTypes: ['future-entity'] });

assert.deepEqual(publishedLanguageLocales(), ['en', 'hi'], 'only published language entities may be public locales');
assert.equal(resolveLocaleRoute('en', '/en').isPublic, true, 'published locale root is public');
assert.equal(resolveLocaleRoute('es', '/es').isPreview, true, 'Spanish homepage is an explicit preview');
assert.equal(resolveLocaleRoute('es', '/es').isRoutable, true, 'preview root is routable');
assert.equal(resolveLocaleRoute('es', '/es').isPublic, false, 'preview root is never public');
assert.equal(resolveLocaleRoute('es', '/es/personality/intj').isPreview, true, 'preview personality route is routable');
assert.equal(resolveLocaleRoute('es', '/es/personality/intj/careers').isPreview, true, 'preview career route is routable');
assert.equal(resolveLocaleRoute('es', '/es/compare/intj-vs-intp').isPreview, true, 'preview comparison route is routable');
assert.equal(resolveLocaleRoute('es', '/es/contact').isRoutable, false, 'unconfigured preview page fails closed');
assert.equal(resolveLocaleRoute('fr', '/fr').isPreview, true, 'French phase-one homepage is an explicit preview');
assert.equal(resolveLocaleRoute('fr', '/fr/contact').isPreview, true, 'French static phase-one route is previewable');
assert.equal(resolveLocaleRoute('fr', '/fr/personality/intj').isPreview, true, 'French personality route is previewable once authored');
assert.equal(resolveLocaleRoute('fr', '/fr/personality/intj/careers').isPreview, true, 'French career route is previewable once authored');
assert.equal(resolveLocaleRoute('fr', '/fr/compare/intj-vs-intp').isPreview, true, 'French comparison route is previewable once authored');
assert.equal(resolveLocaleRoute('de', '/de').isRoutable, false, 'unknown locale is never routable');
assert.equal(entityIdForLocaleRoute('es', '/es/personality/intj'), 'personality-guide:intj');
assert.equal(entityIdForLocaleRoute('es', '/es/personality/intj/careers'), 'career-guide:intj');
assert.equal(entityIdForLocaleRoute('es', '/es/compare/intj-vs-intp'), 'compare:intj-vs-intp');

assert.equal(resolveEntityLocale('future-entity:example', 'en', fixture).isPublic, true);
assert.equal(resolveEntityLocale('future-entity:example', 'es', fixture).isPreview, true, 'preview state is explicit');
assert.equal(resolveEntityLocale('future-entity:example', 'fr', fixture).isRoutable, false, 'planned state is blocked');
assert.equal(resolveEntityLocale('future-entity:example', 'de', fixture).isRoutable, false, 'unavailable state is blocked');
assert.equal(resolveEntityLocale('future-entity:retired', 'en', fixture).isRoutable, false, 'deprecated state is blocked');
assert.equal(resolveEntityLocale('future-entity:missing', 'en', fixture).availability, 'unavailable', 'unknown entity fails closed');
assert.equal(resolveEntityLocale('future-entity:example', 'xx', fixture).availability, 'unavailable', 'unknown locale fails closed');
assert.deepEqual(publicLocalesForEntity('future-entity:example', fixture), ['en']);
assert.deepEqual(filterPublicNavigation('en', [
  { label: 'Visible', entityId: 'community:directory' },
  { label: 'Legacy', href: '/test' },
]), [{ label: 'Visible', entityId: 'community:directory' }, { label: 'Legacy', href: '/test' }]);
assert.deepEqual(filterPublicNavigation('es', [{ label: 'Preview', entityId: 'personality-guide:intj' }]), [], 'preview locale is excluded from navigation');
assert.equal(isNavigationVisible('es', 'personality-guide:intj'), false, 'preview entity is not public navigation');

const alternates = pageAlternates('personality/intj', undefined, 'personality-guide:intj');
assert.deepEqual(Object.keys(alternates).sort(), ['en', 'hi', 'x-default'], 'hreflang includes published locales only');
assert.deepEqual(publicLocalesForEntity('personality-guide:intj'), ['en', 'hi'], 'sitemap source contains published locales only');

console.log('Locale availability guard checks passed for published, preview, planned, unavailable, and deprecated states.');
