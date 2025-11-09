import React, { useEffect } from 'react';

function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h >= 19) return 'Good Night';
  if (h >= 16) return 'Good Evening';
  if (h >= 12) return 'Good Afternoon';
  if (h >= 5) return 'Good Morning';
  return 'Hello';
}

export default function Header() {
  const greeting = getGreeting();

  useEffect(() => {
    // Ensure the device status bar (PWA / mobile browser) matches theme
    const themeColor = '#0ea5e9'; // sky-500
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', themeColor);
  }, []);

  return (
    <header className="w-full text-center pt-6 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Campus Day Planner</h1>
      <p className="text-sm text-slate-500 mt-1">{greeting}</p>
    </header>
  );
}
