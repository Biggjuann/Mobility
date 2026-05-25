import { Preferences } from '@capacitor/preferences';
import { api } from './api';

// The progress keys the app persists locally. These are the only values that
// sync to the cloud — nothing else about the device is ever transmitted.
export const SYNC_KEYS = [
  'mobility-completed',
  'mobility-current-month',
  'mobility-month-start',
  'mobility-dismissed-advance',
];

const TOKEN_KEY = 'mobility-auth-token';
const EMAIL_KEY = 'mobility-auth-email';

let pushTimer = null;

export async function getToken() {
  return (await Preferences.get({ key: TOKEN_KEY })).value;
}

export async function getEmail() {
  return (await Preferences.get({ key: EMAIL_KEY })).value;
}

export async function isAuthed() {
  return !!(await getToken());
}

async function collectState() {
  const state = {};
  for (const k of SYNC_KEYS) {
    const { value } = await Preferences.get({ key: k });
    if (value != null) state[k] = value;
  }
  return state;
}

// Debounced push so rapid drill toggles collapse into a single network write.
export function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushNow().catch(() => {});
  }, 1500);
}

export async function pushNow() {
  const token = await getToken();
  if (!token) return;
  await api.putState(token, await collectState());
}

export async function pull() {
  const token = await getToken();
  if (!token) return;
  const { state } = await api.getState(token);
  if (state && typeof state === 'object') {
    for (const k of SYNC_KEYS) {
      if (state[k] != null) {
        await Preferences.set({ key: k, value: String(state[k]) });
      }
    }
  }
}

async function persistSession(token, email) {
  await Preferences.set({ key: TOKEN_KEY, value: token });
  await Preferences.set({ key: EMAIL_KEY, value: email });
}

export async function register(email, password) {
  const { token } = await api.register(email, password);
  await persistSession(token, email);
  // New account: seed the cloud with whatever progress exists on this device.
  await pushNow();
}

export async function login(email, password) {
  const { token } = await api.login(email, password);
  await persistSession(token, email);
  // Existing account: adopt the cloud copy as the source of truth.
  await pull();
}

export async function logout() {
  await Preferences.remove({ key: TOKEN_KEY });
  await Preferences.remove({ key: EMAIL_KEY });
}
