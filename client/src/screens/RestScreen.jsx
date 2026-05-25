import React from 'react';
import { Cloud } from 'lucide-react';
import { useTheme, FONTS } from '../theme';

// Rest / Recovery day (visual guide screen 10).
export default function RestScreen() {
  const t = useTheme();
  return (
    <div className="flex flex-col items-center text-center pt-16">
      <Cloud size={56} strokeWidth={1} style={{ color: t.faint }} className="mb-6" />
      <h1
        className="text-5xl mb-4"
        style={{ fontFamily: FONTS.serif, fontWeight: 300, color: t.ink }}
      >
        Rest Day
      </h1>
      <p
        className="text-base leading-relaxed max-w-xs mb-10"
        style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}
      >
        Full rest. Recovery is when adaptation happens.
      </p>

      <div
        className="w-full rounded-2xl p-6 text-left"
        style={{ background: t.card }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.3em] mb-3 text-center"
          style={{ fontFamily: FONTS.mono, color: t.faint }}
        >
          Optional
        </div>
        <p
          className="text-sm leading-relaxed text-center"
          style={{ fontFamily: FONTS.serif, color: t.ink }}
        >
          Take a 10–20 minute walk. Get outside. Breathe. Let your body recover.
        </p>
      </div>

      <p
        className="mt-10 text-sm"
        style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.faint }}
      >
        See you tomorrow.
      </p>
    </div>
  );
}
