# URANIUM-1: Data Pipeline — CNEA + SIACAM Uranium Data Ingestion

**Effort:** ~4 hours
**Priority:** High
**Labels:** data-pipeline, uranium, cnea, siacam

---

## Objective

Build a multi-stage data pipeline that scrapes, extracts, normalizes, and serves all available uranium data from CNEA informational pages and the SIACAM (Secretaría de Minería) open data platform. Output is consumed by URANIUM-2 for frontend visualization.

## Data Sources Discovered

### 1. CNEA Informational Pages (narrative/contextual)
| URL | Content |
|-----|---------|
| `/cnea/tn/mineria-del-uranio` | Landing page with links to sub-pages |
| `/cnea/tecnologia-nuclear/mineria-del-uranio/que-es-el-uranio` | Uranium properties, isotopes, applications |
| `/cnea/tecnologia-nuclear/mineria-del-uranio/exploracion-de-uranio` | Exploration history, 33,650 tU resources, mentions "mapa interactivo" |
| `/cnea/tecnologia-nuclear/mineria-del-uranio/produccion-de-uranio` | Production process flow (mining → crushing → leaching → concentration → precipitation → conversion) |
| `/cnea/tecnologia-nuclear/mineria-del-uranio/remediacion-ambiental-de-la-mineria-del-uranio` | 7 remediation sites across 6 provinces (Mendoza, Córdoba, San Luis, La Rioja, Salta, Chubut) |
| `/cnea/tecnologia-nuclear/mineria-del-uranio/recursos-de-uranio-identificados-en-argentina` | Embedded interactive map (likely Tableau/PowerBI) |

**Key stats from text:**
- 33,650 tU identified resources (recoverable < USD 130/kgU)
- 2,600 tU produced between 1952-1997
- 13 historical uranium deposits across Argentina
- 7 production centers + 1 pilot plant
- Last production: 1997 (Sierra Pintada/Mendoza)
- 7 remediation sites in 6 provinces

### 2. SIACAM — Cartera de Proyectos Mineros (structured data)
**Package:** `mineria-cartera-proyectos-mineros-argentina-siacam`
**URL:** `https://www.mecon.gob.ar/dataset/Cartera-de-Proyectos-Mineros-Metaliferos-y-Litio-del-SIACAM.xlsx`

**21 uranium projects found** with the following schema:

| Field | Description |
|-------|-------------|
| N° | Project number |
| NOMBRE | Project name |
| LATITUD | Decimal latitude |
| LONGITUD | Decimal longitude |
| MINERAL PRINCIPAL | "Uranio" |
| PROVINCIA | Province |
| ESTADO | Project stage |
| CONTROLANTE (1°) | Controller company |
| PORCENTAJE (1°) | Ownership % |
| ORIGEN (1°) | Country of origin |

**Complete list of uranium projects:**

| # | Name | Province | Status | Controller |
|---|------|----------|--------|------------|
| 1 | Amarillo Grande (Anit, Sta. Bárbara) | Río Negro | Exploración avanzada | Blue Sky Uranium Corp. (Canadá) |
| 2 | Arroyo Perdido | Chubut | Exploración inicial | CNEA (Argentina) |
| 3 | Cateos | Neuquén | Prospección | — |
| 4 | Catriel (Mari) | Río Negro | Exploración inicial | CNEA (Argentina) |
| 5 | Cerro Solo | Chubut | Exploración avanzada | CNEA (Argentina) |
| 6 | Chihuidos | Neuquén | Exploración inicial | Blue Sky Uranium Corp. (Canadá) |
| 7 | Corcovo | Mendoza | Exploración inicial | Blue Sky Uranium Corp. (Canadá) |
| 8 | Don Otto | Salta | Factibilidad | CNEA (Argentina) |
| 9 | Hope | Chubut | Prospección | — |
| 10 | Huemules | Mendoza | Exploración inicial | Jaguar Uranium Corp. (Canadá) |
| 11 | Ivana (Amarillo Grande) | Río Negro | EEP | Blue Sky Uranium Corp. (Canadá) |
| 12 | Kaia | Río Negro | Prospección | — |
| 13 | Lago Seco | Chubut | Prospección | — |
| 14 | Laguna Colorada | Chubut | Exploración avanzada | CNEA (Argentina) |
| 15 | Laguna Salada | Chubut | EEP | Jaguar Uranium Corp. (Canadá) |
| 16 | Lucho U | Río Negro | Prospección | Lucero Claudio (Unipersonal) |
| 17 | Meseta Central | Chubut | Exploración avanzada | UrAmérica Ltd. (Reino Unido) |
| 18 | Meseta Sirven (Laguna Sirve) | Santa Cruz | Exploración inicial | CNEA + Fomicruz S.E. (Argentina) |
| 19 | Sierra Cuadrada | Chubut | Prospección | CNEA (Argentina) |
| 20 | Sierra Pintada | Mendoza | Factibilidad | CNEA (Argentina) |
| 21 | (1 unnamed, N°205 likely missing) | — | — | — |

