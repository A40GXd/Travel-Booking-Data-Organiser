import React from 'react';
import { ItineraryEvent } from '../types';

interface CommandCenterProps {
  events: ItineraryEvent[];
  onNavigateTab: (tab: 'timeline' | 'data-matrix' | 'budget') => void;
  onOpenSmartImport: () => void;
}

export const CommandCenterView: React.FC<CommandCenterProps> = ({
  events,
  onNavigateTab,
  onOpenSmartImport,
}) => {
  const teamMembers = [
    { name: 'Mira Vance', handle: '@mira.explores', role: 'Expedition Commander', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD790b-PbyJIxM_-Vlw0NxY_4UtT1l7iQdEsgDlecRumr30nknTdO9InJqKNk5vRd7iVIGSsnqNrpD1ZobztCh-1hWi22i6rZs5bhJOqklUtGRQHnqaWF_p9S4BsY3b3Wc6Ev-rwaXfEyHKDiHML_Sii_rJJZvm-Woo6Plw1xXvoBoz_ukmapOAfLtUmwbGr2klO_dtulVjjRnK_PTR-C5nTEQmcuofavuAN_QRKufySJyVNaF72wWr6Q' },
    { name: 'Kenji Sato', handle: '@kenji.runs', role: 'Transit & Route Ops', avatar: '' },
    { name: 'Sarah Chen', handle: '@sarah.c', role: 'Treasury & Splitter', avatar: '' },
    { name: 'Leo Tanaka', handle: '@leot', role: 'Culinary & Culture Scout', avatar: '' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1540px] mx-auto">
      {/* Hero Mission Control Banner */}
      <div className="bg-[#1a1c20] p-6 rounded-2xl border border-[#282a2e] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#c3f400]/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping"></span>
              <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] uppercase tracking-wider">
                EXPEDITION TELEMETRY // ACTIVE DEPLOYMENT
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#e2e2e8]">
              Tokyo &amp; Kyoto Drift '25 Command Center
            </h1>
            <p className="font-['DM_Sans'] text-sm text-[#c4c9ac] max-w-2xl">
              Real-time synchronization across flight vectors, urban rapid express corridors,
              Michelin dining reservations, and team expense ledger.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onOpenSmartImport}
              className="px-4 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_16px_rgba(195,244,0,0.3)] hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">bolt</span>
              <span>Drop New PNR</span>
            </button>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="px-4 py-2 rounded-full bg-[#282a2e] text-[#e2e2e8] hover:bg-[#333539] font-['DM_Sans'] text-xs font-bold transition-all border border-[#37393e] cursor-pointer"
            >
              View Full Chrono
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">TOTAL DISTANCE</span>
            <span className="material-symbols-outlined text-[#c3f400]">flight</span>
          </div>
          <div className="mt-4">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8]">5,142</span>
            <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] ml-1.5">NM</span>
            <span className="block text-xs text-[#c3f400] font-['Space_Mono'] mt-1">SFO → HND Cruise Active</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">LOCKED RESERVATIONS</span>
            <span className="material-symbols-outlined text-[#7df4ff]">confirmation_number</span>
          </div>
          <div className="mt-4">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8]">{events.length}</span>
            <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] ml-1.5">/ 11 PNRs</span>
            <span className="block text-xs text-[#7df4ff] font-['Space_Mono'] mt-1">94% Confidence Decoded</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">CURRENCY PEG</span>
            <span className="material-symbols-outlined text-[#ddb7ff]">currency_yen</span>
          </div>
          <div className="mt-4">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8]">152.40</span>
            <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] ml-1.5">USD/JPY</span>
            <span className="block text-xs text-[#c3f400] font-['Space_Mono'] mt-1">+0.32% Favorable Rate</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">NEXT WAYPOINT</span>
            <span className="material-symbols-outlined text-[#c3f400]">schedule</span>
          </div>
          <div className="mt-4">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#c3f400]">15:45</span>
            <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] ml-1.5">JST</span>
            <span className="block text-xs text-[#c4c9ac] font-['Space_Mono'] mt-1">Haneda T3 Touchdown</span>
          </div>
        </div>
      </div>

      {/* Main Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Radar Stream */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#1a1c20] p-6 rounded-2xl border border-[#282a2e] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">explore</span>
                <span>Active Expedition Sequence</span>
              </h3>
              <button
                onClick={() => onNavigateTab('data-matrix')}
                className="text-xs font-['Space_Mono'] text-[#c3f400] hover:underline"
              >
                Open Matrix →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {events.slice(0, 5).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onNavigateTab('timeline')}
                  className="bg-[#1e2024] hover:bg-[#282a2e] p-4 rounded-xl border border-[#282a2e] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0c0e12] border border-[#333539] flex items-center justify-center text-[#c3f400] text-xs font-['Space_Mono'] font-bold">
                      D{ev.day}
                    </span>
                    <div>
                      <h4 className="font-['Space_Grotesk'] font-semibold text-[#e2e2e8] text-sm sm:text-base">
                        {ev.title}
                      </h4>
                      <p className="font-['DM_Sans'] text-xs text-[#c4c9ac]">{ev.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] block">
                      {ev.time_start}
                    </span>
                    <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                      {ev.pnr || 'CONFIRMED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Squad Roster & Weather Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Squad Roster */}
          <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] font-bold text-[#e2e2e8] text-sm">
                EXPEDITION SQUAD (4)
              </span>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-[11px] font-['Space_Mono'] text-[#7df4ff] hover:underline"
              >
                Split Balances
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {teamMembers.map((m, idx) => (
                <div key={m.name} className="flex items-center justify-between bg-[#1e2024] p-2.5 rounded-xl border border-[#282a2e]">
                  <div className="flex items-center gap-2.5">
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full ring-1 ring-[#c3f400]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#37393e] flex items-center justify-center font-['Space_Mono'] text-xs text-[#c3f400] font-bold">
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-['DM_Sans'] text-xs font-bold text-[#e2e2e8]">{m.name}</span>
                      <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">{m.handle}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-['Space_Mono'] px-2 py-0.5 rounded bg-[#0c0e12] text-[#c4c9ac]">
                    {idx === 0 ? 'LEAD' : 'MEMBER'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Japan Regional Weather */}
          <div className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] font-bold text-[#e2e2e8] text-sm">
              REGIONAL WEATHER CORRIDOR
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#1e2024] p-2.5 rounded-xl border border-[#282a2e]">
                <span className="text-[10px] font-['Space_Mono'] text-[#c4c9ac] block">TOKYO</span>
                <span className="material-symbols-outlined text-[#c3f400] text-xl my-1">sunny</span>
                <span className="text-base font-bold text-[#e2e2e8] block">21°C</span>
              </div>
              <div className="bg-[#1e2024] p-2.5 rounded-xl border border-[#282a2e]">
                <span className="text-[10px] font-['Space_Mono'] text-[#c4c9ac] block">KYOTO</span>
                <span className="material-symbols-outlined text-[#7df4ff] text-xl my-1">partly_cloudy_day</span>
                <span className="text-base font-bold text-[#e2e2e8] block">19°C</span>
              </div>
              <div className="bg-[#1e2024] p-2.5 rounded-xl border border-[#282a2e]">
                <span className="text-[10px] font-['Space_Mono'] text-[#c4c9ac] block">HAKONE</span>
                <span className="material-symbols-outlined text-[#ddb7ff] text-xl my-1">air</span>
                <span className="text-base font-bold text-[#e2e2e8] block">16°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
