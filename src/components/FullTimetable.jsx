import React, { useMemo, useState } from 'react';

const TIMETABLE = {
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

const days = Object.keys(TIMETABLE);

export default function FullTimetable() {
  const todayIdx = new Date().getDay(); // 0-6 Sun..Sat
  const defaultTab = todayIdx === 0 ? 6 : todayIdx; // map Sun(0) to index 6
  const [active, setActive] = useState(days[defaultTab - 1] || 'Monday');

  return (
    <section className="px-4 pb-24">
      <h2 className="text-lg font-semibold text-center mb-4">Weekly Timetable</h2>

      <div className="flex overflow-auto gap-2 pb-2">
        {days.map((d) => (
          <button key={d} onClick={() => setActive(d)} className={`px-3 py-1.5 rounded-full text-sm border ${active === d ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-700'}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {(TIMETABLE[active] || []).length === 0 ? (
          <p className="text-sm text-slate-500">No classes scheduled.</p>
        ) : (
          <ul className="space-y-2">
            {TIMETABLE[active].map((it, i) => (
              <li key={i} className="border rounded-lg p-3 bg-white flex items-center justify-between">
                <span className="text-sm font-medium">{it.label}</span>
                <span className="text-xs text-slate-500">{it.start}–{it.end}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
