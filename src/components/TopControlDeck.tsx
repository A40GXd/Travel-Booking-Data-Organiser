import React, { useState } from 'react';
import { ViewMode } from '../types';

interface TopControlDeckProps {
  currentViewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  selectedDay: number | null; // null means ALL DAYS
  onSelectDay: (day: number | null) => void;
  onOpenAddEvent: () => void;
  onExportPass: () => void;
}

export const TopControlDeck: React.FC<TopControlDeckProps> = ({
  currentViewMode,
  onSelectViewMode,
  selectedDay,
  onSelectDay,
  onOpenAddEvent,
  onExportPass,
}) => {
  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("Tokyo & Kyoto Drift '25");

  const trips = [
    { name: "Tokyo & Kyoto Drift '25", status: "LIVE EXPEDITION", days: 14 },
    { name: "Nordic Aurora Ring '26", status: "PLANNING", days: 9 },
    { name: "Alpine Crest Traverse '25", status: "ARCHIVED", days: 7 },
  ];

  const daysList = [
    { day: 1, label: 'Day 01 · Oct 14 (Arrival)' },
    { day: 2, label: 'Day 02 · Oct 15 (Shibuya & Harajuku)' },
    { day: 3, label: 'Day 03 · Oct 16 (Akihabara & Ginza)' },
    { day: 4, label: 'Day 04 · Oct 17 (Kyoto Shinkansen)' },
    { day: 5, label: 'Day 05 · Oct 18 (Arashiyama Bamboo)' },
    { day: 6, label: 'Day 06 · Oct 19 (Gion & Tea Ritual)' },
  ];

  return (
    <header className="flex flex-col gap-4 bg-[#1a1c20] p-4 sm:p-5 rounded-2xl border border-[#282a2e] shadow-lg relative">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Trip Identity / Switcher */}
        <div className="relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#282a2e] border border-[#333539] flex items-center justify-center text-[#c3f400] shadow-inner">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                  ACTIVE TRIP // 001
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
                <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold">
                  LIVE EXPEDITION
                </span>
              </div>
              <div
                onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer group select-none"
              >
                <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#e2e2e8] tracking-tight group-hover:text-[#c3f400] transition-colors">
                  {selectedTrip}
                </span>
                <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#c3f400] transition-transform duration-200">
                  {tripDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#333539] text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold">
                  14 DAYS
                </span>
              </div>
            </div>
          </div>

          {/* Trip Dropdown Menu */}
          {tripDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e2024] border border-[#333539] rounded-xl shadow-2xl z-30 p-2 flex flex-col gap-1">
              <div className="px-3 py-1 text-[10px] font-['Space_Mono'] text-[#c4c9ac] uppercase">
                Select Active Expedition
              </div>
              {trips.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setSelectedTrip(t.name);
                    setTripDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    selectedTrip === t.name
                      ? 'bg-[#282a2e] text-[#c3f400] font-semibold'
                      : 'text-[#e2e2e8] hover:bg-[#282a2e]/60'
                  }`}
                >
                  <div>
                    <div className="font-['Space_Grotesk'] font-medium">{t.name}</div>
                    <div className="text-[10px] font-['Space_Mono'] text-[#c4c9ac]">{t.status}</div>
                  </div>
                  <span className="text-xs font-['Space_Mono'] text-[#c4c9ac]">{t.days}D</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Actions & View Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Modes */}
          <div className="flex items-center p-1 rounded-full bg-[#0c0e12] border border-[#282a2e] shadow-inner">
            <button
              onClick={() => onSelectViewMode('chrono')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold transition-all cursor-pointer ${
                currentViewMode === 'chrono'
                  ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm font-bold">timeline</span>
              <span>Chrono Stream</span>
            </button>
            <button
              onClick={() => onSelectViewMode('compact')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold transition-all cursor-pointer ${
                currentViewMode === 'compact'
                  ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">view_agenda</span>
              <span>Compact</span>
            </button>
            <button
              onClick={() => onSelectViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold transition-all cursor-pointer ${
                currentViewMode === 'map'
                  ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Map Split</span>
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={onExportPass}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold transition-colors cursor-pointer border border-[#333539]"
            type="button"
          >
            <span className="material-symbols-outlined text-base">ios_share</span>
            <span>Export Pass</span>
          </button>
          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold tracking-wider uppercase hover:opacity-95 shadow-[0_0_16px_rgba(195,244,0,0.25)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base font-bold">add</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Horizontal Day Segment Pill Filter Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-nowrap">
        <button
          onClick={() => onSelectDay(null)}
          className={`px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedDay === null
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] hover:bg-[#333539]'
          }`}
          type="button"
        >
          ALL DAYS [14]
        </button>
        {daysList.map((d) => {
          const isActive = selectedDay === d.day;
          return (
            <button
              key={d.day}
              onClick={() => onSelectDay(d.day)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] hover:bg-[#333539]'
              }`}
              type="button"
            >
              {isActive && <span className="w-2 h-2 rounded-full bg-[#161e00]"></span>}
              {!isActive && <span className="w-2 h-2 rounded-full bg-[#c3f400]"></span>}
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
