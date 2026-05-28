import React, { useState } from 'react';
import { Flame, User, ChevronDown, ArrowRight } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getSession, getMorning, DAY_KEYS, DAY_SHORT, DAY_LONG, PROGRAMS } from '../lib/program';
import DrillCard from '../components/DrillCard';
import RestScreen from './RestScreen';

export default function TodayScreen({ onOpenMonthPicker, onOpenAccount, onOpenDrill, onPaywall }) {
  const t = useTheme();
  const {
    currentMonth,
    viewMonth,
    setViewMonth,
    daysOnMonth,
    canAdvance,
    streak,
    isComplete,
    toggleComplete,
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

  const label = (text, extra) => (
    <div
      className="text-[10px] uppercase tracking-[0.3em]"
      style={{ fontFamily: FONTS.mono, color: t.faint, ...extra }}
    >
      {text}
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <button onClick={onOpenMonthPicker} className="flex flex-col items-start group">
          <div
            className="text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center gap-1.5"
            style={{ fontFamily: FONTS.mono, color: t.faint }}
          >
            Month {String(viewMonth).padStart(2, '0')} · {viewProgram.name}
            <ChevronDown size={11} style={{ color: t.faint }} />
          </div>
          <h1
            className="text-2xl"
            style={{ fontFamily: FONTS.serif, fontWeight: 400, fontStyle: 'italic', color: t.ink }}
          >
            Mobility
          </h1>
        </button>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <Flame size={14} style={{ color: t.accent }} fill="currentColor" />
              <span className="text-sm tabular-nums" style={{ fontFamily: FONTS.mono, color: t.ink }}>
                {streak}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono, color: t.faint }}>
                day{streak !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button onClick={onOpenAccount} aria-label="Account" className="p-1 -mr-1" style={{ color: t.faint }}>
            <User size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* ADVANCEMENT BANNER */}
      {canAdvance && (
        <div
          className="mb-8 p-5 rounded-2xl animate-slideDown"
          style={{ border: `1px solid ${t.accent}55`, background: t.accentSoft }}
        >
          <div className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: FONTS.mono, color: t.accent }}>
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
              onClick={() => ((currentMonth + 1 > 1 && !isPro) ? onPaywall() : advanceMonth())}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: t.btnBg, color: t.btnText, fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' }}
            >
              {(!isPro && currentMonth + 1 > 1) ? 'UNLOCK' : 'ADVANCE'} <ArrowRight size={12} />
            </button>
            <button
              onClick={dismissAdvance}
              className="px-4 py-2 rounded-full"
              style={{ color: t.muted, fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' }}
            >
              NOT YET
            </button>
          </div>
        </div>
      )}

      {/* VIEWING PREVIEW NOTICE */}
      {!isViewingCurrentMonth && (
        <div
          className="mb-6 px-4 py-3 rounded-xl flex items-center justify-between"
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

      {/* DAY SELECTOR */}
      <div className="flex gap-1 mb-10 -mx-1">
        {DAY_SHORT.map((lbl, i) => {
          const isActive = i === selectedDay;
          const isCurrent = i === today;
          return (
            <button
              key={lbl}
              onClick={() => setSelectedDay(i)}
              className="flex-1 py-3 rounded-md transition-all relative"
              style={{ background: isActive ? t.ink : 'transparent', color: isActive ? t.bg : t.faint }}
            >
              <div className="text-[10px] tracking-[0.15em]" style={{ fontFamily: FONTS.mono }}>
                {lbl}
              </div>
              {isCurrent && !isActive && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: t.accent }} />
              )}
            </button>
          );
        })}
      </div>

      {isRestDay ? (
        <RestScreen />
      ) : (
        <>
          {/* DAY HEADING */}
          <div className="mb-2">
            {label(isToday && isViewingCurrentMonth ? 'Today' : DAY_LONG[selectedDay], { marginBottom: '0.5rem' })}
            <h2 className="text-5xl leading-[0.95] mb-3" style={{ fontFamily: FONTS.serif, fontWeight: 300, color: t.ink }}>
              {session.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              {session.intro}
            </p>
          </div>

          {/* PROGRESS METER */}
          {totalCount > 0 && isViewingCurrentMonth && (
            <div className="mt-8 mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: FONTS.mono, color: t.faint }}>
                  Today's Progress
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] tabular-nums" style={{ fontFamily: FONTS.mono, color: t.muted }}>
                  {totalDone} / {totalCount}
                </span>
              </div>
              <div className="h-px relative overflow-hidden" style={{ background: t.border }}>
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{ width: `${(totalDone / totalCount) * 100}%`, background: t.accent, height: '2px', top: '-0.5px' }}
                />
              </div>
            </div>
          )}

          {/* MORNING SECTION */}
          <Section
            t={t}
            num="01"
            title="Morning Routine"
            intro={morning.intro}
            done={morningDone}
            count={morning.drills.length}
            showCount={isViewingCurrentMonth}
          >
            {morning.drills.map((d, i) => (
              <DrillCard
                key={d.id}
                drill={d}
                index={i}
                isComplete={isComplete(d.id)}
                onOpen={() => onOpenDrill(d)}
                onToggle={toggleComplete}
              />
            ))}
          </Section>

          {/* DEEP SESSION */}
          {session.drills.length > 0 && (
            <Section
              t={t}
              num="02"
              title={session.title}
              done={deepDone}
              count={session.drills.length}
              showCount={isViewingCurrentMonth}
              topMargin="mt-16"
            >
              {session.drills.map((d, i) => (
                <DrillCard
                  key={d.id}
                  drill={d}
                  index={i}
                  isComplete={isComplete(d.id)}
                  onOpen={() => onOpenDrill(d)}
                  onToggle={toggleComplete}
                />
              ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({ t, num, title, intro, done, count, showCount, topMargin = 'mt-12', children }) {
  return (
    <section className={topMargin}>
      <div className="flex items-baseline justify-between mb-1 pb-3" style={{ borderBottom: `1px solid ${t.borderStrong}` }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ fontFamily: FONTS.mono, color: t.faint }}>
            {num}
          </div>
          <h3 className="text-2xl" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
            {title}
          </h3>
        </div>
        {showCount && (
          <div className="text-[10px] uppercase tracking-[0.2em] tabular-nums" style={{ fontFamily: FONTS.mono, color: t.faint }}>
            {done}/{count}
          </div>
        )}
      </div>
      {intro && (
        <p className="mt-3 mb-2 text-xs leading-relaxed pl-1" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
          {intro}
        </p>
      )}
      <div>{children}</div>
    </section>
  );
}
