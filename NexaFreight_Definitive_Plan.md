# NexaFreight — Definitive Cleanup & Completion Plan

> **4 Core Objectives Only:**
> 1. **Logistic Optimization** — consolidation, route planning, cargo classification
> 2. **Route Optimization** — multi-leg routes, corridor alternatives, rerouting
> 3. **Alert Indication** — disruption detection, SLA breach, financial impact
> 4. **AI Automation** — ML predictions, copilot, automated decisions
>
> **Everything else is noise. Strip it.**

---

## PART 1: CODEBASE AUDIT — What to Remove vs Keep

### 1.1 FRONTEND COMPONENTS (`frontend/src/components/`)

| File | Core? | Verdict | Reason |
|------|-------|---------|--------|
| `GlobeMap.tsx` | ✅ YES | **KEEP** | Core map — shows shipments, routes, positions |
| `OsirisMap.tsx` | ✅ YES | **KEEP** | Main map component with route rendering |
| `ShipmentInspectorPanel.tsx` | ✅ YES | **KEEP** | Shipment detail + ML predictions |
| `ProvenanceBadge.tsx` | ✅ YES | **KEEP** | Shows REAL/SIM/DERIVED on every data point |
| `FeedHealthIndicator.tsx` | ✅ YES | **KEEP** | Shows AIS/Truck/Air feed status |
| `GlobalStatusBar.tsx` | ✅ YES | **KEEP** | Top bar with nav + status |
| `LayerPanel.tsx` | ✅ YES | **KEEP** | Toggle map layers (routes, ports, alerts) |
| `LiveAlerts.tsx` | ✅ YES | **KEEP** | Alert notifications on map |
| `SearchBar.tsx` | ✅ YES | **KEEP** | Search shipments/ports |
| `NavigationView.tsx` | ✅ YES | **KEEP** | Map navigation controls |
| `ErrorBoundary.tsx` | ✅ YES | **KEEP** | Error handling (infrastructure) |
| `ScaleBar.tsx` | ✅ YES | **KEEP** | Map scale indicator |
| `DirectionsBar.tsx` | ⚠️ MAYBE | **SIMPLIFY** | Keep if it shows route info, remove if it's navigation directions |
| `AiOverview.tsx` | ⚠️ MAYBE | **SIMPLIFY** | Keep only if it shows ML predictions, remove if it's generic AI chat |
| `KeyboardShortcuts.tsx` | ⚠️ MAYBE | **KEEP** | Low complexity, useful UX |
| `ArcGISPanel.tsx` | ❌ NO | **REMOVE** | GIS visualization — redundant with MapLibre |
| `ChainBrief.tsx` | ❌ NO | **REMOVE** | Supply chain briefings — not core logistics |
| `DrawHud.tsx` | ❌ NO | **REMOVE** | Map drawing tools — not logistics |
| `DrawingToolbar.tsx` | ❌ NO | **REMOVE** | Drawing toolbar — not logistics |
| `FlightWatchPanel.tsx` | ❌ NO | **REMOVE** | Standalone flight panel — flights shown on main map |
| `IntelFeed.tsx` | ❌ NO | **REMOVE** | OSINT intelligence feed — not core logistics |
| `LiveNewsPreviews.tsx` | ❌ NO | **REMOVE** | News feed — not core logistics |
| `OsintPanel.tsx` | ❌ NO | **REMOVE** | OSINT panel — not core logistics |
| `ScmPanel.tsx` | ❌ NO | **REMOVE** | Supply chain management panel — dead UI |
| `SharePanel.tsx` | ❌ NO | **REMOVE** | Sharing functionality — not logistics |
| `StyleStudio.tsx` | ❌ NO | **REMOVE** | Map style customization — not logistics |
| `TokenPanel.tsx` | ❌ NO | **REMOVE** | Token/API key management — not logistics |
| `ViewPresets.tsx` | ❌ NO | **REMOVE** | Map view presets — not logistics |
| `WorldRemote.tsx` | ❌ NO | **REMOVE** | World remote control — not logistics |

