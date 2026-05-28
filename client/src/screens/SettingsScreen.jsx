import React, { useState } from 'react';
import {
  CalendarDays,
  RotateCcw,
  Bell,
  Volume2,
  Moon,
  Info,
  AlertTriangle,
  User,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { PROGRAMS } from '../lib/program';

function Toggle({ on, onChange, t }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
      style={{ background: on ? t.accent : t.border }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? '22px' : '2px' }}
      />
    </button>
  );
}

function Row({ t, icon, label, value, onClick, right }) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 text-left"
      style={{ borderBottom: `1px solid ${t.border}` }}
    >
      <span style={{ color: t.faint }}>{icon}</span>
      <span className="flex-1 text-base" style={{ fontFamily: FONTS.sans, color: t.ink }}>
        {label}
      </span>
      {value && (
        <span className="text-sm" style={{ fontFamily: FONTS.mono, color: t.faint }}>
          {value}
        </span>
      )}
      {right}
    </Wrapper>
  );
}

export default function SettingsScreen({ onChangeMonth, onOpenAccount, onPaywall }) {
  const t = useTheme();
  const { currentMonth, settings, updateSettings, resetProgress, isPro, restorePurchases } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [open, setOpen] = useState(null); // 'about' | 'injury' | null
  const [restoreMsg, setRestoreMsg] = useState('');

  const ICON = { size: 18, strokeWidth: 1.5 };

  return (
    <div>
      <h1 className="text-3xl mb-8" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
        Settings
      </h1>

      <Row
        t={t}
        icon={<User {...ICON} />}
        label="Account"
        onClick={onOpenAccount}
        right={<ChevronRight size={16} style={{ color: t.faint }} />}
      />

      <Row
        t={t}
        icon={<Sparkles {...ICON} />}
        label={isPro ? 'Mobility Pro' : 'Go Pro — unlock all months'}
        value={isPro ? 'Active' : undefined}
        onClick={isPro ? undefined : onPaywall}
        right={isPro ? null : <ChevronRight size={16} style={{ color: t.faint }} />}
      />

      {!isPro && (
        <>
          <Row
            t={t}
            icon={<RefreshCw {...ICON} />}
            label="Restore Purchases"
            onClick={async () => {
              setRestoreMsg('Checking…');
              const ok = await restorePurchases();
              setRestoreMsg(ok ? 'Purchases restored.' : 'No active subscription found.');
            }}
            right={<ChevronRight size={16} style={{ color: t.faint }} />}
          />
          {restoreMsg && (
            <div className="py-2 pl-9 text-sm" style={{ fontFamily: FONTS.sans, color: t.muted }}>
              {restoreMsg}
            </div>
          )}
        </>
      )}

      <Row
        t={t}
        icon={<CalendarDays {...ICON} />}
        label="Change Current Month"
        value={`Month ${currentMonth}`}
        onClick={onChangeMonth}
        right={<ChevronRight size={16} style={{ color: t.faint }} />}
      />

      {/* Reset progress with inline confirmation */}
      {confirmReset ? (
        <div className="py-4" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="text-sm mb-3" style={{ fontFamily: FONTS.serif, color: t.ink }}>
            Reset all progress? This clears your streak, history, and returns you to
            Month 1. This can't be undone.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-full"
              style={{ background: t.accent, color: '#fff', fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' }}
            >
              RESET EVERYTHING
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-full"
              style={{ color: t.muted, fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <Row
          t={t}
          icon={<RotateCcw {...ICON} />}
          label="Reset Progress"
          onClick={() => setConfirmReset(true)}
          right={<ChevronRight size={16} style={{ color: t.faint }} />}
        />
      )}

      {/* Reminders */}
      <Row
        t={t}
        icon={<Bell {...ICON} />}
        label="Reminders"
        value={settings.reminderEnabled ? `Daily at ${settings.reminderTime}` : 'Off'}
        right={
          <Toggle
            t={t}
            on={settings.reminderEnabled}
            onChange={() => updateSettings({ reminderEnabled: !settings.reminderEnabled })}
          />
        }
      />
      {settings.reminderEnabled && (
        <div className="py-3 pl-9 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono, color: t.faint }}>
            Time
          </span>
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => updateSettings({ reminderTime: e.target.value })}
            className="px-3 py-1.5 rounded-lg"
            style={{ background: t.cardSolid, border: `1px solid ${t.border}`, color: t.ink, fontFamily: FONTS.mono }}
          />
        </div>
      )}

      <Row
        t={t}
        icon={<Volume2 {...ICON} />}
        label="Sound & Vibration"
        right={<Toggle t={t} on={settings.sound} onChange={() => updateSettings({ sound: !settings.sound })} />}
      />

      <Row
        t={t}
        icon={<Moon {...ICON} />}
        label="Dark Mode"
        right={<Toggle t={t} on={settings.darkMode} onChange={() => updateSettings({ darkMode: !settings.darkMode })} />}
      />

      <Row
        t={t}
        icon={<Info {...ICON} />}
        label="About the Program"
        onClick={() => setOpen(open === 'about' ? null : 'about')}
        right={<ChevronRight size={16} style={{ color: t.faint, transform: open === 'about' ? 'rotate(90deg)' : 'none' }} />}
      />
      {open === 'about' && (
        <Disclosure t={t}>
          Mobility is a 6-month progressive program adapted from end-range strength
          training. Each month builds on the last — from gentle foundations to loaded,
          full-range strength. A short morning routine plus a focused daily session.
        </Disclosure>
      )}

      <Row
        t={t}
        icon={<AlertTriangle {...ICON} />}
        label="Injury Disclaimer"
        onClick={() => setOpen(open === 'injury' ? null : 'injury')}
        right={<ChevronRight size={16} style={{ color: t.faint, transform: open === 'injury' ? 'rotate(90deg)' : 'none' }} />}
      />
      {open === 'injury' && (
        <Disclosure t={t}>
          This app provides general fitness guidance and is not medical advice. Consult
          a healthcare professional before starting, especially with existing injuries
          or conditions. Stop immediately if you feel sharp pain. You exercise at your
          own risk.
        </Disclosure>
      )}

      <div className="text-center mt-12 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: FONTS.mono, color: t.faint }}>
        {PROGRAMS[currentMonth].name} · Move slow · Breathe
      </div>
    </div>
  );
}

function Disclosure({ t, children }) {
  return (
    <div className="py-4 pl-9 pr-2 text-sm leading-relaxed" style={{ borderBottom: `1px solid ${t.border}`, fontFamily: FONTS.serif, color: t.muted }}>
      {children}
    </div>
  );
}
