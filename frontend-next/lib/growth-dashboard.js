const SESSION_KEYS = {
  communication: 'kalqlater.communication-insights.session',
  decision: 'kalqlater.decision-style.session',
};

const analyzerPath = {
  communication: 'insights/communication',
  decision: 'insights/decision',
};

export const FUTURE_INSIGHTS = ['conflict', 'leadership', 'learning'];

// Release capabilities are explicit rather than inferred from a route at
// runtime. A future Decision release can enable its card without changing the
// dashboard's stored-result format.
export const INSIGHT_AVAILABILITY = {
  personality: { available: true },
  communication: { available: true },
  decision: { available: false },
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
  if (!result?.analyzer_slug || !payload?.result_id || !payload?.created_at) return null;
  return {
    id: `${type}:${payload.result_id}`,
    type,
    version: result.analyzer_version,
    completedAt: payload.created_at,
    language: result.locale,
    confidence: result.dimension_results?.some((item) => item.confidence === 'clear-pattern') ? 'clear' : 'reflective',
    resultId: payload.result_id,
    title: type === 'communication' ? (locale === 'hi' ? 'कम्युनिकेशन इनसाइट्स' : 'Communication Insights') : (locale === 'hi' ? 'डिसीजन स्टाइल' : 'Decision Style'),
    summary: result.summary || '',
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
  const [communicationResult, decisionResult] = await Promise.allSettled([
    resultFromSession('communication', locale, storage),
    INSIGHT_AVAILABILITY.decision.available ? resultFromSession('decision', locale, storage) : Promise.resolve(null),
  ]);
  // A stale or unavailable assessment result must not hide the user's other
  // locally available insights (for example, their existing personality type).
  const communication = communicationResult.status === 'fulfilled' ? communicationResult.value : null;
  const decision = decisionResult.status === 'fulfilled' ? decisionResult.value : null;
  const personality = personalityFromBrowser(locale, window.localStorage);
  const completed = [personality, communication, decision].filter(Boolean);
  const dated = completed.filter((item) => item.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const currentExperiment = dated.find((item) => item.weeklyExperiment)?.weeklyExperiment || null;
  return { completed, dated, currentExperiment };
}

export function nextDashboardRecommendation(completedTypes) {
  if (!completedTypes.includes('personality')) return 'personality';
  if (!completedTypes.includes('communication')) return 'communication';
  return 'community';
}
