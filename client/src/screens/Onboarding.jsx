import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { PROGRAMS } from '../lib/program';

export default function Onboarding() {
  const t = useTheme();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [startMonth, setStartMonth] = useState(1);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('07:00');

  const finish = () => completeOnboarding({ startMonth, reminderTime, reminderEnabled });

  const Dots = ({ light }) => (
    <div className="flex justify-center gap-2 mt-10">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: i === step ? (light ? '#fff' : t.accent) : light ? 'rgba(255,255,255,0.3)' : t.border,
          }}
        />
      ))}
    </div>
  );

  // STEP 1 — Welcome (dark hero)
  if (step === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-between p-8"
        style={{ background: 'linear-gradient(160deg, #2b2622 0%, #14110d 100%)' }}
      >
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-5xl leading-tight text-stone-50 mb-5" style={{ fontFamily: FONTS.serif, fontWeight: 300 }}>
            Welcome to <span style={{ fontStyle: 'italic' }}>Mobility</span>
          </h1>
          <p className="text-lg leading-relaxed text-stone-300" style={{ fontFamily: FONTS.serif, fontStyle: 'italic' }}>
            A 6-month program designed to help you move better every day.
          </p>
        </div>
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-full bg-orange-200 text-stone-900"
            style={{ fontFamily: FONTS.mono, fontSize: '12px', letterSpacing: '0.25em' }}
          >
            LET'S BEGIN
          </button>
          <Dots light />
        </div>
      </div>
    );
  }

  // STEPS 2 & 3 — light, themed
  return (
    <div className="fixed inset-0 z-50 flex flex-col p-8" style={{ background: t.bg }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-12 overflow-y-auto">
        {step === 1 && (
          <>
            <h1 className="text-3xl mb-2" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
              Choose Your Start Month
            </h1>
            <p className="text-sm mb-8" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              Start with Month 1 (Foundation), or jump ahead if you're already mobile.
            </p>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((m) => {
                const p = PROGRAMS[m];
                const sel = m === startMonth;
                return (
                  <button
                    key={m}
                    onClick={() => setStartMonth(m)}
                    className="w-full text-left p-4 rounded-2xl flex items-center gap-4"
                    style={{ background: sel ? t.ink : t.card, color: sel ? t.bg : t.ink }}
                  >
                    <span className="text-sm tabular-nums w-5" style={{ fontFamily: FONTS.mono, color: sel ? '#D97757' : t.faint }}>
                      {m}
                    </span>
                    <div className="flex-1">
                      <div className="text-lg leading-tight" style={{ fontFamily: FONTS.serif }}>
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
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl mb-2" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
              Set Your Reminder
            </h1>
            <p className="text-sm mb-8" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              We'll remind you to move consistently. You can change this anytime.
            </p>
            <div className="rounded-2xl p-5 flex items-center justify-between mb-4" style={{ background: t.card }}>
              <span className="text-base" style={{ fontFamily: FONTS.sans, color: t.ink }}>
                Daily reminder
              </span>
              <button
                onClick={() => setReminderEnabled((v) => !v)}
                role="switch"
                aria-checked={reminderEnabled}
                className="w-11 h-6 rounded-full relative transition-colors"
                style={{ background: reminderEnabled ? t.accent : t.border }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: reminderEnabled ? '22px' : '2px' }} />
              </button>
            </div>
            {reminderEnabled && (
              <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: t.card }}>
                <span className="text-base" style={{ fontFamily: FONTS.sans, color: t.ink }}>
                  Time
                </span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-3 py-2 rounded-lg text-lg tabular-nums"
                  style={{ background: t.cardSolid, border: `1px solid ${t.border}`, color: t.ink, fontFamily: FONTS.mono }}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="max-w-md mx-auto w-full">
        <button
          onClick={step === 2 ? finish : () => setStep(step + 1)}
          className="w-full py-4 rounded-full"
          style={{ background: t.btnBg, color: t.btnText, fontFamily: FONTS.mono, fontSize: '12px', letterSpacing: '0.25em' }}
        >
          {step === 2 ? 'START MOVING' : 'CONTINUE'}
        </button>
        <Dots />
      </div>
    </div>
  );
}
