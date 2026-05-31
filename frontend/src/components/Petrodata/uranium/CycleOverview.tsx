'use client'

// Educational opener for the uranium fuel-cycle hub. A miniature, continuously
// looping SVG carries a stylised uranium "atom" around a closed loop with six
// labelled nodes — a teaser for the full 12-step ProcessDiagram below. Motion is
// driven by anime.js v4's createMotionPath (transform-only) and is fully gated on
// prefers-reduced-motion and scroll-into-view. Monochrome "Nothing" styling with
// a scoped amber process accent.

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { createMotionPath } from 'animejs'
import { animate, prefersReducedMotion, useInView, utils } from './anim'
import { URANIUM } from './theme'
import type { Locale } from './content'

// Six labelled nodes positioned around an elliptical loop (viewBox 0 0 360 220).
// Coordinates trace the same ellipse the atom follows, so labels read as stops.
const NODES = [
  { x: 300, y: 110, en: 'Mine', es: 'Minería' },
  { x: 255, y: 185, en: 'Process', es: 'Proceso' },
  { x: 105, y: 185, en: 'Convert', es: 'Conversión' },
  { x: 60, y: 110, en: 'Fuel', es: 'Combustible' },
  { x: 105, y: 35, en: 'Power', es: 'Energía' },
  { x: 255, y: 35, en: 'Waste', es: 'Residuos' },
] as const

export function CycleOverview({ locale }: { locale: Locale }) {
  const t = useTranslations('uraniumHub')

  const { ref, inView } = useInView<HTMLDivElement>()
  const pathRef = useRef<SVGPathElement | null>(null)
  const atomRef = useRef<SVGGElement | null>(null)
  const orbitRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    if (!inView) return
    const pathEl = pathRef.current
    const atomEl = atomRef.current
    if (!pathEl || !atomEl) return

    if (prefersReducedMotion()) {
      // Park the atom at the path start (length 0); no looping.
      const start = pathEl.getPointAtLength(0)
      utils.set(atomEl, { translateX: start.x, translateY: start.y })
      return
    }

    // createMotionPath(path) → { translateX, translateY, rotate } FunctionValues
    // that, fed to animate(), drive the target along the path. We only consume
    // translateX/translateY (rotate would spin the whole atom unhelpfully).
    const { translateX, translateY } = createMotionPath(pathEl)

    const travel = animate(atomEl, {
      translateX,
      translateY,
      ease: 'linear',
      duration: 9000,
      loop: true,
    })

    // Gentle continuous electron-orbit spin on the inner group.
    const spin = orbitRef.current
      ? animate(orbitRef.current, {
          rotate: [0, 360],
          ease: 'linear',
          duration: 4000,
          loop: true,
        })
      : undefined

    return () => {
      travel?.pause?.()
      travel?.revert?.()
      spin?.pause?.()
      spin?.revert?.()
    }
  }, [inView])

  return (
    <section className="container pt-16 pb-12">
      <p className="text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
        {t('cycle.eyebrow')}
      </p>
      <h2 className="mt-2 font-display text-nd-text-display text-balance text-3xl md:text-5xl">
        {t('cycle.title')}
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-pretty leading-relaxed text-nd-text-secondary">
        {t('cycle.intro')}
      </p>

      <div ref={ref} className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center">
        <svg
          viewBox="0 0 360 220"
          className="w-full max-w-xl"
          role="img"
          aria-label={t('cycle.title')}
        >
          {/* Closed elliptical loop the atom rides. */}
          <path
            ref={pathRef}
            d="M 300 110 A 120 75 0 0 1 60 110 A 120 75 0 0 1 300 110 Z"
            fill="none"
            stroke="var(--nd-border)"
            strokeWidth={1}
          />

          {/* Labelled stops around the loop. */}
          {NODES.map((node) => (
            <g key={node.en}>
              <circle
                cx={node.x}
                cy={node.y}
                r={3}
                fill={URANIUM.amber}
                aria-hidden="true"
              />
              <text
                x={node.x}
                y={node.y < 110 ? node.y - 9 : node.y + 16}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fill="var(--nd-text-disabled)"
              >
                {locale === 'en' ? node.en : node.es}
              </text>
            </g>
          ))}

          {/* The travelling uranium atom: nucleus + two rotated orbit ellipses. */}
          <g ref={atomRef}>
            <g ref={orbitRef}>
              <ellipse
                rx={12}
                ry={4.5}
                fill="none"
                stroke={URANIUM.amber}
                strokeWidth={1}
                transform="rotate(30)"
                opacity={0.7}
              />
              <ellipse
                rx={12}
                ry={4.5}
                fill="none"
                stroke={URANIUM.amber}
                strokeWidth={1}
                transform="rotate(-30)"
                opacity={0.7}
              />
            </g>
            <circle r={4} fill={URANIUM.amber} />
          </g>
        </svg>

        <div className="flex-1">
          <div className="border border-nd-border bg-nd-surface p-4 md:p-5">
            <p className="font-sans text-pretty leading-relaxed text-nd-text-secondary">
              {t('cycle.argentinaIntro')}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#cycle-steps"
              className="inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-mono text-nd-text-display transition-colors hover:bg-nd-surface-raised"
              style={{ borderColor: URANIUM.amber }}
            >
              <span>{t('cycle.startTour')}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 border border-nd-border px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-mono text-nd-text-display transition-colors hover:bg-nd-surface-raised"
            >
              <span>{t('cycle.exploreProjects')}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
