# FRONTEND-PROMPT — Uranium Hub: Data Dashboard + Educational Process Flow

**Effort:** ~8 hours
**Tags:** frontend, uranium, dashboard, process-flow, animations, animejs
**Depends on:** BACKEND-PROMPT — Uranium SIACAM Integration

---

## Concept

Build a uranium intelligence hub at `/minerals/uranio` with two intertwined sections:

1. **Data Dashboard** — real uranium data (prices, projects, trade) animated with anime.js
2. **Educational Process Flow** — interactive 12-step uranium fuel cycle with scrollytelling

Think: Bloomberg Terminal meets an interactive museum exhibit. Dark theme, teal/amber glow accents, data-dense but approachable.

## Design System

- **Background:** #0A0A0F (near-black)
- **Card surface:** #14141A
- **Border:** #1E1E2A
- **Accent (uranium):** #00D4AA (teal glow)
- **Accent (process):** #FFB347 (amber)
- **Status green:** #4ADE80
- **Text:** #E4E4E7 / #71717A (dim)
- **Font:** Monospace for numbers, sans-serif for body

## Section 1: Hero (above the fold)

```
┌──────────────────────────────────────────────────────────────┐
│  [U] URANIO                                                   │
│                                                               │
│  $86.35 USD/lb          ▲ +2.49% (Abr 2026)                  │
│  ─────────────────────────────────────────────                │
│  Histórico: $7.10 (Ene 2001) — $136.22 (Jun 2007)            │
│  Recursos: 33,650 tU | Producción histórica: 2,600 tU        │
│                                                               │
│  [Ver gráfico completo ▼]     [Ver ciclo del combustible ▶]  │
└──────────────────────────────────────────────────────────────┘
```

**Animations:** Price counter ticks up from 0 (anime.js, easeOutExpo, 2s duration)

## Section 2: Animated Stats Row (scroll-triggered)

4 stat cards with anime.js animated counters (IntersectionObserver):

```js
// Each counter animates from 0 to its target value on scroll
anime({
  targets: '.stat-counter',
  innerHTML: val => [0, val.dataset.target],
  round: 1,
  easing: 'easeOutExpo',
  duration: 3000,
  delay: (el, i) => i * 200
});
```

| Card | Value | Tooltip |
|------|-------|---------|
| 21 Proyectos | 21 (animated) | Total uranium projects in Argentina |
| 6 Provincias | 6 (animated) | Chubut, Río Negro, Mendoza, Neuquén, Salta, Santa Cruz |
| 4 Empresas | 4 (animated) | CNEA, Blue Sky Uranium, Jaguar Uranium, UrAmérica |
| 8 Avanzados | 8 (animated) | Projects in advanced exploration, EEP or feasibility |

## Section 3: 35-Year Price Chart (animated SVG)

```
┌──────────────────────────────────────────────────────────────┐
│  PRECIO DEL URANIO — USD/lb                                   │
│                                                               │
│  $140 ┤╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │
│       │                      ╱╲                               │
│  $105 ┤                     ╱  ╲         ╱╲                  │
│       │                    ╱    ╲  ╱╲  ╱  ╲  ╱╲             │
│   $70 ┤          ╱╲      ╱      ╲╱  ╲╱    ╲╱  ╲            │
│       │        ╱  ╲╲   ╱                            ╲       │
│   $35 ┤  ╱╲  ╱    ╲ ╱                              ╲       │
│       │ ╱  ╲╱      ╲╱                                ╲      │
│    $7 ┤╱                                              ╲     │
│       └────────────────────────────────────────────────────  │
│       1990        2000        2010        2020        2026   │
│                                                               │
│  ⚠  Jun 2007: $136.22 — máximo histórico                     │
│  ⚠  Ene 2001: $7.10 — mínimo histórico                       │
│  ⚠  Fukushima 2011: caída de $65 → $19                       │
│  ⚠  2024 actual: $86.35 — reaceleración nuclear               │
└──────────────────────────────────────────────────────────────┘
```

**Animation:** SVG path "draws itself" left-to-right:
```js
anime({
  targets: '.price-chart-path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutQuad',
  duration: 4000,
  delay: 500
});
```

