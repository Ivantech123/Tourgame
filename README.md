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
2. Run frontend + API server (SQLite):
   `npm run dev`

## API + SQL

- API server starts on `http://localhost:3001`
- Frontend runs on `http://localhost:3000` and proxies `/api` to backend
- SQLite DB file is created automatically at `server/data/database.sqlite`
- Implemented endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `PUT /api/users/:id`
  - `POST /api/bookings`
  - `GET /api/bookings/:userId`