**Result: REMOVE 14 files, KEEP 12 files**

---

### 1.2 FRONTEND LIB FILES (`frontend/src/lib/`)

| File | Core? | Verdict | Reason |
|------|-------|---------|--------|
| `nexafreight/client.ts` | ✅ YES | **KEEP** | API client for backend calls |
| `httpJson.ts` | ✅ YES | **KEEP** | HTTP utility |
| `geo.ts` | ✅ YES | **KEEP** | Geographic calculations |
| `airports.ts` | ✅ YES | **KEEP** | Airport coordinates for air routes |
| `countryCentroids.ts` | ✅ YES | **KEEP** | Country center points for map |
| `aoi.ts` | ❌ NO | **REMOVE** | Area of Interest — OSINT feature |
| `aoi-export.ts` | ❌ NO | **REMOVE** | AOI export — OSINT feature |
| `bulgaria-sources.ts` | ❌ NO | **REMOVE** | Bulgaria-specific sources — OSINT |
| `camera-feed.ts` | ❌ NO | **REMOVE** | CCTV camera feed — OSINT |
| `camera-preview.ts` | ❌ NO | **REMOVE** | Camera preview — OSINT |
| `draw.ts` | ❌ NO | **REMOVE** | Map drawing utilities — not logistics |
| `gdeltEvents.ts` | ❌ NO | **REMOVE** | GDELT events — OSINT (add back in Phase 5) |
| `malware-intel.ts` | ❌ NO | **REMOVE** | Malware intelligence — not logistics |
| `malware-live.ts` | ❌ NO | **REMOVE** | Live malware feed — not logistics |
| `map-palette.ts` | ❌ NO | **REMOVE** | Map color palette — not needed |
| `ai-engine.ts` | ⚠️ MAYBE | **KEEP if used by copilot** | Check if this is the LLM integration |

**Result: REMOVE 10 files, KEEP 5-6 files**

---

### 1.3 BACKEND ADAPTERS (`backend/src/nexafreight/adapters/`)

| File | Core? | Verdict | Reason |
|------|-------|---------|--------|
| `protocols.py` | ✅ YES | **KEEP** | Adapter protocol definitions |
| `aisstream.py` | ✅ YES | **KEEP** | Real vessel tracking via AISStream |
| `mock.py` | ✅ YES | **KEEP** | Mock adapter for testing |
| `feed/` | ✅ YES | **KEEP** | Feed adapters (replay AIS, truck sim, flight sim) |
| `routing/` | ✅ YES | **KEEP** | Sea/road/air route computation |
| `llm/` | ✅ YES | **KEEP** | LLM adapters for copilot |

**Result: KEEP ALL — these are core**

---

### 1.4 BACKEND ROUTERS (`backend/src/nexafreight/routers/`)

| File | Core? | Verdict | Reason |
|------|-------|---------|--------|
| `auth.py` | ✅ YES | **KEEP** | Authentication (infrastructure) |
| `shipments.py` | ✅ YES | **KEEP** | Shipment CRUD + route + predict |
| `map.py` | ✅ YES | **KEEP** | Map positions, routes, ports, feed health |
| `alerts.py` | ⚠️ STUB | **BUILD** | Currently stub — needs real implementation |
| `disruptions.py` | ⚠️ STUB | **BUILD** | Currently stub — needs real implementation |
| `decisions.py` | ⚠️ STUB | **BUILD** | Currently stub — needs real implementation |
| `copilot.py` | ⚠️ STUB | **BUILD** | Currently stub — needs real implementation |
| `analytics.py` | ⚠️ STUB | **BUILD** | Currently stub — needs real implementation |

**Result: KEEP ALL, but 5 are stubs that need real implementation**

---

### 1.5 BACKEND SERVICES (`backend/src/nexafreight/services/`)

