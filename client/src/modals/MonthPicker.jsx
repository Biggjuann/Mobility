import React from 'react';
import { X, Lock, ChevronRight } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { PROGRAMS } from '../lib/program';

// "The Six Months" picker. Selecting an unlocked month previews it; the caller
// decides whether selection also changes the active month.
export default function MonthPicker({ currentMonth, daysOnMonth, onSelect, onClose }) {
  const t = useTheme();
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(20, 17, 13, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: t.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
            The Six Months
          </h2>
          <button onClick={onClose} style={{ color: t.faint }} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((m) => {
            const p = PROGRAMS[m];
            const isCurrent = m === currentMonth;
            const isLocked = m > currentMonth;
            return (
              <button
                key={m}
                onClick={() => {
                  onSelect(m);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4"
                style={{
                  background: isCurrent ? t.ink : t.card,
                  color: isCurrent ? t.bg : t.ink,
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: isCurrent ? 'rgba(217, 119, 87, 0.2)' : 'transparent',
                    border: isCurrent ? 'none' : `1px solid ${isLocked ? t.border : t.faint}`,
                  }}
                >
                  {isLocked ? (
                    <Lock size={14} style={{ color: t.faint }} />
                  ) : (
                    <span
                      className="text-sm tabular-nums"
                      style={{ fontFamily: FONTS.mono, color: isCurrent ? '#D97757' : t.ink }}
                    >
                      {m}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg leading-tight" style={{ fontFamily: FONTS.serif, fontWeight: 400 }}>
                    {p.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ fontFamily: FONTS.serif, fontStyle: 'italic', opacity: 0.7 }}
                  >
                    {p.tagline}
                  </div>
                </div>
                {isCurrent && (
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] tabular-nums px-2 py-1 rounded-full"
                    style={{ fontFamily: FONTS.mono, background: 'rgba(217, 119, 87, 0.2)', color: '#D97757' }}
                  >
                    Day {daysOnMonth + 1}
                  </div>
                )}
                {isLocked && <ChevronRight size={16} style={{ color: t.faint }} />}
              </button>
            );
          })}
        </div>
        <div
          className="mt-6 pt-4 text-xs leading-relaxed"
          style={{ borderTop: `1px solid ${t.border}`, fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}
        >
          You unlock the next month after 30 days in your current one — the app will
          suggest the advance and ask you to confirm.
        </div>
      </div>
    </div>
  );
}
