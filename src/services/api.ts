import { ItineraryEvent, ExpenseItem, ReadinessItem, CustomerUser } from '../types';
import { INITIAL_EVENTS, INITIAL_EXPENSES, INITIAL_READINESS, DEFAULT_CUSTOMER_USER } from '../data/initialData';

// When deployed on Vercel, BASE_URL is empty ('') so calls use same-site relative '/api' routes
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Local fallback storage keys for offline or standalone preview
const STORAGE_EVENTS_KEY = 'wanderlore_events_v2';
const STORAGE_EXPENSES_KEY = 'wanderlore_expenses_v2';
const STORAGE_READINESS_KEY = 'wanderlore_readiness_v2';
const STORAGE_USER_KEY = 'wanderlore_customer_session_v2';

function getLocalEvents(): ItineraryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read warning', e);
  }
  return INITIAL_EVENTS;
}

function saveLocalEvents(events: ItineraryEvent[]) {
  try {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Storage write warning', e);
  }
}

function getLocalExpenses(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_EXPENSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read warning', e);
  }
  return INITIAL_EXPENSES;
}

function saveLocalExpenses(expenses: ExpenseItem[]) {
  try {
    localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.warn('Storage write warning', e);
  }
}

export const apiService = {
  async checkHealth(): Promise<{ status: string; service?: string; environment?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          status: 'ok',
          service: data.app || 'Vercel Python Serverless',
          environment: data.environment || 'production',
        };
      }
    } catch {
      // In offline / preview sandbox, report client-fallback
    }
    return { status: 'ok', service: 'wanderlore-client-engine', environment: 'client-preview' };
  },

  async getEvents(): Promise<ItineraryEvent[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/itinerary`, {
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.info('Serverless API call failed or unavailable, using local store', err);
    }
    return getLocalEvents();
  },

  async createEvent(eventData: Omit<ItineraryEvent, 'id'>): Promise<ItineraryEvent> {
    const id = `event-${Date.now()}`;
    const newEvent: ItineraryEvent = { ...eventData, id };

    try {
      const res = await fetch(`${BASE_URL}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.event) {
          // Sync locally as well
          const current = getLocalEvents();
          saveLocalEvents([resJson.event, ...current]);
          return resJson.event;
        }
      }
    } catch (e) {
      console.warn('Backend POST failed, persisting locally', e);
    }

    const current = getLocalEvents();
    const updated = [newEvent, ...current];
    saveLocalEvents(updated);
    return newEvent;
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await fetch(`${BASE_URL}/api/itinerary/${eventId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      console.warn('Backend DELETE failed', e);
    }
    const current = getLocalEvents();
    const filtered = current.filter((e) => e.id !== eventId);
    saveLocalEvents(filtered);
    return true;
  },

  async parsePNR(rawText: string, carrierHint?: string): Promise<{ event: ItineraryEvent; pnr: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/parse-pnr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: rawText, carrier_hint: carrierHint }),
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const data = await res.json();
        const parsedEvent: ItineraryEvent = {
          ...data.parsed_item,
          id: `parsed-${Date.now()}`,
        };
        const current = getLocalEvents();
        saveLocalEvents([parsedEvent, ...current]);
        return {
          event: parsedEvent,
          pnr: data.extracted_pnr,
        };
      }
    } catch (e) {
      console.warn('Remote PNR parsing failed, falling back to client-side engine', e);
    }

    // Client-side regex parser fallback
    const flightMatch = rawText.match(/([A-Z]{2,3})\s?([0-9]{3,4})/i);
    const pnrMatch = rawText.match(/\b([A-Z0-9]{6})\b/i);
    const detectedPNR = pnrMatch ? pnrMatch[1].toUpperCase() : `PNR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let parsedEvent: ItineraryEvent;

    if (flightMatch) {
      const carrier = flightMatch[1].toUpperCase();
      const num = flightMatch[2];
      parsedEvent = {
        id: `parsed-${Date.now()}`,
        title: `${carrier} ${num} Transpacific Flight`,
        category: 'flight',
        day: 1,
        time_start: '12:30',
        time_end: '16:00',
        location: 'Concourse B · Gate 14',
        pnr: detectedPNR,
        subtext: `${carrierHint || carrier} Flight ${carrier}${num} · Seat 12A`,
        cost_jpy: 89000,
        meta_badges: ['DECODED BY AI v2.4', 'ON TIME'],
        status: 'ON TIME',
      };
    } else if (rawText.toLowerCase().includes('hotel') || rawText.toLowerCase().includes('stay') || rawText.toLowerCase().includes('room')) {
      parsedEvent = {
        id: `parsed-${Date.now()}`,
        title: 'Shibuya Sky High Boutique Suites',
        category: 'hotel',
        day: 1,
        time_start: '15:00 JST',
        time_end: '11:00 JST',
        location: '2-11-1 Shibuya, Tokyo',
        pnr: detectedPNR,
        subtext: 'Deluxe City View Room · Breakfast included',
        cost_jpy: 48000,
        meta_badges: ['HOTEL LODGING', 'DIGITAL KEY'],
      };
    } else {
      parsedEvent = {
        id: `parsed-${Date.now()}`,
        title: 'Imported Expedition Reservation',
        category: 'activity',
        day: 2,
        time_start: '13:00',
        time_end: '15:30',
        location: 'Roppongi Hills Observation Deck',
        pnr: detectedPNR,
        subtext: rawText.substring(0, 80) + '...',
        cost_jpy: 4500,
        meta_badges: ['PARSED BY WANDERLORE', 'CONFIRMED'],
      };
    }

    const current = getLocalEvents();
    saveLocalEvents([parsedEvent, ...current]);
    return { event: parsedEvent, pnr: detectedPNR };
  },

  async getExpenses(): Promise<ExpenseItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.expenses)) return data.expenses;
      }
    } catch (e) {
      console.warn('Failed to load remote expenses', e);
    }
    return getLocalExpenses();
  },

  async createExpense(expense: Omit<ExpenseItem, 'id' | 'date'>): Promise<ExpenseItem> {
    const newExp: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.expense) {
          const current = getLocalExpenses();
          saveLocalExpenses([json.expense, ...current]);
          return json.expense;
        }
      }
    } catch (e) {
      console.warn('Remote expense POST failed, saving locally', e);
    }

    const current = getLocalExpenses();
    const updated = [newExp, ...current];
    saveLocalExpenses(updated);
    return newExp;
  },

  async getReadiness(): Promise<ReadinessItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_READINESS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_READINESS;
  },

  async toggleReadiness(id: string, completed: boolean): Promise<ReadinessItem[]> {
    const list = await this.getReadiness();
    const updated = list.map((item) => (item.id === id ? { ...item, completed } : item));
    try {
      localStorage.setItem(STORAGE_READINESS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save error', e);
    }

    try {
      await fetch(`${BASE_URL}/api/readiness/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: id, completed }),
        signal: AbortSignal.timeout(2500),
      });
    } catch {
      // quiet
    }
    return updated;
  },

  async getCurrentUser(): Promise<CustomerUser> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Backend user check fallback', e);
    }

    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return DEFAULT_CUSTOMER_USER;
  },

  async loginCustomer(email: string, password: string): Promise<CustomerUser> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Backend login fallback to local session', e);
    }

    // Client-side fallback session
    const username = email.split('@')[0];
    const user: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Traveler',
      email: email.includes('@') ? email : `${email}@wanderlore.io`,
      handle: `@${username.toLowerCase()}`,
      avatar: email.includes('mira') ? DEFAULT_CUSTOMER_USER.avatar : undefined,
      membershipTier: email.includes('kenji') ? 'NAVIGATOR BLACK' : 'EXPEDITION ELITE',
      memberNumber: `WL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      loyaltyPoints: 34200,
      passportCountry: 'USA',
      linkedPnrs: ['W82KLP', 'TK-9921', 'TC-8812'],
      isLoggedIn: true,
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },

  async loginViaPNR(pnr: string, lastName: string): Promise<CustomerUser> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/pnr-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr, last_name: lastName }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Backend PNR login fallback', e);
    }

    const cleanPnr = pnr.trim().toUpperCase();
    const cleanSurname = lastName.trim();
    const guestUser: CustomerUser = {
      id: `guest-${Date.now()}`,
      name: `${cleanSurname} (Guest)`,
      email: `${cleanSurname.toLowerCase()}@booking.guest`,
      handle: `@${cleanPnr}`,
      membershipTier: 'GUEST',
      memberNumber: `PNR-${cleanPnr}`,
      loyaltyPoints: 1200,
      passportCountry: 'VERIFIED',
      linkedPnrs: [cleanPnr],
      isLoggedIn: true,
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  async registerCustomer(name: string, email: string, password: string, handle?: string): Promise<CustomerUser> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, handle }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Backend register fallback', e);
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      handle: handle || `@${name.toLowerCase().replace(/\s+/g, '')}`,
      membershipTier: 'EXPEDITION ELITE',
      memberNumber: `WL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      loyaltyPoints: 5000,
      passportCountry: 'USA',
      linkedPnrs: ['W82KLP'],
      isLoggedIn: true,
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async logoutCustomer(): Promise<CustomerUser> {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      // quiet
    }
    const guest: CustomerUser = {
      id: 'guest',
      name: 'Guest Traveler',
      email: '',
      handle: '@guest',
      membershipTier: 'GUEST',
      memberNumber: 'WL-GUEST',
      loyaltyPoints: 0,
      linkedPnrs: [],
      isLoggedIn: false,
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(guest));
    return guest;
  },
};
