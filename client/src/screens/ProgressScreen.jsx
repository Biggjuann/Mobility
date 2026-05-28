import React, { useState, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getSession, getMorning, DAY_KEYS, PROGRAMS } from '../lib/program';
import { dateKey, addDays } from '../lib/dates';
import Calendar from '../components/Calendar';

// "Showed up" rate: of the past `days` calendar days that had a scheduled
// session (non-Sunday), how many did the user log at least one drill on.
// This is more meaningful for new users than averaging drill-completion
// ratios (which dilute to ~zero after one day of activity).
function attendance(completed, days) {
  let active = 0;
  let scheduled = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(new Date(), -i);
    const key = DAY_KEYS[d.getDay()];
    if (key === 'sunday') continue;
    scheduled++;
    if (Object.keys(completed[dateKey(d)] || {}).length > 0) active++;
  }
  return { pct: scheduled ? Math.round((active / scheduled) * 100) : 0, active, scheduled };
}

export default function ProgressScreen({ onOpenHistory }) {
  const t = useTheme();
  const { completed, currentMonth, daysOnMonth, streak, bestStreak } = useStore();

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const markedSet = useMemo(
    () =>
      new Set(
        Object.keys(completed).filter((k) => Object.keys(completed[k] || {}).length > 0),
      ),
    [completed],
  );

  const weekly = useMemo(() => attendance(completed, 7), [completed]);
  const monthly = useMemo(() => attendance(completed, 30), [completed]);
  const totalSessions = markedSet.size;
  const throughPct = Math.min(100, Math.round((daysOnMonth / 30) * 100));

  const prevMonth = () => {
    const d = new Date(calYear, calMonth - 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };
  const nextMonth = () => {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };

  return (
    <div>
      <h1 className="text-center text-3xl mb-8" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
        Progress
      </h1>

      {/* Streak row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-5" style={{ background: t.card }}>
          <div className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: FONTS.mono, color: t.faint }}>
            Current Streak
          </div>
          <div className="flex items-baseline gap-2">
            <Flame size={20} style={{ color: t.accent }} fill="currentColor" />
            <span className="text-3xl tabular-nums" style={{ fontFamily: FONTS.serif, color: t.ink }}>
              {streak}
            </span>
            <span className="text-sm" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: t.card }}>
          <div className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: FONTS.mono, color: t.faint }}>
            Best Streak
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl tabular-nums" style={{ fontFamily: FONTS.serif, color: t.ink }}>
              {bestStreak}
            </span>
            <span className="text-sm" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              {bestStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: t.card }}>
        <Calendar
          year={calYear}
          month={calMonth}
          markedSet={markedSet}
          selectedKey={null}
          onSelectDay={(k) => onOpenHistory(k)}
          onPrev={prevMonth}
          onNext={nextMonth}
        />
      </div>

      {/* Completion stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Stat
          t={t}
          label="This Week"
          value={`${weekly.pct}%`}
          sub={`${weekly.active} of ${weekly.scheduled} day${weekly.scheduled === 1 ? '' : 's'}`}
        />
        <Stat
          t={t}
          label="This Month"
          value={`${monthly.pct}%`}
          sub={`${monthly.active} of ${monthly.scheduled} days`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat t={t} label="Total Sessions" value={String(totalSessions)} sub="all time" />
        <Stat
          t={t}
          label={`Month ${currentMonth}`}
          value={`${throughPct}%`}
          sub={PROGRAMS[currentMonth].name}
        />
      </div>
    </div>
  );
}

function Stat({ t, label, value, sub }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: t.card }}>
      <div className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ fontFamily: FONTS.mono, color: t.faint }}>
        {label}
      </div>
      <div className="text-2xl" style={{ fontFamily: FONTS.serif, color: t.ink }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-0.5" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
          {sub}
        </div>
      )}
    </div>
  );
}
