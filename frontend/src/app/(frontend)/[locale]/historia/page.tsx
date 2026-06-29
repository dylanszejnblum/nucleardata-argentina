import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NuclearPageShell, NuclearSectionHeading } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { TimelineScrolly } from '@/components/ArgentinaNuclear/TimelineScrolly'
import { HISTORY_MILESTONES } from '@/lib/nuclear-mock-data'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('history')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/historia'),
  }
}

export default async function HistoryPage() {
  const t = await getTranslations('history')
  const span = `${HISTORY_MILESTONES[0].year}–${HISTORY_MILESTONES[HISTORY_MILESTONES.length - 1].year}`

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
          {t('blurb', { span })}
        </p>
      </section>

      <TimelineScrolly />

      <section className="container pb-20">
        <NuclearSectionHeading eyebrow={t('method.eyebrow')} title={t('method.title')} />
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-nd-text-secondary font-sans">
          {t('method.body')}
        </p>
      </section>
    </NuclearPageShell>
  )
}
