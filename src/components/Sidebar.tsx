import React from 'react';
import { ActiveNavTab } from '../types';

interface SidebarProps {
  activeNav: ActiveNavTab;
  onSelectNav: (tab: ActiveNavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  decodedCount: number;
  totalPnrs: number;
  backendOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile,
  decodedCount = 9,
  totalPnrs = 11,
  backendOnline = true,
}) => {
  const navItems: { id: ActiveNavTab; label: string; icon: string }[] = [
    { id: 'command-center', label: 'Command Center', icon: 'grid_view' },
    { id: 'timeline', label: 'Timeline & Itinerary', icon: 'flight_takeoff' },
    { id: 'data-matrix', label: 'Data Matrix', icon: 'table_rows' },
    { id: 'budget', label: 'Budget & Splitter', icon: 'payments' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#0c0e12] z-50 flex flex-col justify-between py-6 border-r border-[#1e2024] shadow-[0_1px_8px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Brand Header */}
          <div className="px-6 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Wanderlore Geometric Badge */}
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.25)]">
                  <span className="material-symbols-outlined text-lg">explore</span>
                </div>
                <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight uppercase text-[#e2e2e8]">
                  WANDERLORE
                </span>
              </div>
              <button
                className="lg:hidden text-[#c4c9ac] hover:text-white"
                onClick={onCloseMobile}
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#282a2e] text-[#c4c9ac] font-['Space_Mono'] text-[11px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
                BETA / AI-PARSER v2.4
              </span>
            </div>
          </div>

          {/* Navigation Engine */}
          <div className="px-4">
            <div className="px-2 pb-2 font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
              Navigation Engine
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectNav(item.id);
                      onCloseMobile();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-['DM_Sans'] text-sm transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#c3f400] text-[#161e00] font-semibold shadow-[0_0_20px_-4px_rgba(195,244,0,0.35)]'
                        : 'text-[#c4c9ac] hover:bg-[#282a2e] hover:text-[#e2e2e8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sync Status / Telemetry Footer */}
        <div className="px-6 flex flex-col gap-2">
          <div className="p-3.5 rounded-xl bg-[#1e2024] border border-[#282a2e] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">SYNC STATUS</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                ONLINE
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#282a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c3f400] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(195,244,0,0.5)]"
                style={{ width: `${Math.round((decodedCount / totalPnrs) * 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
              <span>{decodedCount}/{totalPnrs} PNRs Decoded</span>
              <span className="text-[10px] text-[#7df4ff]">
                {backendOnline ? 'FastAPI Bridge' : 'Local Engine'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
