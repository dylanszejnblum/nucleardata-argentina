'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { FUEL_CYCLE_STEPS } from '@/lib/nuclear-mock-data'
import { capabilityMeta } from './theme'
import { cn } from '@/utilities/ui'

/**
 * Horizontal nav of the 10 fuel-cycle steps. Each node is a numbered circle on
 * a connecting rail, with a capability badge. Hovering reveals a tooltip with
 * the full name + description; clicking navigates to the step anchor.
 *
 * Renders a single scrollable row on small screens.
 */
export function FuelCycleNav() {
  const t = useTranslations('controlRoom')
  const locale = useLocale()
  const router = useRouter()
  const [hover, setHover] = useState<number | null>(null)

  const nameOf = (s: (typeof FUEL_CYCLE_STEPS)[number]) =>
    locale === 'en' ? s.nameEn : s.nameEs
  const descOf = (s: (typeof FUEL_CYCLE_STEPS)[number]) =>
    locale === 'en' ? s.descriptionEn : s.descriptionEs

  return (
    <section className="container py-10">
      <div className="mb-5 flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
          {t('fuelCycle.eyebrow')}
        </span>
        <h2 className="font-display text-2xl leading-none text-nd-text-display md:text-3xl">
          {t('fuelCycle.title')}
        </h2>
      </div>

      <div className="relative overflow-x-auto border border-nd-border bg-nd-surface px-4 py-8">
        <ol className="relative flex min-w-[760px] items-start justify-between gap-2">
          {/* Connecting rail */}
          <span
            className="absolute left-0 right-0 top-[1.4rem] h-px"
            style={{ backgroundColor: 'var(--nd-border-visible)' }}
            aria-hidden
          />
          {FUEL_CYCLE_STEPS.map((s) => {
            const cap = capabilityMeta(s.capability)
            return (
              <li
                key={s.id}
                className="relative z-10 flex w-16 flex-col items-center gap-2 text-center"
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
              >
                <button
                  type="button"
                  onClick={() => router.push(`/ciclo-combustible#step-${s.id}`)}
                  aria-label={`${nameOf(s)} — ${descOf(s)}`}
                  className="group relative grid size-11 place-items-center border bg-nd-surface font-mono text-sm tabular-nums transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: hover === s.id ? cap.color : 'var(--nd-border-visible)',
                    color: 'var(--nd-text-display)',
                    boxShadow: hover === s.id ? `0 0 0 2px ${cap.color}33` : undefined,
                  }}
                >
                  {s.id}
                  {/* Capability dot */}
                  <span
                    className="absolute -right-1 -top-1 size-2.5 border border-nd-surface"
                    style={{ backgroundColor: cap.color }}
                    aria-hidden
                  />
                </button>
                <span
                  className={cn(
                    'text-[10px] uppercase tracking-[0.06em] font-mono leading-tight',
                    hover === s.id ? 'text-nd-text-primary' : 'text-nd-text-secondary',
                  )}
                >
                  {nameOf(s)}
                </span>

                {/* Tooltip */}
                {hover === s.id ? (
                  <div
                    role="tooltip"
                    className="absolute top-full z-20 mt-1 w-48 border border-nd-border-visible bg-nd-surface p-3 text-left shadow-[none]"
                  >
                    <span className="block text-[10px] uppercase tracking-[0.1em] font-mono" style={{ color: cap.color }}>
                      {locale === 'en' ? cap.labelEn : cap.labelEs}
                    </span>
                    <span className="mt-1 block font-display text-base leading-tight text-nd-text-display">
                      {nameOf(s)}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-nd-text-secondary font-sans">
                      {descOf(s)}
                    </span>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
