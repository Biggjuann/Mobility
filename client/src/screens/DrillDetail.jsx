import React from 'react';
import { ArrowLeft, Check, Circle, Play } from 'lucide-react';
import { useTheme, FONTS } from '../theme';

// Full-screen drill detail (visual guide screen 2). Back arrow returns; the
// check in the top-right marks the drill done.
export default function DrillDetail({ drill, isComplete, onToggle, onClose, onStartTimer }) {
  const t = useTheme();
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onClose} style={{ color: t.ink }} aria-label="Back">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onToggle(drill.id)}
            aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: isComplete ? t.accent : t.faint,
              background: isComplete ? t.accent : 'transparent',
            }}
          >
            <Check size={18} strokeWidth={2.5} color={isComplete ? '#fff' : t.faint} />
          </button>
        </div>

        <h1
          className="text-5xl leading-[0.95] text-center mb-3"
          style={{ fontFamily: FONTS.serif, fontWeight: 300, color: t.ink }}
        >
          {drill.name}
        </h1>
        <div
          className="text-center text-sm uppercase tracking-[0.25em] mb-12"
          style={{ fontFamily: FONTS.mono, color: t.accent }}
        >
          {drill.spec}
        </div>

        <div
          className="text-[10px] uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: FONTS.mono, color: t.faint }}
        >
          Coaching Cues
        </div>
        <ul className="space-y-3 mb-10">
          {drill.cues.map((cue, i) => (
            <li
              key={i}
              className="text-base leading-relaxed flex gap-3"
              style={{ fontFamily: FONTS.sans, color: t.muted }}
            >
              <span className="flex-shrink-0 mt-2" style={{ color: t.accent }}>
                <Circle size={5} fill="currentColor" />
              </span>
              <span>{cue}</span>
            </li>
          ))}
        </ul>

        <div
          className="rounded-2xl p-5 mb-10"
          style={{ background: t.accentSoft }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: FONTS.mono, color: t.accent }}
          >
            Avoid
          </div>
          <div
            className="text-sm leading-relaxed"
            style={{ fontFamily: FONTS.serif, color: t.ink }}
          >
            {drill.avoid}
          </div>
        </div>

        {drill.timer && (
          <button
            onClick={() => onStartTimer(drill)}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-full"
            style={{ background: t.btnBg, color: t.btnText, fontFamily: FONTS.mono, fontSize: '11px', letterSpacing: '0.2em' }}
          >
            <Play size={14} fill="currentColor" />
            START TIMER
          </button>
        )}
      </div>
    </div>
  );
}
