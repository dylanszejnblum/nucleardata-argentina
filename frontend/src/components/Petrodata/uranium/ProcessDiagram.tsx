'use client'

// The 12-step uranium fuel-cycle as a responsive grid of nodes. Each node shows
// its step number + short title; hovering reveals body + key fact; clicking
// scrolls to the matching detailed step section (#cycle-step-N). A thin amber
// accent line at the top of each node animates scaleX 0→1, staggered on scroll
// into view, to read as "flow" through the cycle. Reduced-motion shows lines
// fully drawn with no movement. Monochrome "Nothing" styling, scoped amber.

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { animate, prefersReducedMotion, stagger, useInView, utils } from './anim'
import { URANIUM } from './theme'
import { getFuelCycle, type Locale } from './content'

export function ProcessDiagram({ locale }: { locale: Locale }) {
  const t = useTranslations('uraniumHub')
  const steps = getFuelCycle(locale)

  const { ref, inView } = useInView<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (!inView || !ref.current) return
    const lines = Array.from(ref.current.querySelectorAll<HTMLElement>('.flow-accent'))
    if (lines.length === 0) return

    if (prefersReducedMotion()) {
      utils.set(lines, { scaleX: 1 })
      return
    }

    const anim = animate(lines, {
      scaleX: [0, 1],
      duration: 600,
      ease: 'outExpo',
      delay: stagger(60),
    })

    return () => {
      anim?.pause?.()
      anim?.revert?.()
    }
  }, [inView, ref])

  const goToStep = (n: number) => {
    document.getElementById(`cycle-step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="container pb-16">
      <p className="text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
        {t('cycle.diagram.eyebrow')}
      </p>
      <h2 className="mt-2 font-display text-nd-text-display text-balance text-2xl md:text-4xl">
        {t('cycle.diagram.title')}
      </h2>
      <p className="mt-2 font-mono text-[11px] text-nd-text-disabled">{t('cycle.diagram.hint')}</p>

      <div
        ref={ref}
        className="mt-8 grid grid-cols-2 gap-px bg-nd-border sm:grid-cols-3 lg:grid-cols-4"
      >
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            aria-label={step.title}
            onClick={() => goToStep(step.n)}
            onMouseEnter={() => setActive(step.n)}
            onMouseLeave={() => setActive((cur) => (cur === step.n ? null : cur))}
            onFocus={() => setActive(step.n)}
            onBlur={() => setActive((cur) => (cur === step.n ? null : cur))}
            className="relative bg-nd-surface p-4 text-left transition-colors hover:bg-nd-surface-raised focus:bg-nd-surface-raised focus:outline-none"
          >
            {/* Amber flow accent — animates scaleX 0→1, staggered, on inView. */}
            <div
              className="flow-accent pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ backgroundColor: URANIUM.amber, transformOrigin: 'left center', transform: 'scaleX(0)' }}
              aria-hidden="true"
            />

            <span className="font-mono text-[11px]" style={{ color: URANIUM.amber }}>
              {String(step.n).padStart(2, '0')}
            </span>
            <span className="mt-1 block font-sans text-sm text-nd-text-display line-clamp-2">
              {step.title}
            </span>

            {active === step.n ? (
              <div className="absolute left-2 right-2 top-full z-10 mt-1 border border-nd-border bg-nd-surface p-3 text-[11px] shadow-lg">
                <p className="font-sans text-pretty leading-relaxed text-nd-text-secondary">
                  {step.body}
                </p>
                <p className="mt-2 font-mono text-nd-text-disabled">{step.keyFact}</p>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  )
}
