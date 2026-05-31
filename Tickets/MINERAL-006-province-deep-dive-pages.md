# MINERAL-006 — Province Deep-Dive Pages

**Effort:** ~6 hours
**Tags:** backend, frontend, provinces, regional, data

---

## Objective

Build per-province intelligence pages at `/provincias/{slug}` showing all mining activity in that province. Projects, commodities, production, employment, trade, and remediation data — one page per province.

## Provinces to Cover

From existing data across all pipeline outputs:

| Province | Key Commodities | Known Projects |
|----------|----------------|----------------|
| **Chubut** | Uranio, Oro, Plata | Cerro Solo, Laguna Colorada, Meseta Central + |
| **Río Negro** | Uranio | Amarillo Grande, Catriel, Ivana + |
| **Mendoza** | Uranio | Sierra Pintada, Corcovo, Huemules |
| **Salta** | Litio, Uranio | Don Otto + litio projects |
| **Neuquén** | Uranio, Petróleo | Chihuidos, Cateos |
| **Santa Cruz** | Oro, Plata, Uranio | Meseta Sirven + gold/silver |
| **San Juan** | Oro, Cobre | Existing pipeline projects |
| **Catamarca** | Litio, Cobre | Existing pipeline projects |
| **Jujuy** | Litio | Existing pipeline projects |
| *Total: 23 provinces + CABA*

## API Endpoints

```
GET /api/v2/provinces
  → [{ slug, name, project_count, commodities: string[], total_resources? }]

GET /api/v2/provinces/{slug}
  → {
      name,
      iso_code,              // "CT", "RN", "MZ", etc.
      project_count,
      commodities: [{
        name: string,
        project_count: number,
        total_resources?: { value, unit }
      }],
      projects: [{
        name, status, commodity, controllers,
        coordinates, resources_summary
      }],
      trade_stats?: {
        major_exports: string[],
        employment?: number
      },
      active_mines: number,
      exploration_projects: number,
      companies_operating: string[]
    }
```

## Frontend: Province Detail Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  CHUBUT                                                       │
│  Patagonia · 8 proyectos · 2 empresas                        │
│                                                               │
│  [ANIMATED COUNTERS]                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  8       │ │  3       │ │  2       │ │  1       │        │
│  │Proyectos │ │Avanzados │ │Empresas  │ │En Remed.│        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                               │
│  [MAP — province focused]                                     │
│  Projects plotted, colored by commodity + status              │
│                                                               │
│  [COMMODITY BREAKDOWN]                                        │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Uranio: 8 proyectos                                 │     │
│  │  ████████████████████████████████████░░░░  78%       │     │
│  │                                                       │     │
│  │  Estado:  Prospección ██  |  Inicial ██  |  Avanz. ██│     │
│  └──────────────────────────────────────────────────────┘     │
│                                                               │
│  [PROJECT LIST]                                                │
│  ┌─────┬──────────────┬──────────┬────────────┬────────────┐ │
│  │  #  │ Proyecto     │ Mineral  │ Estado     │ Empresa    │ │
│  ├─────┼──────────────┼──────────┼────────────┼────────────┤ │
│  │  1  │ Cerro Solo   │ Uranio   │ Avanzada   │ CNEA       │ │
│  │  2  │ Laguna Color.│ Uranio   │ Avanzada   │ CNEA       │ │
│  │  3  │ Meseta Cent. │ Uranio   │ Avanzada   │ UrAmérica  │ │
│  │  4  │ Laguna Salada│ Uranio   │ EEP        │ Jaguar     │ │
│  │  5  │ Arroyo Perd. │ Uranio   │ Inicial    │ CNEA       │ │
│  │ ... │              │          │            │            │ │
│  └─────┴──────────────┴──────────┴────────────┴────────────┘ │
│                                                               │
│  [ENVIRONMENTAL / REMEDIATION SITES]                          │
│  ● Activo: Sierra Pintada style remediation                   │
│  ● Sites in province as per CNEA data                         │
│                                                               │
│  [NAVIGATION]                                                  │
│  ← Mendoza  |  Río Negro →  |  Ver todos los proyectos       │
└──────────────────────────────────────────────────────────────┘
```

## Data Sources

- `data-pipeline/out_uranium_siacam/normalized/uranium_projects.json` — uranium projects by province
- Existing pipeline outputs for gold/silver/copper/lithium projects
- SIACAM trade data for province-level export info
- CNEA facts for remediation sites per province

## Acceptance Criteria

- [ ] Province list page at `/provincias` with grid/map of all 6+ active provinces
- [ ] Each province page shows all projects + commodities + stats
- [ ] Province-to-province navigation (prev/next)
- [ ] Map centered on province with all project markers
- [ ] Commodity breakdown bar for each province
- [ ] Linked to company pages and project pages
- [ ] All counters animated with anime.js

## What to Skip

- Do NOT add population/demographic data
- Do NOT add road/infrastructure layers to map
- Do NOT scrape province government sites for additional data
