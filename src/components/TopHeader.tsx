import React from 'react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenSmartImport: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenSmartImport,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#111317]/85 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-6 border-b border-[#1e2024] shadow-[0_1px_8px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#1a1c20] text-[#c4c9ac] hover:text-white"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        {/* Search Bar / Command Palette Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#1a1c20] hover:bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] transition-colors cursor-pointer border border-transparent hover:border-[#333539]"
          type="button"
        >
          <span className="material-symbols-outlined text-base">search</span>
          <span className="font-['DM_Sans'] text-xs sm:text-sm">Search bookings, flights, stays...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#333539] text-[#e2e2e8] font-['Space_Mono'] text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Smart Import Button */}
        <button
          onClick={onOpenSmartImport}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 active:translate-y-0.5 transition-all shadow-[0_0_16px_rgba(195,244,0,0.25)] cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base font-bold">bolt</span>
          <span className="hidden xs:inline">Smart Import / Drop PNR</span>
          <span className="xs:hidden">Import</span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full bg-[#1a1c20] hover:bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] transition-colors cursor-pointer"
          type="button"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c3f400] ring-2 ring-[#111317]"></span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <img
            alt="Mira Vance Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c3f400]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD790b-PbyJIxM_-Vlw0NxY_4UtT1l7iQdEsgDlecRumr30nknTdO9InJqKNk5vRd7iVIGSsnqNrpD1ZobztCh-1hWi22i6rZs5bhJOqklUtGRQHnqaWF_p9S4BsY3b3Wc6Ev-rwaXfEyHKDiHML_Sii_rJJZvm-Woo6Plw1xXvoBoz_ukmapOAfLtUmwbGr2klO_dtulVjjRnK_PTR-C5nTEQmcuofavuAN_QRKufySJyVNaF72wWr6Q"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-['DM_Sans'] text-xs font-bold text-[#e2e2e8] leading-tight">
              Mira Vance
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] leading-tight">
              @mira.explores
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
