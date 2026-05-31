'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { animateCounter, useInView } from './anim'
import type { StatsData } from './types'

export function UraniumStats({ data }: { data: StatsData }) {
  const t = useTranslations('uraniumHub.stats')
  const locale = useLocale()
  const nf = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-AR')

  const cards = [
    { key: 'projects', label: t('projects'), value: data.projects, fmt: (v: number) => String(Math.round(v)) },
    { key: 'provinces', label: t('provinces'), value: data.provinces, fmt: (v: number) => String(Math.round(v)) },
    { key: 'companies', label: t('companies'), value: data.companies, fmt: (v: number) => String(Math.round(v)) },
    { key: 'advanced', label: t('advanced'), value: data.advanced, fmt: (v: number) => String(Math.round(v)) },
    ...(data.resources != null
      ? [{ key: 'resources', label: t('resources'), value: data.resources, fmt: (v: number) => nf.format(Math.round(v)) }]
      : []),
  ]

  const { ref, inView } = useInView<HTMLDivElement>()
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!inView) return
    const anims = cards.map((c, i) => {
      const el = valueRefs.current[i]
      if (!el) return undefined
      return animateCounter(el, c.value, { duration: 2200, delay: i * 200, format: c.fmt })
    })
    return () => anims.forEach((a) => a?.pause?.())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px bg-nd-border md:grid-cols-4"
      style={{ gridTemplateColumns: cards.length === 5 ? undefined : undefined }}
    >
      {cards.map((c, i) => (
        <div key={c.key} className="bg-nd-surface p-5 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
            {c.label}
          </span>
          <span
            ref={(el) => {
              valueRefs.current[i] = el
            }}
            className="text-4xl md:text-5xl leading-none tabular-nums text-nd-text-display font-display"
          >
            {c.fmt(c.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
