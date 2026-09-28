# Creator Analyzer

Creator Analyzer is an early-stage workspace for YouTube creators. It combines a polished analytics dashboard, Supabase authentication, creator research tools, and an authenticated Gemini-powered assistant.

The analytics, video library, niche scores, thumbnail feedback, and title feedback currently use demo data. YouTube OAuth and live YouTube Analytics are planned but are not connected yet.

## Workspace

- `frontend/` — React, TypeScript, and Vite application
- `backend/` — Express and TypeScript API for local development
- `api/` — Vercel Functions used in production

## Local development

Copy both example environment files, fill in the required values, and install dependencies:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
npm --prefix frontend ci
npm --prefix backend ci
```

Run the frontend and backend in separate terminals:

```bash
npm run dev:frontend
npm run dev:backend
```

Vite proxies `/api` requests to `http://localhost:4000`.

## Environment variables

Frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend and Vercel Functions:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` — safe public/anonymous key used to validate the caller's access token
- `GEMINI_API_KEY`
- `GEMINI_MODEL` — optional, defaults to `gemini-3.6-flash`
- `FRONTEND_ORIGIN` — local Express CORS origin, defaults to `http://localhost:5173`

Never expose a Supabase service-role key or the Gemini API key to the frontend. Configure `/reset-password` as an allowed Supabase Auth redirect URL for each deployed environment.

## Verification

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend run build
```
