const tokenKey = 'kalqlater_auth_token';
const base = () => (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const token = typeof window === 'undefined' ? null : window.localStorage.getItem(tokenKey);
  if (!token || !base()) throw new Error('Reviewer sign-in is required.');
  const response = await fetch(`${base()}/api/localization/reviewer${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || 'The editorial request could not be completed.');
  return payload;
}

export const localizationWorkbenchApi = Object.freeze({
  list: () => request('/blocks'),
  create: (payload) => request('/blocks', { method: 'POST', body: JSON.stringify(payload) }),
  edit: (block, payload) => request(`/blocks/${encodeURIComponent(block.locale)}/${encodeURIComponent(block.content_id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  review: (block, payload) => request(`/blocks/${encodeURIComponent(block.locale)}/${encodeURIComponent(block.content_id)}`, { method: 'PUT', body: JSON.stringify(payload) }),
});