**Tech:** Custom SVG (not Chart.js) — 436 data points, smooth cubic bezier interpolation. Area fill fades in after the line.

## Section 4: Projects Map

```
┌──────────────────────────────────────────────────────────────┐
│  MAPA DE PROYECTOS DE URANIO                                  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                     │     │
│  │           · Salta (Don Otto)                        │     │
│  │                                                     │     │
│  │      · Neuquén (Chihuidos, Cateos)                  │     │
│  │      · Mendoza (Sierra Pintada, Corcovo, Huemules)  │     │
│  │                                                     │     │
│  │           · Río Negro (Amarillo Grande, 5 projects)  │     │
│  │                                                     │     │
│  │                · Chubut (Cerro Solo, +7 projects)   │     │
│  │                · Santa Cruz (Meseta Sirven)         │     │
│  │                                                     │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Leyenda: ● Prospección  ● Exploración inicial               │
│           ● Exploración avanzada  ● EEP  ● Factibilidad      │
│                                                               │
│  [Ver lista completa ▼]                                       │
└──────────────────────────────────────────────────────────────┘
```

**Tech:** Use Leaflet or MapLibre GL with marker clustering.
**Animation:** Markers pop in sequentially north→south:
```js
anime({
  targets: '.uranium-project-marker',
  scale: [{ value: 0 }, { value: 1.3 }, { value: 1 }],
  delay: (el, i) => 500 + i * 150,
  easing: 'easeOutBack'
});
```

## Section 5: Project Table (sortable, filterable)

| # | Proyecto | Provincia | Estado | Empresa | Origen |
|---|----------|-----------|--------|---------|--------|
| 1 | Cerro Solo | Chubut | Avanzada | CNEA | Argentina |
| 2 | Don Otto | Salta | Factibilidad | CNEA | Argentina |
| 3 | Amarillo Grande | Río Negro | Avanzada | Blue Sky Uranium | Canadá |
| 4 | Sierra Pintada | Mendoza | Factibilidad | CNEA | Argentina |
| ... | (21 total) | | | | |

**Animation:** Table rows fade-slide in staggered:
```js
anime({
  targets: '.project-row',
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 800,
  delay: (el, i) => 100 + i * 80
});
```

## Section 6: Donut + Trade Charts

**Projects by status** (donut chart with radial growth animation) + **Imports vs exports by year** (stacked bars).

## Section 7: Educational Process Flow (scrollytelling)

Full 12-step interactive cycle. See detailed spec in **URANIUM-3-educational-uranium-process-flow.md**.

Summary:
- 12 full-viewport scroll-triggered steps
- Each has an animated SVG scene, educational text in Spanish, Argentina data overlay
- Step navigation with progress dots
- Looping atom animation in the overview miniature

## API Endpoints to Call

```
GET /api/v2/minerals/uranium/summary      → hero stats, price, project counts
GET /api/v2/minerals/uranium/prices        → 436 monthly prices for chart
GET /api/v2/minerals/uranium/projects      → 21 projects for map + table
GET /api/v2/minerals/uranium/trade          → imports/exports for trade chart
GET /api/v2/minerals/uranium/prices/stats  → price statistics
```

## Acceptance Criteria

- [ ] Hero section at `/minerals/uranio` with animated price counter
- [ ] Animated 35-year price chart (SVG path drawing animation)
- [ ] Interactive map with 21 project markers (animated pop-in, colored by status)
- [ ] 4 scroll-triggered stat counters
- [ ] Sortable project table with staggered row entrance
- [ ] Projects by status donut chart (animated)
- [ ] Trade balance bar chart
- [ ] 12-step educational process flow with scrollytelling
- [ ] Spanish as default language, English toggle
- [ ] Dark theme matching existing minerals design system
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Mobile responsive
- [ ] anime.js version 4+

## What to Skip

- Do NOT build a separate page for each step — single page, scroll
- Do NOT use a charting library for the main price chart — custom SVG + anime.js
- Do NOT add 3D or WebGL
- Do NOT handle PDF export
- Do NOT build admin/editing UI for educational content (it's static content)

## Key Libraries

- `animejs` (npm: `animejs`) — all animations
- Leaflet or MapLibre GL — map
- Intersection Observer API — scroll triggers (native, no library)
