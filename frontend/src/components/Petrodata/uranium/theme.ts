// Pure module (NO 'use client'): safe to import from server components.
//
// The uranium hub keeps the app's structural language (sharp corners, nd-*
// surface/border/text tokens, mono eyebrows, Doto display numbers) but adopts
// teal as the uranium accent — consistent with the per-commodity colour system
// in commodityColors.ts — plus a single scoped amber accent for the educational
// fuel-cycle section. No glow as a primary affordance; accents stay restrained.

export const URANIUM = {
  /** Uranium accent (teal). */
  teal: '#00D4AA',
  /** Educational process-flow accent (amber), scoped to the fuel-cycle section. */
  amber: '#FFB347',
  /** Positive / feasibility green. */
  green: '#4ADE80',
  /** Advanced-exploration cyan. */
  cyan: '#22D3EE',
} as const

/**
 * Colour for a uranium project lifecycle stage. Accepts either the snake_case
 * status code (`advanced_exploration`) or the Spanish label (`Exploración
 * avanzada`) returned by the API. Earlier (riskier) stages read cooler/dimmer;
 * later (de-risked) stages read warmer/greener.
 */
export function uraniumStatusColor(status: string | null | undefined): string {
  if (!status) return 'var(--nd-text-disabled)'
  const s = status.toLowerCase()
  if (s.includes('factib') || s.includes('feasib')) return URANIUM.green
  if (s.includes('eep') || s.includes('económic') || s.includes('economic') || s.includes('preliminar'))
    return URANIUM.amber
  if (s.includes('avanz') || s.includes('advanced')) return URANIUM.cyan
  if (s.includes('inicial') || s.includes('initial')) return URANIUM.teal
  if (s.includes('prospec')) return '#71717A'
  return 'var(--nd-text-secondary)'
}

/** Stable ordering of lifecycle stages, least → most de-risked. */
export const URANIUM_STATUS_ORDER = [
  'Prospección',
  'Exploración inicial',
  'Exploración avanzada',
  'Evaluación Económica Preliminar',
  'Factibilidad',
] as const
