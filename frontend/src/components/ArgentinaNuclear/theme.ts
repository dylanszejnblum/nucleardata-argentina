// Pure module (NO 'use client'): safe to import from server components.
//
// Centralised tokens for the Nuclear Atlas "Schematic Modernist" system.
// Colours map to capability / status / category semantics used across every
// nuclear page. Keep hex/oklch literals here so palette changes are atomic.

import type {
  ReactorData,
  FuelCycleStep,
  HistoryMilestone,
} from '@/lib/nuclear-mock-data'

/** Uranium-glass accent — the single brand colour. */
export const NUCLEAR = {
  accent: 'var(--nd-accent)',
  accentSubtle: 'var(--nd-accent-subtle)',
  ink: 'var(--nd-text-display)',
} as const

/** Fuel-cycle capability badge palette. */
export const CAPABILITY = {
  yes: { color: 'oklch(62% 0.13 145deg)', labelEs: 'Capacidad activa', labelEn: 'Active capability', glyph: '✓' },
  partial: { color: 'oklch(72% 0.13 75deg)', labelEs: 'Capacidad parcial', labelEn: 'Partial capability', glyph: '~' },
  no: { color: 'oklch(60% 0.17 25deg)', labelEs: 'Sin capacidad', labelEn: 'No capability', glyph: '×' },
} as const

export type CapabilityKey = keyof typeof CAPABILITY

export function capabilityMeta(c: FuelCycleStep['capability']) {
  return CAPABILITY[c]
}

/** Reactor status → badge colour + dot. */
export const REACTOR_STATUS = {
  operational: { color: 'oklch(62% 0.13 145deg)', dot: '#34e89e', labelEs: 'Operativo', labelEn: 'Operational' },
  construction: { color: 'oklch(62% 0.13 230deg)', dot: '#4a9eff', labelEs: 'En construcción', labelEn: 'Under construction' },
  shutdown: { color: 'oklch(62% 0.01 0deg)', dot: '#9aa0a6', labelEs: 'Detenido', labelEn: 'Shutdown' },
  decommissioned: { color: 'oklch(55% 0.01 0deg)', dot: '#6b7280', labelEs: 'Desmantelado', labelEn: 'Decommissioned' },
} as const

export function statusMeta(s: ReactorData['status']) {
  return REACTOR_STATUS[s]
}

/** Reactor type → pill tint. */
export const REACTOR_TYPE: Record<ReactorData['type'], { color: string; label: string }> = {
  PHWR: { color: 'oklch(55% 0.13 145deg)', label: 'PHWR' },
  CANDU: { color: 'oklch(55% 0.13 200deg)', label: 'CANDU' },
  CAREM: { color: 'oklch(55% 0.13 280deg)', label: 'CAREM' },
  pool: { color: 'oklch(55% 0.10 90deg)', label: 'POOL' },
  tanque: { color: 'oklch(55% 0.10 60deg)', label: 'TANQUE' },
}

/** Milestone significance → colour. */
export const SIGNIFICANCE = {
  milestone: { color: 'oklch(62% 0.13 145deg)', labelEs: 'Hito', labelEn: 'Milestone' },
  crisis: { color: 'oklch(60% 0.17 25deg)', labelEs: 'Crisis', labelEn: 'Crisis' },
  turning_point: { color: 'oklch(62% 0.13 40deg)', labelEs: 'Punto de inflexión', labelEn: 'Turning point' },
  context: { color: 'oklch(60% 0.06 230deg)', labelEs: 'Contexto', labelEn: 'Context' },
} as const

export function significanceMeta(s: HistoryMilestone['significance']) {
  return SIGNIFICANCE[s]
}

/** Milestone category → label. */
export const CATEGORY: Record<HistoryMilestone['category'], { labelEs: string; labelEn: string }> = {
  institutional: { labelEs: 'Institucional', labelEn: 'Institutional' },
  technical: { labelEs: 'Técnico', labelEn: 'Technical' },
  political: { labelEs: 'Político', labelEn: 'Political' },
  international: { labelEs: 'Internacional', labelEn: 'International' },
  legal: { labelEs: 'Legal', labelEn: 'Legal' },
}

/** Province restriction type → map tint. */
export const RESTRICTION = {
  none: '#34e89e',
  constitutional: '#e83434',
  legal: '#e89e34',
} as const
