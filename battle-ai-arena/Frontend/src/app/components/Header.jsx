import { Moon, Sun } from 'lucide-react';

export function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-8 py-5 flex items-center justify-between">
      <h1 className="font-display font-semibold text-xl tracking-tight text-on-surface">Battle AI Arena</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
