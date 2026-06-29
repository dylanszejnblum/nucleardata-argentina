import { useTranslations } from 'next-intl'
import { InstrumentReadout } from './InstrumentReadout'

const HERO_STATS = [
  { value: 140, unit: '%', labelKey: 'hero.demand', prefix: '+' },
  { value: 70, labelKey: 'hero.reactors' },
  { value: 25, unit: '+', labelKey: 'hero.countries' },
  { value: 60, unit: 'yr', labelKey: 'hero.worldbank' },
]

/**
 * Global Context hero. Four big numbers framing the nuclear renaissance, then
 * the section tagline.
 */
export function GlobalContextHero() {
  const t = useTranslations('globalContext')
  return (
    <section className="container pt-10 pb-8 md:pt-16 md:pb-10">
      <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
        {t('eyebrow')}
      </span>
      <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl leading-[0.92] text-nd-text-display md:text-8xl">
        {t('title')}
      </h1>
      <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-nd-text-secondary font-sans">
        {t('tagline')}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px border border-nd-border bg-nd-border lg:grid-cols-4">
        {HERO_STATS.map((s) => (
          <div key={s.labelKey} className="bg-nd-surface p-5 md:p-7">
            <InstrumentReadout
              label={t(s.labelKey)}
              value={s.value}
              unit={s.unit}
              size="xl"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
