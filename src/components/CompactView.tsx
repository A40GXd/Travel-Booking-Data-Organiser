import React from 'react';
import { ItineraryEvent } from '../types';

interface CompactViewProps {
  events: ItineraryEvent[];
  onSelectEvent: (category: string, eventId: string) => void;
  selectedDay: number | null;
}

export const CompactView: React.FC<CompactViewProps> = ({
  events,
  onSelectEvent,
  selectedDay,
}) => {
  const filtered = selectedDay ? events.filter((e) => e.day === selectedDay) : events;

  // Group by day
  const groupedByDay: Record<number, ItineraryEvent[]> = {};
  filtered.forEach((e) => {
    if (!groupedByDay[e.day]) groupedByDay[e.day] = [];
    groupedByDay[e.day].push(e);
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {Object.keys(groupedByDay).map((dayKey) => {
        const dayNum = Number(dayKey);
        const dayEvents = groupedByDay[dayNum];

        return (
          <div key={dayNum} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#c3f400] text-[#161e00] font-['Space_Mono'] text-xs font-bold">
                DAY {dayNum.toString().padStart(2, '0')}
              </span>
              <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
                {dayNum === 1
                  ? 'Tokyo Arrival & Shibuya Base'
                  : dayNum === 2
                  ? 'Digital Art & Ginza Geisha Tasting'
                  : `Expedition Stage ${dayNum}`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayEvents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectEvent(item.category, item.id)}
                  className="bg-[#1a1c20] hover:bg-[#1e2024] p-3.5 rounded-xl border border-[#282a2e] hover:border-[#c3f400] transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#0c0e12] border border-[#282a2e] flex items-center justify-center text-[#c3f400]">
                      <span className="material-symbols-outlined text-base">
                        {item.category === 'flight'
                          ? 'flight_takeoff'
                          : item.category === 'transit'
                          ? 'directions_subway'
                          : item.category === 'hotel'
                          ? 'hotel'
                          : item.category === 'dine'
                          ? 'restaurant'
                          : 'local_activity'}
                      </span>
                    </span>
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-semibold text-[#e2e2e8] group-hover:text-[#c3f400] transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-['DM_Sans'] text-xs text-[#c4c9ac] truncate max-w-xs">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] block">
                      {item.time_start}
                    </span>
                    <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">
                      {item.pnr || 'LOCKED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
