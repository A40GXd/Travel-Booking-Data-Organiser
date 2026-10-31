# Travel Booking Data Organiser

A Vite + React + TypeScript travel operations dashboard for planning, tracking, and optimizing multi-day itineraries. The app combines a tactical travel dashboard UI with itinerary management, PNR-style parsing, budget tracking, and backend-ready APIs for a modern travel workflow.

## Overview

This repository contains a full-stack travel booking and trip management application with:

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend/API: Python FastAPI with serverless deployment support
- Deployment model: Vercel-friendly frontend + API routes served from `/api`
- Use case: travel coordination, itinerary planning, expense splitting, readiness checks, and booking workflows

The app is designed for workflows such as:

- flight and transit tracking
- hotel check-in and room key workflows
- dining and activity reservations
- budget and group expense splitting
- travel readiness and planning checklists

## Features

- Multi-day itinerary timeline with travel event tracking
- Tactical dashboard layout inspired by operations/control-room UIs
- Booking-style event records including flights, hotels, dining, and activities
- AI-style PNR parsing flow for extracting trip details from raw text
- Budget tracking with split expense logic
- Travel readiness checklist and status toggles
- Responsive layout for desktop and mobile-friendly interactions
- Vercel-ready configuration with FastAPI serverless compatibility
- Demo customer auth and guest PNR login endpoints

## Tech Stack

- TypeScript
- React 19
- Vite
- Tailwind CSS
- Python
- FastAPI
- Vercel serverless deployment

## Repository Structure

```text
.
├── api/
│   └── index.py               # Vercel serverless FastAPI entrypoint
├── backend/
│   ├── main.py                # Standalone FastAPI backend
│   ├── requirements.txt       # Backend dependencies
│   └── DEPLOYMENT.md          # Backend deployment notes
├── public/
│   └── assets/
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── requirements.txt
├── tsconfig.json
├── vercel.json
├── vite.config.ts
├── README.md
├── .gitignore
└── LICENSE (if added later)
```

## Prerequisites

Before running the project, ensure you have:

- Node.js 18+
- npm
- Python 3.10+
- Optional: Vercel account for deployment

## Local Development

### 1) Install frontend dependencies

```bash
npm install
```

### 2) Run the frontend locally

```bash
npm run dev
```

This starts the Vite development server, usually on:

- http://localhost:3000

### 3) Run the backend locally (optional but recommended)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FRONTEND_ORIGINS="http://localhost:3000,http://localhost:5173"
uvicorn main:app --reload --port 8000
```

Then configure the frontend to use the local backend via a local environment file:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000
```

When deployed to Vercel in the same app, you can leave `VITE_API_BASE_URL` empty and use same-origin calls like `/api/health`.

## Environment Variables

Copy the sample file and fill in the values you need:

```bash
cp .env.example .env
```

Example:

```env
API_SECRET_KEY="your-secure-serverless-secret-key"
WEATHER_API_KEY="optional-weather-key"
FRONTEND_ORIGINS="*"
VITE_API_BASE_URL=""
```

Notes:

- Keep secret values server-side and never expose them in client code.
- The app supports both local backend usage and unified Vercel deployment.

## API Endpoints

The application exposes API routes under `/api` and also includes alias routes for convenience.

Examples:

- `GET /api/health`
- `GET /api/itinerary`
- `POST /api/itinerary`
- `DELETE /api/itinerary/{event_id}`
- `POST /api/parse-pnr`
- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/rates`
- `POST /api/readiness/toggle`
- `POST /api/auth/login`
- `POST /api/auth/pnr-login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Deployment

### Recommended: Vercel single deployment

This project is configured for Vercel deployment using the repository root and `vercel.json`.

Key rewrite behavior includes:

- `/api/(.*)` -> `/api/index.py`
- `/(.*)` -> `/index.html`

Typical deployment steps:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Use the repository root as the project root.
4. Set the framework preset to `Vite`.
5. Build command:

```bash
npm run build
```

6. Output directory:

```bash
dist
```

7. Add environment variables from `.env.example` inside the Vercel dashboard.
8. Deploy.

### Optional: Separate backend deployment

If you deploy the Python API separately, set:

```bash
VITE_API_BASE_URL=https://your-backend-url.example.com
```

and ensure CORS is configured to allow the frontend domain.

## Demo and Auth Notes

This repository includes demo-style customer authentication and guest trip access endpoints:

- email/password login flow
- PNR-based guest login flow
- in-memory customer/session handling
- member profile and trip linkage simulation

These endpoints support demo usage and UI prototypes, and are designed to be replaced with real authentication in a production environment.

## Production Notes

- The app is structured for a static frontend with a serverless backend.
- Data is stored in memory for demo/serverless use.
- For production use, consider replacing in-memory stores with a database and adding real auth, user management, and persistent storage.

## Contributing

Contributions and improvements are welcome. When making changes, verify that both the frontend and API behavior continue to work correctly after updates.

## License

This repository does not currently include a dedicated license file. Please confirm licensing requirements with the repository owner before public reuse or redistribution.
