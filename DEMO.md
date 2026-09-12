# NexaFreight — 10-Minute Demo Script (Definitive Plan §Phase 14)

Showcases the 4 core objectives: **Logistics Optimization, Route Optimization,
Alert Indication, AI Automation.**

## 0. Setup (before the demo starts — 1 minute)

```bash
# Backend (terminal 1)
cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt
cp -n .env.example .env        # set JWT_SECRET
.venv/bin/uvicorn nexafreight.main:app --host 0.0.0.0 --port 8000

# Frontend (terminal 2)
cd frontend && npm ci && npm run dev          # http://localhost:3000

# Demo user seed (once)
cd backend && .venv/bin/python scripts/seed_user.py
# operator@nexafreight.local / operator123   (OPERATOR role)
# admin@nexafreight.local    / admin123      (ADMIN role)
```

Log in as **operator** (can acknowledge alerts, approve reroutes, view financials).
Keep a second tab as **viewer** if you want to show the financials 403 gating.

---

## 1. [2 min] Live map — "the fleet in front of you"

1. The splash clears; the world map appears with ports (azure dots), sea/air/road
   routes, and moving shipment markers — vessels interpolate smoothly via SSE.
2. Point at the top bar: **LIVE entity count, ZULU clock**, FeedHealth pill
   (REPLAY/SIM provenance on the markers via ProvenanceBadge).
3. Press `L` — the Layer panel toggles ports/routes/maritime. Mention: only
   logistics layers are on by default; the OSINT layers were stripped in Phase 0.
4. Click any shipment marker → the popup shows mode + provenance, and the
   **Shipment Inspector** slides in on the right.

> Talk track: *"This is the only surface. Everything the operator does — alerts,
> reroutes, analytics, AI — hangs off this map."*

## 2. [2 min] ML prediction — "we see problems before they cost us"

1. In the inspector, show the **route plan** (leg-by-leg, planned times).
2. Scroll to **ML delay prediction**:
   - P50 delay in hours
   - SLA risk level (ON_TIME / LOW / MEDIUM / HIGH / BREACH)
   - model version, provenance badge (DERIVED)
3. Mention the endpoint behind it: `GET /api/shipments/{id}/predict` — delay
   classifier + ETA quantile (P10/P50/P85) models from DataCo training.

> Talk track: *"The model is frozen and versioned — the UI never sees raw
> feature vectors, only the verdict plus provenance."*

## 3. [2 min] Disruption → alert — "the tower catches it"

Inject a manual disruption (this is what the 15-minute detector and the AIS
listener would also raise automatically):

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@nexafreight.local","password":"admin123"}' \
  | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')

# pick any in-transit shipment id from the inspector URL or:
SID=$(curl -s http://localhost:8000/api/shipments -H "Authorization: Bearer $TOKEN" \
  | python -c 'import sys,json;print(json.load(sys.stdin)["items"][0]["id"])')

curl -s -X POST http://localhost:8000/api/disruptions \
  -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d "{\"shipment_id\":\"$SID\",\"disruption_type\":\"PORT_CONGESTION\",\"delay_hours\":36}"
```

1. The response already names `alert_id` and a severity — financial exposure was
   computed inline (SLA penalties + demurrage per order).
2. Press `A` — the **Alert Center** opens; the new alert sits on top, colored by
   severity, with its `$ exposure` and a provenance badge.
3. Click **Inspect** on the card → inspector jumps to that shipment, alerts listed.

> Talk track: *"Alert math: penalty capped at 10% of revenue, demurrage after
> free days — CRITICAL/HIGH/MEDIUM tiers come straight out of that exposure."*

## 4. [2 min] Reroute options → approval — "three ways out, scored"

1. On the alert card, click **Options** → the Reroute drawer opens with exactly
   **three cards**:
   - **ACCEPT_DELAY** — eat the delay (casted SLA penalties shown)
   - **DIVERT VIA …** — alternative port from the corridor table (green
     ⭐ RECOMMENDED if cheapest)
   - **MODAL_SHIFT_AIR** — clone to air with carbon + freight deltas
2. Each card shows **revised ETA, freight Δ, SLA penalty, demurrage, carbon $,
   CO₂ kg, remaining breaches, total impact** — always computed server-side.
3. Click **Approve & Execute** on the recommended card:
   - decision is written (one per alert — a second click returns **409**)
   - shipment legs: old ones flip to **REPLACED** (zero-loss), new ones appear at
     **route_version 2** — the map redraws around the new chain.
4. Point at the audit: `GET /api/decisions` shows the paper trail with
   before/after route versions and the frozen option snapshot.

> Talk track: *"The UI never submits costs — the slate is regenerated on the
> server, so the audited numbers are the real numbers."*

## 5. [1 min] Copilot — "ask the tower"

In the inspector's **AI Copilot** box, ask:

- `Why was this shipment rerouted?` → traces the decision in plain language
- `Are we on time for SLA?` → per-order ON_TIME/AT_RISK/LATE summary
- `What is the demurrage on this shipment?` → financial engine, no invented figures

> Badge under the answer says `rules` (deterministic) or `llm`/`rules_fallback`,
> plus provenance. Copilot can explain and recommend — it can never approve.

## 6. [1 min] Analytics — "the morning roll-up"

Press `G`:

- **Scorecard**: P&L rail for the next 24h / 7d / 30d deadline windows —
  revenue, costs, realized margin, pending SLA + demurrage estimates.
- **Fleet**: counts by status plus lane demand sparklines (frozen Prophet corpus).
- **SLA risk**: every at-risk shipment with days-to-deadline.
- **ESG**: CO₂ per shipment/route with the vs-air saving — the "why sea beats air"
  number.

Click any row → jumps straight into that shipment's inspector.

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `401` on any curl | token expired (60 min by default) — re-login |
| Alert Center empty | `POST /api/disruptions` again; workers run every 15 min in-app |
| Prediction section missing | model registry offline by design — the section hides on 404/503 |
| Financials hidden | you're logged in as VIEWER: that's the intended 403 gating |

**Provenance legend:** REAL · REPLAYED · SIMULATED · DERIVED — every API
response and every badge carries it.