| File | Core? | Verdict | Status |
|------|-------|---------|--------|
| `consolidation.py` | ✅ YES | **KEEP** | ✅ Exists — groups orders into shipments |
| `route_planner.py` | ✅ YES | **KEEP** | ✅ Exists — plans multi-leg routes |
| `financial_engine.py` | ✅ YES | **KEEP** | ⚠️ Skeleton — needs completion |
| `disruption_detector.py` | ✅ YES | **BUILD** | ❌ Missing — detects AIS deviation + port congestion |
| `alert_engine.py` | ✅ YES | **BUILD** | ❌ Missing — computes financial impact |
| `sla_checker.py` | ✅ YES | **BUILD** | ❌ Missing — checks SLA deadlines |
| `reroute_engine.py` | ✅ YES | **BUILD** | ❌ Missing — generates 3 reroute options |
| `decision_executor.py` | ✅ YES | **BUILD** | ❌ Missing — executes approved reroutes |
| `copilot.py` | ✅ YES | **BUILD** | ❌ Missing — AI Q&A about shipments |

**Result: 3 exist (1 skeleton), 6 need to be built**

---

### 1.6 ROOT-LEVEL FILES

| File | Core? | Verdict | Reason |
|------|-------|---------|--------|
| `docker-compose.yml` | ❌ NO | **REMOVE** | Plan said "zero ops" |
| `deploy.sh` | ❌ NO | **REMOVE** | Deployment script — not needed |
| `Makefile` | ✅ YES | **KEEP** | Dev commands |
| `README.md` | ✅ YES | **REWRITE** | Needs to reflect core objectives only |
| `.gitignore` | ✅ YES | **UPDATE** | Add scratch/archive/datasets |
| `.github/workflows/` | ✅ YES | **KEEP** | CI (but simplify) |
| `frontend/Dockerfile` | ❌ NO | **REMOVE** | No Docker |
| `frontend/.dockerignore` | ❌ NO | **REMOVE** | No Docker |
| `frontend/nginx/` | ❌ NO | **REMOVE** | No nginx |
| `frontend/intel/` | ❌ NO | **REMOVE** | Express server for knowledge graphs — OSINT |
| `frontend/scratch/` | ❌ NO | **REMOVE** | Scratch files |
| `archive/` | ❌ NO | **GITIGNORE** | Old files, don't track |
| `Project idea/` | ❌ NO | **MOVE TO ARCHIVE** | Old planning docs |
| `Datasets/` | ⚠️ | **EXTERNALIZE** | 196MB — move to external storage |

---

## PART 2: EXECUTION PLAN — Step by Step

### PHASE 0: CLEANUP (Day 1 — 3 hours)

> **Goal:** Strip all non-core files from the repository.

#### Step 0.1: Remove non-core frontend components

```bash
cd frontend/src/components/

# Create archive
mkdir -p ../../archive/components

# Remove non-core components
mv ArcGISPanel.tsx ../../archive/components/
mv ChainBrief.tsx ../../archive/components/
mv DrawHud.tsx ../../archive/components/
mv DrawingToolbar.tsx ../../archive/components/
mv FlightWatchPanel.tsx ../../archive/components/
mv IntelFeed.tsx ../../archive/components/
mv LiveNewsPreviews.tsx ../../archive/components/
mv OsintPanel.tsx ../../archive/components/
mv ScmPanel.tsx ../../archive/components/
mv SharePanel.tsx ../../archive/components/
mv StyleStudio.tsx ../../archive/components/
mv TokenPanel.tsx ../../archive/components/
mv ViewPresets.tsx ../../archive/components/
mv WorldRemote.tsx ../../archive/components/

# Remove associated test files
mv FlightWatchPanel.test.ts ../../archive/components/ 2>/dev/null
mv LiveNewsPreviews.test.ts ../../archive/components/ 2>/dev/null
```

#### Step 0.2: Remove non-core lib files

