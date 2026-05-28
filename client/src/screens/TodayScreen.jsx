import React, { useState } from 'react';
import { Flame, ChevronDown, ArrowRight } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getSession, getMorning, DAY_KEYS, DAY_SHORT, DAY_LONG, PROGRAMS } from '../lib/program';
import RestScreen from './RestScreen';

export default function TodayScreen({ onOpenMonthPicker, onOpenSection, onPaywall }) {
  const t = useTheme();
  const {
    currentMonth,
    viewMonth,
    setViewMonth,
    daysOnMonth,
    canAdvance,
    streak,
    isComplete,
    advanceMonth,
    dismissAdvance,
    isPro,
  } = useStore();

  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);

  const dayKey = DAY_KEYS[selectedDay];
  const session = getSession(viewMonth, dayKey);
  const morning = getMorning(viewMonth);
  const viewProgram = PROGRAMS[viewMonth];

  const isToday = selectedDay === today;
  const isViewingCurrentMonth = viewMonth === currentMonth;
  const isRestDay = dayKey === 'sunday';

  const morningDone = morning.drills.filter((d) => isComplete(d.id)).length;
  const deepDone = session.drills.filter((d) => isComplete(d.id)).length;
  const totalDone = morningDone + deepDone;
  const totalCount = morning.drills.length + session.drills.length;
  const pct = totalCount ? (totalDone / totalCount) * 100 : 0;

  const advanceLabel = !isPro && currentMonth + 1 > 1 ? 'UNLOCK' : 'ADVANCE';
  const onAdvanceClick = () =>
    !isPro && currentMonth + 1 > 1 ? onPaywall() : advanceMonth();

  return (
    <div>
      {/* HEADER */}
      <header className="flex justify-between items-start mb-6">
        <button onClick={onOpenMonthPicker} className="flex flex-col items-start text-left">
          <div
            className="flex items-center gap-1.5 mb-2"
            style={{ fontFamily: FONTS.serif, fontSize: '14px', color: t.muted }}
          >
            Month {String(viewMonth).padStart(2, '0')} · {viewProgram.name}
            <ChevronDown size={12} style={{ color: t.faint }} />
          </div>
          <h1
            style={{
              fontFamily: FONTS.serif,
              fontSize: '46px',
              fontWeight: 400,
              color: t.ink,
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            Mobility
          </h1>
        </button>

        {streak > 0 && (
          <div className="flex items-start gap-2 pt-2">
            <Flame size={22} style={{ color: t.accent }} fill="currentColor" />
            <div>
              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: '30px',
                  lineHeight: 1,
                  color: t.ink,
                }}
                className="tabular-nums"
              >
                {streak}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: '12px',
                  color: t.muted,
                  marginTop: 4,
                }}
              >
                day streak
              </div>
            </div>
          </div>
        )}
      </header>

      {/* DAY SELECTOR */}
      <div className="pb-3 mb-2" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex justify-between items-center">
          {DAY_SHORT.map((lbl, i) => {
            const isActive = i === selectedDay;
            const isCurrent = i === today;
            return (
              <button
                key={lbl}
                onClick={() => setSelectedDay(i)}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: isActive ? t.ink : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      color: isActive ? t.bg : t.faint,
                    }}
                  >
                    {lbl}
                  </span>
                </div>
                {isCurrent && !isActive && (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: t.accent,
                      marginTop: 4,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ADVANCE BANNER */}
      {canAdvance && (
        <div
          className="mt-6 p-5 rounded-2xl animate-slideDown"
          style={{ border: `1px solid ${t.accent}55`, background: t.accentSoft }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: FONTS.mono, color: t.accent }}
          >
            You've earned this
          </div>
          <div className="text-lg mb-1" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
            30 days on {viewProgram.name}.
          </div>
          <div className="text-sm mb-4" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
            Ready to step into{' '}
            <strong style={{ fontStyle: 'normal' }}>{PROGRAMS[currentMonth + 1].name}</strong>?
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAdvanceClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: t.btnBg,
                color: t.btnText,
                fontFamily: FONTS.mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
              }}
            >
              {advanceLabel} <ArrowRight size={12} />
            </button>
            <button
              onClick={dismissAdvance}
              className="px-4 py-2 rounded-full"
              style={{
                color: t.muted,
                fontFamily: FONTS.mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
              }}
            >
              NOT YET
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW NOTICE */}
      {!isViewingCurrentMonth && (
        <div
          className="mt-6 px-4 py-3 rounded-xl flex items-center justify-between"
          style={{ background: t.card, border: `1px solid ${t.border}` }}
        >
          <div className="text-xs" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
            {viewMonth > currentMonth ? 'Previewing future month' : 'Reviewing earlier month'}
          </div>
          <button
            onClick={() => setViewMonth(currentMonth)}
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: FONTS.mono, color: t.accent }}
          >
            Return →
          </button>
        </div>
      )}

      {isRestDay ? (
        <RestScreen />
      ) : (
        <>
          {/* TODAY HEADING */}
          <div className="mt-6 mb-6">
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: '17px',
                color: t.accent,
              }}
            >
              {isToday && isViewingCurrentMonth ? 'Today' : DAY_LONG[selectedDay]}
            </div>
            <h2
              style={{
                fontFamily: FONTS.serif,
                fontSize: '40px',
                fontWeight: 400,
                color: t.ink,
                lineHeight: 1.05,
                marginTop: 6,
                letterSpacing: '-0.01em',
              }}
            >
              {session.title}
            </h2>
            <p
              style={{
                fontFamily: FONTS.serif,
                fontStyle: 'italic',
                color: t.muted,
                marginTop: 10,
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {session.intro}
            </p>
          </div>

          {/* PROGRESS */}
          {totalCount > 0 && isViewingCurrentMonth && (
            <div className="mb-6">
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: t.faint,
                  marginBottom: 8,
                }}
              >
                Today's Progress
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontWeight: 500,
                  fontSize: '22px',
                  color: t.ink,
                  marginBottom: 12,
                }}
                className="tabular-nums"
              >
                {totalDone} / {totalCount} Drills Completed
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

          {/* SECTION CARDS */}
          <div className="space-y-3">
            {morning.drills.length > 0 && (
              <SectionCard
                t={t}
                number="01"
                title="Morning Routine"
                subtitle={`${morning.drills.length} drills · Start your day right.`}
                done={morningDone}
                total={morning.drills.length}
                showCount={isViewingCurrentMonth}
                onClick={() =>
                  onOpenSection({
                    title: 'Morning Routine',
                    intro: morning.intro,
                    drills: morning.drills,
                  })
                }
              />
            )}
            {session.drills.length > 0 && (
              <SectionCard
                t={t}
                number="02"
                title={session.title}
                subtitle={`${session.drills.length} drills · Today's focus.`}
                done={deepDone}
                total={session.drills.length}
                showCount={isViewingCurrentMonth}
                onClick={() =>
                  onOpenSection({
                    title: session.title,
                    intro: session.intro,
                    drills: session.drills,
                  })
                }
              />
            )}
          </div>

          <MountainBackdrop t={t} />
        </>
      )}
    </div>
  );
}

