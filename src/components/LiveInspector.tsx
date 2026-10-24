import React, { useState } from 'react';
import { ReadinessItem } from '../types';

interface LiveInspectorProps {
  selectedEventType: string;
  readinessItems: ReadinessItem[];
  onToggleReadiness: (id: string, completed: boolean) => void;
  onOpenMobilePassbook: () => void;
  onContactConcierge: () => void;
}

export const LiveInspector: React.FC<LiveInspectorProps> = ({
  selectedEventType,
  readinessItems,
  onToggleReadiness,
  onOpenMobilePassbook,
  onContactConcierge,
}) => {
  const [showCurrencyCalc, setShowCurrencyCalc] = useState(false);
  const [usdAmount, setUsdAmount] = useState('100');
  const rate = 152.4;

  // Dynamic Inspector card data based on selected event
  const getInspectorData = () => {
    switch (selectedEventType) {
      case 'hotel':
        return {
          itemNumber: 'ITEM #03',
          title: 'TRUNK(HOTEL) Room Key',
          status: 'DIGITAL KEY READY',
          statusColor: 'text-[#ddb7ff]',
          metric1Label: 'ROOM NUMBER',
          metric1Val: 'SUITE 402',
          metric2Label: 'WIFI NETWORK',
          metric2Val: 'TRUNK_GUEST',
          metric3Label: 'CHECK-OUT',
          metric3Val: 'OCT 17 11:00',
          spec1Label: 'PROPERTY LOCATION',
          spec1Val: 'Shibuya-ku, Tomigaya',
          spec2Label: 'INCLUDED MEALS',
          spec2Val: 'Organic Farm Breakfast',
          spec3Label: 'CANCELLATION',
          spec3Val: 'NON-REFUNDABLE',
          spec4Label: 'HOTEL DESK',
          spec4Val: '+81 (0)3 5766 3210',
          action1: 'Open Digital Bluetooth Key',
          action2: 'Hotel Concierge Chat',
        };
      case 'transit':
        return {
          itemNumber: 'ITEM #02',
          title: 'Keikyu Line Live Routing',
          status: 'TRACK 2 ON TIME',
          statusColor: 'text-[#7df4ff]',
          metric1Label: 'DEPARTURE',
          metric1Val: '16:45 HND T3',
          metric2Label: 'ARRIVAL',
          metric2Val: '17:18 SHIBUYA',
          metric3Label: 'EST. FARE',
          metric3Val: '¥540 JPY',
          spec1Label: 'RECOMMENDED IC',
          spec1Val: 'Apple Wallet Suica',
          spec2Label: 'TRANSFER POINT',
          spec2Val: 'Shinagawa Platform 3',
          spec3Label: 'FREQUENCY',
          spec3Val: 'Every 8-10 Minutes',
          spec4Label: 'STATION ASSIST',
          spec4Val: '+81 (0)3 5789 8588',
          action1: 'Open Suica Pass in Wallet',
          action2: 'View Transit Map',
        };
      case 'teamlab':
        return {
          itemNumber: 'ITEM #05',
          title: 'teamLab Entry Voucher',
          status: 'SLOT RESERVED',
          statusColor: 'text-[#ddb7ff]',
          metric1Label: 'TIMED ENTRY',
          metric1Val: '10:00 - 10:30',
          metric2Label: 'GROUP SIZE',
          metric2Val: '4 TICKETS',
          metric3Label: 'DURATION',
          metric3Val: '~3 Hours',
          spec1Label: 'VENUE ENTRY',
          spec1Val: 'Azabudai Hills Garden B1',
          spec2Label: 'TICKET CODE',
          spec2Val: 'PASS-TL-5519',
          spec3Label: 'CONDITIONS',
          spec3Val: 'Strict Window / No Strobe',
          spec4Label: 'INFORMATION',
          spec4Val: '+81 (0)3 6230 9666',
          action1: 'Open Group QR Codes',
          action2: 'Azabudai Hills Directions',
        };
      case 'dine':
        return {
          itemNumber: 'ITEM #04',
          title: 'Uobei Sushi Party Split',
          status: 'TABLE CONFIRMED',
          statusColor: 'text-[#c3f400]',
          metric1Label: 'RESERVATION',
          metric1Val: '20:00 JST',
          metric2Label: 'PARTY COUNT',
          metric2Val: '4 DINERS',
          metric3Label: 'SPLIT PER HEAD',
          metric3Val: '¥2,400',
          spec1Label: 'RESERVATION REF',
          spec1Val: 'TABLECHECK #TC-8812',
          spec2Label: 'SEATING ORDER',
          spec2Val: 'Touchscreen Lanes 21-24',
          spec3Label: 'SPLITWISE LINK',
          spec3Val: 'Synced to Tokyo Drift',
          spec4Label: 'RESTAURANT PHONE',
          spec4Val: '+81 (0)3 3462 0241',
          action1: 'View Reservation Pass',
          action2: 'Call Restaurant Desk',
        };
      case 'dsmg':
        return {
          itemNumber: 'ITEM #06',
          title: 'DSMG & Glitch Tasting',
          status: 'SEATS SECURED',
          statusColor: 'text-[#e2e2e8]',
          metric1Label: 'TASTING TIME',
          metric1Val: '16:15 JST',
          metric2Label: 'BEANS PROFILE',
          metric2Val: 'Geisha Flight',
          metric3Label: 'LOCATION',
          metric3Val: 'Ginza 6-Chome',
          spec1Label: 'RESERVATION CODE',
          spec1Val: 'GLITCH-615',
          spec2Label: 'SEATS RESERVED',
          spec2Val: '2 Bar Stools',
          spec3Label: 'SPECIALTY',
          spec3Val: 'Single Origin Tasting',
          spec4Label: 'ROASTERY PHONE',
          spec4Val: '+81 (0)3 5522 4110',
          action1: 'View Tasting Confirmation',
          action2: 'Navigate Ginza Map',
        };
      case 'flight':
      default:
        return {
          itemNumber: 'ITEM #01',
          title: 'ANA NH107 Flight Deck',
          status: 'EN ROUTE',
          statusColor: 'text-[#c3f400]',
          metric1Label: 'GROUND SPEED',
          metric1Val: '534 KTS',
          metric2Label: 'HEADWIND',
          metric2Val: '42 KTS',
          metric3Label: 'REMAINING',
          metric3Val: '4h 12m',
          spec1Label: 'TERMINAL NAVIGATION',
          spec1Val: 'Tokyo T3 Indoor Map',
          spec2Label: 'CHECKED BAGGAGE',
          spec2Val: '2 × 23KG (46KG MAX)',
          spec3Label: 'CANCELLATION POLICY',
          spec3Val: 'LOCKED / 100% PENALTY',
          spec4Label: 'AIRLINE HOTLINE',
          spec4Val: '+81 (0)3 6741 8841',
          action1: 'Open Mobile Passbook',
          action2: 'Contact Flight Concierge',
        };
    }
  };

  const data = getInspectorData();
  const completedCount = readinessItems.filter((i) => i.completed).length;

  return (
    <aside className="sticky top-20 flex flex-col gap-4">
      {/* Live Inspector Bento Card */}
      <div
        id="flight-inspector-card"
        className="bg-[#1a1c20] rounded-2xl p-5 sm:p-6 border border-[#282a2e] shadow-2xl flex flex-col gap-4 relative overflow-hidden transition-all duration-200"
      >
        {/* Glow Accent subtle blob */}
        <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-[#c3f400]/10 blur-2xl pointer-events-none"></div>

        {/* Card Header & Status */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex flex-col">
            <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] tracking-wider">
              HUD INSPECTOR // {data.itemNumber}
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
              {data.title}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#c3f400]/10 text-[#c3f400] font-['Space_Mono'] text-[11px] font-bold uppercase inline-flex items-center gap-1.5 border border-[#c3f400]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
            {data.status}
          </span>
        </div>

        {/* Radar / Mini Flight Telemetry Graphic */}
        <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">
              {selectedEventType === 'flight' ? 'LIVE TELEMETRY STREAM' : 'TACTICAL STATUS FEED'}
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold">
              {selectedEventType === 'flight' ? 'ALT: 38,000 FT' : 'SIGNAL: STABLE 5G'}
            </span>
          </div>

          {/* SVG Vector Arc Flight Path Graphic */}
          <div className="w-full h-24 relative flex items-center justify-center">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 320 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid backdrop marks */}
              <line
                className="text-[#333539]"
                stroke="currentColor"
                strokeDasharray="3 3"
                x1="20"
                x2="300"
                y1="20"
                y2="20"
              ></line>
              <line
                className="text-[#333539]"
                stroke="currentColor"
                strokeDasharray="3 3"
                x1="20"
                x2="300"
                y1="50"
                y2="50"
              ></line>

              {/* Flight Trajectory */}
              <path
                className="text-[#282a2e]"
                d="M 20 60 Q 160 5 300 60"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
              <path
                className="text-[#c3f400]"
                d="M 20 60 Q 160 5 210 25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              ></path>

              {/* Origin Node */}
              <circle
                className="fill-[#0c0e12] stroke-[#ffffff]"
                cx="20"
                cy="60"
                r="4"
                strokeWidth="2"
              ></circle>
              <text className="fill-[#c4c9ac] font-['Space_Mono'] text-[9px]" x="12" y="74">
                SFO
              </text>

              {/* Current Plane Position Marker */}
              <circle className="fill-[#c3f400]" cx="210" cy="25" r="5"></circle>
              <circle
                className="stroke-[#c3f400]/40 animate-ping"
                cx="210"
                cy="25"
                r="10"
                strokeWidth="1.5"
              ></circle>

              {/* Destination Node */}
              <circle
                className="fill-[#0c0e12] stroke-[#c3f400]"
                cx="300"
                cy="60"
                r="4"
                strokeWidth="2"
              ></circle>
              <text className="fill-[#c3f400] font-['Space_Mono'] text-[9px]" x="290" y="74">
                HND
              </text>
            </svg>
          </div>

          {/* Telemetry Readouts */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-['Space_Mono'] text-[11px]">
            <div className="flex flex-col">
              <span className="text-[#c4c9ac] text-[10px] uppercase">{data.metric1Label}</span>
              <span className="text-[#e2e2e8] font-bold">{data.metric1Val}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#c4c9ac] text-[10px] uppercase">{data.metric2Label}</span>
              <span className="text-[#e2e2e8] font-bold">{data.metric2Val}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#c4c9ac] text-[10px] uppercase">{data.metric3Label}</span>
              <span className="text-[#c3f400] font-bold">{data.metric3Val}</span>
            </div>
          </div>
        </div>

        {/* Inspector Specs & Policy Matrix */}
        <div className="flex flex-col gap-2 font-['Space_Mono'] text-[11px]">
          <div className="p-3 rounded-xl bg-[#1e2024] border border-[#282a2e] flex items-center justify-between">
            <span className="text-[#c4c9ac]">{data.spec1Label}</span>
            <a
              className="text-[#c3f400] hover:underline inline-flex items-center gap-1 font-['DM_Sans'] text-xs font-bold"
              href="#map"
            >
              <span>{data.spec1Val}</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <div className="p-3 rounded-xl bg-[#1e2024] border border-[#282a2e] flex items-center justify-between">
            <span className="text-[#c4c9ac]">{data.spec2Label}</span>
            <span className="text-[#e2e2e8] font-bold">{data.spec2Val}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#1e2024] border border-[#282a2e] flex items-center justify-between">
            <span className="text-[#c4c9ac]">{data.spec3Label}</span>
            <span className="text-[#ffb4ab] font-bold">{data.spec3Val}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#1e2024] border border-[#282a2e] flex items-center justify-between">
            <span className="text-[#c4c9ac]">{data.spec4Label}</span>
            <span className="text-[#e2e2e8] font-bold">{data.spec4Val}</span>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            onClick={onOpenMobilePassbook}
            className="w-full py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(195,244,0,0.25)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base font-bold">airplane_ticket</span>
            <span>{data.action1}</span>
          </button>
          <button
            onClick={onContactConcierge}
            className="w-full py-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#333539]"
            type="button"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>{data.action2}</span>
          </button>
        </div>
      </div>

      {/* Mini Weather Widget & Currency Bento */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weather Box */}
        <div className="bg-[#1a1c20] p-4 rounded-2xl border border-[#282a2e] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">TOKYO FORECAST</span>
            <span className="material-symbols-outlined text-lg text-[#c3f400]">sunny</span>
          </div>
          <div className="mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8] leading-none">
              21°C
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] block mt-1">
              Crisp Autumn / Dry
            </span>
          </div>
        </div>

        {/* Currency Split & Cash Widget */}
        <div
          onClick={() => setShowCurrencyCalc(!showCurrencyCalc)}
          className="bg-[#1a1c20] p-4 rounded-2xl border border-[#282a2e] hover:border-[#7df4ff]/40 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-[#c4c9ac]">
            <span className="font-['Space_Mono'] text-[11px] uppercase">CURRENCY PEG</span>
            <span className="material-symbols-outlined text-lg text-[#7df4ff]">currency_yen</span>
          </div>
          <div className="mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8] leading-none">
              152.4
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] block mt-1">
              USD/JPY Live Interbank
            </span>
          </div>
        </div>
      </div>

      {/* Currency Quick Converter Popover */}
      {showCurrencyCalc && (
        <div className="bg-[#1e2024] p-3.5 rounded-xl border border-[#7df4ff]/30 text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Mono'] text-[#7df4ff] font-bold">Quick Currency Converter</span>
            <button
              onClick={() => setShowCurrencyCalc(false)}
              className="text-[#c4c9ac] hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#0c0e12] px-2 py-1 rounded border border-[#282a2e]">
              <span className="text-[#c4c9ac] mr-1">$</span>
              <input
                type="number"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="bg-transparent w-full text-white font-['Space_Mono'] focus:outline-hidden"
              />
            </div>
            <span className="text-[#c4c9ac]">→</span>
            <div className="flex-1 bg-[#0c0e12] px-2 py-1 rounded border border-[#282a2e] font-['Space_Mono'] text-[#c3f400]">
              ¥{Math.round((parseFloat(usdAmount) || 0) * rate).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Packing & Travel Readiness Indicator Mini Card */}
      <div className="bg-[#1a1c20] p-4 sm:p-5 rounded-2xl border border-[#282a2e] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-lg">checklist</span>
            <span className="font-['Space_Grotesk'] text-sm sm:text-base font-semibold text-[#e2e2e8]">
              Arrival Gate Readiness
            </span>
          </div>
          <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold">
            {completedCount}/{readinessItems.length} COMPLETE
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {readinessItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleReadiness(item.id, !item.completed)}
              className="flex items-center gap-2.5 text-[#e2e2e8] font-['DM_Sans'] text-xs sm:text-sm cursor-pointer select-none group"
            >
              <span
                className={`material-symbols-outlined text-base transition-colors ${
                  item.completed ? 'text-[#c3f400]' : 'text-[#c4c9ac] group-hover:text-white'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.completed ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span
                className={`transition-colors ${
                  item.completed ? 'line-through text-[#c4c9ac]' : 'text-[#e2e2e8]'
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
