const COPY = Object.freeze({
  en: Object.freeze({ heading: 'Continue your journey', primary: 'A useful next step', secondary: 'Explore next', career: 'Career Guide', insight: 'Insights', compare: 'Compare personalities', personality: 'Personality Guide', community: 'Community', jobs: 'Jobs', insights: Object.freeze({ communication: 'Communication Insights', conflict: 'Conflict Insights', leadership: 'Leadership Insights', learning: 'Learning Insights' }) }),
  hi: Object.freeze({ heading: 'अपनी समझ को आगे बढ़ाएँ', primary: 'अगला उपयोगी कदम', secondary: 'आगे देखें', career: 'करियर गाइड', insight: 'इनसाइट्स', compare: 'पर्सनैलिटी तुलना', personality: 'पर्सनैलिटी गाइड', community: 'कम्युनिटी', jobs: 'जॉब्स', insights: Object.freeze({ communication: 'कम्युनिकेशन इनसाइट्स', conflict: 'कॉन्फ्लिक्ट इनसाइट्स', leadership: 'लीडरशिप इनसाइट्स', learning: 'लर्निंग इनसाइट्स' }) }),
  es: Object.freeze({ heading: 'Sigue profundizando', primary: 'Un siguiente paso útil', secondary: 'Sigue explorando', career: 'Guía profesional', insight: 'Perspectivas', compare: 'Comparar personalidades', personality: 'Guía de personalidad', community: 'Comunidad', jobs: 'Oportunidades', insights: Object.freeze({ communication: 'Perspectivas de comunicación', conflict: 'Perspectivas sobre conflictos', leadership: 'Perspectivas de liderazgo', learning: 'Perspectivas de aprendizaje' }) }),
});

const SUPPORTED_TARGET_TYPES = new Set(['personality-guide', 'career-guide', 'compare', 'insight', 'community', 'jobs']);

function labelFor(item, copy) {
  if (item.entityType === 'personality-guide') return `${item.slug.toUpperCase()} — ${copy.personality}`;
  if (item.entityType === 'career-guide') return `${item.slug.toUpperCase()} — ${copy.career}`;
  if (item.entityType === 'compare') return `${item.slug.replace('-vs-', ' · ').toUpperCase()} — ${copy.compare}`;
  if (item.entityType === 'insight') return copy.insights[item.slug] || null;
  if (item.entityType === 'community') return copy.community;
  if (item.entityType === 'jobs') return copy.jobs;
  return null;
}

function presentationSafe(item, locale, mode) {
  if (!item || item.locale !== locale || !SUPPORTED_TARGET_TYPES.has(item.entityType)) return false;
  if (mode === 'public' && item.availability !== 'published') return false;
  if (mode === 'preview' && !['published', 'preview'].includes(item.availability)) return false;
  return typeof item.path === 'string' && item.path.startsWith(`/${locale}/`);
}

/**
 * Converts the validated PR-006 response into an SSR-safe, localized view model.
 * Unknown localized labels and unavailable targets fail closed rather than showing
 * a generic or English fallback.
 */
export function buildRelatedContentModel({ sourceEntityId, sourceType, locale, mode = 'public', service }) {
  const copy = COPY[locale];
  if (!copy || !service?.get) return null;
  const response = service.get({ sourceEntityId, sourceType, locale, mode });
  const items = [response.primary, ...(response.secondary || [])]
    .filter((item) => presentationSafe(item, locale, mode))
    .map((item) => ({ ...item, label: labelFor(item, copy) }))
    .filter((item) => item.label);
  if (items.length === 0) return null;
  return Object.freeze({ copy, primary: Object.freeze(items[0]), secondary: Object.freeze(items.slice(1, 3)) });
}

export const RELATED_CONTENT_COPY = COPY;
