import React, { useState } from 'react';

interface Waypoint {
  id: string;
  name: string;
  category: string;
  coords: string;
  xPct: number;
  yPct: number;
  time: string;
  pnr: string;
  desc: string;
}

interface MapSplitViewProps {
  onSelectEvent: (category: string, eventId: string) => void;
}

export const MapSplitView: React.FC<MapSplitViewProps> = ({ onSelectEvent }) => {
  const waypoints: Waypoint[] = [
    {
      id: 'flight-nh107',
      name: 'Tokyo Haneda Intl (T3)',
      category: 'flight',
      coords: '35.5494° N, 139.7798° E',
      xPct: 75,
      yPct: 82,
      time: '15:45 JST',
      pnr: 'W82KLP',
      desc: 'Arrival gate vector & Baggage Belt 04',
    },
    {
      id: 'transit-keikyu',
      name: 'Shinagawa Rapid Express Hub',
      category: 'transit',
      coords: '35.6284° N, 139.7387° E',
      xPct: 62,
      yPct: 65,
      time: '16:55 JST',
      pnr: 'PASMO-IC',
      desc: 'Transfer from Keikyu line to JR Yamanote',
    },
    {
      id: 'hotel-trunk',
      name: 'TRUNK(HOTEL) Yoyogi Park',
      category: 'hotel',
      coords: '35.6698° N, 139.6881° E',
      xPct: 35,
      yPct: 40,
      time: '17:30 JST',
      pnr: 'TK-9921',
      desc: '1-15-2 Tomigaya · Park View Balcony Suite',
    },
    {
      id: 'dine-uobei',
      name: 'Uobei Sushi Dogenzaka',
      category: 'dine',
      coords: '35.6596° N, 139.6975° E',
      xPct: 38,
      yPct: 48,
      time: '20:00 JST',
      pnr: 'TC-8812',
      desc: 'Shibuya Center-gai conveyor feast',
    },
    {
      id: 'activity-teamlab',
      name: 'teamLab Borderless (Azabudai Hills)',
      category: 'activity',
      coords: '35.6605° N, 139.7428° E',
      xPct: 56,
      yPct: 45,
      time: '10:00 JST',
      pnr: 'PASS-TL-5519',
      desc: 'Mori Building digital art dimension',
    },
    {
      id: 'activity-dsmg',
      name: 'DSMG & Glitch Coffee Roastery',
      category: 'activity',
      coords: '35.6710° N, 139.7645° E',
      xPct: 68,
      yPct: 35,
      time: '14:30 JST',
      pnr: 'GLITCH-615',
      desc: 'Ginza 6-Chome tasting flights',
    },
  ];

  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint>(waypoints[2]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-[#1a1c20] p-4 rounded-2xl border border-[#282a2e] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
          <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] uppercase tracking-wider">
            TACTICAL GEO-VECTOR MAP // GREATER TOKYO METROPOLITAN
          </span>
        </div>
        <div className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
          6 GEO-TAGGED WAYPOINTS LOCKED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tactical Map Canvas */}
        <div className="lg:col-span-8 bg-[#0c0e12] rounded-2xl border border-[#282a2e] p-6 relative min-h-[460px] overflow-hidden flex flex-col justify-between">
          {/* Grid lines background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #333539 1px, transparent 1px), linear-gradient(to bottom, #333539 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* SVG Vector Paths Connecting Waypoints */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="75%,82% 62%,65% 38%,48% 35%,40%"
              fill="none"
              stroke="#c3f400"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <polyline
              points="35%,40% 56%,45% 68%,35%"
              fill="none"
              stroke="#7df4ff"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Waypoint Markers */}
          {waypoints.map((wp) => {
            const isSelected = activeWaypoint.id === wp.id;
            return (
              <div
                key={wp.id}
                onClick={() => {
                  setActiveWaypoint(wp);
                  onSelectEvent(wp.category, wp.id);
                }}
                style={{ left: `${wp.xPct}%`, top: `${wp.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span className="absolute w-8 h-8 rounded-full bg-[#c3f400]/30 animate-ping"></span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#c3f400] text-[#161e00] border-white shadow-[0_0_16px_rgba(195,244,0,0.6)] scale-110'
                        : 'bg-[#1a1c20] text-[#c3f400] border-[#333539] hover:border-[#c3f400]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs font-bold">place</span>
                  </div>
                </div>
                <div
                  className={`mt-1 text-[10px] font-['Space_Mono'] whitespace-nowrap px-1.5 py-0.5 rounded shadow-md transition-colors ${
                    isSelected
                      ? 'bg-[#c3f400] text-[#161e00] font-bold'
                      : 'bg-[#1e2024] text-[#e2e2e8] group-hover:text-[#c3f400]'
                  }`}
                >
                  {wp.name.split('(')[0]}
                </div>
              </div>
            );
          })}

          <div className="z-20 flex justify-between items-end pointer-events-none">
            <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] bg-[#1a1c20]/80 backdrop-blur-xs px-2 py-1 rounded border border-[#282a2e]">
              PROJECTION: WGS84 EPSG:4326 · TOKYO DOWNTOWN
            </span>
            <span className="font-['Space_Mono'] text-[10px] text-[#c3f400] bg-[#1a1c20]/80 backdrop-blur-xs px-2 py-1 rounded border border-[#282a2e]">
              CLICK ANY PIN TO INSPECT
            </span>
          </div>
        </div>

        {/* Selected Waypoint Detail Card */}
        <div className="lg:col-span-4 bg-[#1a1c20] rounded-2xl border border-[#282a2e] p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#282a2e] text-[#c3f400] font-['Space_Mono'] text-[11px] uppercase font-bold">
                {activeWaypoint.category} WAYPOINT
              </span>
              <span className="font-['Space_Mono'] text-xs font-bold text-[#e2e2e8]">
                {activeWaypoint.time}
              </span>
            </div>

            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2e8]">
                {activeWaypoint.name}
              </h3>
              <p className="font-['DM_Sans'] text-xs text-[#c4c9ac] mt-1">{activeWaypoint.desc}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#0c0e12] border border-[#282a2e] flex flex-col gap-1.5 font-['Space_Mono'] text-xs">
              <div className="flex justify-between">
                <span className="text-[#c4c9ac]">COORDINATES</span>
                <span className="text-[#7df4ff]">{activeWaypoint.coords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c4c9ac]">REFERENCE / PNR</span>
                <span className="text-[#c3f400] font-bold">{activeWaypoint.pnr}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectEvent(activeWaypoint.category, activeWaypoint.id)}
            className="w-full py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.3)]"
          >
            <span>Lock On HUD Inspector</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