**Status stages:** Prospección → Exploración inicial → Exploración avanzada → Evaluación Económica Preliminar (EEP) → Factibilidad

### 3. SIACAM — Uranium Prices (structured data)
**Package:** `mineria-precios-internacionales-minerales-siacam`
**URL:** `https://www.mecon.gob.ar/dataset/precios-internacionales-minerales.xlsx`
**Sheet:** Sheet1 — 436 rows of uranium data

**Schema:**
- Año, Mes, Fecha (e.g. "1990M01")
- Precio (decimal)
- Mineral = "Uranio (U)"
- Unidad de medida = "Dólar por Libra (USD/lb)"
- Numero Índice

**Coverage:** Monthly, January 1990 — April 2026 (latest data available)
**Range:** $7.13/lb (Nov 2000) → $136.22/lb (Jun 2007 all-time high)
**Current:** $86.35/lb (Apr 2026)

**Price index also available** for the full 436-month series.

### 4. SIACAM — Uranium Trade Data (structured data)
**Package:** `mineria-comercio-minerales-argentina-siacam`
**Export URL:** `https://www.mecon.gob.ar/dataset/Comercio/expominerales-siacam.csv`
**Import URL:** `https://www.mecon.gob.ar/dataset/Comercio/impominerales-siacam.csv`

**Schema for imports:**
- ANYO (year), ORIGEN (country), PPRO (product code), PROCEDENC (origin), MES (month), GRUPO (product group = "Uranio"), SECTOR (="Metaliferos"), CIF (import value)

**Uranium imports** confirmed from: Estados Unidos, Canadá, Alemania and others since 1994.
**Uranium exports** also available (same schema with FOB values).

### 5. Mining Projects Geospatial Data
**Package:** `energia-proyectos-mineros-ubicacion-aproximada`
**CSV URL:** `http://datos.energia.gob.ar/dataset/05ceffb0-98f3-462b-98f9-96d655f76cef/resource/0c8317ac-eacb-4826-b7e7-8f0a15a62ac1/download/proyectos-mineros-ubicacin-aproximada-.csv`
**SHP URL:** ZIP with shapefile

### 6. Tableau Dashboard (reference)
`https://public.tableau.com/app/profile/sec.mineria/viz/ProyectosMineros/Dashproyectos`

---

## Pipeline Stages

### Stage 1 — Raw Snapshots
- [ ] **S1.1** Download SIACAM XLSX (projects portfolio) → `raw/siacam_proyectos.xlsx` + SHA256
- [ ] **S1.2** Download SIACAM XLSX (prices) → `raw/siacam_precios.xlsx` + SHA256
- [ ] **S1.3** Download SIACAM CSVs (trade: exports + imports) → `raw/siacam_exportaciones.csv`, `raw/siacam_importaciones.csv`
- [ ] **S1.4** Download mining projects geospatial CSV → `raw/proyectos_mineros_ubicacion.csv`
- [ ] **S1.5** Scrape CNEA informational pages → `raw/cnea_mineria_uranio_{page}.txt`

### Stage 2 — Extraction & Staging
- [ ] **S2.1** Parse XLSX → filter only "Uranio" rows → `staging/uranium_projects.csv`
      Fields: project_id, name, latitude, longitude, province, status, controller, origin_country
