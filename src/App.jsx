import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import DailyOverview from './components/DailyOverview';
import FloatingAction from './components/FloatingAction';
import FullTimetable from './components/FullTimetable';
import FullMessMenu from './components/FullMessMenu';

function Screen({ route }) {
  if (route === 'timetable') return <FullTimetable />;
  if (route === 'mess') return <FullMessMenu />;
  return <DailyOverview />;
}

export default function App() {
  const [route, setRoute] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-violet-50">
      <Header />
      <Screen route={route} />
      <FloatingAction onNavigate={setRoute} />
    </div>
  );
}
