import React, { useState } from 'react';
import { EventCategory, ItineraryEvent } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<ItineraryEvent, 'id'>) => Promise<void>;
  defaultDay?: number | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultDay,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('activity');
  const [day, setDay] = useState(defaultDay || 1);
  const [timeStart, setTimeStart] = useState('14:00');
  const [timeEnd, setTimeEnd] = useState('16:00');
  const [location, setLocation] = useState('');
  const [pnr, setPnr] = useState('');
  const [subtext, setSubtext] = useState('');
  const [costJpy, setCostJpy] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required (min 2 characters)';
    else if (title.trim().length < 2) errs.title = 'Title must be at least 2 characters';

    if (!location.trim()) errs.location = 'Location or venue address is required';
    if (!timeStart.trim()) errs.timeStart = 'Start time is required';

    if (pnr && !/^[A-Z0-9#-]{3,16}$/i.test(pnr.trim())) {
      errs.pnr = 'PNR must be 3-16 alphanumeric characters';
    }

    if (costJpy && (isNaN(Number(costJpy)) || Number(costJpy) < 0)) {
      errs.costJpy = 'Cost must be a positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        category,
        day: Number(day),
        time_start: timeStart.trim(),
        time_end: timeEnd.trim() || undefined,
        location: location.trim(),
        pnr: pnr.trim().toUpperCase() || undefined,
        subtext: subtext.trim() || undefined,
        cost_jpy: costJpy ? Number(costJpy) : undefined,
        meta_badges: [`DAY ${day}`, category.toUpperCase(), 'MANUAL ENTRY'],
        status: 'CONFIRMED',
      });
      onClose();
    } catch {
      setErrors({ general: 'Failed to record event. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1c20] border border-[#333539] w-full max-w-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#282a2e] flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-lg">event_available</span>
            </span>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2e8]">
              Lock In Itinerary Vector
            </h3>
          </div>
          <button onClick={onClose} className="text-[#c4c9ac] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {errors.general && (
          <div className="p-2.5 rounded-lg bg-[#93000a]/30 border border-[#93000a] text-[#ffdad6] text-xs font-['Space_Mono']">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-['DM_Sans'] text-xs">
          {/* Title */}
          <div>
            <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Tsukiji Outer Market Morning Tuna Auction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-[#0c0e12] border ${
                errors.title ? 'border-[#ffb4ab]' : 'border-[#282a2e]'
              } focus:border-[#c3f400] rounded-xl px-3.5 py-2.5 text-[#e2e2e8] text-sm focus:outline-hidden`}
            />
            {errors.title && <span className="text-[#ffb4ab] text-[10px] mt-1 block">{errors.title}</span>}
          </div>

          {/* Category & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden"
              >
                <option value="flight">Flight (Aviation)</option>
                <option value="transit">Transit (Rail / Subway)</option>
                <option value="hotel">Hotel &amp; Lodging</option>
                <option value="dine">Food &amp; Dining</option>
                <option value="activity">Culture &amp; Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                Expedition Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden font-['Space_Mono']"
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d.toString().padStart(2, '0')} (Oct {13 + d})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                Start Time *
              </label>
              <input
                type="text"
                placeholder="e.g. 09:30 or 09:30 JST"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className={`w-full bg-[#0c0e12] border ${
                  errors.timeStart ? 'border-[#ffb4ab]' : 'border-[#282a2e]'
                } focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm font-['Space_Mono'] focus:outline-hidden`}
              />
              {errors.timeStart && (
                <span className="text-[#ffb4ab] text-[10px] mt-1 block">{errors.timeStart}</span>
              )}
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="e.g. 12:00 JST"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm font-['Space_Mono'] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
              Location / Venue / Route *
            </label>
            <input
              type="text"
              placeholder="e.g. 4-16-2 Tsukiji, Chuo-ku, Tokyo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full bg-[#0c0e12] border ${
                errors.location ? 'border-[#ffb4ab]' : 'border-[#282a2e]'
              } focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden`}
            />
            {errors.location && (
              <span className="text-[#ffb4ab] text-[10px] mt-1 block">{errors.location}</span>
            )}
          </div>

          {/* PNR & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                PNR / Booking Reference
              </label>
              <input
                type="text"
                placeholder="e.g. W82KLP or TK-9921"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className={`w-full bg-[#0c0e12] border ${
                  errors.pnr ? 'border-[#ffb4ab]' : 'border-[#282a2e]'
                } focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#c3f400] font-['Space_Mono'] text-sm uppercase focus:outline-hidden`}
              />
              {errors.pnr && <span className="text-[#ffb4ab] text-[10px] mt-1 block">{errors.pnr}</span>}
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                Est. Cost (JPY ¥)
              </label>
              <input
                type="number"
                placeholder="e.g. 4500"
                value={costJpy}
                onChange={(e) => setCostJpy(e.target.value)}
                className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] font-['Space_Mono'] text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {/* Notes / Subtext */}
          <div>
            <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
              Field Notes &amp; Seat Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Priority entrance with English guide, camera permitted"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-xs focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full bg-[#282a2e] text-[#e2e2e8] hover:bg-[#333539] font-['DM_Sans'] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_16px_rgba(195,244,0,0.3)] cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#161e00] border-t-transparent rounded-full animate-spin"></span>
                  <span>Encoding...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                  <span>Commit to Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
