// Public URLs for the Privacy Policy and Terms of Service pages served by the
// Mobility API. Built off the same VITE_API_URL the rest of the app uses.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const PRIVACY_URL = BASE ? `${BASE}/privacy` : '';
export const TERMS_URL = BASE ? `${BASE}/terms` : '';
