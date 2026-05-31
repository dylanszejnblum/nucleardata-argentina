# BACKEND-PROMPT — Uranium: SIACAM Data Integration

**Effort:** ~3 hours
**Tags:** backend, uranium, siacam, prices, trade, seed
**Depends on:** Pipeline output at `data-pipeline/out_uranium_siacam/`

---

## What Changed

A new data pipeline (`pipeline_uranium_siacam.py`) ingests uranium data from the SIACAM (Secretaría de Minería) open data platform + CNEA (Comisión Nacional de Energía Atómica). Output is in `data-pipeline/out_uranium_siacam/`.

## What to Build

### 1. New Model: UraniumProject

Use the same JSONB pattern as existing minerals. Schema:

```typescript
interface UraniumProject {
  name: string
  coordinates: { lat: number; lng: number }
  province: string
  province_code: string      // "RN", "CT", "MZ", "SA", "NQ", "SC"
  status: string             // normalized slug: prospection|early_exploration|advanced_exploration|preliminary_economic_assessment|feasibility
  status_label: string       // Spanish display name
  controllers: Array<{
    name: string
    ownership_pct?: string
    origin_country: string
  }>
  mineral: string            // "Uranio"
}
```

**Data sources:**
- Primary: `out_uranium_siacam/normalized/uranium_projects.json`
- Fields: `projects[].project_name`, `latitude`, `longitude`, `province`, `province_code`, `status`, `status_label`, `controllers`

**Seed script** reads `uranium_projects.json` and inserts into the `UraniumProject` collection.

### 2. New Model: UraniumPrice

Time-series, monthly data. Relational table.

```sql
CREATE TABLE uranium_prices (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,              -- first of month, e.g. 2026-04-01
  price_usd DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'USD/lb',
  year INTEGER,
  month INTEGER,
  source VARCHAR(50) DEFAULT 'siacam',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_uranium_prices_date ON uranium_prices(date);
```

**Data sources:**
- `out_uranium_siacam/normalized/uranium_prices.json`
- 436 monthly data points from 1990-01 to 2026-04
- Price statistics on the JSON include min/max/current/decade averages

### 3. New Model: UraniumTrade

```sql
CREATE TABLE uranium_trade (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  trade_type VARCHAR(10) NOT NULL,        -- 'import' | 'export'
  country VARCHAR(100) NOT NULL,
  value_usd DECIMAL(14,2) NOT NULL,
  source VARCHAR(50) DEFAULT 'siacam',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_uranium_trade_year ON uranium_trade(year, trade_type);
```

**Data sources:**
- `out_uranium_siacam/normalized/uranium_imports.json` — 214 records
- `out_uranium_siacam/normalized/uranium_exports.json` — 167 records

### 4. New Model: UraniumFact (or include in existing fact schema)

```typescript
interface UraniumFact {
  key: string     // 'total_resources_tU', 'historical_production_tU', etc.
  value: number | string | string[]
  label: string   // Human-readable in Spanish
  unit?: string   // 'tU', 't', etc.
}
```

**Data source:**
- `out_uranium_siacam/normalized/uranium_facts.json`

### 5. API Endpoints

```
GET /api/v2/minerals/uranium/projects
  → { count: number, projects: UraniumProject[] }

GET /api/v2/minerals/uranium/prices
  → { count: number, prices: UraniumPrice[] }   // supports ?from=&to= query params

GET /api/v2/minerals/uranium/prices/stats
  → { current, allTimeHigh, allTimeLow, decadeAverages }

GET /api/v2/minerals/uranium/trade
  → { imports: UraniumTrade[], exports: UraniumTrade[] }   // supports ?year= filter

GET /api/v2/minerals/uranium/summary
  → { currentPrice, totalResources, historicalProduction, projectsByStatus, projectsByProvince, priceStats }
  // Combined snapshot from latest.json
```

### 6. Seed Script

Write a seed script at `backend/seed/seed-uranium-siacam.ts`:
```typescript
// Pseudocode
async function seedUranium() {
  // 1. Read all JSON files from data-pipeline/out_uranium_siacam/normalized/
  // 2. Upsert UraniumProjects
  // 3. Upsert UraniumPrices
  // 4. Upsert UraniumTrade
  // 5. Upsert UraniumFacts
}
```

## Acceptance Criteria

- [ ] All 4 models created with correct schema
- [ ] Seed script idempotent (can re-run safely)
- [ ] All 5 API endpoints return correct data
- [ ] `/summary` endpoint matches `data-pipeline/out_uranium_siacam/latest.json`
- [ ] Price endpoint supports date range filtering (`?from=2020-01-01&to=2025-12-01`)
- [ ] Project endpoint supports filtering by province and status (`?province=Chubut&status=advanced_exploration`)

## What to Skip

- Do NOT create a separate database — use existing minerals PostgreSQL
- Do NOT add auth for these endpoints (same auth as rest of minerals API)
- Do NOT create a new NestJS module — extend existing minerals module
- Do NOT handle real-time updates (data is monthly, re-seed on pipeline re-run)

## Pipeline Output Reference

```
data-pipeline/out_uranium_siacam/
├── normalized/
│   ├── uranium_projects.json    # 21 projects
│   ├── uranium_prices.json      # 436 monthly prices
│   ├── uranium_imports.json     # 214 import records
│   ├── uranium_exports.json     # 167 export records
│   └── uranium_facts.json       # CNEA narrative facts
├── aggregates/
│   ├── project_aggregates.json  # By status, province, company
│   └── price_statistics.json    # Decade averages, min/max/current
├── staging/
│   └── *.csv                    # Staging CSVs
└── latest.json                  # Dashboard-ready snapshot
```