function SectionCard({ t, number, title, subtitle, done, total, showCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all"
      style={{ background: t.card, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <div style={{ width: 3, height: 32, background: t.accent, borderRadius: 2 }} />
        <span
          className="tabular-nums"
          style={{ fontFamily: FONTS.mono, color: t.accent, fontSize: '13px' }}
        >
          {number}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 600,
            fontSize: '16px',
            color: t.ink,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: '13px',
            color: t.muted,
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>
      {showCount && (
        <div
          className="tabular-nums"
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 600,
            fontSize: '17px',
            color: t.ink,
          }}
        >
          {done} / {total}
        </div>
      )}
    </button>
  );
}

function MountainBackdrop({ t }) {
  return (
    <div
      className="mt-12 -mx-6"
      style={{ height: 120, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden
    >
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMax slice"
        style={{ width: '100%', height: '100%', opacity: 0.32 }}
      >
        <path
          d="M0,200 L0,140 L40,108 L80,128 L120,86 L160,118 L200,76 L240,108 L280,86 L320,118 L360,98 L400,128 L400,200 Z"
          fill={t.dark ? '#3a3530' : '#a8a29e'}
        />
        <path
          d="M0,200 L0,170 L60,150 L100,162 L150,134 L200,150 L260,128 L320,150 L400,140 L400,200 Z"
          fill={t.dark ? '#26221f' : '#78716c'}
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