```bash
cd frontend/src/lib/

mkdir -p ../../archive/lib

mv aoi.ts ../../archive/lib/
mv aoi.test.ts ../../archive/lib/
mv aoi-export.ts ../../archive/lib/
mv aoi-export.test.ts ../../archive/lib/
mv bulgaria-sources.ts ../../archive/lib/
mv camera-feed.ts ../../archive/lib/
mv camera-feed.test.ts ../../archive/lib/
mv camera-preview.ts ../../archive/lib/
mv camera-preview.test.ts ../../archive/lib/
mv draw.ts ../../archive/lib/
mv draw.test.ts ../../archive/lib/
mv gdeltEvents.ts ../../archive/lib/
mv malware-intel.ts ../../archive/lib/
mv malware-intel.test.ts ../../archive/lib/
mv malware-live.ts ../../archive/lib/
mv map-palette.ts ../../archive/lib/
mv map-palette.test.ts ../../archive/lib/
```

#### Step 0.3: Remove Docker and infrastructure

```bash
# From repo root
rm -f docker-compose.yml
rm -f deploy.sh
rm -f DOCKER.md
rm -f frontend/Dockerfile
rm -f frontend/.dockerignore
rm -rf frontend/nginx/
rm -rf frontend/intel/        # Express KG server — OSINT
rm -rf frontend/scratch/      # Scratch files

# Remove duplicate CI
rm -rf backend/.github/
rm -rf frontend/.github/
```

#### Step 0.4: Update .gitignore

```bash
cat >> .gitignore << 'EOF'

# Scratch and archive
scratch/
archive/
frontend/scratch/

# Large datasets (externalize)
Datasets/

# Intel server (removed)
frontend/intel/
EOF
```

#### Step 0.5: Commit

```bash
git add -A
git commit -m "cleanup: strip non-core features, focus on 4 objectives

REMOVED (14 frontend components):
- ArcGISPanel, ChainBrief, DrawHud, DrawingToolbar
- FlightWatchPanel, IntelFeed, LiveNewsPreviews
- OsintPanel, ScmPanel, SharePanel, StyleStudio
- TokenPanel, ViewPresets, WorldRemote

REMOVED (10 lib files):
- aoi, aoi-export, bulgaria-sources, camera-feed
- camera-preview, draw, gdeltEvents, malware-intel
- malware-live, map-palette

REMOVED (infrastructure):
- Docker files, nginx, intel/ Express server
- Duplicate CI workflows, scratch files

KEPT (12 core components):
- GlobeMap, OsirisMap, ShipmentInspectorPanel
- ProvenanceBadge, FeedHealthIndicator, GlobalStatusBar
- LayerPanel, LiveAlerts, SearchBar, NavigationView
- ErrorBoundary, ScaleBar

Core objectives: Logistics Optimization, Route Optimization,
Alert Indication, AI Automation"
```

---

### PHASE 1: COMPLETE FINANCIAL ENGINE (Day 2)

> **Goal:** Finish the skeleton `financial_engine.py` with real calculations.

**File:** `backend/src/nexafreight/services/financial_engine.py`

**What to implement:**
1. `calculate_sla_penalty(order, days_late)` — revenue × rate × days, capped at 10%
2. `calculate_demurrage(port, delay_days)` — tiered rates after free days
3. `calculate_freight_cost(leg)` — carrier rate × distance × weight
4. `calculate_co2_cost(leg)` — emissions × carbon price ($0.08/kg)
5. `calculate_total_impact(shipment)` — sum of all costs
6. `generate_pnl_snapshot(shipment)` — revenue minus all costs

**Dependencies:** None — this is standalone math.

**Test:** Create `tests/unit/test_financial_engine.py` with known values.

---

### PHASE 2: BUILD DISRUPTION DETECTOR (Day 3)

> **Goal:** Detect problems automatically from AIS data and port congestion.

**File:** `backend/src/nexafreight/services/disruption_detector.py`

