<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Y_fg3fTOEjnYA6V_cd9x0UuInq743rgM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure env vars (for backend):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   You can copy `.env.example` to `.env.local`.
3. Run frontend + API server:
   `npm run dev`

## Supabase Setup

- API server starts on `http://localhost:3001`
- Frontend runs on `http://localhost:3000` and proxies `/api` to backend
- Run schema SQL from `server/sql/supabase_schema.sql` in Supabase SQL Editor
- Keep `SUPABASE_SERVICE_ROLE_KEY` only on server-side envs (never in frontend code)

## API

- Implemented endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `PUT /api/users/:id`
  - `POST /api/bookings`
  - `GET /api/bookings/:userId`
