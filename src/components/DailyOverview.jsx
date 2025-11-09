import React, { useEffect, useMemo, useState } from 'react';

// Sample timetable: times in 24h 'HH:MM' and label
const SAMPLE_TIMETABLE = {
  Monday: [
    { start: '09:00', end: '10:00', label: 'Math Lecture' },
    { start: '11:00', end: '12:00', label: 'Physics Lab' },
    { start: '15:00', end: '16:00', label: 'CS Tutorial' },
  ],
  Tuesday: [
    { start: '10:00', end: '11:30', label: 'Chemistry' },
    { start: '13:30', end: '14:30', label: 'Elective' },
  ],
  Wednesday: [
    { start: '09:30', end: '11:00', label: 'Data Structures' },
    { start: '14:00', end: '16:00', label: 'Workshop' },
  ],
  Thursday: [
    { start: '08:30', end: '09:30', label: 'English' },
    { start: '12:30', end: '13:30', label: 'Economics' },
  ],
  Friday: [
    { start: '10:00', end: '11:00', label: 'Lab Viva' },
    { start: '15:30', end: '16:30', label: 'Project' },
  ],
  Saturday: [],
  Sunday: [],
};

const MEAL_WINDOWS = [
  { key: 'breakfast', label: 'Breakfast', start: '08:00', end: '10:00' },
  { key: 'lunch', label: 'Lunch', start: '12:30', end: '14:30' },
  { key: 'dinner', label: 'Dinner', start: '20:00', end: '22:00' },
];

// Minimal demo menus for cycles
const MENU_13 = {
  Monday: { breakfast: 'Idli & Sambar', lunch: 'Rajma Rice', dinner: 'Paneer Curry & Roti' },
  Tuesday: { breakfast: 'Poha', lunch: 'Chole Rice', dinner: 'Veg Pulao' },
  Wednesday: { breakfast: 'Upma', lunch: 'Dal Makhani', dinner: 'Dosa' },
  Thursday: { breakfast: 'Paratha', lunch: 'Kadhi Chawal', dinner: 'Fried Rice' },
  Friday: { breakfast: 'Cornflakes', lunch: 'Veg Thali', dinner: 'Pasta' },
  Saturday: { breakfast: 'Poori Bhaji', lunch: 'Biryani', dinner: 'Noodles' },
  Sunday: { breakfast: 'Pancakes', lunch: 'Special Thali', dinner: 'Pizza' },
};
const MENU_24 = {
  Monday: { breakfast: 'Poha', lunch: 'Chole Rice', dinner: 'Veg Pulao' },
  Tuesday: { breakfast: 'Upma', lunch: 'Dal Makhani', dinner: 'Dosa' },
  Wednesday: { breakfast: 'Paratha', lunch: 'Kadhi Chawal', dinner: 'Fried Rice' },
  Thursday: { breakfast: 'Cornflakes', lunch: 'Veg Thali', dinner: 'Pasta' },
  Friday: { breakfast: 'Idli & Sambar', lunch: 'Rajma Rice', dinner: 'Paneer Curry & Roti' },
  Saturday: { breakfast: 'Pancakes', lunch: 'Special Thali', dinner: 'Pizza' },
  Sunday: { breakfast: 'Poori Bhaji', lunch: 'Biryani', dinner: 'Noodles' },
};

function parseHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

