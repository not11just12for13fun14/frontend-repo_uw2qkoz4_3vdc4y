import React, { useEffect, useState } from 'react';

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

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function Collapse({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen((s) => !s)} className="w-full px-4 py-3 text-left font-medium flex justify-between items-center">
        <span>{title}</span>
        <span className="text-xs text-slate-500">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-slate-700">{children}</div>}
    </div>
  );
}

export default function FullMessMenu() {
  const [tab, setTab] = useState('13');

  return (
    <section className="px-4 pb-24">
      <h2 className="text-lg font-semibold text-center mb-4">Mess Menu</h2>

      <div className="flex gap-2 justify-center">
        <button onClick={() => setTab('13')} className={`px-3 py-1.5 rounded-full text-sm border ${tab==='13' ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-700'}`}>Weeks 1 & 3</button>
        <button onClick={() => setTab('24')} className={`px-3 py-1.5 rounded-full text-sm border ${tab==='24' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-slate-700'}`}>Weeks 2 & 4</button>
      </div>

      <div className="mt-4 space-y-3">
        {days.map((d) => {
          const m = (tab === '13' ? MENU_13 : MENU_24)[d];
          return (
            <Collapse key={d} title={d}>
              <ul className="space-y-1">
                <li><span className="font-medium">Breakfast:</span> {m.breakfast}</li>
                <li><span className="font-medium">Lunch:</span> {m.lunch}</li>
                <li><span className="font-medium">Dinner:</span> {m.dinner}</li>
              </ul>
            </Collapse>
          );
        })}
      </div>
    </section>
  );
}
