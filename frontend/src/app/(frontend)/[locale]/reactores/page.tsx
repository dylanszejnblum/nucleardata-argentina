import type { Metadata } from 'next'
import nextDynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import { NuclearPageShell } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { ReactorHero } from '@/components/ArgentinaNuclear/ReactorHero'
import { ReactorCardGrid } from '@/components/ArgentinaNuclear/ReactorCardGrid'
import { ResearchFleetTable } from '@/components/ArgentinaNuclear/ResearchFleetTable'
import { buildAlternates } from '@/i18n/alternates'

const ReactorsMap = nextDynamic(
  () => import('@/components/ArgentinaNuclear/ReactorsMap').then((m) => ({ default: m.ReactorsMap })),
  {
    loading: () => (
      <section className="container pb-16">
        <div className="h-[58vh] min-h-[380px] animate-pulse border border-nd-border bg-nd-surface-raised" />
      </section>
    ),
  },
)

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reactors')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/reactores'),
  }
}

export default async function ReactorsPage() {
  return (
    <NuclearPageShell>
      <ReactorHero />
      <ReactorCardGrid />
      <ResearchFleetTable />
      <ReactorsMap />
    </NuclearPageShell>
  )
}
