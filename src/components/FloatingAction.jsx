import React, { useState } from 'react';
import { Menu } from 'lucide-react';

export default function FloatingAction({ onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-2 w-52 rounded-xl border bg-white shadow-lg overflow-hidden">
          <button onClick={() => { setOpen(false); onNavigate('timetable'); }} className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50">College Schedule</button>
          <button onClick={() => { setOpen(false); onNavigate('mess'); }} className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50">Mess Menu</button>
        </div>
      )}
      <button aria-label="Open actions" onClick={() => setOpen((s) => !s)} className="h-12 w-12 rounded-full bg-sky-500 text-white grid place-items-center shadow-lg">
        <Menu size={20} />
      </button>
    </div>
  );
}
