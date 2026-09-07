# NexaFreight Control Tower

Two-process system: a Python/FastAPI backend and a Next.js frontend, run side by side.

## Layout

```
backend/     FastAPI service, Alembic migrations, ML models, tests
frontend/    Next.js app (NexaFreight Control Tower UI)
docs/        Phase changelogs, helper scripts, planning docs
archive/     Retired artifacts kept for reference (not part of the running app)
Datasets/    Raw CSVs (gitignored — see "Datasets" below)
```

## Prerequisites

- Python 3.11+, `pip`
- Node.js 20+, `npm`
- PostgreSQL (or whatever `DATABASE_URL` in `backend/.env` points at)

## Setup

```bash
# Backend
cd backend
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET
pip install -r requirements.txt
alembic upgrade head

# Frontend
cd frontend
cp .env.example .env.local  # fill in NEXT_PUBLIC_NEXA_API_URL
npm ci
```

## Run

```bash
# Terminal 1 — backend (port 8000)
cd backend
uvicorn nexafreight.main:app --port 8000 --app-dir src

# Terminal 2 — frontend (port 3000)
cd frontend
npm run dev -- -p 3000
```

Open http://localhost:3000 and log in with the seeded credentials below.

## Seed data

*(placeholder — fill in once the seed script is finalized under `docs/scripts/`)*

```bash
cd backend
python scripts/activate_and_seed_positions.py
```

Default login after seeding: `operator@nexafreight.dev` / `changeme123`

## Datasets

Raw CSVs used for model training/backfills live in `Datasets/` at the repo root.
This directory is gitignored (~196 MB) — pull it separately from *(placeholder: link
to shared storage / release asset)*.

## Tests

```bash
# Backend
cd backend && pytest -q

# Frontend
cd frontend && npx tsc --noEmit && npx vitest run
```

## Architecture note: proxy vs. direct SSE

The frontend proxies REST calls to the backend but connects **directly** to
`:8000` for Server-Sent Events (live position streams). This is intentional —
see `backend/.env.example` / `frontend/.env.example` for details. Do not change
this without updating both env files and the proxy config together.
