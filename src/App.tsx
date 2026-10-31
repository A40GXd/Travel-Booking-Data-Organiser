import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TopControlDeck } from './components/TopControlDeck';
import { TimelineView } from './components/TimelineView';
import { CompactView } from './components/CompactView';
import { MapSplitView } from './components/MapSplitView';
import { LiveInspector } from './components/LiveInspector';
import { CommandCenterView } from './components/CommandCenterView';
import { DataMatrixView } from './components/DataMatrixView';
import { BudgetSplitterView } from './components/BudgetSplitterView';
import { AddEventModal } from './components/AddEventModal';
import { SmartImportModal } from './components/SmartImportModal';
import { MobilePassbookModal } from './components/MobilePassbookModal';
import { SearchModal } from './components/SearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CustomerLoginModal } from './components/CustomerLoginModal';
import { apiService } from './services/api';
import {
  ItineraryEvent,
  ExpenseItem,
  ReadinessItem,
  ActiveNavTab,
  ViewMode,
  CustomerUser,
} from './types';
import {
  INITIAL_EVENTS,
  INITIAL_EXPENSES,
  INITIAL_READINESS,
  DEFAULT_CUSTOMER_USER,
  DEMO_ACCOUNTS,
} from './data/initialData';

export default function App() {
  // Navigation & View Mode State
  const [activeNav, setActiveNav] = useState<ActiveNavTab>('timeline');
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>('chrono');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('flight');

  // Customer Authentication & User State
  const [currentUser, setCurrentUser] = useState<CustomerUser>(DEFAULT_CUSTOMER_USER);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Data Stores
  const [events, setEvents] = useState<ItineraryEvent[]>(INITIAL_EVENTS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [readiness, setReadiness] = useState<ReadinessItem[]>(INITIAL_READINESS);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Modals & Panels State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Load Initial Data & Health Status & Customer Session
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const [health, loadedEvents, loadedExpenses, loadedReadiness, userSession] =
          await Promise.all([
            apiService.checkHealth(),
            apiService.getEvents(),
            apiService.getExpenses(),
            apiService.getReadiness(),
            apiService.getCurrentUser(),
          ]);

        if (isMounted) {
          setBackendOnline(health.status === 'ok');
          if (loadedEvents.length > 0) setEvents(loadedEvents);
          if (loadedExpenses.length > 0) setExpenses(loadedExpenses);
          if (loadedReadiness.length > 0) setReadiness(loadedReadiness);
          if (userSession) setCurrentUser(userSession);
        }
      } catch (err) {
        console.warn('Backend synchronization notice:', err);
      }
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Google Maps Platform Quota Defense State
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Event handlers
  const handleSelectEvent = (category: string, eventId?: string) => {
    // Map event categories/ids to HUD inspector modes
    if (eventId === 'flight-nh107' || category === 'flight') {
      setSelectedEventType('flight');
    } else if (eventId === 'transit-keikyu' || category === 'transit') {
      setSelectedEventType('transit');
    } else if (eventId === 'hotel-trunk' || category === 'hotel') {
      setSelectedEventType('hotel');
    } else if (eventId === 'dine-uobei' || category === 'dine') {
      setSelectedEventType('dine');
    } else if (eventId === 'activity-teamlab' || eventId === 'teamlab') {
      setSelectedEventType('teamlab');
    } else if (eventId === 'activity-dsmg' || eventId === 'dsmg') {
      setSelectedEventType('dsmg');
    } else {
      setSelectedEventType(category);
    }
  };

  const handleCreateEvent = async (eventData: Omit<ItineraryEvent, 'id'>) => {
    const newEvent = await apiService.createEvent(eventData);
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Locked "${newEvent.title}" into Day ${newEvent.day} sequence`);
    handleSelectEvent(newEvent.category, newEvent.id);
  };

  const handleDeleteEvent = async (id: string) => {
    await apiService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event removed from itinerary');
  };

  const handleCreateExpense = async (expenseData: Omit<ExpenseItem, 'id' | 'date'>) => {
    const newExpense = await apiService.createExpense(expenseData);
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Logged expense ¥${newExpense.amount_jpy.toLocaleString()}`);
  };

  const handleToggleReadiness = async (id: string, completed: boolean) => {
    const updated = await apiService.toggleReadiness(id, completed);
    setReadiness(updated);
  };

  const handleImportSuccess = (parsedEvent: ItineraryEvent) => {
    setEvents((prev) => [parsedEvent, ...prev]);
    handleSelectEvent(parsedEvent.category, parsedEvent.id);
    showToast(`AI-Parser decoded & committed: ${parsedEvent.title}`);
  };

  // Customer Auth Handlers
  const handleCustomerLogin = async (email: string, pass: string) => {
    const user = await apiService.loginCustomer(email, pass);
    setCurrentUser(user);
    showToast(`Access granted: ${user.name} [${user.membershipTier}]`);
  };

  const handleCustomerPNRLogin = async (pnr: string, lastName: string) => {
    const user = await apiService.loginViaPNR(pnr, lastName);
    setCurrentUser(user);
    showToast(`Manifest unlocked for PNR: ${pnr} · ${lastName}`);
  };

  const handleCustomerRegister = async (
    name: string,
    email: string,
    pass: string,
    handle?: string
  ) => {
    const user = await apiService.registerCustomer(name, email, pass, handle);
    setCurrentUser(user);
    showToast(`Welcome ${name}! Expedition Elite tier activated.`);
  };

  const handleCustomerLogout = async () => {
    const guest = await apiService.logoutCustomer();
    setCurrentUser(guest);
    showToast('Logged out. Switched to Guest Mode.');
  };

  const handleSelectAccount = async (account: (typeof DEMO_ACCOUNTS)[0]) => {
    const user = await apiService.loginCustomer(account.email, account.password);
    setCurrentUser(user);
    showToast(`Active traveler switched to ${user.name}`);
  };

  return (
    <div className="bg-[#111317] font-['DM_Sans'] text-[#e2e2e8] min-h-screen selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Google Maps Platform Quota Exceeded Sticky Notice */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Toast Notification Pop-up */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2024] border border-[#c3f400] text-[#e2e2e8] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping"></span>
          <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400]">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        decodedCount={events.length}
        totalPnrs={11}
        backendOnline={backendOnline}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-72 transition-all duration-300">
        {/* Top Header */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSmartImport={() => setIsSmartImportOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={2}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleCustomerLogout}
          onSelectAccount={handleSelectAccount}
        />

        {/* Page Content */}
        <main className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#111317]">
          {activeNav === 'timeline' && (
            <div className="flex flex-col gap-6 max-w-[1540px] mx-auto w-full">
              {/* Bento Top Control Deck */}
              <TopControlDeck
                currentViewMode={currentViewMode}
                onSelectViewMode={setCurrentViewMode}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onOpenAddEvent={() => setIsAddEventOpen(true)}
                onExportPass={() => setIsPassbookOpen(true)}
              />

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-12 gap-6 items-start">
                {/* Left: Timeline Stream or Active View */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                  {currentViewMode === 'chrono' && (
                    <TimelineView
                      events={events}
                      selectedEventType={selectedEventType}
                      onSelectEvent={handleSelectEvent}
                      onOpenBoardingPass={() => setIsPassbookOpen(true)}
                      onSyncWallet={() => showToast('Passbook synced to Apple Wallet / Google Wallet')}
                      onOpenDigitalKey={() => showToast('TRUNK(HOTEL) Digital Room Key dispatched via NFC')}
                      selectedDay={selectedDay}
                    />
                  )}

                  {currentViewMode === 'compact' && (
                    <CompactView
                      events={events}
                      onSelectEvent={handleSelectEvent}
                      selectedDay={selectedDay}
                    />
                  )}

                  {currentViewMode === 'map' && (
                    <MapSplitView onSelectEvent={handleSelectEvent} events={events} />
                  )}
                </div>

                {/* Right: Live Inspector Drawer Bento */}
                <div className="col-span-12 lg:col-span-4">
                  <LiveInspector
                    selectedEventType={selectedEventType}
                    readinessItems={readiness}
                    onToggleReadiness={handleToggleReadiness}
                    onOpenMobilePassbook={() => setIsPassbookOpen(true)}
                    onContactConcierge={() =>
                      showToast('Connecting to ANA Priority Concierge: +81 (0)3 6741 8841')
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeNav === 'command-center' && (
            <CommandCenterView
              events={events}
              onNavigateTab={(tab) => {
                setActiveNav(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSmartImport={() => setIsSmartImportOpen(true)}
            />
          )}

          {activeNav === 'data-matrix' && (
            <DataMatrixView
              events={events}
              onSelectEvent={(cat, id) => {
                handleSelectEvent(cat, id);
                setActiveNav('timeline');
              }}
              onDeleteEvent={handleDeleteEvent}
              onOpenAddEvent={() => setIsAddEventOpen(true)}
            />
          )}

          {activeNav === 'budget' && (
            <BudgetSplitterView
              expenses={expenses}
              onAddExpense={handleCreateExpense}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleCustomerLogin}
        onPNRLogin={handleCustomerPNRLogin}
        onRegister={handleCustomerRegister}
        currentUser={currentUser}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSave={handleCreateEvent}
        defaultDay={selectedDay}
      />

      <SmartImportModal
        isOpen={isSmartImportOpen}
        onClose={() => setIsSmartImportOpen(false)}
        onImportSuccess={handleImportSuccess}
        onParsePNR={apiService.parsePNR}
      />

      <MobilePassbookModal
        isOpen={isPassbookOpen}
        onClose={() => setIsPassbookOpen(false)}
        onSyncToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        events={events}
        onSelectEvent={(cat, id) => {
          handleSelectEvent(cat, id);
          setActiveNav('timeline');
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectEvent={(cat, id) => {
          handleSelectEvent(cat, id);
          setActiveNav('timeline');
        }}
      />
    </div>
  );
}