**What to implement:**
1. `check_vessel_delay(leg_id, actual_progress)` — compare planned vs actual progress
2. `check_port_congestion()` — daily scan: today's count vs 90-day average
3. `estimate_delay_hours(disruption_type, severity)` — delay estimation

**Dependencies:** Uses existing Leg, PortDailyStat models.

**Test:** Create `tests/unit/test_disruption_detector.py` with synthetic position data.

**Worker:** Create `backend/src/nexafreight/workers/disruption_monitor.py`
- APScheduler job: runs `check_port_congestion()` daily at 06:00
- AIS deviation check: triggered by each position update

---

### PHASE 3: BUILD ALERT ENGINE (Day 4)

> **Goal:** When disruption detected, compute financial impact per order.

**File:** `backend/src/nexafreight/services/alert_engine.py`

**What to implement:**
1. `process_disruption(disruption)` — find affected shipments, compute impact
2. `compute_revised_eta(shipment, disruption)` — original ETA + delay
3. `check_sla_breaches(shipment, revised_eta)` — per-order SLA check
4. `determine_severity(exposure, breaches)` — CRITICAL/HIGH/MEDIUM/LOW
5. `create_alert(shipment, disruption, breaches, exposure)` — persist alert

**Dependencies:** Uses financial_engine (Phase 1), Disruption model.

**Test:** Create `tests/unit/test_alert_engine.py`.

**Worker:** Create `backend/src/nexafreight/workers/sla_monitor.py`
- APScheduler job: runs every 15 minutes
- Checks all IN_TRANSIT shipments for new SLA breaches

---

### PHASE 4: BUILD SLA CHECKER (Day 5)

> **Goal:** Continuous monitoring of SLA deadlines.

**File:** `backend/src/nexafreight/services/sla_checker.py`

**What to implement:**
1. `check_all_in_transit()` — scan all IN_TRANSIT shipments
2. `compute_sla_risk(order, current_eta)` — ON_TIME/LOW/MEDIUM/HIGH/BREACH
3. `escalate_unacknowledged(alert)` — auto-escalate CRITICAL past ack-SLA

**Dependencies:** Uses financial_engine, Alert model.

---

### PHASE 5: BUILD REROUTE ENGINE (Day 6-7)

> **Goal:** Generate 3 scored reroute options for each alert.

**File:** `backend/src/nexafreight/services/reroute_engine.py`

**What to implement:**
1. `generate_options(alert)` — returns 3 RerouteOption objects
2. `_create_accept_option(alert)` — Option A: accept delay
3. `_create_divert_option(alert, shipment)` — Option B: change port
4. `_create_modal_option(alert, shipment, orders)` — Option C: air freight
5. `_score_option(option, orders)` — total financial impact
6. `_find_alternative_port(port, disruption_type)` — corridor lookup

**Dependencies:** Uses financial_engine, CorridorAlternative model.

**Test:** Create `tests/unit/test_reroute_engine.py`.

---

### PHASE 6: BUILD DECISION EXECUTOR (Day 8)

> **Goal:** Execute approved reroutes — update legs, audit log.

**File:** `backend/src/nexafreight/services/decision_executor.py`

**What to implement:**
1. `execute_decision(alert_id, option_id, user_id)` — main entry point
2. `_replace_old_legs(shipment)` — mark old legs REPLACED
3. `_create_new_legs(shipment, option)` — create divert legs
4. `_increment_route_version(shipment)` — version tracking
5. `_write_audit_log(decision)` — immutable audit entry

**Dependencies:** Uses route_planner, Leg/AuditLog models.

**Test:** Create `tests/unit/test_decision_executor.py`.

---

### PHASE 7: BUILD PREDICTION ENDPOINT (Day 9)

> **Goal:** Wire ML models to API — the T-040 blocker.

**File:** Add to `backend/src/nexafreight/routers/shipments.py`

**Endpoint:** `GET /api/shipments/{id}/predict`

