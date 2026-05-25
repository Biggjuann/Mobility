import React, { createContext, useContext } from 'react';

export const FONTS = {
  serif: 'Fraunces, serif',
  mono: 'Geist Mono, monospace',
  sans: 'Geist, system-ui, sans-serif',
};

// Semantic palette. Screens style against these tokens (never raw hex) so the
// whole app responds to the Dark Mode setting.
const LIGHT = {
  dark: false,
  bg: '#F5F1EA',
  card: 'rgba(28, 25, 23, 0.04)',
  cardSolid: 'rgba(255, 255, 255, 0.6)',
  ink: '#1c1917',
  muted: '#57534e',
  faint: '#78716c',
  border: 'rgba(28, 25, 23, 0.14)',
  borderStrong: 'rgba(28, 25, 23, 0.22)',
  accent: '#D97757',
  accentSoft: 'rgba(217, 119, 87, 0.12)',
  btnBg: '#1c1917',
  btnText: '#ffedd5',
  navBg: 'rgba(245, 241, 234, 0.92)',
};

const DARK = {
  dark: true,
  bg: '#14110d',
  card: 'rgba(255, 255, 255, 0.05)',
  cardSolid: 'rgba(255, 255, 255, 0.07)',
  ink: '#F5F1EA',
  muted: '#d6d0c4',
  faint: '#a8a29e',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.2)',
  accent: '#D97757',
  accentSoft: 'rgba(217, 119, 87, 0.2)',
  btnBg: '#F5F1EA',
  btnText: '#1c1917',
  navBg: 'rgba(20, 17, 13, 0.92)',
};

const ThemeContext = createContext(LIGHT);

export function ThemeProvider({ dark, children }) {
  return (
    <ThemeContext.Provider value={dark ? DARK : LIGHT}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
