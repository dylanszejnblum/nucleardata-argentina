import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NothingHeader } from '@/components/Nothing/Header'
import { NothingFooter } from '@/components/Nothing/Footer'
import { api } from '@/api/client'
import { buildAlternates } from '@/i18n/alternates'
import { ExportSummaryView } from '@/components/Petrodata/entities/ExportSummaryView'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('exportaciones')
  return { title: t('title'), alternates: buildAlternates('/exportaciones') }
}

async function getSummary() {
  try {
    const { data, error } = await api.GET('/api/v2/provinces/export-summary', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

export default async function ExportacionesPage() {
  const [t, summary] = await Promise.all([getTranslations('exportaciones'), getSummary()])

  const bySector = summary
    ? Object.entries(summary.national_by_sector).map(([sector, value]) => ({ sector, value }))
    : []
  const provinces = (summary?.provinces ?? []).map((p) => ({
    slug: p.slug,
    name: p.name,
    total: p.total_export_usd,
    bySector: p.by_sector,
  }))

  return (
    <>
      <NothingHeader />
      <main className="flex-1 w-full">
        <section className="container pt-12 pb-8 md:pt-20">
          <span className="block text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
            {t('eyebrow')}
          </span>
          <h1 className="mt-4 text-balance text-5xl leading-none text-nd-text-display md:text-7xl font-display">
            {t('title')}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-nd-text-secondary font-sans">
            {t('blurb')}
          </p>
        </section>
        <section className="container pb-20">
          {summary ? (
            <ExportSummaryView nationalTotal={summary.national_total_usd} bySector={bySector} provinces={provinces} />
          ) : (
            <p className="text-sm text-nd-text-disabled font-mono">{t('noData')}</p>
          )}
        </section>
      </main>
      <NothingFooter />
    </>
  )
}
