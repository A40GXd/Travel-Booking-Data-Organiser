import React, { useState } from 'react';
import { CustomerUser } from '../types';
import { DEMO_ACCOUNTS } from '../data/initialData';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onPNRLogin: (pnr: string, lastName: string) => Promise<void>;
  onRegister: (name: string, email: string, pass: string, handle?: string) => Promise<void>;
  currentUser?: CustomerUser;
}

type AuthMode = 'member' | 'pnr' | 'register';

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onPNRLogin,
  onRegister,
  currentUser,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('member');

  // Form states
  const [email, setEmail] = useState('mira@wanderlore.io');
  const [password, setPassword] = useState('TokyoDrift25!');
  const [showPassword, setShowPassword] = useState(false);

  const [pnrInput, setPnrInput] = useState('W82KLP');
  const [lastNameInput, setLastNameInput] = useState('Vance');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regHandle, setRegHandle] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passkeyActive, setPasskeyActive] = useState(false);

  if (!isOpen) return null;

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both your Expedition Email/ID and Passphrase.');
      return;
    }
    try {
      setIsLoading(true);
      await onLogin(email.trim(), password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication sequence failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePNRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!pnrInput.trim() || !lastNameInput.trim()) {
      setErrorMessage('Both 6-character PNR locator and Passenger Surname are required.');
      return;
    }
    try {
      setIsLoading(true);
      await onPNRLogin(pnrInput.trim().toUpperCase(), lastNameInput.trim());
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'PNR locator not found in central reservation cache.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Name, valid email, and secure passphrase are required.');
      return;
    }
    try {
      setIsLoading(true);
      await onRegister(regName.trim(), regEmail.trim(), regPassword, regHandle.trim() || undefined);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration sequence interrupted. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage(null);
    try {
      setIsLoading(true);
      await onLogin(account.email, account.password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyTrigger = async () => {
    setPasskeyActive(true);
    setErrorMessage(null);
    setTimeout(async () => {
      setPasskeyActive(false);
      try {
        setIsLoading(true);
        await onLogin('mira@wanderlore.io', 'TokyoDrift25!');
        onClose();
      } catch {
        setErrorMessage('Passkey biometric unlock unavailable. Use passphrase.');
      } finally {
        setIsLoading(false);
      }
    }, 900);
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await onLogin('mira@wanderlore.io', 'TokyoDrift25!');
      onClose();
    } catch {
      setErrorMessage('Google SSO unavailable in preview mode.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#111317] border border-[#282a2e] rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-[#1e2024] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1e2024] border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] shadow-[0_0_16px_rgba(195,244,0,0.25)]">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] font-bold tracking-widest uppercase">
                  WANDERLORE // CUSTOMER GATEWAY
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1e2024] text-[#7df4ff] text-[10px] font-['Space_Mono'] font-bold">
                  v2.4
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#e2e2e8] tracking-tight">
                Customer & Explorer Sign In
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a1c20] hover:bg-[#282a2e] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Current status if user is already logged in */}
        {currentUser?.isLoggedIn && (
          <div className="p-3 rounded-2xl bg-[#1e2024] border border-[#c3f400]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span className="text-[#c4c9ac]">
                Currently authenticated as{' '}
                <strong className="text-[#e2e2e8]">{currentUser.name}</strong> ({currentUser.handle})
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] font-['Space_Mono'] text-[10px] font-bold">
              {currentUser.membershipTier}
            </span>
          </div>
        )}

        {/* Tab Switcher: Member Access vs Guest PNR Lookup vs New Explorer */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1a1c20] rounded-2xl border border-[#282a2e]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('member');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-['DM_Sans'] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'member'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_14px_rgba(195,244,0,0.3)]'
                : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
            }`}
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span className="truncate">Member Access</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('pnr');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-['DM_Sans'] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'pnr'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_14px_rgba(195,244,0,0.3)]'
                : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
            }`}
          >
            <span className="material-symbols-outlined text-base">flight</span>
            <span className="truncate">PNR Lookup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-['DM_Sans'] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_14px_rgba(195,244,0,0.3)]'
                : 'text-[#c4c9ac] hover:text-[#e2e2e8]'
            }`}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span className="truncate">New Explorer</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/40 text-[#ff6688] flex items-center gap-2.5 text-xs font-['Space_Mono'] animate-shake">
            <span className="material-symbols-outlined text-base text-[#ff3366]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Member Sign In Form */}
        {authMode === 'member' && (
          <div className="flex flex-col gap-5">
            {/* Quick Demo Credentials Bar */}
            <div className="p-3.5 rounded-2xl bg-[#1e2024] border border-[#282a2e] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                  QUICK ONE-TOUCH DEMO LOGINS
                </span>
                <span className="font-['Space_Mono'] text-[10px] text-[#7df4ff]">CLICK TO AUTHLOGIN</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDemoSelect(acc)}
                    className="p-2.5 rounded-xl bg-[#282a2e] hover:bg-[#333539] border border-transparent hover:border-[#c3f400]/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-['DM_Sans'] text-xs font-bold text-[#e2e2e8] group-hover:text-[#c3f400] transition-colors truncate">
                        {acc.name}
                      </span>
                      <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] truncate">
                        {acc.tier} · PNR: {acc.pnr}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-sm text-[#c4c9ac] group-hover:text-[#c3f400] transition-colors shrink-0 ml-1">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleMemberSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider flex items-center justify-between">
                  <span>EMAIL OR EXPEDITION ID</span>
                  <span className="text-[#7df4ff] text-[10px]">AUTH DOMAIN</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] text-lg">
                    alternate_email
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mira@wanderlore.io"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['DM_Sans'] outline-none transition-all placeholder:text-[#555a64]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                    PASSPHRASE // ACCESS KEY
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#c3f400] hover:underline font-['Space_Mono'] cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{showPassword ? 'HIDE' : 'SHOW'}</span>
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] text-lg">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['Space_Mono'] outline-none transition-all placeholder:text-[#555a64]"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-sm font-bold uppercase tracking-wider hover:opacity-90 active:translate-y-0.5 transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#161e00] border-t-transparent rounded-full animate-spin"></span>
                    <span>VERIFYING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg font-bold">lock_open</span>
                    <span>AUTHENTICATE & LOAD MANIFEST</span>
                  </>
                )}
              </button>
            </form>

            {/* Fast SSO / Biometrics Row */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-[#1e2024]">
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase tracking-wider text-center">
                OR SIGN IN WITH SECURE BIOMETRICS
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl bg-[#1a1c20] hover:bg-[#282a2e] border border-[#282a2e] text-[#e2e2e8] text-xs font-['DM_Sans'] font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14c0 2.5.6 4.8 1.6 6.8l3.7-2.9v-3.2z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                    />
                  </svg>
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={handlePasskeyTrigger}
                  disabled={isLoading || passkeyActive}
                  className="py-2.5 px-3 rounded-xl bg-[#1a1c20] hover:bg-[#282a2e] border border-[#282a2e] text-[#e2e2e8] text-xs font-['DM_Sans'] font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className={`material-symbols-outlined text-base ${passkeyActive ? 'text-[#c3f400] animate-ping' : 'text-[#7df4ff]'}`}>
                    fingerprint
                  </span>
                  <span>{passkeyActive ? 'Verifying...' : 'Passkey Biometrics'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Guest PNR Lookup Form */}
        {authMode === 'pnr' && (
          <div className="flex flex-col gap-5">
            <div className="p-3.5 rounded-2xl bg-[#1e2024] border border-[#282a2e] flex flex-col gap-2">
              <span className="font-['Space_Mono'] text-[11px] text-[#c3f400] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
                DIRECT PASSENGER RESERVATION RETRIEVAL
              </span>
              <p className="font-['DM_Sans'] text-xs text-[#c4c9ac] leading-relaxed">
                Have a booking reference from ANA, Delta, JAL, or TRUNK(HOTEL)? Access your real-time flight telemetry, boarding cards, and hotel check-in without creating a full password.
              </p>
            </div>

            {/* Quick PNR Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase mr-1">Active PNRs:</span>
              {['W82KLP', 'TK-9921', 'TC-8812'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setPnrInput(code);
                    setLastNameInput('Vance');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] text-[#c3f400] font-['Space_Mono'] text-xs font-bold border border-[#282a2e] hover:border-[#c3f400]/40 transition-colors cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>

            <form onSubmit={handlePNRSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider flex items-center justify-between">
                  <span>6-CHARACTER RECORD LOCATOR // PNR</span>
                  <span className="text-[#7df4ff] text-[10px]">ICAO / IATA</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] text-lg">
                    airplane_ticket
                  </span>
                  <input
                    type="text"
                    maxLength={10}
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                    placeholder="e.g. W82KLP"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['Space_Mono'] uppercase tracking-widest outline-none transition-all placeholder:text-[#555a64]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                  PASSENGER SURNAME
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['DM_Sans'] outline-none transition-all placeholder:text-[#555a64]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-sm font-bold uppercase tracking-wider hover:opacity-90 active:translate-y-0.5 transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#161e00] border-t-transparent rounded-full animate-spin"></span>
                    <span>LOCATING RESERVATION...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg font-bold">radar</span>
                    <span>LOCATE PNR & ACCESS MANIFEST</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: New Explorer Registration Form */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div className="p-3 rounded-2xl bg-[#1e2024] border border-[#ddb7ff]/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ddb7ff] text-2xl">card_membership</span>
              <div className="flex flex-col">
                <span className="font-['Space_Mono'] text-[11px] text-[#ddb7ff] font-bold">
                  EXPEDITION ELITE STATUS ON SIGNUP
                </span>
                <span className="font-['DM_Sans'] text-xs text-[#c4c9ac]">
                  Includes +5,000 Explorer Miles and live flight radar telemetry tracking.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Leo Tanaka"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['DM_Sans'] outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                  HANDLE
                </label>
                <input
                  type="text"
                  value={regHandle}
                  onChange={(e) => setRegHandle(e.target.value)}
                  placeholder="@leo.travels"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['DM_Sans'] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="leo@wanderlore.io"
                className="w-full px-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['DM_Sans'] outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider">
                SECURITY PASSPHRASE
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Choose a strong passphrase"
                className="w-full px-4 py-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e] focus:border-[#c3f400] text-[#e2e2e8] text-sm font-['Space_Mono'] outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-sm font-bold uppercase tracking-wider hover:opacity-90 active:translate-y-0.5 transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#161e00] border-t-transparent rounded-full animate-spin"></span>
                  <span>ENROLLING EXPLORER...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg font-bold">verified_user</span>
                  <span>ENROLL & ACTIVATE DISPATCH</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security & System Metadata Footer */}
        <div className="pt-3 border-t border-[#1e2024] flex items-center justify-between text-[11px] font-['Space_Mono'] text-[#c4c9ac]">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#c3f400]">shield</span>
            TLS 1.3 / VERCEL SERVERLESS AUTH
          </span>
          <span className="text-[#7df4ff]">AES-256 ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};
