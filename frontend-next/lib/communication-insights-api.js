const DEFAULT_TIMEOUT = 12000;

function baseUrl() { return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, ''); }

export class CommunicationInsightsError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  const origin = baseUrl();
  if (!origin) throw new CommunicationInsightsError('unavailable', 'The reflection service is not configured.');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    const response = await fetch(`${origin}/api${path}`, { method, signal: controller.signal, headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Assessment-Access': token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const code = response.status === 410 ? 'expired' : response.status === 404 ? 'unavailable' : response.status === 409 ? 'conflict' : 'rejected';
      throw new CommunicationInsightsError(code, data?.detail || 'The reflection service could not complete that step.');
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new CommunicationInsightsError('timeout', 'The reflection service took too long to respond.');
    throw error;
  } finally {
    window.clearTimeout(timeout); signal?.removeEventListener('abort', onAbort);
  }
}

export const communicationInsightsApi = {
  createSession: (locale, personalityContext, signal) => request('/analyzers/communication-style/sessions', { method: 'POST', body: { locale, ...(personalityContext ? { personality_context: personalityContext } : {}) }, signal }),
  session: (sessionId, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(sessionId)}`, { token, signal }),
  next: (sessionId, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(sessionId)}/next`, { token, signal }),
  submit: (sessionId, token, payload, signal) => request(`/analyzer-sessions/${encodeURIComponent(sessionId)}/responses`, { method: 'POST', token, body: payload, signal }),
  complete: (sessionId, token, signal) => request(`/analyzer-sessions/${encodeURIComponent(sessionId)}/complete`, { method: 'POST', token, signal }),
  result: (resultId, token, signal) => request(`/analyzer-results/${encodeURIComponent(resultId)}`, { token, signal }),
};
