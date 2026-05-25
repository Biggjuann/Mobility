import React from 'react';
import { Lock, Check } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { PROGRAMS } from '../lib/program';

const WHAT_YOU_NEED = ['Bodyweight', 'Chair or wall', '5–15 lb dumbbell', 'Resistance band', 'Pull-up bar'];

export default function ProgramScreen({ onPreviewMonth }) {
  const t = useTheme();
  const { currentMonth } = useStore();

  return (
    <div>
      <h1 className="text-4xl leading-tight mb-3" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
        The Mobility Method
      </h1>
      <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
        A 6-month journey to better mobility, strength, and daily freedom.
      </p>

      {/* Progress dots */}
      <div className="flex items-center justify-between mb-10 px-2">
        {[1, 2, 3, 4, 5, 6].map((m, i) => {
          const done = m < currentMonth;
          const active = m === currentMonth;
          return (
            <React.Fragment key={m}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs tabular-nums"
                style={{
                  fontFamily: FONTS.mono,
                  background: active ? t.accent : done ? t.accentSoft : 'transparent',
                  border: active || done ? 'none' : `1px solid ${t.border}`,
                  color: active ? '#fff' : done ? t.accent : t.faint,
                }}
              >
                {done ? <Check size={14} strokeWidth={3} /> : m}
              </div>
              {i < 5 && <div className="flex-1 h-px mx-1" style={{ background: t.border }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Month roadmap */}
      <div className="space-y-2 mb-10">
        {[1, 2, 3, 4, 5, 6].map((m) => {
          const p = PROGRAMS[m];
          const isCurrent = m === currentMonth;
          const isLocked = m > currentMonth;
          return (
            <button
              key={m}
              onClick={() => onPreviewMonth(m)}
              className="w-full text-left p-4 rounded-2xl flex items-center gap-4"
              style={{ background: isCurrent ? t.ink : t.card, color: isCurrent ? t.bg : t.ink }}
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: isCurrent ? 'rgba(217,119,87,0.2)' : 'transparent',
                  border: isCurrent ? 'none' : `1px solid ${isLocked ? t.border : t.faint}`,
                }}
              >
                {isLocked ? (
                  <Lock size={13} style={{ color: t.faint }} />
                ) : (
                  <span className="text-sm tabular-nums" style={{ fontFamily: FONTS.mono, color: isCurrent ? '#D97757' : t.ink }}>
                    {m}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="text-lg leading-tight" style={{ fontFamily: FONTS.serif, fontWeight: 400 }}>
                  {p.name}
                </div>
                <div className="text-xs mt-0.5" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', opacity: 0.75 }}>
                  {p.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <InfoBlock t={t} title="What You Need">
        <ul className="space-y-1.5">
          {WHAT_YOU_NEED.map((item) => (
            <li key={item} className="text-sm" style={{ fontFamily: FONTS.sans, color: t.ink }}>
              {item}
            </li>
          ))}
        </ul>
      </InfoBlock>

      <InfoBlock t={t} title="How It Works">
        <p className="text-sm leading-relaxed" style={{ fontFamily: FONTS.serif, color: t.ink }}>
          Stay in each month for 30 days. The work gets progressively harder — less
          support, deeper ranges, then light load. After 30 days you unlock the next.
        </p>
      </InfoBlock>

      <InfoBlock t={t} title="Safety First">
        <p className="text-sm leading-relaxed" style={{ fontFamily: FONTS.serif, color: t.ink }}>
          Stop short of pain. Move slow. Breathe. Be consistent. Mobility is built
          over months, not days.
        </p>
      </InfoBlock>
    </div>
  );
}

function InfoBlock({ t, title, children }) {
  return (
    <div className="mb-8">
      <div className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ fontFamily: FONTS.mono, color: t.accent }}>
        {title}
      </div>
      {children}
    </div>
  );
}
