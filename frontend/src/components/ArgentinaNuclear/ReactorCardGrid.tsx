'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { REACTORS } from '@/lib/nuclear-mock-data'
import { cn } from '@/utilities/ui'
import { StatusBadge } from './StatusBadge'
import { ReactorDetail } from './ReactorDetail'
import { statusMeta, REACTOR_TYPE } from './theme'

/**
 * Grid of reactor cards. Power reactors render as wide hero cards; prototype
 * and the rest render in a compact grid. Clicking a card expands an inline
 * detail panel (accordion-style; only one open at a time).
 */
export function ReactorCardGrid() {
  const t = useTranslations('reactors')
  const [openId, setOpenId] = useState<string | null>(null)

  const power = REACTORS.filter((r) => r.category === 'power')
  const prototype = REACTORS.filter((r) => r.category === 'prototype')
  // Research reactors are rendered separately by <ResearchFleetTable />.
  const featured = [...power, ...prototype]

  return (
    <section className="container pb-4">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
            {t('fleet.eyebrow')}
          </span>
          <h2 className="mt-2 font-display text-3xl leading-none text-nd-text-display md:text-4xl">
            {t('fleet.title')}
          </h2>
        </div>
        <p className="max-w-md text-pretty text-sm leading-6 text-nd-text-secondary font-sans">
          {t('fleet.blurb')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-nd-border md:grid-cols-2 lg:grid-cols-3">
        {featured.map((r) => {
          const isOpen = openId === r.id
          const sm = statusMeta(r.status)
          const tm = REACTOR_TYPE[r.type]
          const isHero = r.category === 'power'
          return (
            <div
              key={r.id}
              className={cn(
                'group border bg-nd-surface',
                isHero ? 'lg:col-span-1' : '',
                isOpen && 'ring-1 ring-inset',
              )}
              style={isOpen ? { '--tw-ring-color': 'var(--nd-accent)' } as React.CSSProperties : undefined}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : r.id)}
                aria-expanded={isOpen}
                className="flex w-full flex-col gap-4 p-5 text-left md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="inline-block border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em]"
                      style={{ borderColor: tm.color, color: tm.color }}
                    >
                      {tm.label}
                    </span>
                    <h3 className="mt-2 font-display text-3xl leading-none text-nd-text-display">
                      {r.name}
                    </h3>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
                      {r.city}, {r.province}
                    </span>
                  </div>
                  <StatusBadge color={sm.color} label={sm.labelEs} />
                </div>

                <div className="grid grid-cols-3 gap-px border border-nd-border bg-nd-border">
                  <KpiCell
                    label={r.capacityMwe != null ? 'MWe' : 'MWt'}
                    value={r.capacityMwe ?? r.capacityMwt ?? 0}
                  />
                  <KpiCell
                    label={t('card.firstCrit')}
                    value={
                      r.firstCriticality
                        ? new Date(r.firstCriticality).getFullYear()
                        : '—'
                    }
                  />
                  <KpiCell
                    label={t('card.factor')}
                    value={r.lifetimeFactor != null ? `${r.lifetimeFactor.toFixed(0)}%` : '—'}
                  />
                </div>

                <span
                  className="text-[11px] uppercase tracking-[0.1em] font-mono"
                  style={{ color: 'var(--nd-accent)' }}
                >
                  {isOpen ? t('card.close') : t('card.expand')} →
                </span>
              </button>

              {isOpen ? <ReactorDetail reactor={r} /> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function KpiCell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-nd-surface px-2 py-2">
      <span className="block text-[10px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
        {label}
      </span>
      <span
        className="font-display text-xl tabular-nums leading-none text-nd-text-display"
        data-numeric
      >
        {value}
      </span>
    </div>
  )
}
