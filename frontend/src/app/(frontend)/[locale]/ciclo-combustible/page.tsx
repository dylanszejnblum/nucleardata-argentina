import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NuclearPageShell } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { CycleFlowSVG } from '@/components/ArgentinaNuclear/CycleFlowSVG'
import { CAPABILITY } from '@/components/ArgentinaNuclear/theme'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('fuelCycle')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/ciclo-combustible'),
  }
}

export default async function FuelCyclePage() {
  const t = await getTranslations('fuelCycle')

  return (
    <NuclearPageShell>
      <section className="container pt-10 pb-8 md:pt-16 md:pb-10">
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
          {t('eyebrow')}
        </span>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl leading-[0.95] text-nd-text-display md:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-nd-text-secondary font-sans">
          {t('blurb')}
        </p>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border border-nd-border bg-nd-surface px-4 py-3">
          {(Object.keys(CAPABILITY) as Array<keyof typeof CAPABILITY>).map((k) => {
            const c = CAPABILITY[k]
            return (
              <span
                key={k}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono"
              >
                <span className="inline-block size-2.5" style={{ backgroundColor: c.color }} aria-hidden />
                {c.labelEs}
              </span>
            )
          })}
        </div>
      </section>

      <section className="container pb-20">
        <CycleFlowSVG />
      </section>
    </NuclearPageShell>
  )
}
