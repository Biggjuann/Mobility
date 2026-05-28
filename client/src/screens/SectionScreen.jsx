import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import DrillCard from '../components/DrillCard';

// Pushed when the user taps a section card on the Today screen. Shows the
// drill list for that section (morning routine, or the day's deep session).
export default function SectionScreen({ section, onClose, onOpenDrill }) {
  const t = useTheme();
  const { isComplete, toggleComplete } = useStore();
  const done = section.drills.filter((d) => isComplete(d.id)).length;
  const total = section.drills.length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <button onClick={onClose} aria-label="Back" className="mb-8" style={{ color: t.ink }}>
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>

        <h1
          className="text-4xl leading-tight mb-3"
          style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}
        >
          {section.title}
        </h1>
        {section.intro && (
          <p
            className="text-sm mb-8"
            style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}
          >
            {section.intro}
          </p>
        )}

        {total > 0 && (
          <div className="mb-6">
            <div
              className="flex items-center justify-between mb-2"
              style={{ fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' }}
            >
              <span style={{ color: t.faint, textTransform: 'uppercase' }}>Section progress</span>
              <span style={{ color: t.muted }} className="tabular-nums">
                {done} / {total}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: t.border,
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: t.accent,
                  borderRadius: 999,
                  transition: 'width 0.5s',
                }}
              />
            </div>
          </div>
        )}

        <div>
          {section.drills.map((d, i) => (
            <DrillCard
              key={d.id}
              drill={d}
              index={i}
              isComplete={isComplete(d.id)}
              onOpen={() => onOpenDrill(d)}
              onToggle={toggleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
