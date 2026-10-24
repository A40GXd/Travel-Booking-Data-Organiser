# Wanderlore Independent Deployment Guide

This project is architected with a strict separation of concerns:
- **Frontend**: Single Page Application built with React, TypeScript, Tailwind CSS, and Vite (located in `/src`, `/public`, `index.html`, `vite.config.ts`, `package.json`).
- **Backend**: Python FastAPI service with Pydantic validation and CORS controls (located in `/backend/`).

> **Runtime Notice for AI Studio**: AI Studio runs within a Node.js development container. The Python backend files are located in `/backend` for independent deployment on Render/Railway. In the local development sandbox, the React frontend features an integrated client-side data bridge so all UI components, modals, and telemetry functions work immediately. When deployed, the frontend connects directly to your deployed FastAPI backend via `VITE_API_BASE_URL`.

---

## 1. Deploying the Python FastAPI Backend on Render

Render is ideal for deploying FastAPI web services with automated SSL and scale-to-zero or dedicated instances.

### Step-by-Step Instructions:
1. **Push your code to GitHub / GitLab**.
2. **Log into [Render Dashboard](https://dashboard.render.com)**.
3. Click **New +** and select **Web Service**.
4. Connect your Git repository.
5. Configure the service parameters:
   - **Name**: `wanderlore-backend`
   - **Region**: Choose the closest region (e.g., Oregon, Frankfurt, Singapore).
   - **Branch**: `main` (or your active branch).
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment Variables**:
   Under the **Environment** tab on Render, add:
   | Key | Value | Notes |
   |---|---|---|
   | `FRONTEND_ORIGINS` | `https://your-wanderlore-frontend.vercel.app,http://localhost:3000` | Comma-separated list of allowed origins for CORS |
   | `API_SECRET_KEY` | `your-cryptographically-random-secret` | Kept confidential on Render, never sent to frontend |
   | `WEATHER_API_KEY` | *(Optional third-party weather API token)* | Server-only secret |
7. Click **Create Web Service**.
8. Once deployed, copy your Render service URL (e.g. `https://wanderlore-backend.onrender.com`).
9. Verify by opening `https://wanderlore-backend.onrender.com/api/health` in your browser. You should receive `{"status":"ok", ...}`.

---

## 2. Deploying the React + TypeScript Frontend on Vercel

Vercel provides edge delivery, global CDN, and automated builds for Vite React applications.

### Step-by-Step Instructions:
1. **Log into [Vercel](https://vercel.com)**.
2. Click **Add New...** -> **Project**.
3. Import your Git repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default repository root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Environment Variables**:
   Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://wanderlore-backend.onrender.com` | The base URL of your deployed Render backend |
6. Click **Deploy**.
7. Once finished, Vercel gives you a live production URL (e.g. `https://wanderlore.vercel.app`).
8. Copy your Vercel production domain and add it to `FRONTEND_ORIGINS` in your Render Web Service settings so CORS allows requests.

---

## 3. Local Development Options

### Running the Python Backend Locally:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
export FRONTEND_ORIGINS="http://localhost:3000,http://localhost:5173"
uvicorn main:app --reload --port 8000
```
API Documentation will be interactively available at `http://localhost:8000/docs`.

### Running the React Frontend Locally:
```bash
npm install
npm run dev
```
Set `VITE_API_BASE_URL="http://localhost:8000"` in `.env.local` to direct frontend calls to the local FastAPI backend.
