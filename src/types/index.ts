export type EventCategory = 'flight' | 'transit' | 'hotel' | 'dine' | 'activity';

export interface ItineraryEvent {
  id: string;
  title: string;
  category: EventCategory;
  day: number;
  time_start: string;
  time_end?: string;
  location: string;
  pnr?: string;
  subtext?: string;
  cost_jpy?: number;
  meta_badges?: string[];
  split_info?: string;
  status?: string;
  image_url?: string;
  image_alt?: string;
  
  // Specific event fields
  flight?: {
    carrier: string;
    flight_number: string;
    origin_code: string;
    origin_name: string;
    origin_time: string;
    origin_gate: string;
    dest_code: string;
    dest_name: string;
    dest_time: string;
    dest_terminal: string;
    duration: string;
    aircraft: string;
    seat: string;
    cabin: string;
    baggage_tag: string;
    carousel: string;
  };
  transit?: {
    line_name: string;
    duration_mins: number;
    fare_jpy: number;
    route_steps: string[];
    card_type: string;
  };
  hotel?: {
    room_type: string;
    booking_code: string;
    check_in: string;
    check_out: string;
    address: string;
    breakfast_included: boolean;
    refundable: boolean;
    digital_key_active: boolean;
    image_url?: string;
  };
  dine?: {
    booking_ref: string;
    time_window: string;
    party_size: number;
    specialty: string;
    address: string;
  };
  activity?: {
    voucher_code: string;
    entry_slot: string;
    ticket_count: number;
    warnings?: string;
    notes?: string;
    image_url?: string;
  };
}

export interface ReadinessItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface FlightTelemetry {
  pnr: string;
  flight_number: string;
  carrier: string;
  altitude_ft: number;
  ground_speed_kts: number;
  headwind_kts: number;
  remaining_time: string;
  progress_pct: number;
  terminal_map_url: string;
  checked_baggage: string;
  cancellation_policy: string;
  airline_hotline: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount_jpy: number;
  paid_by: string;
  split_with: string[];
  category: string;
  date: string;
}

export interface BalanceSummary {
  person: string;
  paid: number;
  owed: number;
  net: number;
}

export type ViewMode = 'chrono' | 'compact' | 'map';

export type ActiveNavTab = 'command-center' | 'timeline' | 'data-matrix' | 'budget';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar?: string;
  membershipTier: 'GUEST' | 'EXPEDITION ELITE' | 'NAVIGATOR BLACK';
  memberNumber: string;
  loyaltyPoints: number;
  passportCountry?: string;
  linkedPnrs: string[];
  isLoggedIn: boolean;
}

export interface AuthResponse {
  user: CustomerUser;
  token?: string;
  message: string;
}
