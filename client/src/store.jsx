import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { todayKey, dateKey, daysBetween, addDays } from './lib/dates';
import { scheduleReminder } from './lib/notifications';
import { initPurchases, checkPro, restore as restorePro } from './lib/purchases';

const StoreContext = createContext(null);

const DEFAULT_SETTINGS = {
  reminderEnabled: false,
  reminderTime: '07:00',
  sound: true,
  darkMode: false,
};

const get = (k) => window.storage.get(k).then((r) => r?.value ?? null).catch(() => null);
const set = (k, v) => window.storage.set(k, v).catch(() => {});
const del = (k) => window.storage.delete(k).catch(() => {});

function computeStreaks(completed) {
  const doneSet = new Set(
    Object.keys(completed).filter(
      (k) => completed[k] && Object.keys(completed[k]).length > 0,
    ),
  );

  let streak = 0;
  let d = new Date();
  while (true) {
    const k = dateKey(d);
    if (doneSet.has(k)) {
      streak++;
      d = addDays(d, -1);
    } else {
      if (streak === 0 && k === todayKey()) {
        d = addDays(d, -1);
        continue;
      }
      break;
    }
  }

  const nums = [...doneSet]
    .map((k) => {
      const [y, m, dd] = k.split('-').map(Number);
      return Math.floor(Date.UTC(y, m - 1, dd) / 86400000);
    })
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  for (const n of nums) {
    run = prev !== null && n === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = n;
  }

  return { streak, bestStreak: Math.max(best, streak) };
}

export function StoreProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [completed, setCompleted] = useState({});
  const [currentMonth, setCurrentMonth] = useState(1);
  const [monthStart, setMonthStart] = useState(null);
  const [viewMonth, setViewMonth] = useState(1);
  const [dismissedAdvanceFor, setDismissedAdvanceFor] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [onboarded, setOnboarded] = useState(true); // assume true until load proves otherwise
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, m, ms, dis, st, ob] = await Promise.all([
        get('mobility-completed'),
        get('mobility-current-month'),
        get('mobility-month-start'),
        get('mobility-dismissed-advance'),
        get('mobility-settings'),
        get('mobility-onboarded'),
      ]);
      if (c) try { setCompleted(JSON.parse(c)); } catch {}
      if (m) {
        const parsed = parseInt(m, 10);
        setCurrentMonth(parsed);
        setViewMonth(parsed);
      }
      if (ms) setMonthStart(ms);
      else {
        const k = todayKey();
        setMonthStart(k);
        set('mobility-month-start', k);
      }
      if (dis) setDismissedAdvanceFor(dis);
      if (st) try { setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(st) }); } catch {}
      setOnboarded(ob === '1');
      setLoaded(true);
    })();
  }, []);

  // Persist completions whenever they change (this also triggers cloud sync).
  useEffect(() => {
    if (!loaded) return;
    set('mobility-completed', JSON.stringify(completed));
  }, [completed, loaded]);

  // Initialize in-app purchases and load the user's Pro entitlement.
  useEffect(() => {
    (async () => {
      await initPurchases();
      setIsPro(await checkPro());
    })();
  }, []);

  const refreshPro = useCallback(async () => {
    setIsPro(await checkPro());
  }, []);

  const restorePurchases = useCallback(async () => {
    const ok = await restorePro();
    setIsPro(ok);
    return ok;
  }, []);

  const { streak, bestStreak } = useMemo(() => computeStreaks(completed), [completed]);
  const daysOnMonth = useMemo(() => daysBetween(monthStart), [monthStart]);

  const toggleComplete = useCallback((drillId) => {
    const tKey = todayKey();
    setCompleted((prev) => {
      const dayMap = { ...(prev[tKey] || {}) };
      if (dayMap[drillId]) delete dayMap[drillId];
      else dayMap[drillId] = true;
      return { ...prev, [tKey]: dayMap };
    });
  }, []);

  const markComplete = useCallback((drillId) => {
    const tKey = todayKey();
    setCompleted((prev) => ({
      ...prev,
      [tKey]: { ...(prev[tKey] || {}), [drillId]: true },
    }));
  }, []);

  const isComplete = useCallback(
    (drillId, dk = todayKey()) => !!completed[dk]?.[drillId],
    [completed],
  );
  const completedCount = useCallback(
    (dk) => Object.keys(completed[dk] || {}).length,
    [completed],
  );

  const advanceMonth = useCallback(() => {
    const next = Math.min(currentMonth + 1, 6);
    const k = todayKey();
    setCurrentMonth(next);
    setViewMonth(next);
    setMonthStart(k);
    setDismissedAdvanceFor(null);
    set('mobility-current-month', String(next));
    set('mobility-month-start', k);
    del('mobility-dismissed-advance');
  }, [currentMonth]);

  const jumpToMonth = useCallback((m) => {
    const k = todayKey();
    setCurrentMonth(m);
    setViewMonth(m);
    setMonthStart(k);
    setDismissedAdvanceFor(null);
    set('mobility-current-month', String(m));
    set('mobility-month-start', k);
    del('mobility-dismissed-advance');
  }, []);

  const dismissAdvance = useCallback(() => {
    const tag = `month-${currentMonth}-day-${Math.floor(daysOnMonth / 7)}`;
    setDismissedAdvanceFor(tag);
    set('mobility-dismissed-advance', tag);
  }, [currentMonth, daysOnMonth]);

  const resetProgress = useCallback(() => {
    const k = todayKey();
    setCompleted({});
    setCurrentMonth(1);
    setViewMonth(1);
    setMonthStart(k);
    setDismissedAdvanceFor(null);
    set('mobility-current-month', '1');
    set('mobility-month-start', k);
    del('mobility-dismissed-advance');
  }, []);

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      set('mobility-settings', JSON.stringify(next));
      if ('reminderEnabled' in partial || 'reminderTime' in partial) {
        scheduleReminder(next.reminderEnabled, next.reminderTime);
      }
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(({ startMonth, reminderTime, reminderEnabled }) => {
    const k = todayKey();
    setCurrentMonth(startMonth);
    setViewMonth(startMonth);
    setMonthStart(k);
    set('mobility-current-month', String(startMonth));
    set('mobility-month-start', k);
    setSettings((prev) => {
      const next = { ...prev, reminderTime, reminderEnabled };
      set('mobility-settings', JSON.stringify(next));
      scheduleReminder(reminderEnabled, reminderTime);
      return next;
    });
    setOnboarded(true);
    set('mobility-onboarded', '1');
  }, []);

  const canAdvance =
    viewMonth === currentMonth &&
    currentMonth < 6 &&
    daysOnMonth >= 30 &&
    dismissedAdvanceFor !== `month-${currentMonth}-day-${Math.floor(daysOnMonth / 7)}`;

  const value = {
    loaded,
    completed,
    currentMonth,
    monthStart,
    daysOnMonth,
    viewMonth,
    setViewMonth,
    settings,
    onboarded,
    isPro,
    refreshPro,
    restorePurchases,
    streak,
    bestStreak,
    canAdvance,
    toggleComplete,
    markComplete,
    isComplete,
    completedCount,
    advanceMonth,
    jumpToMonth,
    dismissAdvance,
    resetProgress,
    updateSettings,
    completeOnboarding,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
