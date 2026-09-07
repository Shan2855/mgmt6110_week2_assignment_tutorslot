import React from 'react';
import { ActiveScreen } from '../types';
import { Calendar, UserCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  bookedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onSelectScreen,
  bookedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-inner font-bold text-xl">
              TS
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                TutorSlot
              </h1>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <span>Current Week: Sep 7 – Sep 11, 2026</span>
              </p>
            </div>
          </div>

          {/* Screen Switch Buttons for mobile and desktop */}
          <nav
            aria-label="App Navigation"
            className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700"
          >
            <button
              id="nav-btn-find"
              type="button"
              onClick={() => onSelectScreen('find')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[44px] ${
                activeScreen === 'find'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Find a Tutor</span>
            </button>

            <button
              id="nav-btn-schedule"
              type="button"
              onClick={() => onSelectScreen('schedule')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[44px] relative ${
                activeScreen === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Week</span>
              {bookedCount > 0 && (
                <span
                  id="header-booked-badge"
                  className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full min-w-[20px]"
                >
                  {bookedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
