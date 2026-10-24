import React from 'react';
import { ItineraryEvent } from '../types';

interface TimelineViewProps {
  events: ItineraryEvent[];
  selectedEventType: string;
  onSelectEvent: (type: string, eventId?: string) => void;
  onOpenBoardingPass: () => void;
  onSyncWallet: () => void;
  onOpenDigitalKey: () => void;
  selectedDay: number | null;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  selectedEventType,
  onSelectEvent,
  onOpenBoardingPass,
  onSyncWallet,
  onOpenDigitalKey,
  selectedDay,
}) => {
  // Filter events by selected day if provided
  const day1Events = events.filter((e) => e.day === 1);
  const day2Events = events.filter((e) => e.day === 2);
  const otherDaysEvents = events.filter((e) => e.day > 2);

  const showDay1 = selectedDay === null || selectedDay === 1;
  const showDay2 = selectedDay === null || selectedDay === 2;
  const showOtherDays = selectedDay === null || selectedDay > 2;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ======================= DAY 01 ======================= */}
      {showDay1 && (
        <section className="flex flex-col gap-4">
          {/* Day Section Divider Pill Label */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#c3f400] text-[#161e00] font-['Space_Mono'] text-xs font-bold">
                DAY 01
              </span>
              <div className="flex flex-col">
                <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-semibold text-[#e2e2e8] tracking-tight">
                  Touchdown Tokyo: The Arrival Vector
                </h2>
                <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                  TUE, OCT 14, 2025 · JST (UTC+9)
                </span>
              </div>
            </div>
            <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] bg-[#1a1c20] border border-[#282a2e] px-2.5 py-1 rounded">
              {day1Events.length} EVENTS LOCKED
            </span>
          </div>

          {/* CHRONO FEED CONTAINER */}
          <div className="relative pl-6 flex flex-col gap-4">
            {/* Continuous Neo-Utility Track Line */}
            <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-[#333539]"></div>

            {/* EVENT 1: FLIGHT NH107 (Interactive Hero Flight Bento) */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('flight', 'flight-nh107')}
            >
              {/* Chrono dot node */}
              <div className="absolute -left-[27px] top-7 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedEventType === 'flight'
                      ? 'bg-[#c3f400] ring-4 ring-[#c3f400]/40'
                      : 'bg-[#c3f400] ring-2 ring-[#c3f400]/20'
                  }`}
                ></span>
              </div>

              {/* Bento Flight Container */}
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl overflow-hidden border transition-all duration-200 shadow-xl ${
                  selectedEventType === 'flight'
                    ? 'border-[#c3f400] shadow-[0_0_24px_rgba(195,244,0,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                {/* Top Meta Bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-[#1e2024] flex items-center justify-between border-b border-[#282a2e]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#6f00be] text-[#d6a9ff] font-['Space_Mono'] text-[11px] font-bold uppercase">
                      FLIGHT · NH107
                    </span>
                    <span className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac]">
                      All Nippon Airways
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">PNR:</span>
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] tracking-wider px-2 py-0.5 rounded bg-[#0c0e12] border border-[#282a2e]">
                      W82KLP
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#c3f400]/10 text-[#c3f400] font-['Space_Mono'] text-[10px] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-ping"></span>
                      ON TIME
                    </span>
                  </div>
                </div>

                {/* Flight Route Big Display */}
                <div className="p-5 sm:p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Origin */}
                    <div className="flex flex-col">
                      <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                        SAN FRANCISCO INTL
                      </span>
                      <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#e2e2e8] leading-none mt-1">
                        SFO
                      </span>
                      <span className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e2e2e8] mt-1">
                        08:30 <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">PDT</span>
                      </span>
                      <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                        Gate G98 · Concourse G
                      </span>
                    </div>

                    {/* Transit Visual HUD */}
                    <div className="flex-1 flex flex-col items-center px-2 sm:px-6">
                      <div className="flex items-center justify-between w-full font-['Space_Mono'] text-[10px] sm:text-[11px] text-[#c4c9ac] mb-1">
                        <span>NON-STOP</span>
                        <span className="text-[#c3f400] font-bold">11h 15m</span>
                        <span>BOEING 787-9</span>
                      </div>
                      <div className="w-full relative flex items-center">
                        <div className="w-full h-0.5 bg-[#333539]"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#282a2e] border border-[#37393e] flex items-center justify-center text-[#c3f400] shadow-md">
                          <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                        </div>
                      </div>
                      <span className="font-['Space_Mono'] text-[10px] sm:text-[11px] text-[#c4c9ac] mt-2 tracking-widest text-center">
                        TRANSPACIFIC CRUISE
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="flex flex-col text-right">
                      <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                        TOKYO HANEDA
                      </span>
                      <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#c3f400] leading-none mt-1">
                        HND
                      </span>
                      <span className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e2e2e8] mt-1">
                        15:45 <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">JST +1</span>
                      </span>
                      <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold">
                        Terminal 3 (Intl)
                      </span>
                    </div>
                  </div>

                  {/* Perforated Tear / Sub-data strip */}
                  <div className="pt-4 bg-[#0c0e12] p-4 rounded-xl border border-[#282a2e] flex flex-wrap items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                      <div className="flex flex-col">
                        <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">ASSIGNED SEAT</span>
                        <span className="font-['Space_Mono'] text-sm sm:text-base font-bold text-[#e2e2e8]">
                          14K <span className="text-[10px] text-[#c4c9ac] font-normal">(Window)</span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">CABIN CLASS</span>
                        <span className="font-['Space_Mono'] text-sm sm:text-base font-bold text-[#e2e2e8]">
                          PREMIUM ECON
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">BAGGAGE TAG</span>
                        <span className="font-['Space_Mono'] text-sm sm:text-base font-bold text-[#c3f400]">
                          #0205847
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">CAROUSEL</span>
                        <span className="font-['Space_Mono'] text-sm sm:text-base font-bold text-[#e2e2e8]">
                          BELT 04 (T3)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBoardingPass();
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase hover:opacity-90 transition-all shadow-[0_0_12px_rgba(195,244,0,0.3)] cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">qr_code_2</span>
                        <span>Boarding Pass</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSyncWallet();
                        }}
                        className="p-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] transition-colors cursor-pointer"
                        title="Sync to Apple / Google Wallet"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-lg">wallet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* EVENT 2: TRANSIT CONNECTION (Keikyu Line to Shibuya) */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('transit', 'transit-keikyu')}
            >
              <div className="absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full bg-[#7df4ff] ${
                    selectedEventType === 'transit' ? 'ring-4 ring-[#7df4ff]/40' : ''
                  }`}
                ></span>
              </div>
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all border shadow-md ${
                  selectedEventType === 'transit'
                    ? 'border-[#7df4ff] shadow-[0_0_20px_rgba(125,244,255,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#00dbe9]/20 text-[#7df4ff] font-['Space_Mono'] text-[11px] font-bold uppercase">
                      TRANSIT EXPRESS
                    </span>
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#e2e2e8]">
                      16:45 → 17:18
                    </span>
                    <span className="font-['DM_Sans'] text-xs text-[#c4c9ac]">(33 mins)</span>
                  </div>
                  <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                    EST. COST: ¥540
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#282a2e] border border-[#333539] flex items-center justify-center text-[#7df4ff]">
                      <span className="material-symbols-outlined text-xl">directions_subway</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e2e2e8]">
                        Keikyu Airport Line (Direct Rapid Express)
                      </span>
                      <span className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac]">
                        Haneda T3 → Shinagawa → Transfer Yamanote Line to Shibuya
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c0e12] border border-[#282a2e] text-[#c3f400] font-['Space_Mono'] text-[11px]">
                      <span className="material-symbols-outlined text-sm">contactless</span>
                      Suica / Pasmo Ready
                    </span>
                    <span className="p-1.5 rounded-lg bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8]">
                      <span className="material-symbols-outlined text-base">directions</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* EVENT 3: HOTEL CHECK-IN (TRUNK HOTEL Yoyogi Park) */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('hotel', 'hotel-trunk')}
            >
              <div className="absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full bg-[#ddb7ff] ${
                    selectedEventType === 'hotel' ? 'ring-4 ring-[#ddb7ff]/40' : ''
                  }`}
                ></span>
              </div>
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl overflow-hidden transition-all border shadow-md ${
                  selectedEventType === 'hotel'
                    ? 'border-[#ddb7ff] shadow-[0_0_20px_rgba(221,183,255,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Hotel Visual Banner */}
                  <div className="md:col-span-4 relative h-44 md:h-auto min-h-[160px] bg-[#1e2024] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="TRUNK(HOTEL) Yoyogi Park architecture"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0E5S5SRCCyDdH8z6eJo9lMVAiHCs_XECjulfUMQL1_-CQ4FxwgZmnrl7hwph5dospJQMm_urxAppKebqJNw7CfeyHtP7FFixzFgWQYG25UDQMEyKloWYpORylWMStVeRhNC0-PpUczfkaEm4gvDxRCqKaeAeJyKbGow4uDwz-t-_BgzDIlCN3ytcGjW4I7vEW9UHjTDwAHulZm4vbogDDdanxCbonZLhlUoL2hKK7mOSXKZjP6S_e2Q"
                      onError={(e) => {
                        // Fallback container if remote image fails
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1a1c20] via-[#1a1c20]/40 to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0c0e12]/80 backdrop-blur-md text-[#ddb7ff] font-['Space_Mono'] text-[11px] font-bold uppercase border border-[#ddb7ff]/20">
                      HOTEL LODGING
                    </span>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-['Space_Mono'] text-xs font-bold text-[#c4c9ac]">
                          CHECK-IN · 17:30 JST
                        </span>
                        <span className="font-['Space_Mono'] text-xs font-bold text-[#ddb7ff] bg-[#0c0e12] border border-[#282a2e] px-2 py-0.5 rounded">
                          #TK-9921
                        </span>
                      </div>
                      <h3 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e2e2e8]">
                        TRUNK(HOTEL) Yoyogi Park
                      </h3>
                      <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac] mt-0.5">
                        1-15-2 Tomigaya, Shibuya-ku, Tokyo · Park View Balcony Suite
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-[#0c0e12]/60 p-3 rounded-xl border border-[#282a2e]">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 font-['Space_Mono'] text-[11px] text-[#e2e2e8]">
                          <span className="material-symbols-outlined text-sm text-[#c3f400]">
                            free_breakfast
                          </span>
                          Breakfast Included
                        </span>
                        <span className="inline-flex items-center gap-1 font-['Space_Mono'] text-[11px] text-[#ffb4ab]">
                          <span className="material-symbols-outlined text-sm">lock</span>
                          Non-Refundable
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDigitalKey();
                        }}
                        className="font-['DM_Sans'] text-xs font-bold text-[#c3f400] hover:underline flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span>Digital Key</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* EVENT 4: DINNER RESERVATION (Uobei Sushi) */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('dine', 'dine-uobei')}
            >
              <div className="absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full bg-[#c3f400] ${
                    selectedEventType === 'dine' ? 'ring-4 ring-[#c3f400]/40' : ''
                  }`}
                ></span>
              </div>
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all border shadow-md ${
                  selectedEventType === 'dine'
                    ? 'border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#3c4d00] text-[#abd600] font-['Space_Mono'] text-[11px] font-bold uppercase">
                      FOOD &amp; DINE
                    </span>
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#e2e2e8]">
                      20:00 - 21:30 JST
                    </span>
                  </div>
                  <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                    TABLECHECK #TC-8812
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#282a2e] border border-[#333539] flex items-center justify-center text-[#c3f400]">
                      <span className="material-symbols-outlined text-xl">restaurant</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e2e2e8]">
                        Uobei Sushi Dogenzaka (High-Speed Conveyor)
                      </span>
                      <span className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac]">
                        Table for 4 · High-speed touchscreen lanes · Shibuya Center-gai
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0c0e12] border border-[#282a2e] text-[#e2e2e8] font-['Space_Mono'] text-[11px]">
                      SPLIT ASSIGNED: 4 PPL
                    </span>
                    <button
                      className="p-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">pin_drop</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ======================= DAY 02 ======================= */}
      {showDay2 && (
        <section className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#282a2e] border border-[#333539] text-[#e2e2e8] font-['Space_Mono'] text-xs font-bold">
                DAY 02
              </span>
              <div className="flex flex-col">
                <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-semibold text-[#e2e2e8] tracking-tight">
                  Neon &amp; Subcultures: Azabudai to Ginza
                </h2>
                <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                  WED, OCT 15, 2025 · JST (UTC+9)
                </span>
              </div>
            </div>
            <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] bg-[#1a1c20] border border-[#282a2e] px-2.5 py-1 rounded">
              {day2Events.length} EVENTS SCHEDULED
            </span>
          </div>

          <div className="relative pl-6 flex flex-col gap-4">
            <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-[#333539]"></div>

            {/* EVENT 5: ACTIVITY - teamLab Borderless */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('teamlab', 'activity-teamlab')}
            >
              <div className="absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full bg-[#f0dbff] ${
                    selectedEventType === 'teamlab' ? 'ring-4 ring-[#f0dbff]/40' : ''
                  }`}
                ></span>
              </div>
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl overflow-hidden transition-all border shadow-md ${
                  selectedEventType === 'teamlab'
                    ? 'border-[#ddb7ff] shadow-[0_0_20px_rgba(221,183,255,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  <div className="md:col-span-4 relative h-40 md:h-auto min-h-[150px] bg-[#1e2024] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="teamLab Borderless digital art projection"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2IEQyUm9hfCSybhNocoTiaKQz9IKzSyrQQDY_Lot_fw4iCK7Y_F_-CC17sh4yQrmGrA5YLGEto-8vlKF5tnRTtSzOGNpYP8Q5cVVCpDZW89jDlZV7qwYFwn_DDrKnEcPhhV15JKBIFWvoaMSIcBKvHcbgxXjnroCri1ZZ8Z9jgrED5xz_RneNFQcRv2g-j0hcL5_rSqBleOjNDV1HJKNt-vgJbJIYYyx0kpoU6cE20IwMw90bdb0MDw"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1a1c20] via-[#1a1c20]/30 to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0c0e12]/80 backdrop-blur-md text-[#f0dbff] font-['Space_Mono'] text-[11px] font-bold uppercase border border-[#ddb7ff]/20">
                      IMMERSIVE ART
                    </span>
                  </div>
                  <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-['Space_Mono'] text-xs font-bold text-[#c4c9ac]">
                          ENTRY SLOT · 10:00 - 10:30 JST
                        </span>
                        <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] bg-[#0c0e12] border border-[#282a2e] px-2 py-0.5 rounded">
                          PASS-TL-5519
                        </span>
                      </div>
                      <h3 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e2e2e8]">
                        teamLab Borderless: MORI Building Digital Art
                      </h3>
                      <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac]">
                        Azabudai Hills Garden Plaza B B1 · Strict entry window requirement
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-[#0c0e12]/50 p-3 rounded-xl border border-[#282a2e]">
                      <div className="flex items-center gap-3">
                        <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">confirmation_number</span>
                          QR Attached (4 Passes)
                        </span>
                        <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                          No Strobe Warning
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBoardingPass();
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#6f00be] text-[#d6a9ff] hover:opacity-90 font-['DM_Sans'] text-xs font-bold transition-colors cursor-pointer"
                        type="button"
                      >
                        View Passes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* EVENT 6: ACTIVITY & CAFE - DSMG & Glitch Coffee */}
            <article
              className="relative group cursor-pointer"
              onClick={() => onSelectEvent('dsmg', 'activity-dsmg')}
            >
              <div className="absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full bg-[#0c0e12] flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full bg-[#c4c9ac] ${
                    selectedEventType === 'dsmg' ? 'ring-4 ring-[#c4c9ac]/40' : ''
                  }`}
                ></span>
              </div>
              <div
                className={`bg-[#1a1c20] hover:bg-[#1e2024] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all border shadow-md ${
                  selectedEventType === 'dsmg'
                    ? 'border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.15)]'
                    : 'border-[#282a2e] hover:border-[#37393e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#282a2e] text-[#c4c9ac] font-['Space_Mono'] text-[11px] font-bold uppercase">
                      CULTURE &amp; RETAIL
                    </span>
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#e2e2e8]">
                      14:30 - 17:00 JST
                    </span>
                  </div>
                  <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
                    RESERVATIONS CONFIRMED
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#282a2e] border border-[#333539] flex items-center justify-center text-[#e2e2e8]">
                      <span className="material-symbols-outlined text-xl">storefront</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e2e2e8]">
                        Dover Street Market Ginza &amp; Glitch Coffee Roastery
                      </span>
                      <span className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac]">
                        Single origin geisha tasting flights booked for 16:15
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0c0e12] border border-[#282a2e] text-[#c4c9ac] font-['Space_Mono'] text-[11px]">
                      GINZA 6-CHOME
                    </span>
                    <button
                      className="p-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">navigation</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Render Other Days (Day 3-6) if selected or added */}
      {showOtherDays && otherDaysEvents.length > 0 && (
        <section className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#282a2e] border border-[#333539] text-[#e2e2e8] font-['Space_Mono'] text-xs font-bold">
                ADDITIONAL EXPEDITIONS
              </span>
              <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e2e2e8]">
                Upcoming Scheduled Days
              </h2>
            </div>
            <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
              {otherDaysEvents.length} EVENTS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 pl-6 border-l-2 border-[#333539]">
            {otherDaysEvents.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectEvent(item.category, item.id)}
                className="bg-[#1a1c20] hover:bg-[#1e2024] p-4 rounded-xl border border-[#282a2e] cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-[#282a2e] text-[#c3f400] font-['Space_Mono'] text-[11px]">
                    DAY {item.day}
                  </span>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[#e2e2e8]">{item.title}</h4>
                    <p className="font-['DM_Sans'] text-xs text-[#c4c9ac]">{item.location}</p>
                  </div>
                </div>
                <div className="text-right font-['Space_Mono'] text-xs">
                  <div className="text-[#c3f400] font-bold">{item.time_start}</div>
                  <div className="text-[10px] text-[#c4c9ac]">{item.pnr}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
