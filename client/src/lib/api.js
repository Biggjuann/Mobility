// Thin client for the Mobility backend API.
// Base URL is injected at build time via VITE_API_URL. When empty (e.g. pure
// local/PWA use) all calls will fail fast and the app stays local-first.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function req(path, { method = 'GET', body, token } = {}) {
  if (!BASE) throw new Error('No API configured');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    // Surface the server's generic message; never leak status internals to UI.
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  register: (email, password) =>
    req('/api/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) =>
    req('/api/auth/login', { method: 'POST', body: { email, password } }),
  getState: (token) => req('/api/state', { token }),
  putState: (token, state) =>
    req('/api/state', { method: 'PUT', token, body: { state } }),
  deleteAccount: (token) => req('/api/account', { method: 'DELETE', token }),
};
