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
// Marks which account the local progress belongs to, so a different user
// signing in on the same device never inherits the previous user's data.
const OWNER_KEY = 'mobility-progress-owner';

let pushTimer = null;

export async function getToken() {
  return (await Preferences.get({ key: TOKEN_KEY })).value;
}
export async function getEmail() {
  return (await Preferences.get({ key: EMAIL_KEY })).value;
}
async function getOwner() {
  return (await Preferences.get({ key: OWNER_KEY })).value;
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

async function writeState(state) {
  for (const k of SYNC_KEYS) {
    if (state[k] != null) await Preferences.set({ key: k, value: String(state[k]) });
  }
}

async function clearProgressLocal() {
  for (const k of SYNC_KEYS) await Preferences.remove({ key: k });
}

// ── Merge: union of progress so nothing is ever lost when two devices meet ──
function parseObj(s) {
  try {
    const v = JSON.parse(s);
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

export function mergeState(local, cloud) {
  const out = {};

  // Completions: union per date, union drill ids within each date.
  const a = parseObj(local['mobility-completed']);
  const b = parseObj(cloud['mobility-completed']);
  const completed = { ...a };
  for (const date of Object.keys(b)) {
    completed[date] = { ...(completed[date] || {}), ...b[date] };
  }
  out['mobility-completed'] = JSON.stringify(completed);

  // Current month: the further-along value wins.
  const lm = parseInt(local['mobility-current-month'] || '1', 10);
  const cm = parseInt(cloud['mobility-current-month'] || '1', 10);
  const month = Math.max(lm, cm);
  out['mobility-current-month'] = String(month);

  // Month start: pair it with whichever source owns the chosen month; on a tie
  // keep the earlier date (more tenure toward the 30-day unlock).
  const ls = local['mobility-month-start'];
  const cs = cloud['mobility-month-start'];
  if (cm > lm) out['mobility-month-start'] = cs || ls;
  else if (lm > cm) out['mobility-month-start'] = ls || cs;
  else {
    const earlier = [ls, cs].filter(Boolean).sort()[0];
    if (earlier) out['mobility-month-start'] = earlier;
  }

  const dismissed = cloud['mobility-dismissed-advance'] || local['mobility-dismissed-advance'];
  if (dismissed) out['mobility-dismissed-advance'] = dismissed;

  return out;
}

// Debounced push so rapid drill toggles collapse into a single network write.
export function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushNow().catch(() => {});
  }, 1200);
}

export async function pushNow() {
  const token = await getToken();
  if (!token) return;
  await api.putState(token, await collectState());
}

async function fetchCloud(token) {
  const { state } = await api.getState(token);
  return state && typeof state === 'object' ? state : {};
}

// Launch-time / refresh sync for the already-signed-in user: merge any offline
// local changes with the cloud copy, persist, and push the reconciled result.
export async function pull() {
  const token = await getToken();
  if (!token) return;
  const merged = mergeState(await collectState(), await fetchCloud(token));
  await writeState(merged);
  await pushNow();
}

async function persistSession(token, email) {
  await Preferences.set({ key: TOKEN_KEY, value: token });
  await Preferences.set({ key: EMAIL_KEY, value: email });
  await Preferences.set({ key: OWNER_KEY, value: email });
}

export async function register(email, password) {
  const { token } = await api.register(email, password);
  await persistSession(token, email);
  // New account: seed the cloud with whatever progress exists on this device.
  await pushNow();
}

export async function login(email, password) {
  const { token } = await api.login(email, password);
  // If this device last belonged to a *different* account, drop that user's
  // local progress before pulling — never blend two users' histories.
  const owner = await getOwner();
  if (owner && owner !== email) await clearProgressLocal();

  const merged = mergeState(await collectState(), await fetchCloud(token));
  await writeState(merged);
  await persistSession(token, email);
  await pushNow();
}

export async function logout() {
  await Preferences.remove({ key: TOKEN_KEY });
  await Preferences.remove({ key: EMAIL_KEY });
  await Preferences.remove({ key: OWNER_KEY });
  // Leave the device on a clean slate so the next user starts fresh.
  await clearProgressLocal();
}
