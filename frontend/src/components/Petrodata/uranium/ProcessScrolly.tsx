'use client'

// Scroll-driven walkthrough of the 12-step uranium fuel cycle. A sticky
// navigator tracks the in-view step (shared IntersectionObserver), and each
// step animates its schematic scene (staggered `.anim-el` groups) and text
// block on first entry. Section accent is amber; teal for secondary data.

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { URANIUM } from './theme'
import { fadeIn, staggerIn, useInView } from './anim'
import { getFuelCycle, type FuelCycleStep, type Locale } from './content'
import { StepScene } from './StepScene'

const AMBER = URANIUM.amber
const TOTAL = 12

function scrollToStep(n: number) {
  document.getElementById(`cycle-step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Step({ step, total }: { step: FuelCycleStep; total: number }) {
  const t = useTranslations('uraniumHub')
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 })
  const playedRef = useRef(false)

  useEffect(() => {
    if (!inView || playedRef.current) return
    playedRef.current = true
    const root = ref.current
    if (!root) return
    const sceneEls = root.querySelectorAll<SVGGElement>('.anim-el')
    if (sceneEls.length) staggerIn(Array.from(sceneEls), { startDelay: 60, step: 80 })
    const textEl = root.querySelector<HTMLElement>('.cycle-text')
    if (textEl) fadeIn(textEl, { delay: 120 })
  }, [inView, ref])

  return (
    <section
      ref={ref}
      id={`cycle-step-${step.n}`}
      className="min-h-[80vh] grid md:grid-cols-2 gap-8 items-center container py-16 scroll-mt-28"
    >
      {/* Scene (stacks above text on mobile). Framed panel; a strong currentColor
          drives the illustration's base strokes. */}
      <div className="order-1">
        <div className="dot-grid-subtle grid aspect-[6/5] place-items-center border border-nd-border bg-nd-surface-raised p-8 text-nd-text-primary md:p-12">
          <StepScene id={step.id} className="w-full max-w-sm" />
        </div>
      </div>

      {/* Text block */}
      <div className="cycle-text order-2 flex flex-col gap-5" style={{ opacity: 0 }}>
        <span
          className="text-[10px] uppercase tracking-[0.08em] font-mono"
          style={{ color: AMBER }}
        >
          {t('cycle.stepLabel', { n: step.n, total })}
        </span>

        <h3 className="font-display text-nd-text-display text-balance text-3xl md:text-4xl leading-tight">
          {step.title}
        </h3>

        <p className="font-sans text-nd-text-secondary text-pretty leading-relaxed">{step.body}</p>

        {/* Key fact — amber left border */}
        <div className="border-l-2 pl-4" style={{ borderColor: AMBER }}>
          <span className="block text-[10px] uppercase tracking-[0.08em] font-mono text-nd-text-disabled">
            {t('cycle.keyFact')}
          </span>
          <span className="font-mono text-sm text-nd-text-primary">{step.keyFact}</span>
        </div>

        {/* Argentina note */}
        <div className="border border-nd-border p-4">
          <span className="block text-[10px] uppercase tracking-[0.08em] font-mono text-nd-text-disabled">
            {t('cycle.argentinaNote')}
          </span>
          <span className="font-sans text-sm text-nd-text-secondary text-pretty leading-relaxed">
            {step.argentina}
          </span>
        </div>
      </div>
    </section>
  )
}

export function ProcessScrolly({ locale }: { locale: Locale }) {
  const t = useTranslations('uraniumHub')
  const steps = getFuelCycle(locale)
  const [active, setActive] = useState(1)

  // Shared observer: pick the section closest to the viewport centre.
  useEffect(() => {
    const sections = steps
      .map((s) => document.getElementById(`cycle-step-${s.n}`))
      .filter((el): el is HTMLElement => el != null)
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return

    const visible = new Map<number, number>()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = Number((e.target as HTMLElement).id.replace('cycle-step-', ''))
          if (e.isIntersecting) visible.set(n, e.intersectionRatio)
          else visible.delete(n)
        }
        let best = -1
        let bestRatio = -1
        for (const [n, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = n
          }
        }
        if (best > 0) setActive(best)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [steps])

  const goPrev = useCallback(() => scrollToStep(Math.max(1, active - 1)), [active])
  const goNext = useCallback(() => scrollToStep(Math.min(TOTAL, active + 1)), [active])
  const activeStep = steps.find((s) => s.n === active) ?? steps[0]

  return (
    <div id="cycle-steps">
      {/* Sticky navigator: prev/next + current step label & title + progress.
          The 12-dot rail shows on md+; the title row carries small screens. */}
      <div className="sticky top-0 z-30 border-b border-nd-border bg-nd-surface/95 backdrop-blur">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={active <= 1}
              aria-label={t('cycle.prev')}
              className="grid size-8 shrink-0 place-items-center border border-nd-border text-nd-text-secondary transition-colors hover:text-nd-text-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>

            <div className="min-w-0 flex-1 text-center" aria-live="polite">
              <div
                className="text-[10px] uppercase tracking-[0.08em] font-mono"
                style={{ color: AMBER }}
              >
                {t('cycle.stepLabel', { n: active, total: TOTAL })}
              </div>
              <div className="truncate font-display text-sm leading-tight text-nd-text-display md:text-base">
                {activeStep.title}
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={active >= TOTAL}
              aria-label={t('cycle.next')}
              className="grid size-8 shrink-0 place-items-center border border-nd-border text-nd-text-secondary transition-colors hover:text-nd-text-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div
            className="mt-2.5 hidden items-center justify-center gap-2 md:flex"
            role="tablist"
            aria-label={t('cycle.diagram.title')}
          >
            {steps.map((s) => {
              const isActive = s.n === active
              return (
                <button
                  key={s.n}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={t('cycle.stepLabel', { n: s.n, total: TOTAL })}
                  onClick={() => scrollToStep(s.n)}
                  className="grid size-5 shrink-0 place-items-center transition-transform hover:scale-110"
                >
                  <span
                    className="size-2 transition-all"
                    style={{
                      backgroundColor: isActive ? AMBER : 'var(--nd-border-visible)',
                      transform: isActive ? 'scale(1.5)' : 'scale(1)',
                    }}
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-nd-border" aria-hidden>
          <div
            className="h-full"
            style={{
              width: `${(active / TOTAL) * 100}%`,
              backgroundColor: AMBER,
              transition: 'width 300ms ease-out',
            }}
          />
        </div>
      </div>

      {/* Step sections */}
      {steps.map((step) => (
        <Step key={step.n} step={step} total={TOTAL} />
      ))}
    </div>
  )
}
