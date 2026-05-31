# MINERAL-005 — Company Intelligence Pages

**Effort:** ~6 hours
**Tags:** backend, frontend, companies, projects, portfolio

---

## Objective

Build per-company intelligence pages at `/companies/{slug}` showing each company's full project portfolio across all commodities in Argentina, with project timeline, resource totals, and corporate profile.

## Companies to Cover (from existing data)

| Company | Projects | Origin |
|---------|----------|--------|
| **CNEA** | Cerro Solo, Sierra Pintada, Don Otto, Laguna Colorada, Catriel, Arroyo Perdido, Meseta Sirven, Sierra Cuadrada (8 uranium) | Argentina |
| **Blue Sky Uranium Corp.** | Amarillo Grande (Anit/Ivana), Corcovo, Chihuidos (4 uranium) | Canadá |
| **Jaguar Uranium Corp.** | Laguna Salada, Huemules (2 uranium) | Canadá |
| **UrAmérica Ltd.** | Meseta Central (1 uranium) | Reino Unido |
| **Fomicruz S.E.** | Meseta Sirven (co-participation with CNEA) | Argentina |

Plus extend to all companies across all minerals (Glencore, Newmont, Barrick, etc. from the existing pipeline data).

## API Endpoints

```
GET /api/v2/companies
  → [{ slug, name, origin_country, project_count, commodities, image_url? }]

GET /api/v2/companies/{slug}
  → {
      name, origin_country, description?,
      projects: [{
        name, commodity, province, status,
        coordinates: { lat, lng },
        resources_summary: { total_tonnage, grade }
      }],
      total_projects: number,
      commodities_involved: string[],
      provinces: string[],
      project_timeline: [{ stage, date? }]
    }
```

## Frontend: Company Detail Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  CNEA                                                         │
│  Comisión Nacional de Energía Atómica                        │
│  Argentina · Estatal                                          │
│                                                               │
│  8 proyectos · 4 provincias · Uranio                          │
├──────────────────────────────────────────────────────────────┤
│  [ANIMATED COUNTERS]                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  8       │ │  2       │ │  4       │ │  33,650  │        │
│  │Proyectos │ │En Factib.│ │Provincias│ │tU Recursos│        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                               │
│  [PROJECT PORTFOLIO MAP]                                      │
│  All projects plotted, color-coded by status                  │
│                                                               │
│  [PROJECT LIST — sortable table]                              │
│  ┌─────┬──────────────┬──────────┬────────────┬────────────┐ │
│  │  #  │ Proyecto     │ Provincia│ Estado     │ Recurso    │ │
│  ├─────┼──────────────┼──────────┼────────────┼────────────┤ │
│  │  1  │ Cerro Solo   │ Chubut   │ Avanzada   │ 35.4 MLbs  │ │
│  │  2  │ Don Otto     │ Salta    │ Factibilidad│ 12.8 MLbs │ │
│  │ ... │              │          │            │            │ │
│  └─────┴──────────────┴──────────┴────────────┴────────────┘ │
│                                                               │
│  [TIMELINE]                                                   │
│  Project progression through stages over years                │
│                                                               │
│  [QUICK FACTS]                                                │
│  ● Created in 1950                                            │
│  ● Responsible for uranium exploration, production, remediation│
│  ● First yellowcake produced in 1952 (Córdoba)                │
│  ● Manages 7 active remediation sites                         │
└──────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

- [ ] Company list page at `/companies` with search/filter
- [ ] Company detail page at `/companies/{slug}` with full portfolio
- [ ] Map showing all projects for that company
- [ ] Project table sortable by status, province, resource size
- [ ] Timeline view of project progression
- [ ] Links between company pages and project pages (bidirectional)
- [ ] anime.js stat counters for company-level aggregates

## What to Skip

- Do NOT build company logos/scraping — use first-letter avatars
- Do NOT add financial data about companies (beyond what's in mining pipeline)
