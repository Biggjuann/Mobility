import React, { useState, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getSession, getMorning, DAY_KEYS, PROGRAMS } from '../lib/program';
import { dateKey, addDays } from '../lib/dates';
import Calendar from '../components/Calendar';

// Average completion ratio across the last `days` scheduled (non-rest) days.
function completionPct(completed, currentMonth, days) {
  let sum = 0;
  let n = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(new Date(), -i);
    const key = DAY_KEYS[d.getDay()];
    if (key === 'sunday') continue; // rest day, not scheduled
    const scheduled = getMorning(currentMonth).drills.length + getSession(currentMonth, key).drills.length;
    if (!scheduled) continue;
    const done = Object.keys(completed[dateKey(d)] || {}).length;
    sum += Math.min(done, scheduled) / scheduled;
    n++;
  }
  return n ? Math.round((sum / n) * 100) : 0;
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

  const weekly = useMemo(() => completionPct(completed, currentMonth, 7), [completed, currentMonth]);
  const monthly = useMemo(() => completionPct(completed, currentMonth, 30), [completed, currentMonth]);
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
              days
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
              days
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
        <Stat t={t} label="Weekly Completion" value={`${weekly}%`} />
        <Stat t={t} label="Monthly Completion" value={`${monthly}%`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat t={t} label="Total Sessions" value={String(totalSessions)} />
        <Stat
          t={t}
          label={`You're ${throughPct}% through`}
          value={`Month ${currentMonth}`}
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
