import { useTranslations } from 'next-intl'
import { REACTOR_SUMMARY, REACTORS } from '@/lib/nuclear-mock-data'
import { InstrumentReadout } from './InstrumentReadout'

/**
 * Hero for the Reactors page. Schematic-modernist masthead with three
 * instrument readouts: total GWe online, operational power reactors, and the
 * fleet's mean age (computed from first-criticality years).
 */
export function ReactorHero() {
  const t = useTranslations('reactors')

  const yearNow = new Date('2026-06-28').getFullYear()
  const ages = REACTORS.filter(
    (r) => r.category === 'power' && r.status === 'operational' && r.firstCriticality,
  ).map((r) => yearNow - new Date(r.firstCriticality!).getFullYear())
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0

  return (
    <section className="container pt-10 pb-8 md:pt-16 md:pb-10">
      <div className="flex items-center gap-3">
        <span
          className="grid size-7 place-items-center border text-[11px] font-mono"
          style={{ borderColor: 'var(--nd-accent)', color: 'var(--nd-accent)' }}
          aria-hidden
        >
          ⚛
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
          {t('eyebrow')}
        </span>
      </div>

      <h1 className="mt-5 max-w-4xl text-balance font-display text-5xl leading-[0.95] text-nd-text-display md:text-7xl">
        {t('heroTitle')}
      </h1>

      <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-nd-text-secondary font-sans">
        {t('heroTagline')}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-px border border-nd-border bg-nd-border sm:grid-cols-3">
        <div className="bg-nd-surface p-5 md:p-7">
          <InstrumentReadout
            label={t('kpi.totalMwe')}
            value={REACTOR_SUMMARY.totalMwe}
            unit="MWe"
            size="xl"
          />
        </div>
        <div className="bg-nd-surface p-5 md:p-7">
          <InstrumentReadout
            label={t('kpi.operationalPower')}
            value={REACTOR_SUMMARY.operationalPowerReactors}
            size="xl"
          />
          <span className="mt-2 block text-[11px] text-nd-text-secondary font-mono">
            +{REACTOR_SUMMARY.underConstruction} {t('kpi.underConstruction')}
          </span>
        </div>
        <div className="bg-nd-surface p-5 md:p-7">
          <InstrumentReadout
            label={t('kpi.avgAge')}
            value={avgAge}
            unit={t('kpi.years')}
            size="xl"
          />
          <span className="mt-2 block text-[11px] text-nd-text-secondary font-mono">
            {t('kpi.avgFactor')}{' '}
            <span className="tabular-nums" data-numeric>
              {REACTOR_SUMMARY.averageLifetimeFactor.toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