function getTodayName(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

function statusFor(nowMins, startHM, endHM) {
  if (nowMins < parseHM(startHM)) return 'upcoming';
  if (nowMins > parseHM(endHM)) return 'done';
  return 'ongoing';
}

function classStatusList(items, nowMins) {
  return items.map((it) => ({
    ...it,
    state: statusFor(nowMins, it.start, it.end),
  }));
}

function useMessCycle() {
  const [cycle, setCycle] = useState(() => localStorage.getItem('messCycle') || '13');

  useEffect(() => {
    // Auto-switch every Monday
    const now = new Date();
    const dow = now.getDay(); // 0 Sun, 1 Mon
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - ((dow + 6) % 7)); // move to Monday of this week
    thisMonday.setHours(0, 0, 0, 0);
    const monKey = `mon-${thisMonday.toISOString().slice(0, 10)}`;

    const lastAuto = localStorage.getItem('messCycleLastAuto');
    if (dow === 1 && lastAuto !== monKey) {
      const next = cycle === '13' ? '24' : '13';
      localStorage.setItem('messCycle', next);
      localStorage.setItem('messCycleLastAuto', monKey);
      setCycle(next);
    }
  }, []); // run once on mount

  const chooseOnce = (val) => {
    localStorage.setItem('messCycle', val);
    setCycle(val);
  };

  const toggle = () => {
    const next = cycle === '13' ? '24' : '13';
    localStorage.setItem('messCycle', next);
    setCycle(next);
  };

  return { cycle, chooseOnce, toggle };
}

export default function DailyOverview() {
  const [now, setNow] = useState(new Date());
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const today = getTodayName(now);
  const items = SAMPLE_TIMETABLE[today] || [];
  const itemsWithState = useMemo(() => classStatusList(items, nowMins), [items, nowMins]);
  const { cycle, chooseOnce, toggle } = useMessCycle();
  const menu = cycle === '13' ? MENU_13 : MENU_24;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const currentMeals = MEAL_WINDOWS.map((mw) => {
    const state = statusFor(nowMins, mw.start, mw.end);
    const text = menu[today]?.[mw.key] || '—';
    return { ...mw, text, state };
  });

  // Determine if we should show the cycle chooser
  const lastPromptKey = localStorage.getItem('messCyclePromptedOn');
  const isSunday = new Date().getDay() === 0;
  const todayKey = new Date().toISOString().slice(0, 10);
  const hasChoice = !!localStorage.getItem('messCycle');
  const shouldShowPrompt = !hasChoice || (isSunday && lastPromptKey !== todayKey);

  const handleChoice = (val) => {
    chooseOnce(val);
    localStorage.setItem('messCyclePromptedOn', todayKey);
  };

  const isFriday = today === 'Friday';

  const stateStyles = {
    done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ongoing: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    upcoming: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <section className="px-4 pb-24">
      {shouldShowPrompt && (
        <div className="mb-3 rounded-xl border p-3 bg-white shadow-sm">
          <p className="text-sm text-slate-700">Choose your mess menu cycle. You won't be asked again until next Sunday.</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => handleChoice('13')} className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-sm">Weeks 1 & 3</button>
            <button onClick={() => handleChoice('24')} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm">Weeks 2 & 4</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-800">Today · {today}</h2>
            {isFriday && (
              <button aria-label="Toggle menu cycle" onClick={toggle} className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow ring-2 ring-white" />
            )}
          </div>
          {itemsWithState.length === 0 ? (
            <p className="text-sm text-slate-500">No classes scheduled today.</p>
          ) : (
            <ul className="space-y-2">
              {itemsWithState.map((it, idx) => (
                <li key={idx} className={`border rounded-lg px-3 py-2 ${stateStyles[it.state]}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{it.label}</span>
                    <span className="text-xs text-slate-500">{it.start}–{it.end}</span>
                  </div>
                  <p className="text-xs mt-0.5 capitalize">{it.state}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-slate-800">Today's Meals · Cycle {cycle}</h3>
            {isFriday && (
              <button aria-label="Toggle menu cycle" onClick={toggle} className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow ring-2 ring-white" />
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentMeals.map((m) => (
              <div key={m.key} className={`border rounded-xl p-3 ${stateStyles[m.state]}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-slate-500">{m.start}–{m.end}</div>
                </div>
                <div className="mt-1 text-sm">{m.text}</div>
                <div className="mt-1 text-xs capitalize">{m.state}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
