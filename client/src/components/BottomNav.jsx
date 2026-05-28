import React from 'react';
import { Home, BarChart2, BookOpen, Settings } from 'lucide-react';
import { useTheme, FONTS } from '../theme';

const TABS = [
  { id: 'today', label: 'Today', Icon: Home },
  { id: 'progress', label: 'Progress', Icon: BarChart2 },
  { id: 'program', label: 'Program', Icon: BookOpen },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  const t = useTheme();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: t.navBg,
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${t.border}`,
      }}
    >
      <div
        className="max-w-md mx-auto flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3"
              style={{ color: on ? t.ink : t.faint }}
            >
              <Icon size={22} strokeWidth={on ? 2 : 1.5} fill={on && id === 'today' ? 'currentColor' : 'none'} />
              <span
                className="text-[11px]"
                style={{ fontFamily: FONTS.sans, fontWeight: on ? 600 : 400 }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
