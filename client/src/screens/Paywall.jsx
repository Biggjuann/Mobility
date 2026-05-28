import React, { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTheme, FONTS } from '../theme';
import { useStore } from '../store';
import { getPackages, purchase, restore, purchasesAvailable } from '../lib/purchases';

const BENEFITS = [
  'All 6 months — Foundation through Advanced',
  'Every daily session and the full drill library',
  'Progress tracking, streaks, and history',
  'Cloud sync across your devices',
];

// Static fallback prices shown when the store isn't reachable (web/dev preview).
const FALLBACK = {
  ANNUAL: { priceString: '$59.99', period: 'year' },
  MONTHLY: { priceString: '$9.99', period: 'month' },
};

export default function Paywall({ onClose }) {
  const t = useTheme();
  const { refreshPro } = useStore();
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState('ANNUAL');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  const pkgFor = (type) => packages.find((p) => p.packageType === type);
  const priceFor = (type) => pkgFor(type)?.product?.priceString || FALLBACK[type].priceString;

  const buy = async () => {
    const pkg = pkgFor(selected);
    if (!pkg) {
      setError('Subscriptions are available in the App Store version of the app.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const ok = await purchase(pkg);
      await refreshPro();
      if (ok) onClose();
      else setError('Purchase did not complete.');
    } catch (e) {
      // RevenueCat sets userCancelled on cancel — don't show an error then.
      if (!e?.userCancelled) setError(e?.message || 'Purchase failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const doRestore = async () => {
    setError('');
    setBusy(true);
    try {
      const ok = await restore();
      await refreshPro();
      if (ok) onClose();
      else setError('No active subscription found to restore.');
    } catch {
      setError('Could not restore purchases.');
    } finally {
      setBusy(false);
    }
  };

  const Plan = ({ type, label, sub, badge }) => {
    const on = selected === type;
    return (
      <button
        onClick={() => setSelected(type)}
        className="w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all"
        style={{ border: `1.5px solid ${on ? t.accent : t.border}`, background: on ? t.accentSoft : 'transparent' }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ border: `2px solid ${on ? t.accent : t.faint}`, background: on ? t.accent : 'transparent' }}
        >
          {on && <Check size={12} strokeWidth={3} color="#fff" />}
        </div>
        <div className="flex-1">
          <div className="text-base" style={{ fontFamily: FONTS.serif, color: t.ink }}>
            {label}
          </div>
          <div className="text-xs mt-0.5" style={{ fontFamily: FONTS.sans, color: t.muted }}>
            {sub}
          </div>
        </div>
        {badge && (
          <span
            className="text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded-full"
            style={{ fontFamily: FONTS.mono, background: t.accent, color: '#fff' }}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-6 pt-10 pb-12 min-h-screen flex flex-col">
        <div className="flex justify-end">
          <button onClick={onClose} style={{ color: t.faint }} aria-label="Close">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-2 mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: FONTS.mono, color: t.accent }}>
            Mobility Pro
          </div>
          <h1 className="text-4xl leading-tight" style={{ fontFamily: FONTS.serif, fontWeight: 300, color: t.ink }}>
            Unlock the full 6-month method
          </h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ fontFamily: FONTS.serif, fontStyle: 'italic', color: t.muted }}>
            Month 1 is free forever. Go Pro to keep progressing through deeper range,
            load, and end-range strength.
          </p>
        </div>

        <ul className="space-y-3 mb-8">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-3 text-sm" style={{ fontFamily: FONTS.sans, color: t.ink }}>
              <Check size={18} strokeWidth={2.5} style={{ color: t.accent, flexShrink: 0 }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3 mb-6">
          <Plan
            type="ANNUAL"
            label={`${priceFor('ANNUAL')} / year`}
            sub="7-day free trial, then billed yearly"
            badge="Best value"
          />
          <Plan
            type="MONTHLY"
            label={`${priceFor('MONTHLY')} / month`}
            sub="Billed monthly, cancel anytime"
          />
        </div>

        {error && (
          <div className="text-sm mb-4" style={{ fontFamily: FONTS.sans, color: t.accent }}>
            {error}
          </div>
        )}

        <button
          onClick={buy}
          disabled={busy}
          className="w-full py-4 rounded-full uppercase disabled:opacity-50"
          style={{ background: t.btnBg, color: t.btnText, fontFamily: FONTS.mono, fontSize: '12px', letterSpacing: '0.2em' }}
        >
          {busy ? 'Please wait…' : selected === 'ANNUAL' ? 'Start free trial' : 'Subscribe'}
        </button>

        <button
          onClick={doRestore}
          disabled={busy}
          className="w-full text-center mt-3 py-2"
          style={{ fontFamily: FONTS.sans, fontSize: '13px', color: t.muted }}
        >
          Restore purchases
        </button>

        <div className="mt-auto pt-8">
          <p className="text-[11px] leading-relaxed text-center" style={{ fontFamily: FONTS.sans, color: t.faint }}>
            Payment is charged to your Apple ID. Subscriptions renew automatically
            unless canceled at least 24 hours before the period ends; manage or cancel
            in your App Store account settings. The free trial converts to a paid
            subscription unless canceled during the trial.
          </p>
          {!purchasesAvailable() && (
            <p className="text-[11px] text-center mt-3" style={{ fontFamily: FONTS.sans, color: t.faint }}>
              Purchases are only available in the App Store version.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
