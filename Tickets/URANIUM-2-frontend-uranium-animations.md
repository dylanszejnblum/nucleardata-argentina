# URANIUM-2 — Frontend: Uranium Hub with Anime.js Animations

**Effort:** ~6 hours
**Priority:** Medium
**Labels:** frontend, uranium, anime-js, visualization, wow-factor
**Depends on:** URANIUM-1 (data pipeline)

---

## Objective

Build a dedicated uranium intelligence page within the minerals dashboard. Data-dense, dark theme, Bloomberg Terminal × Linear aesthetic. Powered by anime.js for smooth, production-quality animations.

## Data Sources (from URANIUM-1 pipeline)

| Endpoint | Data | Format |
|----------|------|--------|
| `GET /api/v2/minerals/prices?mineral=Uranio` | Monthly uranium price 1990-present | Time series (date, price_usd) |
| `GET /api/v2/minerals/projects?mineral=Uranio` | 21 uranium projects with GPS + status | JSON array |
| `GET /api/v2/minerals/trade?mineral=Uranio&type=import/export` | Uranium trade by year/country | JSON array |
| `GET /api/v2/minerals/projects/summary` | Aggregated: by status, province, origin | JSON |
| `GET /api/v2/minerals/prices/stats` | Min/max/avg per decade | JSON |

## Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  URANIO  [U]  86.35 USD/lb  ▲ +2.1%  (Apr 2026)           │
│  ────────────────────────────────────────────────────────   │
│  Rango histórico: $7.13 (Nov 2000) — $136.22 (Jun 2007)    │
│  Recursos identificados: 33,650 tU | Producción histórica: 2,600 tU │
├──────────────────────┬───────────────────────────────────────┤
│                      │                                       │
│  [ANIMATED PRICE     │  [PROJECTS MAP — Leaflet/MapLibre]    │
│   CHART]             │                                       │
│                      │  21 proyectos de uranio               │
│  Línea de precios    │  Marcadores animados por status:      │
│  mensuales desde     │  ● Prospección · ● Explor. inicial    │
│  1990 con efecto     │  ● Explor. avanzada · ● EEP           │
│  de "dibujo" al      │  ● Factibilidad                        │
│  cargar página       │                                       │
│                      │  Hover: nombre + empresa + status     │
│                      │  Click: abre modal con detalle        │
├──────────────────────┴───────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │  21     │ │  7      │ │  4      │ │  2      │            │
│  │PROYECTOS│ │PROVINCIAS│ │EMPRESAS │ │EN FASE  │            │
│  │         │ │         │ │         │ │AVANZADA │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│              (animated counters on scroll)                    │
├──────────────────────────────────────────────────────────────┤
│  [TRADE BALANCE]                [PROJECTS BY STATUS]         │
│  ┌──────────────────────┐       ┌──────────────────────┐     │
│  │ Barras stacked:      │       │ Donut chart:         │     │
│  │ imports vs exports   │       │ Prospección 25%      │     │
│  │ por año, uranio      │       │ Explor. inicial 30%  │     │
│  │ con entrada animada  │       │ Explor. avanzada 20% │     │
│  │                      │       │ EEP 10%              │     │
│  │                      │       │ Factibilidad 15%     │     │
│  └──────────────────────┘       └──────────────────────┘     │
├──────────────────────────────────────────────────────────────┤
│  [PROJECT TABLE — sortable/filterable]                       │
│  ┌─────┬──────────────┬──────────┬────────────┬────────────┐│
│  │  #  │ Proyecto     │ Provincia│ Estado     │ Empresa    ││
│  ├─────┼──────────────┼──────────┼────────────┼────────────┤│
│  │  1  │ Cerro Solo   │ Chubut   │ Avanzada   │ CNEA       ││
│  │  2  │ Don Otto     │ Salta    │ Factibilidad│ CNEA      ││
│  │  3  │ Amarillo Gr. │ Río Negro│ Avanzada   │ Blue Sky   ││
│  │ ... │              │          │            │            ││
│  └─────┴──────────────┴──────────┴────────────┴────────────┘│
│              (animated row entrance — staggered)             │
├──────────────────────────────────────────────────────────────┤
│  [PRICE MILESTONES TIMELINE]                                 │
│                                                              │
│  1990 ── $9 ──────── 2000 ── $7 ────────── 2007 ── $136 ── │
│  │                          │                  │            │
│  │  Primeros años          │  Mínimo           │  Pico      │
│  │  de producción          │  histórico        │  histórico │
│                                                              │
│  2011 ── $65 ─── 2016 ── $19 ──── 2024 ── $100 ── 2026 ── $86│
│  │               │                   │                       │
│  │  Fukushima    │  Depresión        │  Nuclear revival      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Anime.js Animation Use Cases

### 1. Hero Price Counter (page load)
```javascript
// Animate from 0 to current price on load
anime({
  targets: '.uranium-hero-price',
  innerHTML: [0, 86.35],
  round: 2,
  easing: 'easeOutExpo',
  duration: 2000,
  update: (anim) => {
    document.querySelector('.uranium-hero-price').textContent =
      '$' + anim.animatables[0].target.innerHTML;
  }
});
```
- **Effect:** Price counter ticks up rapidly then slows towards final value
- **Variant:** Add a green/red flash indicator for trend direction

