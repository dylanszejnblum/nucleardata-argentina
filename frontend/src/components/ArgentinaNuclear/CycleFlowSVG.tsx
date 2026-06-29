'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { FUEL_CYCLE_STEPS } from '@/lib/nuclear-mock-data'
import { capabilityMeta } from './theme'
import { CycleDetailPanel } from './CycleDetailPanel'

const NODE_RX = 46 // horizontal half-spacing in SVG units
const NODE_R = 22
const VIEW_W = (FUEL_CYCLE_STEPS.length - 1) * NODE_RX * 2 + NODE_R * 4
const VIEW_H = 120

/**
 * Schematic SVG of the 10-step fuel cycle. Each node is a numbered circle with
 * a capability dot; the selected node fills uranium-green and its detail panel
 * renders below. Selection follows the `#step-N` URL hash (so the Control Room
 * nav deep-links correctly) and responds to ← / → keyboard input.
 *
 * The SVG scrolls horizontally on narrow viewports.
 */
export function CycleFlowSVG() {
  const locale = useLocale()
  const [selectedId, setSelectedId] = useState<number>(FUEL_CYCLE_STEPS[0].id)
  const svgRef = useRef<HTMLDivElement>(null)

  const nameOf = (s: (typeof FUEL_CYCLE_STEPS)[number]) => (locale === 'en' ? s.nameEn : s.nameEs)

  const selectById = useCallback((id: number) => {
    setSelectedId(id)
    if (typeof window !== 'undefined') {
      const el = document.getElementById(`step-${id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  // Sync from URL hash on mount (deep-links from Control Room nav).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = window.location.hash.match(/step-(\d+)/)
    if (m) {
      const id = Number(m[1])
      if (FUEL_CYCLE_STEPS.some((s) => s.id === id)) setSelectedId(id)
    }
  }, [])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = FUEL_CYCLE_STEPS.findIndex((s) => s.id === selectedId)
      if (e.key === 'ArrowRight' && idx < FUEL_CYCLE_STEPS.length - 1) {
        e.preventDefault()
        selectById(FUEL_CYCLE_STEPS[idx + 1].id)
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        selectById(FUEL_CYCLE_STEPS[idx - 1].id)
      }
    },
    [selectedId, selectById],
  )

  const selected = FUEL_CYCLE_STEPS.find((s) => s.id === selectedId)!

  return (
    <div>
      <div
        ref={svgRef}
        className="overflow-x-auto border border-nd-border bg-nd-surface"
        role="group"
        aria-label="Fuel cycle flow"
      >
        <svg
          width={VIEW_W}
          height={VIEW_H}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block"
          style={{ minWidth: '100%' }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          role="slider"
          aria-valuenow={selectedId}
          aria-valuemin={1}
          aria-valuemax={FUEL_CYCLE_STEPS.length}
          aria-label="Fuel cycle step"
        >
          {/* Connecting rail */}
          <line
            x1={NODE_R * 2}
            y1={VIEW_H / 2 - 22}
            x2={VIEW_W - NODE_R * 2}
            y2={VIEW_H / 2 - 22}
            stroke="var(--nd-border-visible)"
            strokeWidth={1}
          />
          {/* Progress overlay up to selected */}
          <line
            x1={NODE_R * 2}
            y1={VIEW_H / 2 - 22}
            x2={NODE_R * 2 + (selectedId - 1) * NODE_RX * 2}
            y2={VIEW_H / 2 - 22}
            stroke="var(--nd-accent)"
            strokeWidth={1.5}
          />
          {FUEL_CYCLE_STEPS.map((s, i) => {
            const cx = NODE_R * 2 + i * NODE_RX * 2
            const cy = VIEW_H / 2 - 22
            const cap = capabilityMeta(s.capability)
            const isSel = s.id === selectedId
            return (
              <g
                key={s.id}
                transform={`translate(${cx} ${cy})`}
                className="cursor-pointer"
                onClick={() => selectById(s.id)}
                role="button"
                aria-label={`${s.id}. ${nameOf(s)}`}
                tabIndex={-1}
              >
                <circle
                  r={NODE_R}
                  fill={isSel ? 'var(--nd-accent)' : 'var(--nd-surface)'}
                  stroke={isSel ? 'var(--nd-accent)' : 'var(--nd-border-visible)'}
                  strokeWidth={1.25}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontFamily="var(--font-martian-mono), monospace"
                  fill={isSel ? 'var(--nd-surface)' : 'var(--nd-text-display)'}
                >
                  {s.id}
                </text>
                {/* Capability badge */}
                <circle
                  cx={NODE_R * 0.72}
                  cy={-NODE_R * 0.72}
                  r={5}
                  fill={cap.color}
                  stroke="var(--nd-surface)"
                  strokeWidth={1.5}
                />
                {/* Short name below */}
                <text
                  y={NODE_R + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--font-hanken-grotesk), sans-serif"
                  fill={isSel ? 'var(--nd-text-primary)' : 'var(--nd-text-secondary)'}
                >
                  {nameOf(s)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-6">
        <CycleDetailPanel step={selected} />
      </div>
    </div>
  )
}
