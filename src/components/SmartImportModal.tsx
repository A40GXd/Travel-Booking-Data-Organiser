import React, { useState } from 'react';
import { ItineraryEvent } from '../types';

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (event: ItineraryEvent) => void;
  onParsePNR: (rawText: string, hint?: string) => Promise<{ event: ItineraryEvent; pnr: string }>;
}

export const SmartImportModal: React.FC<SmartImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onParsePNR,
}) => {
  const [rawText, setRawText] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodeProgress, setDecodeProgress] = useState(0);
  const [statusText, setStatusText] = useState('Idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const sampleTemplates = [
    {
      label: 'ANA NH107 E-Ticket',
      content:
        'ALL NIPPON AIRWAYS CONFIRMATION\nPassenger: MIRA VANCE\nFlight: NH107 / Boeing 787-9\nRoute: SFO (San Francisco) to HND (Tokyo Haneda)\nDeparture: 08:30 PDT Oct 14\nArrival: 15:45 JST Oct 15\nSeat: 14K (Premium Economy)\nBooking Ref: W82KLP\nBaggage: 2 Pieces 23kg',
    },
    {
      label: 'JR Shinkansen Nozomi',
      content:
        'SMART-EX BULLET TRAIN RESERVATION\nService: Tokaido Shinkansen Nozomi 43\nFrom: Tokyo Track 14 To: Kyoto Platform 11\nDepart: 09:12 JST Arrive: 11:27 JST\nCar 7, Seat 8D (Mt. Fuji Window Side)\nPNR Code: SMART-EX-77\nTotal Fare: ¥14,200',
    },
    {
      label: 'TRUNK Hotel Stay',
      content:
        'HOTEL RESERVATION CONFIRMATION\nProperty: TRUNK(HOTEL) Yoyogi Park\nCheck-in: Oct 14, 2025 at 17:30 JST\nCheck-out: Oct 17, 2025 at 11:00 JST\nGuest: Mira Vance\nSuite: Park View Balcony Suite\nConfirmation Number: TK-9921\nBreakfast: Daily Included',
    },
  ];

  const handleStartDecode = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please paste ticket text or select a template above.');
      return;
    }
    setErrorMsg('');
    setIsDecoding(true);
    setDecodeProgress(15);
    setStatusText('Ingesting unstructured OCR/PNR string...');

    setTimeout(() => {
      setDecodeProgress(45);
      setStatusText('Extracting flight carrier vectors & timetable slots...');
    }, 400);

    setTimeout(() => {
      setDecodeProgress(80);
      setStatusText('Parsing seat assignments and booking hashes...');
    }, 850);

    try {
      const result = await onParsePNR(rawText);
      setTimeout(() => {
        setDecodeProgress(100);
        setStatusText('PNR decoded with 96% AI confidence!');
        setTimeout(() => {
          setIsDecoding(false);
          onImportSuccess(result.event);
          onClose();
        }, 500);
      }, 1200);
    } catch {
      setIsDecoding(false);
      setErrorMsg('Failed to decode input. Please check the text format.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1c20] border border-[#333539] w-full max-w-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#282a2e] flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-lg font-bold">bolt</span>
            </span>
            <div className="flex flex-col">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2e8]">
                Smart Import / Drop PNR
              </h3>
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">
                AI-PARSER ENGINE v2.4 · AUTO-EXTRACT
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#c4c9ac] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-[#93000a]/30 border border-[#93000a] text-[#ffdad6] text-xs font-['Space_Mono']">
            {errorMsg}
          </div>
        )}

        {/* Sample Quick Load Buttons */}
        <div>
          <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase block mb-1.5">
            Quick-Load Sample Confirmations:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleTemplates.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setRawText(t.content)}
                className="px-2.5 py-1 rounded-lg bg-[#0c0e12] border border-[#282a2e] hover:border-[#c3f400] text-[#e2e2e8] text-[11px] font-['Space_Mono'] cursor-pointer transition-colors"
              >
                + {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
            Raw E-Ticket / Confirmation Email / PNR Code
          </label>
          <textarea
            rows={6}
            placeholder="Paste your airline confirmation email, boarding pass SMS, TableCheck reservation, or booking PNR reference here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isDecoding}
            className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl p-3 text-[#e2e2e8] font-['Space_Mono'] text-xs focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Decoding Progress Meter */}
        {isDecoding && (
          <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#282a2e] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-['Space_Mono']">
              <span className="text-[#c3f400] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
                {statusText}
              </span>
              <span className="text-[#e2e2e8] font-bold">{decodeProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#282a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c3f400] transition-all duration-300"
                style={{ width: `${decodeProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-['Space_Mono'] text-[#c4c9ac]">
            Accepts: IATA, PNR, TableCheck, JR-East, Suica
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDecoding}
              className="px-4 py-2 rounded-full bg-[#282a2e] text-[#e2e2e8] hover:bg-[#37393e] font-['DM_Sans'] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartDecode}
              disabled={isDecoding}
              className="px-5 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_16px_rgba(195,244,0,0.3)] cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">bolt</span>
              <span>{isDecoding ? 'Decoding...' : 'Parse & Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
