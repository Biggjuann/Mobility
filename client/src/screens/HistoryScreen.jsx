import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getSession, getMorning, DAY_KEYS, DAY_LONG } from '../lib/program';
import { dateKey, MONTH_NAMES } from '../lib/dates';
import Calendar from '../components/Calendar';

const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function HistoryScreen({ initialDate, onClose }) {
  const t = useTheme();
  const { completed, currentMonth, completedCount } = useStore();

  const start = initialDate ? parseKey(initialDate) : new Date();
  const [selectedKey, setSelectedKey] = useState(initialDate || dateKey(start));
  const [calYear, setCalYear] = useState(start.getFullYear());
  const [calMonth, setCalMonth] = useState(start.getMonth());

  const markedSet = useMemo(
    () => new Set(Object.keys(completed).filter((k) => Object.keys(completed[k] || {}).length > 0)),
    [completed],
  );

  const detail = useMemo(() => {
    if (!selectedKey) return null;
    const d = parseKey(selectedKey);
    const dayKey = DAY_KEYS[d.getDay()];
    const session = getSession(currentMonth, dayKey);
    const isRest = dayKey === 'sunday';
    const total = isRest ? 0 : getMorning(currentMonth).drills.length + session.drills.length;
    const done = completedCount(selectedKey);
    const dateLabel = `${DAY_LONG[d.getDay()].slice(0, 3)}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
    return { title: session.title, isRest, total, done, dateLabel };
  }, [selectedKey, currentMonth, completedCount]);

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
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onClose} style={{ color: t.ink }} aria-label="Back">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="text-3xl" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
            History
          </h1>
        </div>

        <div className="rounded-2xl p-5 mb-6" style={{ background: t.card }}>
          <Calendar
            year={calYear}
            month={calMonth}
            markedSet={markedSet}
            selectedKey={selectedKey}
            onSelectDay={setSelectedKey}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
        </div>

        {detail && (
          <button
            className="w-full text-left rounded-2xl p-5"
            style={{ background: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ fontFamily: FONTS.mono, color: t.faint }}>
              {detail.dateLabel}
            </div>
            <div className="text-2xl mb-1" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
              {detail.title}
            </div>
            <div className="text-sm" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              {detail.isRest
                ? 'Rest day'
                : `${detail.done} of ${detail.total} drills completed`}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
