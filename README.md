# Travel Booking Data Organiser

A Vite + React + TypeScript travel operations dashboard for planning, tracking, and optimizing multi-day itineraries. The app combines a tactical flight/HUD interface with itinerary management, AI-assisted PNR parsing, expense splitting, and readiness tracking.

## Overview

This repository contains a full-stack travel planning application:

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend/API: Python FastAPI running as a Vercel serverless function
- Deployment model: Vercel-hosted frontend with API routes served from `/api`

The app is designed for travel coordination workflows such as flight tracking, hotel bookings, transit plans, daily activity scheduling, and group expense management.

## Features

- Interactive itinerary timeline and day-based travel planning
- Flight, transit, hotel, dining, and activity event tracking
- Smart import / AI-style PNR parsing workflow
- Budget and split expense management
- Readiness checklist for travel preparation
- Responsive dashboard with mobile-friendly modals and drawers
- Vercel-ready configuration with Python serverless API compatibility

## Tech Stack

- TypeScript
- React 19
- Vite
- Tailwind CSS
- FastAPI
- Python
- Vercel serverless deployment

## Project Structure

```text
.
├── api/
│   └── index.py              # Vercel Python serverless API entrypoint
├── backend/
│   ├── main.py               # Optional standalone FastAPI backend
│   ├── requirements.txt      # Backend Python dependencies
│   └── DEPLOYMENT.md         # Backend deployment notes
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example              # Environment variable template
├── index.html
├── metadata.json
├── package.json
├── requirements.txt          # Root Python requirements for local usage
├── tsconfig.json
├── vercel.json               # Vercel routing and build config
├── vite.config.ts
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ or newer
- npm
- Python 3.10+
- A Vercel account if you want to deploy the app

## Local Development

### 1) Install frontend dependencies

```bash
npm install
```

### 2) Run the frontend

```bash
npm run dev
```

This starts the Vite development server, typically at:

- http://localhost:3000

### 3) Run the API locally (optional but recommended for full functionality)

Use the Python backend in a local virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FRONTEND_ORIGINS="http://localhost:3000,http://localhost:5173"
uvicorn main:app --reload --port 8000
```

Then set the frontend to use the local backend:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000
```

The project also supports a same-origin deployment model on Vercel where the Python API is served from `/api` and the frontend performs relative requests like `/api/health`.

## Environment Variables

Copy the sample environment file and fill in the required values:

```bash
cp .env.example .env
```

Example configuration:

```env
API_SECRET_KEY="your-secure-serverless-secret-key"
WEATHER_API_KEY="optional-third-party-weather-key"
FRONTEND_ORIGINS="*"
VITE_API_BASE_URL=""
```

Notes:

- `API_SECRET_KEY` and other server-side values should never be exposed in client-side code.
- For a Vercel unified deployment, keep `VITE_API_BASE_URL` empty so requests use relative `/api` paths.
- For local testing with a separate backend, set `VITE_API_BASE_URL` to your backend URL.

## Deployment

### Recommended: Vercel (single deployment)

This repository is already configured for a Vercel deployment using `vercel.json`.

Key rewrite behavior:

- `/api/(.*)` -> `/api/index.py`
- `/(.*)` -> `/index.html`

This allows the React frontend and Python FastAPI API to coexist in one deployment.

Deployment steps:

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Use the repository root as the project root.
4. Keep the framework preset as `Vite`.
5. Set build command:

```bash
npm run build
```

6. Set output directory:

```bash
dist
```

7. Add the environment variables from `.env.example` in the Vercel dashboard.
8. Deploy the project.

### Optional: Separate backend deployment

If you deploy the Python API independently (for example on Render or Railway), set:

```bash
VITE_API_BASE_URL=https://your-backend-url.example.com
```

and ensure the backend CORS configuration allows your frontend domain.

## API Endpoints

The application exposes API routes under `/api` and also under root-level aliases for convenience.

Examples:

- `GET /api/health` or `/health`
- `GET /api/itinerary`
- `POST /api/itinerary`
- `DELETE /api/itinerary/{event_id}`
- `POST /api/parse-pnr`
- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/rates`
- `POST /api/readiness/toggle`

## Production Notes

- The app is designed to run as a static frontend with a serverless backend.
- Data is kept in-memory at runtime for the serverless API and is suitable for demos and lightweight deployments.
- For production persistence, you should connect a database and replace the in-memory data stores.

## License

This project is currently distributed without a separate license file in the repository. Please confirm licensing requirements with the repository owner before public reuse or redistribution.

## Contributing

Pull requests and refinements are welcome. If you are updating the app, keep the deployment structure in mind and verify that both the frontend and the Vercel API routes continue to work after changes.
