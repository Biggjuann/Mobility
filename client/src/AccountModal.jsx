import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { register, login, logout, getEmail } from './lib/sync';

// Minimum password length must match the server's policy.
const MIN_PASSWORD = 8;

export default function AccountModal({ onClose }) {
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
      // Re-run the app's load effect against freshly synced local state.
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

  const labelStyle = {
    fontFamily: 'Geist Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.2em',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(20, 17, 13, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: '#F5F1EA' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl text-stone-900"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}
          >
            {currentEmail ? 'Your account' : mode === 'register' ? 'Create account' : 'Sign in'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X size={20} />
          </button>
        </div>

        {currentEmail ? (
          <div className="space-y-5">
            <div>
              <div className="text-stone-500 mb-1 uppercase" style={labelStyle}>
                Signed in as
              </div>
              <div
                className="text-lg text-stone-900"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {currentEmail}
              </div>
            </div>
            <p
              className="text-sm text-stone-600 leading-relaxed"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}
            >
              Your progress syncs to the cloud automatically. Sign in on any device
              to pick up where you left off.
            </p>
            <button
              onClick={doLogout}
              className="w-full py-3 rounded-full border border-stone-400 text-stone-700 hover:bg-stone-200/60 uppercase"
              style={labelStyle}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p
              className="text-sm text-stone-600 leading-relaxed mb-2"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}
            >
              Sync your streak and progress across devices. Optional — the app works
              fully offline without an account.
            </p>
            <div>
              <label className="block text-stone-500 mb-2 uppercase" style={labelStyle}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-500"
                style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
              />
            </div>
            <div>
              <label className="block text-stone-500 mb-2 uppercase" style={labelStyle}>
                Password
              </label>
              <input
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-500"
                style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
              />
              {mode === 'register' && (
                <div className="text-[11px] text-stone-500 mt-1.5" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                  At least {MIN_PASSWORD} characters.
                </div>
              )}
            </div>

            {error && (
              <div
                className="text-sm text-orange-700"
                style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full bg-stone-900 text-orange-100 hover:bg-stone-800 disabled:opacity-50 uppercase"
              style={labelStyle}
            >
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setError('');
              }}
              className="w-full text-center text-stone-600 hover:text-stone-900 pt-1"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '13px' }}
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