- [ ] **S2.2** Parse XLSX prices → filter Uranio → `staging/uranium_prices.csv`
      Fields: date, price_usd_per_lb, mineral, unit
- [ ] **S2.3** Filter trade CSVs for GRUPO="Uranio" → `staging/uranium_imports.csv`, `staging/uranium_exports.csv`
- [ ] **S2.4** Parse CNEA text → extract structured facts → `staging/cnea_facts.json`
      Key facts: total_resources_tU (33,650), historical_production_tU (2,600), production_years (1952-1997), last_production_year (1997), sites, provinces

### Stage 3 — Normalization
- [ ] **S3.1** Normalize statuses to English slugs:
      - Prospección → prospection
      - Exploración inicial → early_exploration
      - Exploración avanzada → advanced_exploration
      - Evaluación Económica Preliminar → preliminary_economic_assessment
      - Factibilidad → feasibility
- [ ] **S3.2** Normalize province names (standarized to ISO-like codes)
- [ ] **S3.3** Generate `normalized/uranium_projects.json` — JSONB-ready for variable-schema
- [ ] **S3.4** Generate `normalized/uranium_prices.json` — time-series ready for `fact_prices` table
- [ ] **S3.5** Generate `normalized/uranium_trade.json` — imports + exports aggregated by year/country

### Stage 4 — Aggregates
- [ ] **S4.1** Projects by status & province → `aggregates/projects_by_status_province.json`
- [ ] **S4.2** Projects by controller origin → `aggregates/projects_by_origin.json`
- [ ] **S4.3** Price stats (min, max, avg by year/decade) → `aggregates/price_statistics.json`
- [ ] **S4.4** Trade balance (imports - exports) by year → `aggregates/trade_balance.json`

---

## Data Shape: Backend Models

### Projects Collection (JSONB — variable schema per commodity)
```typescript
interface UraniumProject {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
  province: string;
  province_code: string;     // e.g. "RN", "CT", "MZ"
  status: string;            // normalized slug
  status_label: string;      // Spanish display name
  controllers: Array<{
    name: string;
    ownership_pct?: number;
    origin_country: string;
  }>;
  mineral: "Uranio";
  created_at: string;
  updated_at: string;
  source: "siacam";
  source_url: string;
}
```

### Prices Time-Series (relational — `fact_prices`)
```sql
CREATE TABLE fact_prices (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  mineral VARCHAR(50) NOT NULL,  -- 'Uranio'
  price_usd DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,     -- 'USD/lb'
  source VARCHAR(50) NOT NULL,   -- 'siacam'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fact_prices_mineral_date ON fact_prices(mineral, date);
```

### Trade Data
```sql
CREATE TABLE fact_trade_minerals (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  trade_type VARCHAR(10) NOT NULL,  -- 'import' | 'export'
  mineral VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  value_usd DECIMAL(12,2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Acceptance Criteria

- [ ] Pipeline script `run.py` in `petroldata.ar/data-pipeline/uranium/` with checkpoint/resume
- [ ] All 6 data sources have raw snapshots with checksums
- [ ] Normalized JSON output in `petroldata.ar/data-pipeline/uranium/out/normalized/`
- [ ] Aggregate JSON output in `petroldata.ar/data-pipeline/uranium/out/aggregates/`
- [ ] `out/latest.json` — lightweight JSON for dashboard consumption (current price + project summary)
- [ ] All errors logged to `logs/pipeline.log`
- [ ] Backend seed scripts generated pointing to the out CSVs

## What to Skip

- Do NOT attempt to scrape the embedded Tableau/PowerBI map on the recursos page — use the SIACAM XLSX instead
- Do NOT scrape remediation site pages individually beyond what's in `cnea_facts.json`
- Do NOT build an API endpoint yet — this ticket is data pipeline only
- Do NOT download the SHP file unless a map layer is specifically needed

## Dependencies

- Python 3.10+
- openpyxl (for XLSX parsing)
- httpx or requests
- `petroldata.ar/data-pipeline/` infrastructure (checkpoint directory, logging pattern)
