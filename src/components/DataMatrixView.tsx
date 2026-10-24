import React, { useState } from 'react';
import { ItineraryEvent, EventCategory } from '../types';

interface DataMatrixProps {
  events: ItineraryEvent[];
  onSelectEvent: (category: string, eventId: string) => void;
  onDeleteEvent: (id: string) => void;
  onOpenAddEvent: () => void;
}

export const DataMatrixView: React.FC<DataMatrixProps> = ({
  events,
  onSelectEvent,
  onDeleteEvent,
  onOpenAddEvent,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Records' },
    { id: 'flight', label: 'Flights' },
    { id: 'transit', label: 'Transit' },
    { id: 'hotel', label: 'Lodging' },
    { id: 'dine', label: 'Dining' },
    { id: 'activity', label: 'Activities' },
  ];

  const filtered = events.filter((e) => {
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      (e.pnr && e.pnr.toLowerCase().includes(q)) ||
      e.location.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const copyPNR = (pnr: string, id: string) => {
    navigator.clipboard.writeText(pnr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Day', 'Category', 'Title', 'PNR', 'Start Time', 'End Time', 'Location', 'Cost (JPY)'];
    const rows = filtered.map((e) => [
      e.id,
      e.day,
      e.category,
      `"${e.title.replace(/"/g, '""')}"`,
      e.pnr || 'N/A',
      e.time_start,
      e.time_end || '',
      `"${e.location.replace(/"/g, '""')}"`,
      e.cost_jpy || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'wanderlore_tokyo_drift_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case 'flight':
        return 'bg-[#6f00be]/30 text-[#d6a9ff] border-[#6f00be]';
      case 'transit':
        return 'bg-[#00dbe9]/20 text-[#7df4ff] border-[#00dbe9]/40';
      case 'hotel':
        return 'bg-[#ddb7ff]/20 text-[#ddb7ff] border-[#ddb7ff]/40';
      case 'dine':
        return 'bg-[#3c4d00]/40 text-[#abd600] border-[#3c4d00]';
      case 'activity':
      default:
        return 'bg-[#282a2e] text-[#c4c9ac] border-[#37393e]';
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-[1540px] mx-auto">
      {/* Control bar */}
      <div className="bg-[#1a1c20] p-4 sm:p-5 rounded-2xl border border-[#282a2e] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-['DM_Sans'] font-bold transition-all cursor-pointer ${
                filterCategory === c.id
                  ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.25)]'
                  : 'bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] hover:bg-[#333539]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0c0e12] px-3 py-1.5 rounded-full border border-[#282a2e]">
            <span className="material-symbols-outlined text-sm text-[#c4c9ac] mr-1.5">search</span>
            <input
              type="text"
              placeholder="Filter matrix records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#e2e2e8] focus:outline-hidden w-36 sm:w-48 placeholder:text-[#8e9379]"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] text-xs font-bold font-['DM_Sans'] transition-colors cursor-pointer border border-[#333539]"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold font-['DM_Sans'] uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.2)]"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Tabular Grid */}
      <div className="bg-[#1a1c20] rounded-2xl border border-[#282a2e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c0e12] border-b border-[#282a2e] text-[#c4c9ac] font-['Space_Mono'] text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-normal">Day</th>
                <th className="py-3.5 px-4 font-normal">PNR / Ref</th>
                <th className="py-3.5 px-4 font-normal">Category</th>
                <th className="py-3.5 px-4 font-normal">Title &amp; Route</th>
                <th className="py-3.5 px-4 font-normal">Timing</th>
                <th className="py-3.5 px-4 font-normal">Cost (JPY)</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282a2e] font-['DM_Sans'] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#c4c9ac]">
                    No records found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectEvent(item.category, item.id)}
                    className="hover:bg-[#1e2024]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-['Space_Mono'] font-bold text-[#c3f400]">
                      D{item.day.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4 font-['Space_Mono']">
                      {item.pnr ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyPNR(item.pnr!, item.id);
                          }}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0c0e12] border border-[#282a2e] text-[#e2e2e8] hover:border-[#c3f400] transition-colors"
                          title="Click to copy PNR"
                        >
                          <span>{item.pnr}</span>
                          <span className="material-symbols-outlined text-[13px] text-[#c4c9ac]">
                            {copiedId === item.id ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-[#8e9379]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-['Space_Mono'] text-[10px] font-bold uppercase border ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#e2e2e8] group-hover:text-[#c3f400] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#c4c9ac] truncate max-w-xs">{item.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-['Space_Mono'] text-[11px] text-[#e2e2e8]">
                      <div>{item.time_start}</div>
                      {item.time_end && <div className="text-[#8e9379]">{item.time_end}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-['Space_Mono'] font-bold text-[#e2e2e8]">
                      {item.cost_jpy ? `¥${item.cost_jpy.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c3f400]/10 text-[#c3f400] font-['Space_Mono'] text-[10px] font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                        {item.status || 'CONFIRMED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(item.category, item.id);
                          }}
                          className="p-1 rounded hover:bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8]"
                          title="Inspect Item"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(item.id);
                          }}
                          className="p-1 rounded hover:bg-[#282a2e] text-[#c4c9ac] hover:text-[#ffb4ab]"
                          title="Delete Item"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
