# petrodata

Argentina-focused resources tracker — oil, gas, minerals, and rare-earths. A monorepo with a Python extraction pipeline, a NestJS API over the resulting production data, and a Next.js + Payload CMS frontend.

## Architecture

```
┌────────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   data-pipeline/   │    │     backend/     │    │     frontend/      │
│                    │    │                  │    │                    │
│  PDF reports       │    │  NestJS + Prisma │    │  Next.js 16        │
│   ↓ Mistral OCR    │    │   ↓ /api/v1/*    │    │   + Payload CMS    │
│   ↓ deterministic  │    │   ↓ Swagger docs │    │   + Tailwind v4    │
│      markdown      │    │   ↓ GeoJSON      │    │   + MapLibre       │
│      parser        │    │                  │    │                    │
│   ↓ JSON + CSV     │    │   Postgres       │    │   Reads backend    │
│                    │    │   (Neon/local)   │    │   via openapi.json │
└────────────────────┘    └──────────────────┘    └────────────────────┘
       Python (uv)            Node 20+ (pnpm)         Node 20+ (pnpm)
```

The pipeline produces validated per-project JSON for mining fact sheets. The backend serves Vaca Muerta oil & gas production data ingested from Argentine government CSVs. The frontend consumes the backend's OpenAPI surface and renders dashboards, maps, and editorial content.

## Layout

| Path             | What it is                                                                                                                | Stack                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `backend/`       | REST API exposing `/api/v1/*` — production facts, operators, wells, GeoJSON, data-freshness. See [backend README](backend/README.md).                 | NestJS 11 · Prisma 6 · Postgres · Swagger                                            |
| `frontend/`      | Public site and admin panel for petrodata. Generates typed clients from `backend/openapi.json`.                            | Next.js 16 · React 19 · Payload 3 · Tailwind v4 · MapLibre · Recharts                |
| `data-pipeline/` | One-record-per-project extraction from large PDF mining reports (gold, silver, uranium, copper, lithium). See [pipeline README](data-pipeline/README.md). | Python · uv · Mistral OCR (stage 3a only) · deterministic markdown parser            |

## Quick start

Requires: Node `>=20.9`, pnpm `>=9`, Python `3.11+` (managed by `uv`), and a Postgres instance.

### 1. Backend

```bash
cd backend
pnpm install
cp .env.example .env          # set DATABASE_URL, CSV_DATA_DIR, EIA_API_KEY
pnpm prisma migrate dev       # create tables
pnpm db:seed                  # load CSVs (~1–2 min)
pnpm start:dev                # → http://localhost:3001/api/v1
```

Swagger UI at <http://localhost:3001/api/v1/docs>. Regenerate the spec with `pnpm openapi:export` whenever the API surface changes.

### 2. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env          # set PAYLOAD_SECRET, DATABASE_URL, NEXT_PUBLIC_API_BASE_URL
pnpm api:types                # regenerate ./src/api/types.ts from backend openapi.json
pnpm dev                      # → http://localhost:3000
```

The first run prompts you to create an admin user at `/admin`.

### 3. Data pipeline

```bash
cd data-pipeline
uv sync                       # installs pinned Python + deps
export MISTRAL_API_KEY=...    # only needed for stage 3a (OCR)

# full run on one PDF, fixed 3-pages-per-project
uv run run.py --pdf portfolio_uranium_2026.pptx.pdf --out out_uranium/ \
              --strategy fixed --pages-per-project 3 --workers 4 --long
```

Outputs land in `out_<commodity>/projects.json` (clean) and `review_queue.json` (rejected with reasons). Re-iterate the parser without re-OCR via `--reparse-only`. See the [pipeline README](data-pipeline/README.md) for stage-by-stage details.

## Data flow

```
Argentine Secretaría de Energía CSVs ──► backend Prisma seed ──► Postgres ──► /api/v1/*
                                                                                  │
PDF mining fact sheets ──► data-pipeline ──► projects.json ──► (TODO: ingest)     ▼
                                                                          frontend dashboards
```

The pipeline's `projects.json` is the source of truth for mining-project records; the frontend surfaces both that data and the backend's well/production data on a single map and detail pages.

## Repo conventions

- **Package managers:** `pnpm` for Node, `uv` for Python. Do not mix.
- **Env files:** `.env` is gitignored everywhere. Each app ships a `.env.example` with dummy values — copy and fill in.
- **OpenAPI as contract:** `backend/openapi.json` is committed. The frontend regenerates `src/api/types.ts` from it; never hand-edit the types file.
- **Coordinates:** decimal degrees, S/W negative.
- **Schema source of truth:** `data-pipeline/schema.py` for mining projects; `backend/prisma/schema.prisma` for production data.

## License

UNLICENSED — private project.
