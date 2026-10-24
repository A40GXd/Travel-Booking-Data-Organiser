import React from 'react';

interface MobilePassbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncToast: (msg: string) => void;
}

export const MobilePassbookModal: React.FC<MobilePassbookModalProps> = ({
  isOpen,
  onClose,
  onSyncToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1c20] border border-[#333539] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Pass Top Banner */}
        <div className="bg-[#6f00be] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">flight</span>
            </div>
            <div>
              <span className="text-[10px] font-['Space_Mono'] uppercase tracking-wider block opacity-80">
                BOARDING PASS
              </span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold">ANA All Nippon Airways</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-6 flex flex-col gap-5 bg-[#1a1c20]">
          {/* Passenger & Class */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase block">
                PASSENGER
              </span>
              <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
                MIRA VANCE
              </span>
            </div>
            <div className="text-right">
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase block">
                CABIN CLASS
              </span>
              <span className="font-['Space_Mono'] text-sm font-bold text-[#c3f400]">
                PREMIUM ECON
              </span>
            </div>
          </div>

          {/* Route Display */}
          <div className="flex items-center justify-between py-2 border-y border-[#282a2e]">
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#e2e2e8]">SFO</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">08:30 PDT</span>
              <span className="text-[10px] text-[#8e9379]">San Francisco</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-['Space_Mono'] text-[10px] text-[#c3f400]">11h 15m</span>
              <span className="material-symbols-outlined text-[#c3f400] text-lg my-0.5">
                arrow_forward
              </span>
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">NH107</span>
            </div>

            <div className="flex flex-col text-right">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#c3f400]">HND</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">15:45 JST +1</span>
              <span className="text-[10px] text-[#8e9379]">Tokyo Haneda T3</span>
            </div>
          </div>

          {/* Boarding Specs Grid */}
          <div className="grid grid-cols-4 gap-2 text-center bg-[#0c0e12] p-3 rounded-xl border border-[#282a2e]">
            <div>
              <span className="text-[9px] font-['Space_Mono'] text-[#c4c9ac] block">GATE</span>
              <span className="font-['Space_Mono'] text-sm font-bold text-[#e2e2e8]">G98</span>
            </div>
            <div>
              <span className="text-[9px] font-['Space_Mono'] text-[#c4c9ac] block">BOARDING</span>
              <span className="font-['Space_Mono'] text-sm font-bold text-[#c3f400]">07:50</span>
            </div>
            <div>
              <span className="text-[9px] font-['Space_Mono'] text-[#c4c9ac] block">GROUP</span>
              <span className="font-['Space_Mono'] text-sm font-bold text-[#e2e2e8]">GRP 2</span>
            </div>
            <div>
              <span className="text-[9px] font-['Space_Mono'] text-[#c4c9ac] block">SEAT</span>
              <span className="font-['Space_Mono'] text-sm font-bold text-[#c3f400]">14K</span>
            </div>
          </div>

          {/* Perforated Divider with cutouts */}
          <div className="relative py-2 flex items-center">
            <div className="w-full border-b-2 border-dashed border-[#333539]"></div>
            <div className="absolute -left-9 w-6 h-6 rounded-full bg-black"></div>
            <div className="absolute -right-9 w-6 h-6 rounded-full bg-black"></div>
          </div>

          {/* Scannable Aztec / QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
            <div className="w-36 h-36 flex items-center justify-center bg-white">
              {/* High-contrast Aztec / QR representation */}
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="#000000">
                <rect x="10" y="10" width="25" height="25" fill="#000000" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#000000" />

                <rect x="65" y="10" width="25" height="25" fill="#000000" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#000000" />

                <rect x="10" y="65" width="25" height="25" fill="#000000" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#000000" />

                <rect x="42" y="15" width="16" height="6" />
                <rect x="42" y="27" width="10" height="8" />
                <rect x="15" y="42" width="25" height="6" />
                <rect x="45" y="45" width="12" height="12" />
                <rect x="65" y="42" width="20" height="8" />
                <rect x="42" y="65" width="15" height="6" />
                <rect x="65" y="65" width="8" height="20" />
                <rect x="78" y="78" width="12" height="12" />
              </svg>
            </div>
            <span className="font-['Space_Mono'] text-xs font-bold text-black tracking-widest mt-2">
              PNR: W82KLP · 0205847
            </span>
          </div>

          {/* Sync actions */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                onSyncToast('Passbook synced to Apple Wallet / Google Wallet');
                onClose();
              }}
              className="w-full py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(195,244,0,0.3)]"
            >
              <span className="material-symbols-outlined text-base">wallet</span>
              <span>Add to Apple / Google Wallet</span>
            </button>
            <button
              onClick={() => {
                onSyncToast('Offline PDF Voucher generated');
                onClose();
              }}
              className="w-full py-2 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold transition-colors cursor-pointer"
            >
              Download PDF Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
