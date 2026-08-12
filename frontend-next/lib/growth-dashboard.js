const SESSION_KEYS = {
  communication: 'kalqlater.communication-insights.session',
  conflict: 'kalqlater.conflict-insights.session',
  leadership: 'kalqlater.leadership-insights.session',
  learning: 'kalqlater.learning-insights.session',
};

const analyzerPath = {
  communication: 'insights/communication',
  conflict: 'insights/conflict',
  leadership: 'insights/leadership',
  learning: 'insights/learning',
};

export const FUTURE_INSIGHTS = [];

// Release availability is explicit. A stored private session must never make
// an unpublished insight look public simply because its route exists locally.
export const INSIGHT_AVAILABILITY = {
  personality: { available: true },
  communication: { available: true },
  conflict: { available: true },
  leadership: { available: true },
  learning: { available: true },
};

export function readJson(storage, key) {
  try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; }
}

function backendUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
}

async function resultFromSession(type, locale, storage) {
  const saved = readJson(storage, SESSION_KEYS[type]);
  if (!saved?.resultId || !saved?.accessToken || saved.locale !== locale || !backendUrl()) return null;
  const response = await fetch(`${backendUrl()}/api/analyzer-results/${encodeURIComponent(saved.resultId)}`, {
    headers: { 'X-Assessment-Access': saved.accessToken }, credentials: 'omit',
  });
  if (!response.ok) return null;
  const payload = await response.json();
  const result = payload?.result;
  // A completed insight is only shown when its authored result is intact. This
  // prevents the dashboard from inventing an empty substitute for missing copy.
  if (!result?.analyzer_slug || !result?.summary || !payload?.result_id || !payload?.created_at) return null;
  return {
    id: `${type}:${payload.result_id}`,
    type,
    version: result.analyzer_version,
    completedAt: payload.created_at,
    language: result.locale,
    confidence: result.dimension_results?.some((item) => item.confidence === 'clear-pattern') ? 'clear' : 'reflective',
    resultId: payload.result_id,
    title: type === 'communication' ? (locale === 'hi' ? 'कम्युनिकेशन इनसाइट्स' : 'Communication Insights') : type === 'conflict' ? (locale === 'hi' ? 'कन्फ्लिक्ट इनसाइट्स' : 'Conflict Insights') : type === 'leadership' ? (locale === 'hi' ? 'लीडरशिप इनसाइट्स' : 'Leadership Insights') : (locale === 'hi' ? 'लर्निंग इनसाइट्स' : 'Learning Insights'),
    summary: result.summary,
    resultUrl: `/${locale}/${analyzerPath[type]}/result/${payload.result_id}`,
    retakeUrl: `/${locale}/${analyzerPath[type]}/start`,
    weeklyExperiment: result.weekly_challenge || null,
  };
}

function personalityFromBrowser(locale, storage) {
  const type = storage.getItem('kalqlater_latest_personality_type_v1');
  if (!/^(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)$/.test(type || '')) return null;
  return {
    id: `personality:${type}`,
    type: 'personality',
    version: null,
    completedAt: null,
    language: locale,
    confidence: null,
    resultId: null,
    title: locale === 'hi' ? 'पर्सनैलिटी' : 'Personality',
    summary: locale === 'hi' ? `${type} पर्सनैलिटी संदर्भ इस ब्राउज़र में उपलब्ध है।` : `${type} personality context is available in this browser.`,
    resultUrl: null,
    guideUrl: `/${locale}/personality/${type.toLowerCase()}`,
    retakeUrl: '/test',
    weeklyExperiment: null,
  };
}

/**
 * Phase 1 deliberately reads only result records the current browser can prove.
 * It does not invent timestamps, completion states, experiments, or cross-insight scores.
 */
export async function loadGrowthDashboard(locale, storage = window.sessionStorage) {
  const [communicationResult, conflictResult, leadershipResult, learningResult] = await Promise.allSettled([
    resultFromSession('communication', locale, storage),
    resultFromSession('conflict', locale, storage),
    resultFromSession('leadership', locale, storage),
    resultFromSession('learning', locale, storage),
  ]);
  // A stale or unavailable assessment result must not hide the user's other
  // locally available insights (for example, their existing personality type).
  const communication = communicationResult.status === 'fulfilled' ? communicationResult.value : null;
  const conflict = conflictResult.status === 'fulfilled' ? conflictResult.value : null;
  const leadership = leadershipResult.status === 'fulfilled' ? leadershipResult.value : null;
  const learning = learningResult.status === 'fulfilled' ? learningResult.value : null;
  const personality = personalityFromBrowser(locale, window.localStorage);
  const completed = [personality, communication, conflict, leadership, learning].filter(Boolean);
  const dated = completed.filter((item) => item.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const currentExperiment = dated.find((item) => item.weeklyExperiment)?.weeklyExperiment || null;
  return { completed, dated, currentExperiment };
}

export function nextDashboardRecommendation(completedTypes) {
  if (!completedTypes.includes('personality')) return 'personality';
  if (!completedTypes.includes('communication')) return 'communication';
  if (!completedTypes.includes('conflict')) return 'conflict';
  if (!completedTypes.includes('leadership')) return 'leadership';
  if (!completedTypes.includes('learning')) return 'learning';
  return 'community';
}
