import React from 'react';
import { Check, ChevronRight, Play } from 'lucide-react';
import { useTheme, FONTS } from '../theme';

// A single drill row on the Today screen. The checkbox toggles completion;
// tapping the row opens the full Drill Detail screen.
export default function DrillCard({ drill, index, isComplete, onOpen, onToggle }) {
  const t = useTheme();
  return (
    <div
      className="border-b last:border-b-0"
      style={{
        borderColor: t.border,
        background: isComplete ? t.accentSoft : 'transparent',
      }}
    >
      <button onClick={onOpen} className="w-full px-1 py-5 flex items-start gap-4 text-left">
        <div className="flex-shrink-0 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(drill.id);
            }}
            aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: isComplete ? t.accent : t.faint,
              background: isComplete ? t.accent : 'transparent',
            }}
          >
            {isComplete && <Check size={14} strokeWidth={3} color="#fff" />}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-xs tabular-nums"
              style={{ fontFamily: FONTS.mono, color: t.faint }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3
              className="text-xl leading-tight"
              style={{
                fontFamily: FONTS.serif,
                fontWeight: 400,
                color: t.ink,
                textDecoration: isComplete ? 'line-through' : 'none',
                textDecorationColor: 'rgba(217, 119, 87, 0.5)',
                textDecorationThickness: '1px',
              }}
            >
              {drill.name}
            </h3>
          </div>
          <div
            className="text-xs uppercase tracking-[0.15em] pl-7 flex items-center gap-2"
            style={{ fontFamily: FONTS.mono, color: t.faint }}
          >
            {drill.spec}
            {drill.timer && <Play size={10} fill="currentColor" />}
          </div>
        </div>
        <ChevronRight
          size={18}
          strokeWidth={1.5}
          className="mt-2 flex-shrink-0"
          style={{ color: t.faint }}
        />
      </button>
    </div>
  );
}
