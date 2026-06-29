// Schematic provincial atlas for the Nuclear Map page.
//
// Polygons are intentionally simplified blocky shapes — a "drafting-paper"
// representation, not a cartographic survey. Coordinates live in an abstract
// viewBox (0 0 360 760); provinces are positioned roughly geographically
// (north at top, Argentina is tall & narrow).
//
// Restriction years are documented where known (Mendoza 2007, Río Negro 2017,
// El Bolsón 1984) and indicative elsewhere — they drive the timeline-slider
// "banning spreads over time" effect, not a legal database.

export type ProvinceShape = {
  code: string
  name: string
  /** SVG polygon points string (viewBox 0 0 360 760). */
  points: string
  /** Label anchor (cx, cy). */
  label: [number, number]
  /** Year the restriction took effect (for the timeline slider). Null = allowed. */
  restrictionYear: number | null
}

export const ARGENTINA_VIEWBOX = { w: 360, h: 760 } as const

export const PROVINCE_SHAPES: ProvinceShape[] = [
  {
    code: 'SA',
    name: 'Salta',
    points: '55,35 150,30 158,110 70,120',
    label: [104, 75],
    restrictionYear: 2010,
  },
  {
    code: 'CT',
    name: 'Catamarca',
    points: '78,120 158,112 168,184 88,190',
    label: [126, 152],
    restrictionYear: 1988,
  },
  {
    code: 'MZ',
    name: 'Mendoza',
    points: '52,300 142,298 136,402 58,402',
    label: [96, 350],
    restrictionYear: 2007,
  },
  {
    code: 'CB',
    name: 'Córdoba',
    points: '168,248 252,250 252,332 165,332',
    label: [208, 290],
    restrictionYear: null,
  },
  {
    code: 'SF',
    name: 'Santa Fe',
    points: '252,208 322,210 322,312 252,312',
    label: [287, 260],
    restrictionYear: null,
  },
  {
    code: 'BA',
    name: 'Buenos Aires',
    points: '208,330 332,318 342,432 220,452',
    label: [278, 385],
    restrictionYear: null,
  },
  {
    code: 'CABA',
    name: 'CABA',
    points: '302,372 318,372 318,388 302,388',
    label: [310, 380],
    restrictionYear: null,
  },
  {
    code: 'NQ',
    name: 'Neuquén',
    points: '78,440 150,440 150,560 92,560',
    label: [112, 500],
    restrictionYear: null,
  },
  {
    code: 'RN',
    name: 'Río Negro',
    points: '110,470 252,470 256,560 125,560',
    label: [185, 515],
    restrictionYear: 2017,
  },
  {
    code: 'CH',
    name: 'Chubut',
    points: '118,560 262,560 252,690 128,690',
    label: [190, 625],
    restrictionYear: 2003,
  },
]

/** Reactor pin positions, anchored to the schematic province centroids. */
export const REACTOR_PIN_OFFSETS: Record<string, [number, number]> = {
  SA: [-8, 4],
  CT: [0, 6],
  MZ: [0, -4],
  CB: [10, -2],
  SF: [4, 6],
  BA: [6, -8],
  CABA: [0, 0],
  NQ: [-4, 0],
  RN: [-20, 4],
  CH: [0, -6],
}

export const SLIDER_RANGE = { min: 1984, max: 2026 } as const
export const SLIDER_MARKERS = [1984, 1994, 2003, 2007, 2017, 2026] as const
