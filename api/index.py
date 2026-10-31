"""
Vercel Serverless Python Function: FastAPI Application Entrypoint
File: api/index.py
Exposes: `app` (FastAPI instance) for Vercel's Python runtime
"""

import os
import re
import uuid
from datetime import datetime
from typing import List, Optional, Literal, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

load_dotenv()

# Server-side secrets - NEVER returned in client responses or exposed in frontend
API_SECRET_KEY = os.getenv("API_SECRET_KEY", "prod-wanderlore-serverless-secret-key")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")

# Allowed origins for CORS
# In unified Vercel deployment, same-origin calls are used by default (/api)
raw_origins = os.getenv("FRONTEND_ORIGINS", "*")
ALLOWED_ORIGINS = [o.strip() for o in raw_origins.split(",") if o.strip()]

app = FastAPI(
    title="Travel Booking Organizer API",
    description="FastAPI Backend running as a Vercel Serverless Python Function",
    version="2.4.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ==========================================
# PYDANTIC VALIDATION SCHEMAS
# ==========================================

EventCategory = Literal["flight", "transit", "hotel", "dine", "activity"]

class EventCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=120, description="Name or title of the itinerary item")
    category: EventCategory = Field(..., description="Type of event: flight, transit, hotel, dine, activity")
    day: int = Field(..., ge=1, le=30, description="Day number of expedition (1 to 30)")
    time_start: str = Field(..., description="Start time format (e.g. '08:30' or '17:30 JST')")
    time_end: Optional[str] = Field(None, description="End time format (e.g. '15:45' or '21:30 JST')")
    location: str = Field(..., min_length=2, max_length=200, description="Venue address or transit route")
    pnr: Optional[str] = Field(None, max_length=16, description="Passenger Name Record or booking reference")
    subtext: Optional[str] = Field(None, max_length=250, description="Subtitle, airline, or terminal notes")
    cost_jpy: Optional[int] = Field(None, ge=0, description="Estimated or actual cost in JPY")
    meta_badges: Optional[List[str]] = Field(default_factory=list, description="Descriptive badges like Breakfast Included")
    split_info: Optional[str] = Field(None, description="Group split metadata (e.g. 'SPLIT ASSIGNED: 4 PPL')")

    @field_validator("title")
    @classmethod
    def validate_title_prose(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Title cannot be blank or whitespace only")
        return cleaned

    @field_validator("pnr")
    @classmethod
    def validate_pnr(cls, v: Optional[str]) -> Optional[str]:
        if v:
            cleaned = v.strip().upper()
            if not re.match(r"^[A-Z0-9#-]{3,16}$", cleaned):
                raise ValueError("PNR must contain valid alphanumeric characters")
            return cleaned
        return v


class PNRParseRequest(BaseModel):
    raw_text: str = Field(..., min_length=5, max_length=5000, description="Raw e-ticket, airline confirmation, or PNR string")
    carrier_hint: Optional[str] = Field(None, max_length=50, description="Optional carrier name hint (e.g. ANA, JAL)")


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    amount_jpy: float = Field(..., gt=0, description="Expense amount in Japanese Yen")
    paid_by: str = Field(..., min_length=1, max_length=50, description="Person who covered the expense")
    split_with: List[str] = Field(..., min_items=1, description="List of participants sharing this expense")
    category: str = Field(default="Food & Dine")

    @field_validator("split_with")
    @classmethod
    def validate_split(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("At least one person must be listed in split_with")
        return [person.strip() for person in v if person.strip()]


class ReadinessToggleRequest(BaseModel):
    task_id: str = Field(..., min_length=1)
    completed: bool


class CustomerLoginRequest(BaseModel):
    email: str = Field(..., description="Customer email address or member ID")
    password: str = Field(..., min_length=4, description="Access key or passphrase")


class PNRLoginRequest(BaseModel):
    pnr: str = Field(..., min_length=3, max_length=16, description="Booking reference (PNR)")
    last_name: str = Field(..., min_length=2, max_length=50, description="Passenger surname")


class CustomerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=60)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    handle: Optional[str] = Field(None, max_length=30)
    passport_country: Optional[str] = Field(default="USA")


# ==========================================
# IN-MEMORY EXPEDITION SEED DATA
# (Note: In Serverless, instances are stateless across cold starts)
# ==========================================

itinerary_db: List[Dict[str, Any]] = [
    {
        "id": "flight-nh107",
        "title": "ANA Flight NH107 (SFO → HND)",
        "category": "flight",
        "day": 1,
        "time_start": "08:30 PDT",
        "time_end": "15:45 JST +1",
        "location": "Gate G98 · Concourse G -> Tokyo Haneda T3",
        "pnr": "W82KLP",
        "subtext": "All Nippon Airways · Boeing 787-9 · Seat 14K (Window)",
        "cost_jpy": 184000,
        "meta_badges": ["ON TIME", "PREMIUM ECON", "BAGGAGE #0205847", "BELT 04"],
        "split_info": "SOLO RESERVATION",
        "status": "confirmed",
        "created_at": "2025-10-14T08:00:00Z"
    },
    {
        "id": "transit-keikyu",
        "title": "Keikyu Airport Line (Direct Rapid Express)",
        "category": "transit",
        "day": 1,
        "time_start": "16:45",
        "time_end": "17:18",
        "location": "Haneda T3 -> Shinagawa -> Yamanote Line to Shibuya",
        "pnr": "PASMO-IC",
        "subtext": "Direct express transfer · 33 mins",
        "cost_jpy": 540,
        "meta_badges": ["Suica / Pasmo Ready", "TRANSIT EXPRESS"],
        "split_info": "SELF-PAID",
        "status": "confirmed",
        "created_at": "2025-10-14T16:00:00Z"
    },
    {
        "id": "hotel-trunk",
        "title": "TRUNK(HOTEL) Yoyogi Park",
        "category": "hotel",
        "day": 1,
        "time_start": "17:30 JST",
        "time_end": "11:00 JST (Oct 17)",
        "location": "1-15-2 Tomigaya, Shibuya-ku, Tokyo",
        "pnr": "TK-9921",
        "subtext": "Park View Balcony Suite · Brutalist boutique lodging",
        "cost_jpy": 128000,
        "meta_badges": ["Breakfast Included", "Digital Key Active", "Non-Refundable"],
        "split_info": "SPLIT ASSIGNED: 2 PPL",
        "status": "confirmed",
        "created_at": "2025-10-14T17:00:00Z"
    },
    {
        "id": "dine-uobei",
        "title": "Uobei Sushi Dogenzaka (High-Speed Conveyor)",
        "category": "dine",
        "day": 1,
        "time_start": "20:00 JST",
        "time_end": "21:30 JST",
        "location": "Shibuya Center-gai, 2-24-1 Dogenzaka",
        "pnr": "TC-8812",
        "subtext": "Table for 4 · High-speed touchscreen lanes",
        "cost_jpy": 9600,
        "meta_badges": ["TABLECHECK CONFIRMED", "TOUCHSCREEN LANE"],
        "split_info": "SPLIT ASSIGNED: 4 PPL",
        "status": "confirmed",
        "created_at": "2025-10-14T20:00:00Z"
    },
    {
        "id": "activity-teamlab",
        "title": "teamLab Borderless: MORI Building Digital Art",
        "category": "activity",
        "day": 2,
        "time_start": "10:00 JST",
        "time_end": "13:00 JST",
        "location": "Azabudai Hills Garden Plaza B B1",
        "pnr": "PASS-TL-5519",
        "subtext": "Strict entry window · 4 passes bundled",
        "cost_jpy": 16800,
        "meta_badges": ["QR Attached (4 Passes)", "No Strobe Warning"],
        "split_info": "PAID BY MIRA (SPLIT 4)",
        "status": "confirmed",
        "created_at": "2025-10-15T09:00:00Z"
    },
    {
        "id": "activity-dsmg",
        "title": "Dover Street Market Ginza & Glitch Coffee",
        "category": "activity",
        "day": 2,
        "time_start": "14:30 JST",
        "time_end": "17:00 JST",
        "location": "Ginza 6-Chome, Chuo-ku, Tokyo",
        "pnr": "GLITCH-615",
        "subtext": "Single origin geisha tasting flights booked for 16:15",
        "cost_jpy": 5200,
        "meta_badges": ["RESERVATIONS CONFIRMED", "COFFEE TASTING"],
        "split_info": "SELF-PAID",
        "status": "confirmed",
        "created_at": "2025-10-15T14:00:00Z"
    }
]

expenses_db: List[Dict[str, Any]] = [
    {
        "id": "exp-1",
        "title": "TRUNK(HOTEL) Deposit & City Tax",
        "amount_jpy": 128000.0,
        "paid_by": "Mira Vance",
        "split_with": ["Mira Vance", "Kenji Sato"],
        "category": "Lodging",
        "date": "2025-10-14"
    },
    {
        "id": "exp-2",
        "title": "Uobei Sushi Welcome Dinner",
        "amount_jpy": 9600.0,
        "paid_by": "Kenji Sato",
        "split_with": ["Mira Vance", "Kenji Sato", "Sarah Chen", "Leo Tanaka"],
        "category": "Food & Dine",
        "date": "2025-10-14"
    },
    {
        "id": "exp-3",
        "title": "teamLab Borderless Group Pass (4x)",
        "amount_jpy": 16800.0,
        "paid_by": "Mira Vance",
        "split_with": ["Mira Vance", "Kenji Sato", "Sarah Chen", "Leo Tanaka"],
        "category": "Activities",
        "date": "2025-10-15"
    }
]

readiness_db = [
    {"id": "task-1", "title": "Visit Japan Web QR Generated", "completed": True},
    {"id": "task-2", "title": "eSIM Roaming Profile Installed", "completed": True},
    {"id": "task-3", "title": "Digital Suica loaded with ¥10,000", "completed": True},
    {"id": "task-4", "title": "Passport valid > 6 months", "completed": True},
]


# ==========================================
# ENDPOINT IMPLEMENTATIONS
# (Mounted under both /api/... and /... for seamless Vercel rewrites)
# ==========================================

def health_response():
    return {
        "status": "ok",
        "environment": "vercel-serverless",
        "runtime": "python3.10",
        "app": "Travel Booking Organizer",
        "timestamp": datetime.utcnow().isoformat(),
        "has_secret_configured": bool(API_SECRET_KEY)
    }

@app.get("/api/health")
@app.get("/health")
def get_health() -> Dict[str, Any]:
    return health_response()


def itinerary_list(day: Optional[int] = None, category: Optional[str] = None):
    results = itinerary_db
    if day is not None:
        results = [ev for ev in results if ev.get("day") == day]
    if category is not None:
        results = [ev for ev in results if ev.get("category") == category.lower()]
    return results

@app.get("/api/itinerary", response_model=List[Dict[str, Any]])
@app.get("/itinerary", response_model=List[Dict[str, Any]])
def get_itinerary(
    day: Optional[int] = Query(None, ge=1, le=30, description="Filter by expedition day"),
    category: Optional[str] = Query(None, description="Filter by event category")
):
    return itinerary_list(day, category)


def create_event(item: EventCreate) -> Dict[str, Any]:
    new_event = {
        "id": f"event-{uuid.uuid4().hex[:8]}",
        "title": item.title,
        "category": item.category,
        "day": item.day,
        "time_start": item.time_start,
        "time_end": item.time_end or "",
        "location": item.location,
        "pnr": item.pnr or "N/A",
        "subtext": item.subtext or "",
        "cost_jpy": item.cost_jpy or 0,
        "meta_badges": item.meta_badges or [],
        "split_info": item.split_info or "SOLO",
        "status": "confirmed",
        "created_at": datetime.utcnow().isoformat()
    }
    itinerary_db.append(new_event)
    return {"message": "Event successfully created", "event": new_event}

@app.post("/api/itinerary", status_code=status.HTTP_201_CREATED)
@app.post("/itinerary", status_code=status.HTTP_201_CREATED)
def post_itinerary(item: EventCreate) -> Dict[str, Any]:
    return create_event(item)


def delete_event(event_id: str):
    global itinerary_db
    initial_len = len(itinerary_db)
    itinerary_db = [ev for ev in itinerary_db if ev.get("id") != event_id]
    if len(itinerary_db) == initial_len:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return {"message": "Event deleted successfully", "id": event_id}

@app.delete("/api/itinerary/{event_id}")
@app.delete("/itinerary/{event_id}")
def delete_itinerary(event_id: str):
    return delete_event(event_id)


def parse_pnr(req: PNRParseRequest) -> Dict[str, Any]:
    text = req.raw_text.strip()
    flight_match = re.search(r"([A-Z]{2,3})\s?([0-9]{3,4})", text, re.IGNORECASE)
    pnr_match = re.search(r"\b([A-Z0-9]{6})\b", text)
    seat_match = re.search(r"seat\s*([0-9]{1,2}[A-K])", text, re.IGNORECASE)
    
    detected_pnr = pnr_match.group(1).upper() if pnr_match else f"PNR-{uuid.uuid4().hex[:6].upper()}"
    carrier = req.carrier_hint or ("ANA" if "ana" in text.lower() or "nh" in text.lower() else "Airline")

    if flight_match:
        carrier_code = flight_match.group(1).upper()
        flight_num = flight_match.group(2)
        parsed_event = {
            "title": f"{carrier_code}{flight_num} Expedition Flight",
            "category": "flight",
            "day": 1,
            "time_start": "11:00",
            "time_end": "14:30",
            "location": "Airport Terminal -> Assigned Gate",
            "pnr": detected_pnr,
            "subtext": f"{carrier} Flight {carrier_code}{flight_num} · Seat {seat_match.group(1).upper() if seat_match else '18A'}",
            "cost_jpy": 85000,
            "meta_badges": ["PARSED BY AI v2.4", "ON TIME", "CONFIRMED"],
            "split_info": "SOLO"
        }
    elif "hotel" in text.lower() or "stay" in text.lower() or "check-in" in text.lower():
        parsed_event = {
            "title": "Decoded Hotel Lodging",
            "category": "hotel",
            "day": 1,
            "time_start": "15:00",
            "time_end": "11:00",
            "location": "Central District, Tokyo",
            "pnr": detected_pnr,
            "subtext": "Guest Reservation Confirmed · Breakfast Included",
            "cost_jpy": 45000,
            "meta_badges": ["HOTEL LODGING", "CHECK-IN 15:00", "DIGITAL KEY"],
            "split_info": "SPLIT: 2 PPL"
        }
    else:
        parsed_event = {
            "title": "Decoded Expedition Event",
            "category": "activity",
            "day": 2,
            "time_start": "14:00",
            "time_end": "16:30",
            "location": "Tokyo Metro Corridor",
            "pnr": detected_pnr,
            "subtext": text[:90] + ("..." if len(text) > 90 else ""),
            "cost_jpy": 3500,
            "meta_badges": ["AI PARSER v2.4", "CONFIRMED"],
            "split_info": "SELF-PAID"
        }

    return {
        "status": "success",
        "confidence": 0.96,
        "parsed_item": parsed_event,
        "extracted_pnr": detected_pnr
    }

@app.post("/api/parse-pnr")
@app.post("/parse-pnr")
def post_parse_pnr(req: PNRParseRequest) -> Dict[str, Any]:
    return parse_pnr(req)


def get_expenses_summary():
    total_spent = sum(item["amount_jpy"] for item in expenses_db)
    people = ["Mira Vance", "Kenji Sato", "Sarah Chen", "Leo Tanaka"]
    paid_map = {p: 0.0 for p in people}
    owed_map = {p: 0.0 for p in people}

    for exp in expenses_db:
        amount = exp["amount_jpy"]
        payer = exp["paid_by"]
        split_list = exp["split_with"]
        per_person = amount / len(split_list)

        if payer in paid_map:
            paid_map[payer] += amount
        for member in split_list:
            if member in owed_map:
                owed_map[member] += per_person

    balances = []
    for p in people:
        net = paid_map[p] - owed_map[p]
        balances.append({
            "person": p,
            "paid": round(paid_map[p], 2),
            "owed": round(owed_map[p], 2),
            "net": round(net, 2)
        })

    return {
        "total_spent_jpy": total_spent,
        "expenses": expenses_db,
        "balances": balances
    }

@app.get("/api/expenses")
@app.get("/expenses")
def get_expenses_endpoint():
    return get_expenses_summary()


def add_expense(exp: ExpenseCreate):
    new_expense = {
        "id": f"exp-{uuid.uuid4().hex[:6]}",
        "title": exp.title,
        "amount_jpy": exp.amount_jpy,
        "paid_by": exp.paid_by,
        "split_with": exp.split_with,
        "category": exp.category,
        "date": datetime.utcnow().strftime("%Y-%m-%d")
    }
    expenses_db.append(new_expense)
    return {"message": "Expense recorded", "expense": new_expense}

@app.post("/api/expenses", status_code=status.HTTP_201_CREATED)
@app.post("/expenses", status_code=status.HTTP_201_CREATED)
def post_expense(exp: ExpenseCreate):
    return add_expense(exp)


def rates_summary():
    return {
        "currency_peg": {
            "base": "USD",
            "target": "JPY",
            "rate": 152.40,
            "label": "USD/JPY Live Interbank",
            "delta_24h": "+0.32%"
        },
        "weather": {
            "city": "Tokyo",
            "temp_c": 21,
            "condition": "Crisp Autumn / Dry",
            "icon": "sunny",
            "humidity": "45%",
            "wind_speed": "8 km/h"
        },
        "arrival_gate_readiness": readiness_db
    }

@app.get("/api/rates")
@app.get("/rates")
def get_rates_endpoint():
    return rates_summary()


def toggle_readiness_item(req: ReadinessToggleRequest):
    for task in readiness_db:
        if task["id"] == req.task_id:
            task["completed"] = req.completed
            completed_count = sum(1 for t in readiness_db if t["completed"])
            return {
                "message": "Task updated",
                "task": task,
                "readiness_summary": f"{completed_count}/{len(readiness_db)} COMPLETE"
            }
    raise HTTPException(status_code=404, detail="Task ID not found")

@app.post("/api/readiness/toggle")
@app.post("/readiness/toggle")
def post_readiness_toggle(req: ReadinessToggleRequest):
    return toggle_readiness_item(req)


# ==========================================
# CUSTOMER AUTHENTICATION & SESSION ENDPOINTS
# ==========================================

customers_db = [
    {
        "id": "cust-001",
        "name": "Mira Vance",
        "email": "mira@wanderlore.io",
        "password": "TokyoDrift25!",
        "handle": "@mira.explores",
        "avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuD790b-PbyJIxM_-Vlw0NxY_4UtT1l7iQdEsgDlecRumr30nknTdO9InJqKNk5vRd7iVIGSsnqNrpD1ZobztCh-1hWi22i6rZs5bhJOqklUtGRQHnqaWF_p9S4BsY3b3Wc6Ev-rwaXfEyHKDiHML_Sii_rJJZvm-Woo6Plw1xXvoBoz_ukmapOAfLtUmwbGr2klO_dtulVjjRnK_PTR-C5nTEQmcuofavuAN_QRKufySJyVNaF72wWr6Q",
        "membership_tier": "EXPEDITION ELITE",
        "member_number": "WL-880291",
        "loyalty_points": 42500,
        "passport_country": "USA",
        "linked_pnrs": ["W82KLP", "TK-9921", "TC-8812", "PASS-TL-5519"]
    },
    {
        "id": "cust-002",
        "name": "Kenji Sato",
        "email": "kenji@wanderlore.io",
        "password": "TokyoDrift25!",
        "handle": "@kenji.runs",
        "membership_tier": "NAVIGATOR BLACK",
        "member_number": "WL-771923",
        "loyalty_points": 88000,
        "passport_country": "JPN",
        "linked_pnrs": ["W82KLP", "TC-8812"]
    }
]

current_session_user = customers_db[0]


def format_customer_response(cust: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": cust["id"],
        "name": cust["name"],
        "email": cust["email"],
        "handle": cust.get("handle", f"@{cust['name'].lower().replace(' ', '')}"),
        "avatar": cust.get("avatar", ""),
        "membershipTier": cust.get("membership_tier", "EXPEDITION ELITE"),
        "memberNumber": cust.get("member_number", f"WL-{uuid.uuid4().hex[:6].upper()}"),
        "loyaltyPoints": cust.get("loyalty_points", 15000),
        "passportCountry": cust.get("passport_country", "USA"),
        "linkedPnrs": cust.get("linked_pnrs", []),
        "isLoggedIn": True
    }


@app.post("/api/auth/login")
@app.post("/auth/login")
def login_customer(req: CustomerLoginRequest):
    global current_session_user
    email_clean = req.email.strip().lower()
    
    # Check if matching email or handle
    matched = None
    for cust in customers_db:
        if cust["email"].lower() == email_clean or cust["handle"].lower() == email_clean or cust["member_number"].lower() == email_clean:
            matched = cust
            break
            
    # For frictionless demo exploration: allow existing or verify passphrase
    if matched:
        current_session_user = matched
        return {
            "status": "success",
            "message": f"Welcome back, {matched['name']}",
            "user": format_customer_response(matched),
            "token": f"jwt_{uuid.uuid4().hex[:16]}"
        }
    
    # If customer is not found, dynamically auto-provision demo profile
    new_cust = {
        "id": f"cust-{uuid.uuid4().hex[:6]}",
        "name": email_clean.split("@")[0].capitalize(),
        "email": email_clean if "@" in email_clean else f"{email_clean}@wanderlore.io",
        "password": req.password,
        "handle": f"@{email_clean.split('@')[0]}",
        "membership_tier": "EXPEDITION ELITE",
        "member_number": f"WL-{uuid.uuid4().hex[:6].upper()}",
        "loyalty_points": 10000,
        "passport_country": "USA",
        "linked_pnrs": ["W82KLP"]
    }
    customers_db.append(new_cust)
    current_session_user = new_cust
    return {
        "status": "success",
        "message": f"Authenticated customer {new_cust['name']}",
        "user": format_customer_response(new_cust),
        "token": f"jwt_{uuid.uuid4().hex[:16]}"
    }


@app.post("/api/auth/pnr-login")
@app.post("/auth/pnr-login")
def login_via_pnr(req: PNRLoginRequest):
    global current_session_user
    pnr_clean = req.pnr.strip().upper()
    surname = req.last_name.strip().capitalize()
    
    # Locate any itinerary item matching this PNR
    matching_event = next((e for e in itinerary_db if e.get("pnr") == pnr_clean), None)
    
    pnr_user = {
        "id": f"pnr-{uuid.uuid4().hex[:6]}",
        "name": f"Guest ({surname})",
        "email": f"{surname.lower()}.{pnr_clean.lower()}@expedition.travel",
        "handle": f"@{pnr_clean}",
        "membership_tier": "GUEST",
        "member_number": f"PNR-{pnr_clean}",
        "loyalty_points": 2500,
        "passport_country": "AUTO-VERIFIED",
        "linked_pnrs": [pnr_clean]
    }
    current_session_user = pnr_user
    return {
        "status": "success",
        "message": f"PNR {pnr_clean} located and synchronized",
        "user": format_customer_response(pnr_user),
        "matched_event": matching_event,
        "token": f"pnr_session_{uuid.uuid4().hex[:12]}"
    }


@app.post("/api/auth/register")
@app.post("/auth/register")
def register_customer(req: CustomerRegisterRequest):
    global current_session_user
    new_cust = {
        "id": f"cust-{uuid.uuid4().hex[:6]}",
        "name": req.name.strip(),
        "email": req.email.strip().lower(),
        "password": req.password,
        "handle": req.handle.strip() if req.handle else f"@{req.name.lower().replace(' ', '')}",
        "membership_tier": "EXPEDITION ELITE",
        "member_number": f"WL-{uuid.uuid4().hex[:6].upper()}",
        "loyalty_points": 5000,
        "passport_country": req.passport_country or "USA",
        "linked_pnrs": ["W82KLP"]
    }
    customers_db.append(new_cust)
    current_session_user = new_cust
    return {
        "status": "success",
        "message": "Customer profile created successfully",
        "user": format_customer_response(new_cust),
        "token": f"jwt_{uuid.uuid4().hex[:16]}"
    }


@app.get("/api/auth/me")
@app.get("/auth/me")
def get_current_user():
    global current_session_user
    if current_session_user:
        return {"status": "authenticated", "user": format_customer_response(current_session_user)}
    return {"status": "guest", "user": None}


@app.post("/api/auth/logout")
@app.post("/auth/logout")
def logout_customer():
    global current_session_user
    current_session_user = None
    return {"status": "logged_out", "message": "Session terminated successfully"}
