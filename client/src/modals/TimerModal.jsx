import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Pause, X } from 'lucide-react';
import { FONTS } from '../theme';
import { useStore } from '../store';
import { formatTime } from '../lib/dates';

// Immersive dark timer (matches the visual guide) regardless of app theme.
export default function TimerModal({ drill, onClose, onComplete }) {
  const { settings } = useStore();
  const { duration, sides } = drill.timer;
  const [side, setSide] = useState(1);
  const [seconds, setSeconds] = useState(duration);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds !== 0) return;
    if (settings.sound) {
      if (navigator.vibrate) navigator.vibrate(200);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {}
    }
    if (side < sides) {
      setTimeout(() => {
        setSide(side + 1);
        setSeconds(duration);
      }, 1500);
    } else {
      setDone(true);
      setRunning(false);
    }
  }, [seconds, side, sides, duration, settings.sound]);

  const progress = ((duration - seconds) / duration) * 100;
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (progress / 100) * circumference;

  const handleComplete = () => {
    onComplete(drill.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(20, 17, 13, 0.96)', backdropFilter: 'blur(8px)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-stone-300 hover:text-white p-2"
        aria-label="Close timer"
      >
        <X size={24} strokeWidth={1.5} />
      </button>
      <div className="w-full max-w-sm flex flex-col items-center">
        <div
          className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-3"
          style={{ fontFamily: FONTS.mono }}
        >
          {sides > 1 ? `Side ${side} of ${sides}` : 'Hold'}
        </div>
        <h2
          className="text-3xl text-stone-50 mb-12 text-center"
          style={{ fontFamily: FONTS.serif, fontWeight: 400 }}
        >
          {drill.name}
        </h2>
        <div className="relative w-72 h-72 mb-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="#D97757"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-7xl text-stone-50 tabular-nums"
              style={{ fontFamily: FONTS.serif, fontWeight: 300 }}
            >
              {formatTime(seconds)}
            </div>
            {done && (
              <div
                className="text-sm uppercase tracking-[0.25em] text-orange-300 mt-3"
                style={{ fontFamily: FONTS.mono }}
              >
                Complete
              </div>
            )}
          </div>
        </div>
        {!done ? (
          <button
            onClick={() => setRunning(!running)}
            className="flex items-center gap-3 px-8 py-3 rounded-full border border-stone-600 text-stone-100 hover:bg-stone-800"
            style={{ fontFamily: FONTS.mono, fontSize: '11px', letterSpacing: '0.2em' }}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? 'PAUSE' : 'RESUME'}
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-3 px-10 py-3 rounded-full bg-orange-200 text-stone-900 hover:bg-orange-100"
            style={{ fontFamily: FONTS.mono, fontSize: '11px', letterSpacing: '0.2em' }}
          >
            <Check size={14} strokeWidth={2.5} />
            MARK DONE
          </button>
        )}
      </div>
    </div>
  );
}
