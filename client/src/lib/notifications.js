import { LocalNotifications } from '@capacitor/local-notifications';

const REMINDER_ID = 1;

// Schedule (or cancel) the daily "time to move" reminder. Wrapped in try/catch
// because the plugin is unimplemented on web — there it silently no-ops so the
// settings UI still works during browser development.
export async function scheduleReminder(enabled, time) {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    if (!enabled) return;

    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    const [hour, minute] = (time || '07:00').split(':').map((n) => parseInt(n, 10));
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: 'Mobility',
          body: "Time to move. A few minutes today keeps the streak alive.",
          schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
        },
      ],
    });
  } catch {
    /* web / permission denied — no-op */
  }
}