**What to implement:**
1. Extract features from DB for the shipment
2. Load delay classifier model
3. Get delay probability + SHAP explanations
4. Load ETA quantile models (P10/P50/P85)
5. Compute SLA risk level
6. Return structured response with provenance=DERIVED

**Dependencies:** Uses existing ML models in `/models/` directory.

---

### PHASE 8: WIRE UP API ROUTES (Day 10)

> **Goal:** Replace stub routers with real implementations.

#### alerts.py — Replace stub with:
```
GET  /api/alerts                    → list alerts (filter by status, severity)
GET  /api/alerts/{id}               → alert detail with reroute options
PATCH /api/alerts/{id}/acknowledge  → mark acknowledged
GET  /api/alerts/{id}/options       → get/generate reroute options
POST /api/alerts/{id}/approve       → approve a reroute option
```

#### disruptions.py — Replace stub with:
```
GET  /api/disruptions               → list disruptions
POST /api/disruptions               → create manual disruption
GET  /api/disruptions/{id}          → disruption detail
```

#### decisions.py — Replace stub with:
```
GET  /api/decisions                 → audit history
GET  /api/decisions/{id}            → decision detail
```

#### copilot.py — Replace stub with:
```
POST /api/copilot/ask               → AI Q&A about a shipment
```

#### analytics.py — Replace stub with:
```
GET  /api/analytics/scorecard       → KPI summary
GET  /api/analytics/financial       → P&L breakdown
GET  /api/analytics/sla             → SLA performance
GET  /api/analytics/esg             → CO₂ by mode
```

---

### PHASE 9: BUILD COPILOT (Day 11-12)

> **Goal:** AI that answers questions about shipments using real data.

**File:** `backend/src/nexafreight/services/copilot.py`

**What to implement:**
1. `build_context(shipment_id)` — gather all relevant data
2. `ask(question, context)` — send to LLM with constraints
3. `validate_response(response)` — ensure no invented data

**Context includes:**
- Shipment state (all legs, status, position)
- Active alerts + disruption details
- ML prediction (delay probability, ETA range, SHAP factors)
- Financial snapshot (revenue, margin, demurrage risk)

**Constraints:**
- Only answer from provided context
- Never invent shipment IDs, vessel names, or financial figures
- Cannot approve actions — only explain and recommend

**Dependencies:** Uses existing LLM adapters (Gemini/Ollama).

---

### PHASE 10: FRONTEND — ALERT CENTER (Day 13-14)

> **Goal:** Build the alert management UI.

**File:** `frontend/src/components/AlertCenter.tsx`

**What to build:**
1. Alert list with severity filters (CRITICAL/HIGH/MEDIUM/LOW)
2. Alert cards showing: type, shipment, exposure, breaches
3. Acknowledge button
4. "View Options" button → opens RerouteOptions modal

**File:** `frontend/src/components/RerouteOptions.tsx`

**What to build:**
1. 3 option cards (Accept, Divert, Modal Shift)
2. Each card: ETA, cost delta, breaches, CO₂, total impact
3. ⭐ AI RECOMMENDED badge on best option
4. Approve button with confirmation dialog

---

### PHASE 11: FRONTEND — SHIPMENT DETAIL (Day 15-16)

> **Goal:** Build the shipment detail view with ML predictions.

**File:** Enhance `frontend/src/components/ShipmentInspectorPanel.tsx`

**What to build:**
1. Route timeline (leg-by-leg with status)
2. ML prediction panel (delay probability, ETA range, SHAP bars)
3. Financial snapshot (revenue, costs, margin)
4. Orders table (per-order SLA status)
5. AI Copilot input

---

### PHASE 12: FRONTEND — ANALYTICS (Day 17)

> **Goal:** Build the analytics dashboard.

**File:** Create `frontend/src/components/AnalyticsDashboard.tsx`

**What to build:**
1. KPI cards (on-time %, revenue, margin, penalties)
2. CO₂ by mode chart
3. SLA performance chart
4. Demand forecast sparklines

