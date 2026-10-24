import React, { useState, useEffect } from 'react';
import { ItineraryEvent } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: ItineraryEvent[];
  onSelectEvent: (category: string, eventId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  events,
  onSelectEvent,
}) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = events.filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.pnr && e.pnr.toLowerCase().includes(q)) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-[#1a1c20] border border-[#333539] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-[#282a2e] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#c3f400] text-xl">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Search flights, hotels, PNRs, venues, or bookings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#e2e2e8] text-sm font-['DM_Sans'] focus:outline-hidden placeholder:text-[#8e9379]"
          />
          <kbd className="px-2 py-0.5 rounded bg-[#282a2e] text-[#c4c9ac] font-['Space_Mono'] text-[10px]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#282a2e] p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-[#c4c9ac] text-xs">
              No bookings or telemetry vectors found matching "{query}"
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectEvent(item.category, item.id);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#1e2024] cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#0c0e12] border border-[#282a2e] flex items-center justify-center text-[#c3f400]">
                    <span className="material-symbols-outlined text-sm">
                      {item.category === 'flight'
                        ? 'flight'
                        : item.category === 'transit'
                        ? 'train'
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
                    <p className="font-['DM_Sans'] text-xs text-[#c4c9ac]">{item.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-['Space_Mono'] text-xs text-[#c3f400] font-bold block">
                    {item.time_start}
                  </span>
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">
                    {item.pnr || `DAY ${item.day}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
