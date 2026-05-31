# MINERAL-004 — Trade Flow Sankey Diagram

**Effort:** ~4 hours
**Tags:** frontend, trade, sankey, visualization, siacam

---

## Objective

Build an interactive Sankey diagram visualizing Argentina's mineral trade flows. The user selects a commodity (Uranio, Oro, Cobre, Litio, Plata, etc.) and sees a flow: exporting countries → Argentina → importing countries, with trade values as flow thickness.

## Data Source

SIACAM trade datasets already available at `data-pipeline/out_uranium_siacam/normalized/` for uranium, and the same pattern exists for all other minerals in the SIACAM pipeline. The trade CSVs have year, country, value_usd, trade_type (import/export), mineral/commodity fields.

## Backend

```
GET /api/v2/minerals/trade/flow?mineral=Uranio&year=2024
  → {
      mineral: "Uranio",
      year: 2024,
      imports: [
        { country: "Canadá", value_usd: 29747 },
        { country: "Alemania", value_usd: 965 },
        ...
      ],
      exports: [
        { country: "Reino Unido", value_usd: 1500 },
        ...
      ],
      total_import_usd: number,
      total_export_usd: number,
      balance_usd: number
    }
```

## Frontend

A full-viewport section on the minerals dashboard (or a dedicated `/minerals/comercio` page) with:

- **Commodity selector** — dropdown with all minerals
- **Year slider** — 1994 → current, with play/pause auto-advance
- **Sankey diagram** — 3 columns: Orígenes → Argentina → Destinos
- **Top N toggle** — show top 5/10/all countries
- **Balance indicator** — deficit/surplus badge
- **Anime.js animations** — flows animate on year change, nodes pulse on hover

## Acceptance Criteria

- [ ] Sankey renders correctly for uranium trade across all available years
- [ ] Works for all minerals in the SIACAM trade dataset
- [ ] Year slider with auto-play
- [ ] Country tooltips on hover with exact values
- [ ] Responsive (collapses to horizontal bar chart on mobile)

## What to Skip

- Do NOT build a full ETL for trade data — use existing normalized output
- Do NOT add real-time updates (data is monthly, re-seed on pipeline run)
