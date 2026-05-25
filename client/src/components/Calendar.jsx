import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { monthGrid, dateKey, todayKey, MONTH_NAMES } from '../lib/dates';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function Calendar({
  year,
  month,
  markedSet,
  selectedKey,
  onSelectDay,
  onPrev,
  onNext,
}) {
  const t = useTheme();
  const cells = monthGrid(year, month);
  const tKey = todayKey();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-1" style={{ color: t.faint }} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <div
          className="text-base"
          style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}
        >
          {MONTH_NAMES[month]} {year}
        </div>
        <button onClick={onNext} className="p-1" style={{ color: t.faint }} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] tracking-[0.1em]"
            style={{ fontFamily: FONTS.mono, color: t.faint }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d) => {
          const key = dateKey(d);
          const inMonth = d.getMonth() === month;
          const marked = markedSet.has(key);
          const isToday = key === tKey;
          const isSelected = key === selectedKey;
          return (
            <div key={key} className="flex justify-center">
              <button
                onClick={() => onSelectDay && onSelectDay(key)}
                disabled={!inMonth}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm tabular-nums transition-all"
                style={{
                  fontFamily: FONTS.mono,
                  opacity: inMonth ? 1 : 0.25,
                  background: marked ? t.accent : isSelected ? t.accentSoft : 'transparent',
                  color: marked ? '#fff' : t.ink,
                  border: isToday && !marked ? `1px solid ${t.accent}` : '1px solid transparent',
                }}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
