'use client'

import type { ProvinceShape } from './argentina-provinces'

type ProvinceTooltipProps = {
  province: ProvinceShape
  /** Restriction detail text from PROVINCES_NUCLEAR. */
  detail: string
  nuclearAllowed: boolean
  restrictionType: string
  legislationRef?: string
  /** SVG-coordinate anchor for the tooltip card. */
  x: number
  y: number
}

const TYPE_COLOR: Record<string, string> = {
  none: 'oklch(62% 0.13 145deg)',
  legal: '#e89e34',
  constitutional: '#e83434',
}

/**
 * Floating tooltip shown when hovering a province. Positioned within the map's
 * SVG coordinate space (rendered as an absolutely-positioned HTML card overlay).
 */
export function ProvinceTooltip({
  province,
  detail,
  nuclearAllowed,
  restrictionType,
  legislationRef,
  x,
  y,
}: ProvinceTooltipProps) {
  const color = TYPE_COLOR[restrictionType] ?? 'var(--nd-text-disabled)'
  return (
    <div
      className="pointer-events-none absolute z-30 w-56 -translate-x-1/2 border border-nd-border-visible bg-nd-surface p-3"
      style={{ left: `${(x / 360) * 100}%`, top: `${(y / 760) * 100}%` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-lg leading-none text-nd-text-display">{province.name}</span>
        <span
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] font-mono"
          style={{ color }}
        >
          <span className="inline-block size-2" style={{ backgroundColor: color }} aria-hidden />
          {nuclearAllowed ? 'Permite' : 'Restringe'}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-nd-text-secondary font-sans">{detail}</p>
      {legislationRef ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
          {legislationRef}
        </p>
      ) : null}
    </div>
  )
}