---

### PHASE 13: INTEGRATION TESTING (Day 18-19)

> **Goal:** End-to-end flow works.

**Test scenario:**
1. Manual disruption created via POST /api/disruptions
2. Alert engine computes financial impact
3. Alert appears in frontend
4. Operator clicks "View Options" → 3 options shown
5. Operator approves Option B (Divert)
6. Decision executor updates legs
7. Map shows new route
8. Audit log entry created
9. Copilot can explain what happened

---

### PHASE 14: DEMO SCRIPT (Day 20)

> **Goal:** 10-minute demo that showcases all 4 core objectives.

**Demo flow:**
1. **[2 min]** Open dashboard → show live map with 36 moving assets
2. **[2 min]** Click a shipment → show ML prediction (73% delay risk, SHAP factors)
3. **[2 min]** Inject disruption → alert fires with $4,800 exposure
4. **[2 min]** Show 3 reroute options → approve Option B
5. **[1 min]** Map redraws with new route → audit log entry
6. **[1 min]** Ask copilot "Why was this rerouted?" → AI explains

---

## PART 3: SUMMARY

### Files to REMOVE: 24
- 14 frontend components
- 10 lib files
- Docker, nginx, intel, scratch

### Files to BUILD: 9
- `disruption_detector.py`
- `alert_engine.py`
- `sla_checker.py`
- `reroute_engine.py`
- `decision_executor.py`
- `copilot.py`
- `AlertCenter.tsx`
- `RerouteOptions.tsx`
- `AnalyticsDashboard.tsx`

### Files to COMPLETE: 4
- `financial_engine.py` (skeleton → full)
- `alerts.py` (stub → real)
- `disruptions.py` (stub → real)
- `decisions.py` (stub → real)
- `copilot.py` (stub → real)
- `analytics.py` (stub → real)
- `shipments.py` (add prediction endpoint)

### Files to KEEP AS-IS: ~30
- All models, migrations, scripts
- All feed/routing/LLM adapters
- Core frontend components (map, inspector, badges)
- Core lib files (client, http, geo, airports)

### Timeline: 20 days

| Days | Phase | Deliverable |
|------|-------|-------------|
| 1 | Cleanup | All non-core files removed |
| 2 | Financial Engine | Cost calculations complete |
| 3 | Disruption Detector | AIS deviation + port congestion |
| 4 | Alert Engine | Financial impact + SLA breaches |
| 5 | SLA Checker | Continuous monitoring |
| 6-7 | Reroute Engine | 3 scored options |
| 8 | Decision Executor | Reroute execution + audit |
| 9 | Prediction Endpoint | ML models → API |
| 10 | API Routes | All stubs replaced |
| 11-12 | Copilot | AI Q&A |
| 13-14 | Frontend: Alerts | AlertCenter + RerouteOptions |
| 15-16 | Frontend: Detail | ShipmentInspectorPanel |
| 17 | Frontend: Analytics | Dashboard |
| 18-19 | Integration Test | End-to-end flow |
| 20 | Demo Script | 10-minute walkthrough |

---

## PART 4: WHAT YOUR AGENT SHOULD DO

When you give this plan to your coding agent, tell it:

```
Follow the NexaFreight_Definitive_Plan.md step by step.

Rules:
1. Do NOT add any feature not in the plan
2. Do NOT add any dependency not already in requirements.txt
3. Do NOT modify files marked as KEEP AS-IS
4. Every service must have a corresponding unit test
5. Every API endpoint must return proper error handling
6. Every response must include provenance field
7. Use the existing database models — do not create new ones
8. Use the existing adapter pattern — do not create new adapters
9. Keep the codebase Python 3.11 compatible
10. After each phase, run `make test` to verify nothing broke
```

---

*This is the definitive plan. Follow it exactly. No scope creep. No "nice to have." Just the 4 core objectives, built properly.*
