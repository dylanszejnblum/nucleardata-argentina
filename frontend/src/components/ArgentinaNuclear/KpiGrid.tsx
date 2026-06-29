'use client'

import { useLocale, useTranslations } from 'next-intl'
import { InstrumentReadout } from './InstrumentReadout'
import { KPI_DATA } from '@/lib/nuclear-mock-data'

type Kpi = {
  label: string
  value: number
  unit?: string
  href: string
  decimals?: number
  prefix?: string
}

/**
 * Six instrument readouts in a responsive grid. Each is a locale-aware link to
 * the section it summarises. Number formatting is locale-aware (es-AR / en-US).
 */
export function KpiGrid() {
  const t = useTranslations('controlRoom')
  const locale = useLocale()
  const nf = Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const kpis: Kpi[] = [
    { label: t('kpi.totalMwe'), value: KPI_DATA.totalMwe, unit: 'MWe', href: '/reactores' },
    { label: t('kpi.gridPct'), value: KPI_DATA.gridPercentage, unit: '%', href: '/reactores' },
    { label: t('kpi.carem'), value: KPI_DATA.caremCapacity, unit: 'MWe', href: '/reactores#carem-25' },
    {
      label: t('kpi.u3o8'),
      value: KPI_DATA.u3o8Price,
      unit: '$/lb',
      href: '/contexto-global',
      decimals: 2,
    },
    { label: t('kpi.uraniumProjects'), value: KPI_DATA.uraniumProjects, href: '/contexto-global' },
    { label: t('kpi.historicalMines'), value: KPI_DATA.historicalMines, href: '/historia' },
  ]

  return (
    <section className="container py-10">
      <div className="grid grid-cols-2 gap-px border border-nd-border bg-nd-border lg:grid-cols-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="group relative bg-nd-surface p-5 transition-colors hover:bg-nd-surface-raised md:p-7"
          >
            <InstrumentReadout
              label={k.label}
              value={k.value}
              unit={k.unit}
              href={k.href}
              size="lg"
              format={
                k.decimals
                  ? (v) => nf.format(v)
                  : (v) => Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-AR').format(Math.round(v))
              }
            />
          </div>
        ))}
      </div>
    </section>
  )
}
