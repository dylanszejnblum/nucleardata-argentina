# URANIUM-3 — Educational: Uranium Fuel Cycle Interactive Process Flow

**Effort:** ~5 hours
**Priority:** Medium
**Labels:** frontend, educational, process-flow, animation, uranium
**Depends on:** URANIUM-1 (data pipeline — for contextual data overlays)

---

## Objective

Build an interactive, animated educational section within the uranium hub that visualizes the complete uranium fuel cycle. From geologic formation → exploration → mining → milling → conversion → enrichment → fuel fabrication → power generation → waste management. This transforms dry process descriptions into an engaging, scroll-driven visual narrative.

## Concept

A **horizontal scrollable process flow** (or vertical timeline on mobile) where each step of the uranium fuel cycle is a card with:
- An animated SVG illustration of the step
- A brief educational description (English + Spanish toggle)
- Key data overlay from URANIUM-1 pipeline (where applicable)
- Smooth anime.js transitions between steps

## The 10-Step Fuel Cycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   CICLO DEL COMBUSTIBLE NUCLEAR                          │
│                    Nuclear Fuel Cycle                                      │
│                                                                           │
│  ╔══════════╗    ╔════════════╗    ╔══════════╗    ╔══════════════╗      │
│  ║  1. Veta  ║──▶║  2. Pros-  ║──▶║  3. Expl- ║──▶║  4. Minería   ║      │
│  ║  Geológica║    ║  pección   ║    ║  oración  ║    ║  (Open pit /  ║      │
│  ║           ║    ║  (Aérea +  ║    ║  Avanzada ║    ║  Subterránea) ║      │
│  ╚══════════╝    ╚════════════╝    ╚══════════╝    ╚══════════════╝      │
│       │                │                  │                │              │
│       ▼                ▼                  ▼                ▼              │
│  Natural U    Tareas radiométricas  Perforaciones,  Extracción del       │
│  en corteza   aéreas, mapeo geo-    muestreo,       mineral uranífero    │
│  terrestre    lógico, geoquímica    evaluación      → camiones a planta  │
│  (2-4 ppm)                          de recursos                          │
│                                                                           │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐  ┌──────────────┐  │
│  │ 5. Trit-  │──▶│ 6. Lixivia-  │──▶│ 7. Intercam-  │──▶│ 8. Precipi-  │  │
│  │ uración   │    │ ción         │    │ bio Iónico    │    │ tación       │  │
│  │ (Chancado)│    │ (Ácido       │    │ (Concentra-   │    │ (Yellowcake) │  │
│  │           │    │  Sulfúrico)  │    │  ción)        │    │              │  │
│  └──────────┘    └──────────────┘    └──────────────┘  └──────────────┘  │
│       │                │                  │                │              │
│       ▼                ▼                  ▼                ▼              │
│  Rocas → tamaño  H₂SO₄ separa U   Resinas capturan   +NH₃ → U₃O₈       │
│  reducido en     de la roca →     U desde solución   (70% U) en          │
│  trituradora     solución (lix.)   → solución conc.   tambores           │
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 9. Conversión │──▶│ 10. Fabric-  │──▶│ 11. Genera-  │──▶│ 12. Gestión  │  │
│  │ (U₃O₈ → UO₂) │    │ ación de     │    │ ción Eléc-   │    │ de Residuos  │  │
│  │               │    │ Combustible  │    │ trica        │    │ Radiactivos  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  └──────────────┘  │
│       │                │                  │                │              │
│       ▼                ▼                  ▼                ▼              │
│  Yellowcake →     Pastillas UO₂    Atucha I+II,        Almacenamiento   │
│  UO₂ (dióxido     ensambladas en   Embalse → 1,757     en seco +        │
│  de uranio)       varillas de Zr   MWe (7% del SADI)   disposición      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Page Section Layout

### Section 1: Overview Infographic (above the fold)
```
┌──────────────────────────────────────────────────────────────┐
│  CICLO DEL COMBUSTIBLE NUCLEAR                                │
│  Del yacimiento a la generación eléctrica                     │
│                                                               │
│  [ANIMATED MINIATURE — full cycle looping animation]          │
│                                                               │
│  Una molécula de uranio viaja por todo el ciclo:              │
│  ● Yacimiento → ● Mina → ● Planta → ● Conversión →          │
│  ● Combustible → ● Reactor → ↺ (vuelve a empezar)            │
│                                                               │
│  ⌜                                              ⌟                │
│  │ Argentina produjo 2.600 tU entre 1952-1997.               │
│  │ Hoy, el uranio para nuestras centrales nucleares           │
│  │ (Atucha I, Atucha II, Embalse) se importa.                │
│  │ Tenemos 33.650 tU en recursos identificados.               │
│  └────────────────────────────────────────────────────────────┘│
│                                                               │
│  [Iniciar recorrido]  [Explorar proyectos]                    │
└──────────────────────────────────────────────────────────────┘
```

### Section 2: Step-by-step Scrollytelling (scroll-driven)

Each step is a full-viewport section that triggers as the user scrolls:

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ┌──────────────────────────┐                      │
│              │                          │                      │
│              │   ⚒️  ⛏️  💧  🔬  ⚛️     │                      │
│              │   (Animated SVG scene)    │                      │
│              │                          │                      │
│              └──────────────────────────┘                      │
│                                                               │
│  PASO 4 — MINERÍA                                             │
│  ─────────────────────────────────────                        │
│                                                               │
│  En Argentina se usaron dos métodos:                          │
│                                                               │
│  ● CIELO ABIERTO — cuando el mineral está cerca               │
│    de la superficie. Se perfora y volca la roca               │
│    mineralizada.                                              │
│                                                               │
│  ● SUBTERRÁNEA — para depósitos profundos.                    │
│    Se excavan túneles para acceder a la veta.                 │
│                                                               │
│  La roca extraída pasa por un túnel radiométrico              │
│  que clasifica el material por su concentración de            │
│  uranio antes de enviarlo a la trituradora.                   │
│                                                               │
│  ┌────────────────────────────────────────────────┐           │
│  │ Proyectos argentinos activos: 21                │           │
│  │ En minería: Sierra Pintada (Mza, factibilidad)  │           │
│  │             Don Otto (Salta, factibilidad)      │           │
│  └────────────────────────────────────────────────┘           │
│                                                               │
│  ◀  Paso 3      [⏺ 1 ● 2 ● 3 ● 4 ● 5 ● 6 ● 7 ● 8]  Paso 5 ▶│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Section 3: Interactive Process Diagram (full page)
An SVG-based process flow diagram that users can hover/click:
- Each node shows a simplified icon
- Hovering shows an educational tooltip
- Clicking scrolls to the corresponding scrollytelling section
- Lines between nodes animate (pulsing glow showing the "flow" of material)

### Section 4: Argentina-Specific Context
```
┌──────────────────────────────────────────────────────────────┐
│  URANIO EN ARGENTINA                                         │
│                                                               │
│  Hitos:                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 1946     │  │ 1952     │  │ 1955     │  │ 1997     │      │
│  │ 1er      │  │ Primeras │  │ Mina     │  │ Cierra   │      │
│  │ depósito │  │ 4,5 t    │  │ Huemul   │  │ Sierra   │      │
│  │ (Mza)    │  │ yellow-  │  │ en        │  │ Pintada  │      │
│  │          │  │ cake     │  │ Malargüe │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                               │
│  Hoy: Argentina importa uranio para sus 3 centrales           │
│  nucleares mientras desarrolla nuevos proyectos.              │
│                                                               │
│  [Ver proyectos activos →]                                    │
└──────────────────────────────────────────────────────────────┘
```

## Anime.js Animations

### 1. Overview Miniature — Full Cycle Looping Animation
```javascript
// A uranium atom travels through the cycle nodes in a loop
const cyclePath = document.querySelector('.cycle-path');
const atom = document.querySelector('.uranium-atom');

// Animate atom along the path — continuous loop
function animateCycle() {
  anime({
    targets: atom,
    motionPath: cyclePath,
    easing: 'easeInOutSine',
    duration: 8000,
    loop: true,
    // Glow pulse on each node when atom passes through
    update: (anim) => {
      const progress = anim.progress;
      highlightNodeAtProgress(progress);
    }
  });
}
```

### 2. Scrollytelling — Step Entry Animations
```javascript
// Each step section triggers when scrolled into view
const steps = document.querySelectorAll('.process-step');

steps.forEach((step, i) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate the SVG scene elements one by one
        const svgElements = step.querySelectorAll('.anim-svg-element');
        anime({
          targets: svgElements,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: (el, idx) => idx * 200,
          easing: 'easeOutQuad',
          duration: 800
        });

        // Typewriter effect for the educational text
        const text = step.querySelector('.step-description');
        anime({
          targets: text,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: 800
        });

        observer.unobserve(step);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(step);
});
```

### 3. Process Diagram — Node Highlight Pulse
```javascript
// Active node pulses, inactive nodes dim, flow lines animate
anime({
  targets: '.process-flow-line',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'linear',
  duration: 3000,
  loop: true
});

// Each node has a subtle breathing animation
nodes.forEach((node, i) => {
  anime({
    targets: node,
    scale: [1, 1.05, 1],
    duration: 3000,
    delay: i * 400,
    loop: true,
    easing: 'easeInOutSine'
  });
});
```

### 4. Timeline — Horizontal Scroll with Milestone Highlights
```javascript
// Timeline events animate in as user scrolls horizontally
anime({
  targets: '.timeline-event',
  translateX: (el) => {
    const rect = el.getBoundingClientRect();
    return [rect.width * -0.5, 0]; // slide in from left
  },
  opacity: [0, 1],
  delay: (el, i) => i * 200,
  easing: 'easeOutCubic',
  duration: 600
});
```

## Educational Content per Step

Each step card should include:
1. **Animated SVG scene** — simplified diagram showing the process
2. **Title** (Spanish + English)
3. **Short description** — 2-3 paragraphs in plain Spanish
4. **Key fact** — one memorable data point (from URANIUM-1 pipeline)
5. **Toggle** — switch between Spanish / English text
6. **Argentina-specific note** — how this step applies to the country

### Step Content Outline (draft)

| Step | Spanish Title | Key Educational Point | Argentina Data Hook |
|------|--------------|----------------------|---------------------|
| 1 | Formación geológica | Uranio en corteza terrestre (2-4 ppm), se concentra en depósitos | 33,650 tU identificados en Argentina |
| 2 | Prospección | Técnicas: radiométrica aérea, geoquímica, mapeo geológico | CNEA realiza prospección en 6 provincias |
| 3 | Exploración avanzada | Perforaciones, muestreo, evaluación de recursos | 21 proyectos con diferentes grados de avance |
| 4 | Minería | Cielo abierto vs subterránea | Sierra Pintada = cielo abierto, Don Otto = factibilidad |
| 5 | Trituración | Reducción de tamaño + clasificación radiométrica | Túnel radiométrico separa por concentración |
| 6 | Lixiviación | H₂SO₄ separa uranio de roca estéril | Planchada impermeabilizada + piletas |
| 7 | Intercambio iónico | Resinas capturan uranio de solución | Columnas de intercambio iónico |
| 8 | Precipitación | +NH₃ → Yellow Cake (U₃O₈, 70% U) | 2,600 tU producidas históricamente |
| 9 | Conversión | U₃O₈ → UO₂ (dióxido de uranio) | Se realiza en planta de conversión de CNEA |
| 10 | Fabricación de combustible | Pastillas UO₂ ensambladas en vainas de Zr | Abastece Atucha I, II y Embalse |
| 11 | Generación eléctrica | Fisión nuclear → calor → vapor → electricidad | 7% del SADI proviene de nuclear |
| 12 | Gestión de residuos | Almacenamiento en seco + disposición final | 7 sitios de remediación activa |

## Tech Approach

- **Single HTML artifact** (like Claude Design pattern) — self-contained page with:
  - Embedded SVG for process flow diagram
  - anime.js for all animations
  - Intersection Observer for scrollytelling triggers
  - CSS custom properties for theming (matches dark minerals palette)
  - No framework dependencies — vanilla JS
- **Or** could be a Payload CMS page if preferred

## Acceptance Criteria

- [ ] 12-step interactive process flow with full-viewport scrollytelling sections
- [ ] Animated overview miniature with looping uranium atom path
- [ ] SVG process diagram with hover tooltips and pulsing flow lines
- [ ] Spanish/English language toggle on each step card
- [ ] Argentina-specific data overlays (from URANIUM-1) on relevant steps (steps 1, 3, 4, 8, 10, 11, 12)
- [ ] Argentina historical timeline (1946 → present)
- [ ] Responsive: horizontal scroll on desktop, vertical stack on mobile
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Step navigation (◀ / ▶ arrows + dot indicators)

## What to Skip

- Do NOT add 3D or WebGL — keep it 2D SVG + anime.js
- Do NOT include enrichment details (Argentina doesn't enrich — that's a separate topic)
- Do NOT make this a video — it should be interactive HTML
- Do NOT build backend endpoints for this — educational content is static HTML/CSS/JS
- Do NOT cover thorium fuel cycle or advanced reactor designs — stay focused on the conventional uranium fuel cycle as practiced in Argentina

## Design Reference

- **Vibe:** The visual explainer style of Bloomberg's "QuickTake" or The Economist's process flows
- **Color:** Dark background (#0A0A0F), teal glow (#00D4AA) for uranium, amber (#FFB347) for process flow, dim gray (#71717A) for inactive elements
- **Typography:** Monospace data numbers, sans-serif body text
- **Animation philosophy:** Educational first, flashy second — each animation should teach, not distract
