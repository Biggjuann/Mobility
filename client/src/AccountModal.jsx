import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme, FONTS } from './theme';
import { register, login, logout, getEmail } from './lib/sync';

// Minimum password length must match the server's policy.
const MIN_PASSWORD = 8;

export default function AccountModal({ onClose }) {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [currentEmail, setCurrentEmail] = useState(null);

  useEffect(() => {
    getEmail().then(setCurrentEmail);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    setBusy(true);
    try {
      if (mode === 'register') await register(trimmed, password);
      else await login(trimmed, password);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  const doLogout = async () => {
    await logout();
    window.location.reload();
  };

  const labelStyle = { fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.2em' };
  const inputStyle = {
    fontFamily: FONTS.sans,
    background: t.cardSolid,
    border: `1px solid ${t.border}`,
    color: t.ink,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(20, 17, 13, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: t.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: FONTS.serif, fontWeight: 400, color: t.ink }}>
            {currentEmail ? 'Your account' : mode === 'register' ? 'Create account' : 'Sign in'}
          </h2>
          <button onClick={onClose} style={{ color: t.faint }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {currentEmail ? (
          <div className="space-y-5">
            <div>
              <div className="mb-1 uppercase" style={{ ...labelStyle, color: t.faint }}>
                Signed in as
              </div>
              <div className="text-lg" style={{ fontFamily: FONTS.serif, color: t.ink }}>
                {currentEmail}
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              Your progress syncs to the cloud automatically. Sign in on any device to
              pick up where you left off.
            </p>
            <button
              onClick={doLogout}
              className="w-full py-3 rounded-full uppercase"
              style={{ ...labelStyle, border: `1px solid ${t.borderStrong}`, color: t.muted }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm leading-relaxed mb-2" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
              Sync your streak and progress across devices. Optional — the app works
              fully offline without an account.
            </p>
            <div>
              <label className="block mb-2 uppercase" style={{ ...labelStyle, color: t.faint }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block mb-2 uppercase" style={{ ...labelStyle, color: t.faint }}>
                Password
              </label>
              <input
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                style={inputStyle}
              />
              {mode === 'register' && (
                <div className="text-[11px] mt-1.5" style={{ fontFamily: FONTS.sans, color: t.faint }}>
                  At least {MIN_PASSWORD} characters.
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm" style={{ fontFamily: FONTS.sans, color: t.accent }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full uppercase disabled:opacity-50"
              style={{ ...labelStyle, background: t.btnBg, color: t.btnText }}
            >
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setError('');
              }}
              className="w-full text-center pt-1"
              style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: '13px', color: t.muted }}
            >
              {mode === 'register'
                ? 'Already have an account? Sign in'
                : 'New here? Create an account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
