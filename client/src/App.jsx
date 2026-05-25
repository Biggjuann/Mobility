import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './theme';
import { useStore } from './store';
import BottomNav from './components/BottomNav';
import TodayScreen from './screens/TodayScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProgramScreen from './screens/ProgramScreen';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';
import DrillDetail from './screens/DrillDetail';
import Onboarding from './screens/Onboarding';
import TimerModal from './modals/TimerModal';
import MonthPicker from './modals/MonthPicker';
import AccountModal from './AccountModal.jsx';

// Keeps the document/safe-area background in sync with the theme.
function BodyBackground() {
  const t = useTheme();
  useEffect(() => {
    document.body.style.background = t.bg;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.bg);
  }, [t.bg]);
  return null;
}

export default function App() {
  const {
    loaded,
    onboarded,
    settings,
    currentMonth,
    daysOnMonth,
    setViewMonth,
    jumpToMonth,
    isComplete,
    toggleComplete,
    markComplete,
  } = useStore();

  const [tab, setTab] = useState('today');
  const [detailDrill, setDetailDrill] = useState(null);
  const [timerDrill, setTimerDrill] = useState(null);
  const [picker, setPicker] = useState(null); // null | 'preview' | 'change'
  const [showAccount, setShowAccount] = useState(false);
  const [historyDate, setHistoryDate] = useState(null);

  if (!loaded) {
    return (
      <ThemeProvider dark={settings.darkMode}>
        <BodyBackground />
        <div style={{ minHeight: '100vh' }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider dark={settings.darkMode}>
      <BodyBackground />
      <Styles />
      {!onboarded ? (
        <Onboarding />
      ) : (
        <>
          <main className="max-w-md mx-auto px-6 pt-10 pb-28 min-h-screen">
            {tab === 'today' && (
              <TodayScreen
                onOpenMonthPicker={() => setPicker('preview')}
                onOpenAccount={() => setShowAccount(true)}
                onOpenDrill={setDetailDrill}
              />
            )}
            {tab === 'progress' && <ProgressScreen onOpenHistory={setHistoryDate} />}
            {tab === 'program' && (
              <ProgramScreen
                onPreviewMonth={(m) => {
                  setViewMonth(m);
                  setTab('today');
                }}
              />
            )}
            {tab === 'settings' && (
              <SettingsScreen
                onChangeMonth={() => setPicker('change')}
                onOpenAccount={() => setShowAccount(true)}
              />
            )}
          </main>
          <BottomNav active={tab} onChange={setTab} />
        </>
      )}

      {/* Overlays */}
      {detailDrill && (
        <DrillDetail
          drill={detailDrill}
          isComplete={isComplete(detailDrill.id)}
          onToggle={toggleComplete}
          onClose={() => setDetailDrill(null)}
          onStartTimer={(d) => setTimerDrill(d)}
        />
      )}
      {timerDrill && (
        <TimerModal drill={timerDrill} onClose={() => setTimerDrill(null)} onComplete={markComplete} />
      )}
      {picker && (
        <MonthPicker
          currentMonth={currentMonth}
          daysOnMonth={daysOnMonth}
          onSelect={picker === 'change' ? jumpToMonth : setViewMonth}
          onClose={() => setPicker(null)}
        />
      )}
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      {historyDate !== null && (
        <HistoryScreen initialDate={historyDate} onClose={() => setHistoryDate(null)} />
      )}
    </ThemeProvider>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Geist:wght@300..600&family=Geist+Mono:wght@400;500&display=swap');
      @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-slideDown { animation: slideDown 0.5s ease-out; }
      input[type="time"] { color-scheme: light dark; }
    `}</style>
  );
}
