const TIMEOUT = 12000;

export class ConflictInsightsError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kalqlater.onrender.com').replace(/\/$/, '');
  if (!base) throw new ConflictInsightsError('unavailable', 'The Conflict Insights service is not configured.');
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    const response = await fetch(`${base}/api${path}`, { method, signal: controller.signal, headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Assessment-Access': token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ConflictInsightsError(response.status === 404 ? 'unavailable' : response.status === 410 ? 'expired' : response.status === 409 ? 'conflict' : 'rejected', data.detail || 'The reflection service could not complete that step.');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new ConflictInsightsError('timeout', 'The reflection service took too long to respond.');
    throw error;
  } finally { window.clearTimeout(timer); signal?.removeEventListener('abort', onAbort); }
}

export const conflictInsightsApi = {
  createSession: (locale, personalityContext, signal) => request('/analyzers/conflict-insights/sessions', { method: 'POST', body: { locale, ...(personalityContext ? { personality_context: personalityContext } : {}) }, signal }),
  session: (id, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}`, { token, signal }),
  scenario: (id, token, scenario, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}/scenarios/${encodeURIComponent(scenario)}`, { token, signal }),
  next: (id, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}/next`, { token, signal }),
  submit: (id, token, body, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}/responses`, { method: 'POST', token, body, signal }),
  update: (id, token, body, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}/responses`, { method: 'PUT', token, body, signal }),
  complete: (id, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(id)}/complete`, { method: 'POST', token, signal }),
  result: (id, token, signal) => request(`/analyzer-results/${encodeURIComponent(id)}`, { token, signal }),
};
