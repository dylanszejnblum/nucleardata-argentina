'use client'

import { useEffect, useRef } from 'react'
import { URANIUM } from './theme'
import { animate, prefersReducedMotion, staggerIn, useInView, utils } from './anim'
import { getPriceMilestones, type Locale } from './content'

export function PriceMilestones({ locale }: { locale: Locale }) {
  const data = getPriceMilestones(locale)
  const { ref, inView } = useInView<HTMLDivElement>()
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inView) return
    const lineEl = lineRef.current
    const nodes = ref.current?.querySelectorAll('.milestone-node')

    if (prefersReducedMotion()) {
      if (lineEl) utils.set(lineEl, { scaleX: 1 })
      if (nodes) utils.set(Array.from(nodes), { opacity: 1, translateY: 0 })
      return
    }

    if (lineEl) {
      animate(lineEl, { scaleX: [0, 1], duration: 1200, ease: 'outExpo' })
    }
    if (nodes && nodes.length) {
      staggerIn(Array.from(nodes), { startDelay: 400, step: 90 })
    }
  }, [inView, ref])

  return (
    <div ref={ref} className="relative w-full">
      {/* Baseline (md+ only, drawn behind the nodes) */}
      <div className="pointer-events-none absolute inset-x-0 top-[14px] hidden md:block" aria-hidden>
        <div
          ref={lineRef}
          className="h-px w-full bg-nd-border-visible"
          style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
        />
      </div>

      {/* md+: evenly spaced row · mobile: vertical stack */}
      <ol className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-4">
        {data.map((m) => (
          <li
            key={`${m.year}-${m.label}`}
            className="milestone-node flex flex-1 items-start gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
            style={{ opacity: 0 }}
          >
            <div
              className="mt-1 size-2.5 shrink-0 md:mt-0"
              style={{ backgroundColor: URANIUM.teal }}
              aria-hidden
            />
            <div className="flex flex-col gap-1 md:items-center">
              <span className="font-display text-2xl leading-none text-nd-text-display tabular-nums">
                {m.year}
              </span>
              <span className="font-mono text-sm tabular-nums" style={{ color: URANIUM.teal }}>
                {`$${m.price.toFixed(2)}`}
              </span>
              <span className="line-clamp-2 max-w-[14ch] font-mono text-[11px] leading-snug text-nd-text-disabled">
                {m.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
