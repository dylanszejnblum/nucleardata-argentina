'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import nextDynamic from 'next/dynamic'
import { cn } from '@/utilities/ui'

const ReactorCore = nextDynamic(
  () => import('./ReactorCore').then((m) => ({ default: m.ReactorCore })),
  { ssr: false },
)

const TABS = ['PHWR', 'CANDU', 'CAREM'] as const
type Tab = (typeof TABS)[number]

const TAB_BLURB: Record<Tab, { es: string; en: string }> = {
  PHWR: {
    es: 'Reactor de agua pesada a presión — Atucha I & II (Siemens/KWU).',
    en: 'Pressurized heavy water reactor — Atucha I & II (Siemens/KWU).',
  },
  CANDU: {
    es: 'Canada Deuterium Uranium — Embalse (AECL), 2064 MWt.',
    en: 'Canada Deuterium Uranium — Embalse (AECL), 2064 MWt.',
  },
  CAREM: {
    es: 'SMR argentino — CAREM-25 (CNEA/INVAP), 100 MWt, integrado.',
    en: 'Argentine SMR — CAREM-25 (CNEA/INVAP), 100 MWt, integrated.',
  },
}

/**
 * Control Room hero: full-bleed 3D CANDU-6 cutaway backdrop with overlaid
 * title, subtitle and a visual reactor-type selector (no model switching yet).
 */
export function ControlRoomHero() {
  const t = useTranslations('controlRoom')
  const [tab, setTab] = useState<Tab>('CANDU')

  return (
    <section className="relative h-[58vh] min-h-[440px] w-full overflow-hidden border-b border-nd-border">
      {/* 3D backdrop */}
      <div className="absolute inset-0">
        <ReactorCore active />
      </div>
      {/* Readability veil */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, var(--nd-surface) 0%, transparent 55%, var(--nd-surface) 100%)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, var(--nd-surface) 0%, transparent 45%)' }}
        aria-hidden
      />

      {/* Overlay text */}
      <div className="relative z-10 container flex h-full flex-col justify-between py-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
            <span className="nd-live-dot inline-block size-2" style={{ backgroundColor: 'var(--nd-accent)' }} aria-hidden />
            {t('eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-6xl leading-[0.9] text-nd-text-display md:text-8xl">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-nd-text-secondary font-sans">
            {t('subtitle')}
          </p>
        </div>

        {/* Reactor-type selector tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tb) => {
            const isActive = tb === tab
            return (
              <button
                key={tb}
                type="button"
                onClick={() => setTab(tb)}
                className={cn(
                  'border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-mono transition-colors',
                  isActive ? 'text-nd-text-display' : 'text-nd-text-secondary hover:text-nd-text-primary',
                )}
                style={isActive ? { borderColor: 'var(--nd-accent)', backgroundColor: 'var(--nd-accent-subtle)' } : { borderColor: 'var(--nd-border-visible)' }}
              >
                {tb}
              </button>
            )
          })}
          <span className="ml-2 text-[11px] text-nd-text-secondary font-mono">
            {TAB_BLURB[tab].es}
          </span>
        </div>
      </div>
    </section>
  )
}
