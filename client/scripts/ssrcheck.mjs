// No-browser smoke test: render every screen through Vite's real transform
// pipeline to catch import/JSX/hook/render errors. Not a visual test.
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const vite = await createServer({
  root: process.cwd(),
  logLevel: 'error',
  server: { middlewareMode: true },
});

const load = (p) => vite.ssrLoadModule(p);

const { StoreProvider } = await load('/src/store.jsx');
const { ThemeProvider } = await load('/src/theme.jsx');
const { PROGRAMS } = await load('/src/lib/program.js');

const drill = PROGRAMS[1].morning.drills[2]; // has a timer

const screens = [
  ['App', '/src/App.jsx', {}],
  ['TodayScreen', '/src/screens/TodayScreen.jsx', { onOpenMonthPicker() {}, onOpenAccount() {}, onOpenDrill() {} }],
  ['ProgressScreen', '/src/screens/ProgressScreen.jsx', { onOpenHistory() {} }],
  ['ProgramScreen', '/src/screens/ProgramScreen.jsx', { onPreviewMonth() {} }],
  ['SettingsScreen', '/src/screens/SettingsScreen.jsx', { onChangeMonth() {}, onOpenAccount() {} }],
  ['HistoryScreen', '/src/screens/HistoryScreen.jsx', { initialDate: '2026-05-21', onClose() {} }],
  ['DrillDetail', '/src/screens/DrillDetail.jsx', { drill, isComplete: false, onToggle() {}, onClose() {}, onStartTimer() {} }],
  ['RestScreen', '/src/screens/RestScreen.jsx', {}],
  ['Onboarding', '/src/screens/Onboarding.jsx', {}],
  ['TimerModal', '/src/modals/TimerModal.jsx', { drill, onClose() {}, onComplete() {} }],
  ['MonthPicker', '/src/modals/MonthPicker.jsx', { currentMonth: 2, daysOnMonth: 5, onSelect() {}, onClose() {} }],
  ['BottomNav', '/src/components/BottomNav.jsx', { active: 'today', onChange() {} }],
  ['AccountModal', '/src/AccountModal.jsx', { onClose() {} }],
];

let failures = 0;
for (const [name, path, props] of screens) {
  try {
    const mod = await load(path);
    const Comp = mod.default;
    const tree = React.createElement(
      StoreProvider,
      null,
      React.createElement(ThemeProvider, { dark: false }, React.createElement(Comp, props)),
    );
    const html = renderToStaticMarkup(tree);
    console.log(`PASS  ${name.padEnd(16)} (${html.length} chars)`);
  } catch (e) {
    failures++;
    console.log(`FAIL  ${name.padEnd(16)} ${e.message}`);
  }
}

// Also render in dark mode to catch theme-token issues.
for (const [name, path, props] of screens.filter((s) => s[0] !== 'App')) {
  try {
    const mod = await load(path);
    const Comp = mod.default;
    renderToStaticMarkup(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(ThemeProvider, { dark: true }, React.createElement(Comp, props)),
      ),
    );
  } catch (e) {
    failures++;
    console.log(`FAIL(dark) ${name} ${e.message}`);
  }
}

await vite.close();
console.log(failures ? `\n${failures} FAILURES` : '\nALL SCREENS RENDER OK (light + dark)');
process.exit(failures ? 1 : 0);
