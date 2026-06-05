import React from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Check, Circle, Play, XCircle, Lightbulb } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { richContent, drillAsset } from '../lib/drillContent';

// Hides its image on load error so missing assets degrade silently.
function SafeImage({ src, alt, style, className }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

export default function DrillDetail({ drill, isComplete, onToggle, onClose, onStartTimer }) {
  const t = useTheme();
  const rich = richContent(drill.id);
  const usesRich = !!rich;

  // Cues for the body of the page: rich content wins, otherwise fall back to
  // the simple coaching cues the program data carries today.
  const cues = (usesRich && rich.cues) || drill.cues || [];
  const avoid = (usesRich && rich.avoid) || drill.avoid;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
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

        {/* Title block */}
        <h1
          className="text-5xl leading-[0.95] text-center mb-3"
          style={{ fontFamily: FONTS.serif, fontWeight: 300, color: t.ink }}
        >
          {drill.name}
        </h1>
        <div
          className="text-center text-sm uppercase tracking-[0.25em] mb-4"
          style={{ fontFamily: FONTS.mono, color: t.accent }}
        >
          {drill.spec}
        </div>
        {rich?.description && (
          <p
            className="text-center text-sm leading-relaxed mb-8"
            style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}
          >
            {rich.description}
          </p>
        )}

        {/* Hero image (rich only) */}
        {rich?.heroImage && (
          <div className="mb-10 rounded-2xl overflow-hidden" style={{ background: t.card }}>
            <SafeImage src={drillAsset(rich.heroImage)} alt={drill.name} className="w-full" />
          </div>
        )}

        {/* Phase breakdown (rich only) */}
        {usesRich && rich.phases?.length > 0 && (
          <div className="space-y-10 mb-10">
            {rich.phases.map((p, i) => (
              <PhaseBlock key={p.id} t={t} index={i + 1} phase={p} />
            ))}
          </div>
        )}

        {/* Coaching cues (always) */}
        {cues.length > 0 && (
          <>
            <div
              className="text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: FONTS.mono, color: t.faint }}
            >
              Coaching Cues
            </div>
            <ul className="space-y-3 mb-10">
              {cues.map((cue, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base leading-relaxed"
                  style={{ fontFamily: FONTS.sans, color: t.ink }}
                >
                  {usesRich ? (
                    <Check
                      size={18}
                      strokeWidth={2.5}
                      style={{ color: t.accent, flexShrink: 0, marginTop: 4 }}
                    />
                  ) : (
                    <span style={{ color: t.accent, flexShrink: 0, marginTop: 8 }}>
                      <Circle size={5} fill="currentColor" />
                    </span>
                  )}
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Avoid */}
        {avoid && (
          <div className="rounded-2xl p-5 mb-10" style={{ background: t.accentSoft }}>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={16} style={{ color: t.accent }} strokeWidth={2} />
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ fontFamily: FONTS.mono, color: t.accent }}
              >
                Avoid
              </div>
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ fontFamily: FONTS.serif, color: t.ink }}
            >
              {avoid}
            </div>
            {rich?.avoidImage && (
              <SafeImage
                src={drillAsset(rich.avoidImage)}
                alt="What to avoid"
                className="w-full mt-4 rounded-xl"
              />
            )}
          </div>
        )}

        {/* Tip (rich only) */}
        {rich?.tip && (
          <div
            className="rounded-2xl p-4 mb-10 flex items-start gap-3"
            style={{ background: t.card }}
          >
            <Lightbulb size={18} strokeWidth={1.5} style={{ color: t.accent, marginTop: 2 }} />
            <div className="text-sm leading-relaxed" style={{ fontFamily: FONTS.serif, color: t.ink }}>
              <span style={{ fontWeight: 600 }}>Tip:</span> {rich.tip}
            </div>
          </div>
        )}

        {/* Start Timer */}
        {drill.timer && (
          <button
            onClick={() => onStartTimer(drill)}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-full"
            style={{
              background: t.btnBg,
              color: t.btnText,
              fontFamily: FONTS.mono,
              fontSize: '11px',
              letterSpacing: '0.2em',
            }}
          >
            <Play size={14} fill="currentColor" />
            START TIMER
          </button>
        )}
      </div>
    </div>
  );
}

function PhaseBlock({ t, index, phase }) {
  const breathUp = phase.breath === 'inhale';
  const BreathIcon = breathUp ? ArrowUp : ArrowDown;
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: `1.5px solid ${t.accent}`, color: t.accent, fontFamily: FONTS.mono, fontSize: '13px' }}
        >
          {index}
        </div>
        <div
          className="text-sm uppercase tracking-[0.25em]"
          style={{ fontFamily: FONTS.mono, color: t.accent, fontWeight: 600 }}
        >
          {phase.label}
        </div>
      </div>
      {phase.breath && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background: t.card }}
        >
          <BreathIcon size={14} style={{ color: t.accent }} />
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: FONTS.mono, color: t.ink }}
          >
            {phase.breath}
          </span>
        </div>
      )}
      {phase.image && (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: t.card }}>
          <SafeImage src={drillAsset(phase.image)} alt={phase.label} className="w-full" />
        </div>
      )}
      {phase.cues?.length > 0 && (
        <ul className="space-y-2">
          {phase.cues.map((c, i) => (
            <li
              key={i}
              className="flex gap-3 text-base leading-relaxed"
              style={{ fontFamily: FONTS.sans, color: t.ink }}
            >
              <span style={{ color: t.accent, flexShrink: 0, marginTop: 8 }}>
                <Circle size={5} fill="currentColor" />
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
