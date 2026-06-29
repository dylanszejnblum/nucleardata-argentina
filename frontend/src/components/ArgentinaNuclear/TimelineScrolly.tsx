'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { HISTORY_MILESTONES } from '@/lib/nuclear-mock-data'
import type { HistoryMilestone } from '@/lib/nuclear-mock-data'
import { CATEGORY, significanceMeta } from './theme'
import { VisualPanel } from './VisualPanel'
import { cn } from '@/utilities/ui'

type Filter = 'all' | HistoryMilestone['category']
const FILTERS: { key: Filter; labelKey: string }[] = [
  { key: 'all', labelKey: 'filters.all' },
  { key: 'institutional', labelKey: 'filters.institutional' },
  { key: 'technical', labelKey: 'filters.technical' },
  { key: 'political', labelKey: 'filters.political' },
  { key: 'legal', labelKey: 'filters.legal' },
  { key: 'international', labelKey: 'filters.international' },
]

/**
 * Scrollytelling history timeline. Left column: vertical timeline of milestone
 * cards; an IntersectionObserver tracks which card is centred in the viewport
 * and highlights it (uranium-green) + drives the right-hand visual panel.
 * A row of category filters above narrows the list.
 */
export function TimelineScrolly() {
  const t = useTranslations('history')
  const [filter, setFilter] = useState<Filter>('all')
  const [activeId, setActiveId] = useState<number>(HISTORY_MILESTONES[0].id)
  const observerRefs = useRef<Record<number, HTMLLIElement | null>>({})

  const milestones = useMemo(() => {
    return filter === 'all'
      ? HISTORY_MILESTONES
      : HISTORY_MILESTONES.filter((m) => m.category === filter)
  }, [filter])

  // Reset active to the first visible milestone when the filter changes.
  useEffect(() => {
    if (milestones.length) setActiveId(milestones[0].id)
  }, [milestones])

  // Track the centred milestone.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const id = Number((visible[0].target as HTMLElement).dataset.milestoneId)
          if (!Number.isNaN(id)) setActiveId(id)
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    Object.values(observerRefs.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [milestones])

  const active = HISTORY_MILESTONES.find((m) => m.id === activeId) ?? null

  return (
    <section className="container py-10">
      {/* Category filters */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-mono transition-colors',
                isActive ? 'text-nd-text-display' : 'text-nd-text-secondary hover:text-nd-text-primary',
              )}
              style={
                isActive
                  ? { borderColor: 'var(--nd-accent)', backgroundColor: 'var(--nd-accent-subtle)' }
                  : { borderColor: 'var(--nd-border-visible)' }
              }
            >
              {t(f.labelKey)}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Timeline */}
        <ol className="relative border-l border-nd-border-visible pl-6">
          {milestones.map((m) => {
            const isActive = m.id === active?.id
            const sig = significanceMeta(m.significance)
            const cat = CATEGORY[m.category]
            return (
              <li
                key={m.id}
                ref={(el) => {
                  observerRefs.current[m.id] = el
                }}
                data-milestone-id={m.id}
                className="relative pb-12 last:pb-0"
              >
                {/* Node */}
                <span
                  className="absolute -left-[1.7rem] top-1 size-3.5 border"
                  style={{
                    backgroundColor: isActive ? sig.color : 'var(--nd-surface)',
                    borderColor: sig.color,
                    boxShadow: isActive ? `0 0 0 3px ${sig.color}33` : undefined,
                  }}
                  aria-hidden
                />
                <div
                  className={cn(
                    'border bg-nd-surface p-5 transition-all md:p-6',
                    isActive ? 'border-nd-border-visible' : 'border-nd-border',
                  )}
                  style={isActive ? { borderColor: 'var(--nd-accent)' } : undefined}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      className="font-display text-4xl leading-none tabular-nums text-nd-text-display md:text-5xl"
                      data-numeric
                      style={isActive ? { color: 'var(--nd-accent)' } : undefined}
                    >
                      {m.year}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.1em] font-mono"
                      style={{ color: sig.color }}
                    >
                      {sig.labelEs}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-tight text-nd-text-display md:text-2xl">
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-nd-text-secondary font-sans">
                    {m.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
                      {cat.labelEs}
                    </span>
                    {m.sources.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] uppercase tracking-[0.1em] text-nd-text-secondary font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        {/* Sticky visual panel */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <VisualPanel milestone={active} />
        </div>
      </div>
    </section>
  )
}
