import { Preferences } from '@capacitor/preferences';
import { SYNC_KEYS, schedulePush } from './sync';

// Local-first key/value store. Mirrors the shape the app already expects
// (window.storage.get -> { value }, .set, .delete) but is backed by Capacitor
// Preferences so it persists natively on device. Mutations to synced keys
// schedule a debounced push to the cloud when the user is signed in.
const syncSet = new Set(SYNC_KEYS);

export const storage = {
  async get(key) {
    return Preferences.get({ key });
  },
  async set(key, value) {
    await Preferences.set({ key, value });
    if (syncSet.has(key)) schedulePush();
  },
  async delete(key) {
    await Preferences.remove({ key });
    if (syncSet.has(key)) schedulePush();
  },
};