### 2. Main Price Chart — Line Drawing Animation
```javascript
// SVG line "draws itself" on page load — 436 data points from 1990-2026
anime({
  targets: '.uranium-chart-path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutQuad',
  duration: 4000,
  delay: 500
});

// Animated area fill gradient following the line
anime({
  targets: '.uranium-chart-fill',
  opacity: [0, 0.3],
  easing: 'easeOutSine',
  duration: 2000,
  delay: 3500
});
```
- **Effect:** Historical price line "draws itself" left-to-right, then the area fill fades in beneath

### 3. Stat Counters — Scroll-triggered
```javascript
// Trigger when scrolled into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      anime({
        targets: '.stat-counter',
        innerHTML: val => [0, val.dataset.target],
        round: 1,
        easing: 'easeOutExpo',
        duration: 3000,
        delay: (el, i) => i * 300
      });
      observer.unobserve(entry.target);
    }
  });
});
```
- **Effects:**
  - 21 projects — counter animates from 0
  - 6 provinces — counter animates
  - 33,650 tU — large counter with comma formatting
  - 2,600 tU — historical production

### 4. Map Marker Pop-in Animation
```javascript
// Map markers appear with a popping animation
anime({
  targets: '.uranium-project-marker',
  scale: [
    { value: 0, duration: 0 },
    { value: 1.3, duration: 400, easing: 'easeOutBack' },
    { value: 1, duration: 200, easing: 'easeOutQuad' }
  ],
  delay: (el, i) => 500 + i * 150,
  // Different colors by status
  begin: () => {
    // Add glow pulse on each marker
    markers.forEach(m => {
      anime({
        targets: m.querySelector('.pulse-ring'),
        scale: [1, 2],
        opacity: [0.8, 0],
        duration: 2000,
        loop: true,
        delay: Math.random() * 2000
      });
    });
  }
});
```
- **Effect:** Map markers pop in sequentially from north to south (or grouped by province)
- **Color scheme:** Prospección (gray), Exploración inicial (teal), Avanzada (cyan), EEP (amber), Factibilidad (green)

### 5. Donut Chart — Radial Fill
```javascript
// Donut segments animate in with a radial growth effect
anime({
  targets: '.donut-segment',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeOutCubic',
  duration: 2000,
  delay: (el, i) => 300 + i * 200
});
```

### 6. Project Table — Staggered Row Entry
```javascript
// Table rows fade+slide in, one by one
anime({
  targets: '.project-table-row',
  translateY: [20, 0],
  opacity: [0, 1],
  easing: 'easeOutQuad',
  duration: 800,
  delay: (el, i) => 100 + i * 80
});
```

### 7. Price Milestones Timeline — Horizontal Progress
```javascript
// Timeline nodes animate in sequence with connecting line
anime.timeline({
  easing: 'easeOutExpo',
})
.add({
  targets: '.timeline-line',
  scaleX: [0, 1],
  duration: 1500,
})
.add({
  targets: '.timeline-node',
  scale: [0, 1],
  duration: 600,
  delay: (el, i) => 200 + i * 300
})
.add({
  targets: '.timeline-label',
  opacity: [0, 1],
  translateY: [10, 0],
  duration: 400,
  delay: (el, i) => 200 + i * 200
});
```

## Animation Performance Guidelines

1. **Use `will-change`** on all animated elements
2. **Prefer transform/opacity** for GPU-composited animations (avoid layout-triggering props)
3. **Batch SVG path animations** — one path for 436 points is fine, animate stroke-dashoffset
4. **Disable animations on `prefers-reduced-motion`**
5. **Lazy load anime.js** only on the uranium page (don't bundle globally)

## Color Palette

```
Background:     #0A0A0F (near-black)
Card surface:   #14141A
Border:         #1E1E2A
Accent primary: #00D4AA (teal — uranium glow)
Accent warn:    #FFB347 (amber — EEP/advanced)
Status green:   #4ADE80 (green — feasibility)
Text primary:   #E4E4E7
Text dim:       #71717A
Chart line:     #00D4AA
Chart fill:     rgba(0, 212, 170, 0.1)
```

## Acceptance Criteria

- [ ] Uranium Hub accessible at `/minerals/uranio` with:
  - Hero section with animated price counter and key stats
  - 35-year historical price chart (line drawn animation)
  - Interactive map with 21 uranium project markers (animated pop-in)
  - 4 animated stat counters (scroll-triggered via IntersectionObserver)
  - Projects by status donut chart (radial growth animation)
  - Trade balance bar chart (animated entry)
  - Sortable project table (staggered row entrance)
  - Price milestones timeline
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Mobile responsive (animations degrade gracefully on mobile)
- [ ] Data fetched from `/api/v2/minerals/` endpoints
- [ ] Error state + loading skeleton with shimmer animation
- [ ] Tooltips on hover for chart data points

## What to Skip

- Do NOT build a separate PDF export page
- Do NOT implement real-time WebSocket updates (monthly data is fine)
- Do NOT add 3D/WebGL animations — stick with anime.js 2D animations
- Do NOT write unit tests for animations (visual QA only)

## Dependencies

- **anime.js** v4+ — `npm install animejs`
- **Leaflet** (or MapLibre GL JS) for the project map
- **Chart.js** or custom SVG for price chart (anime.js + SVG for line drawing)
- **Intersection Observer API** for scroll-triggered animations
- Backend endpoints from URANIUM-1 pipeline (in Tickets/URANIUM-1.md)
