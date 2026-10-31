import React, { useState, useRef, useEffect } from 'react';
import { CustomerUser } from '../types';
import { DEMO_ACCOUNTS } from '../data/initialData';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenSmartImport: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  currentUser?: CustomerUser;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSelectAccount?: (account: (typeof DEMO_ACCOUNTS)[0]) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenSmartImport,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  currentUser,
  onOpenLogin,
  onLogout,
  onSelectAccount,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoggedIn = currentUser?.isLoggedIn ?? false;

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

        {/* Customer Login / User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          {isLoggedIn && currentUser ? (
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-[#1a1c20] hover:bg-[#282a2e] border border-[#282a2e] hover:border-[#c3f400]/40 transition-all cursor-pointer"
              type="button"
              aria-label="Customer account menu"
            >
              {currentUser.avatar ? (
                <img
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#c3f400]"
                  src={currentUser.avatar}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#282a2e] text-[#c3f400] font-['Space_Grotesk'] text-xs font-bold flex items-center justify-center ring-1 ring-[#c3f400]">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-['DM_Sans'] text-xs font-bold text-[#e2e2e8] leading-tight">
                  {currentUser.name}
                </span>
                <span className="font-['Space_Mono'] text-[10px] text-[#c3f400] leading-tight">
                  {currentUser.handle}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#c4c9ac]">
                {isUserMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1c20] hover:bg-[#282a2e] border border-[#c3f400]/50 text-[#c3f400] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:border-[#c3f400] transition-all cursor-pointer shadow-[0_0_14px_rgba(195,244,0,0.15)]"
              type="button"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span className="hidden xs:inline">CUSTOMER SIGN IN</span>
              <span className="xs:hidden">LOGIN</span>
            </button>
          )}

          {/* Account Dropdown Panel */}
          {isUserMenuOpen && currentUser && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111317] border border-[#282a2e] rounded-2xl shadow-2xl p-4 flex flex-col gap-3.5 animate-in fade-in duration-150 z-50">
              {/* Member Summary Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#1e2024]">
                {currentUser.avatar ? (
                  <img
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#c3f400]"
                    src={currentUser.avatar}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1e2024] text-[#c3f400] font-['Space_Grotesk'] text-base font-bold flex items-center justify-center ring-2 ring-[#c3f400]">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-['DM_Sans'] text-sm font-bold text-[#e2e2e8] truncate">
                    {currentUser.name}
                  </span>
                  <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] truncate">
                    {currentUser.email || currentUser.handle}
                  </span>
                  <span className="font-['Space_Mono'] text-[10px] text-[#c3f400] font-bold mt-0.5">
                    {currentUser.membershipTier} · {currentUser.memberNumber}
                  </span>
                </div>
              </div>

              {/* Loyalty & Telemetry Stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#1a1c20] border border-[#282a2e]">
                <div className="flex flex-col">
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase">
                    EXPLORER MILES
                  </span>
                  <span className="font-['Space_Mono'] text-sm font-bold text-[#c3f400]">
                    {currentUser.loyaltyPoints.toLocaleString()} PTS
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase">
                    LINKED PNRS
                  </span>
                  <span className="font-['Space_Mono'] text-sm font-bold text-[#7df4ff]">
                    {currentUser.linkedPnrs.length} ACTIVE
                  </span>
                </div>
              </div>

              {/* Linked PNR list */}
              {currentUser.linkedPnrs.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase">
                    Linked Record Locators:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.linkedPnrs.map((pnr) => (
                      <span
                        key={pnr}
                        className="px-2 py-0.5 rounded bg-[#1e2024] text-[#e2e2e8] font-['Space_Mono'] text-xs font-bold border border-[#282a2e]"
                      >
                        {pnr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Switch Demo Travelers */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#1e2024]">
                <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase">
                  Switch Traveler:
                </span>
                <div className="flex flex-col gap-1">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        if (onSelectAccount) {
                          onSelectAccount(acc);
                        }
                        setIsUserMenuOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#282a2e] text-left text-xs text-[#e2e2e8] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{acc.name} ({acc.role})</span>
                      <span className="font-['Space_Mono'] text-[10px] text-[#c3f400]">{acc.tier}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1e2024]">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] text-[#c4c9ac] hover:text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Switch Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#ff3366]/10 hover:bg-[#ff3366]/20 text-[#ff6688] font-['DM_Sans'] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
