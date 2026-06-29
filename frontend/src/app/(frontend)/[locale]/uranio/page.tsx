import type { Metadata } from 'next'
import nextDynamic from 'next/dynamic'
import { getLocale, getTranslations } from 'next-intl/server'
import { NothingHeader } from '@/components/Nothing/Header'
import { NothingFooter } from '@/components/Nothing/Footer'
import { api, type ApiSchemas } from '@/api/client'
import { buildAlternates } from '@/i18n/alternates'
import { uraniumStatusColor, URANIUM_STATUS_ORDER } from '@/components/Petrodata/uranium/theme'
import type { Locale } from '@/components/Petrodata/uranium/content'
import type {
  HeroData,
  StatsData,
  PricePoint,
  ProjectPoint,
  StatusSlice,
  TradeRow,
} from '@/components/Petrodata/uranium/types'
import { UraniumHero } from '@/components/Petrodata/uranium/UraniumHero'
import { UraniumStats } from '@/components/Petrodata/uranium/UraniumStats'
import { PriceChart } from '@/components/Petrodata/uranium/PriceChart'
import { UraniumProjectsTable } from '@/components/Petrodata/uranium/UraniumProjectsTable'
import { StatusDonut } from '@/components/Petrodata/uranium/StatusDonut'
import { TradeChart } from '@/components/Petrodata/uranium/TradeChart'
import { TradeFlowExplorer } from '@/components/Petrodata/entities/TradeFlowExplorer'
import { CycleOverview } from '@/components/Petrodata/uranium/CycleOverview'
import { ProcessScrolly } from '@/components/Petrodata/uranium/ProcessScrolly'
import { ProcessDiagram } from '@/components/Petrodata/uranium/ProcessDiagram'
import { ArgentinaContext } from '@/components/Petrodata/uranium/ArgentinaContext'

const UraniumMap = nextDynamic(
  () => import('@/components/Petrodata/uranium/UraniumMap').then((m) => ({ default: m.UraniumMap })),
  { loading: () => <div className="h-full w-full animate-pulse bg-nd-surface-raised" /> },
)

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Summary = ApiSchemas['UraniumSummaryDto']
type PricesResp = ApiSchemas['UraniumPricesResponseDto']
type ProjectsResp = ApiSchemas['UraniumProjectsResponseDto']
type TradeResp = ApiSchemas['UraniumTradeResponseDto']
type TradeFlowDto = ApiSchemas['TradeFlowDto']

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('uraniumHub')
  return {
    title: `${t('title')} — Argentina`,
    alternates: buildAlternates('/uranio'),
  }
}

const num = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

async function getSummary(): Promise<Summary | null> {
  try {
    const { data, error } = await api.GET('/api/v2/minerals/uranium/summary', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

async function getPrices(): Promise<PricesResp | null> {
  try {
    const { data, error } = await api.GET('/api/v2/minerals/uranium/prices', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

async function getProjects(): Promise<ProjectsResp | null> {
  try {
    const { data, error } = await api.GET('/api/v2/minerals/uranium/projects', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

async function getTrade(): Promise<TradeResp | null> {
  try {
    const { data, error } = await api.GET('/api/v2/minerals/uranium/trade', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

async function getTradeFlow(): Promise<TradeFlowDto | null> {
  try {
    const { data, error } = await api.GET('/api/v2/minerals/trade/flow', { cache: 'no-store' })
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

export default async function UraniumHubPage() {
  const [t, locale, summary, pricesResp, projectsResp, tradeResp, flow] = await Promise.all([
    getTranslations('uraniumHub'),
    getLocale(),
    getSummary(),
    getPrices(),
    getProjects(),
    getTrade(),
    getTradeFlow(),
  ])
  const loc = (locale === 'en' ? 'en' : 'es') as Locale

  if (!summary) {
    const tCommon = await getTranslations('common')
    return (
      <>
        <NothingHeader />
        <main className="flex-1 flex items-center justify-center text-nd-text-disabled text-sm font-mono">
          {tCommon('backendOffline', {
            url: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
          })}
        </main>
        <NothingFooter />
      </>
    )
  }

  const stats: PricesResp['prices'] = pricesResp?.prices ?? []
  const priceStats = summary.priceStats

  const hero: HeroData = {
    price: num(summary.currentPrice),
    date: typeof summary.currentDate === 'string' ? summary.currentDate : null,
    changePct: num(summary.priceChangePct),
    low: priceStats.allTimeLow
      ? { value: priceStats.allTimeLow.value, date: priceStats.allTimeLow.date }
      : null,
    high: priceStats.allTimeHigh
      ? { value: priceStats.allTimeHigh.value, date: priceStats.allTimeHigh.date }
      : null,
    resources: num(summary.totalResources),
    production: num(summary.historicalProduction),
    unit: priceStats.unit || 'USD/lb',
  }

  const projects: ProjectPoint[] = (projectsResp?.projects ?? []).map((p) => {
    const controllers = p.controllers ?? []
    return {
      name: p.name,
      lat: num(p.latitude) ?? 0,
      lng: num(p.longitude) ?? 0,
      province: str(p.province),
      statusCode: str(p.status),
      statusLabel: str(p.status_label),
      company: controllers[0]?.name ?? '—',
      origin: str(controllers[0]?.origin_country),
    }
  })

  const companies = new Set(
    (projectsResp?.projects ?? []).flatMap((p) => (p.controllers ?? []).map((c) => c.name)),
  ).size

  const statsData: StatsData = {
    projects: summary.activeProjects,
    provinces: summary.provincesWithProjects,
    companies: companies || 0,
    advanced: summary.advancedProjects,
    resources: num(summary.totalResources),
  }

  const pricePoints: PricePoint[] = stats
    .map((p) => ({ date: p.date, price: p.price_usd }))
    .filter((p) => Number.isFinite(p.price))
    .sort((a, b) => a.date.localeCompare(b.date))

  const statusSlices: StatusSlice[] = Object.entries(summary.projectsByStatus)
    .map(([label, count]) => ({ label, count, color: uraniumStatusColor(label) }))
    .sort((a, b) => statusRank(a.label) - statusRank(b.label))

  const trade: TradeRow[] = [
    ...(tradeResp?.imports ?? []).map((r) => ({ year: r.year, type: 'import' as const, value: r.value_usd })),
    ...(tradeResp?.exports ?? []).map((r) => ({ year: r.year, type: 'export' as const, value: r.value_usd })),
  ]

  const fromYear = pricePoints[0]?.date.slice(0, 4) ?? ''
  const toYear = pricePoints[pricePoints.length - 1]?.date.slice(0, 4) ?? ''

  return (
    <>
      <NothingHeader />
      <main className="flex-1 w-full overflow-x-clip">
        <UraniumHero data={hero} />

        <section className="container pb-12">
          <UraniumStats data={statsData} />
        </section>

        <section id="price-chart" className="container pb-12 scroll-mt-24">
          <SectionHead eyebrow={t('priceChart.eyebrow')} title={t('priceChart.title')}>
            {pricePoints.length > 0
              ? t('priceChart.subtitle', { n: pricePoints.length, from: fromYear, to: toYear })
              : null}
          </SectionHead>
          <div className="border border-nd-border bg-nd-surface p-5 md:p-6">
            {pricePoints.length > 0 ? (
              <PriceChart points={pricePoints} low={hero.low} high={hero.high} unit={hero.unit} />
            ) : (
              <p className="text-nd-text-disabled text-sm font-mono">{t('priceChart.noData')}</p>
            )}
          </div>
        </section>

        <section className="container pb-12">
          <SectionHead eyebrow={t('map.eyebrow')} title={t('map.title')}>
            {t('map.mapped', { n: projects.length })}
          </SectionHead>
          <div className="h-[65vh] min-h-[480px] overflow-hidden border border-nd-border bg-nd-surface">
            <UraniumMap projects={projects} legendLabel={t('map.legend')} />
          </div>
        </section>

        <section id="projects" className="container pb-12 scroll-mt-24">
          <SectionHead eyebrow={t('table.eyebrow')} title={t('table.title')}>
            {t('table.subtitle', { n: projects.length })}
          </SectionHead>
          <UraniumProjectsTable projects={projects} />
        </section>

        {/* Projects by status (donut) + imports vs exports (bars) */}
        <section className="container pb-12">
          <div className="grid grid-cols-1 gap-px bg-nd-border lg:grid-cols-2">
            <div className="bg-nd-surface p-5 md:p-6">
              <SectionHead eyebrow={t('donut.eyebrow')} title={t('donut.title')} compact />
              <StatusDonut data={statusSlices} />
            </div>
            <div className="bg-nd-surface p-5 md:p-6">
              <SectionHead eyebrow={t('trade.eyebrow')} title={t('trade.title')} compact />
              {trade.length > 0 ? (
                <TradeChart rows={trade} importsLabel={t('trade.imports')} exportsLabel={t('trade.exports')} />
              ) : (
                <p className="text-nd-text-disabled text-sm font-mono">{t('trade.noData')}</p>
              )}
            </div>
          </div>
        </section>

        {/* Trade flow — Sankey embedded (uranium is the only mineral with trade data) */}
        <section className="container pb-16">
          <SectionHead eyebrow={t('trade.eyebrow')} title={t('trade.flowTitle')} />
          {flow ? (
            <TradeFlowExplorer initial={flow} minerals={['Uranio']} />
          ) : (
            <p className="text-nd-text-disabled text-sm font-mono">{t('trade.noData')}</p>
          )}
        </section>

        {/* Educational fuel-cycle */}
        <div id="cycle" className="scroll-mt-24 border-t border-nd-border">
          <CycleOverview locale={loc} />
          <ProcessScrolly locale={loc} />
          <ProcessDiagram locale={loc} />
          <ArgentinaContext locale={loc} />
        </div>
      </main>
      <NothingFooter />
    </>
  )
}

function statusRank(label: string): number {
  const i = URANIUM_STATUS_ORDER.findIndex((s) => s.toLowerCase() === label.toLowerCase())
  return i === -1 ? 99 : i
}

function SectionHead({
  eyebrow,
  title,
  children,
  compact = false,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
  compact?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 md:flex-row md:items-end md:justify-between ${compact ? 'mb-5' : 'mb-6'}`}>
      <div>
        <span className="block text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
          {eyebrow}
        </span>
        <h2
          className={`mt-2 text-balance leading-none text-nd-text-display font-display ${
            compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
          }`}
        >
          {title}
        </h2>
      </div>
      {children != null && (
        <span className="text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
          {children}
        </span>
      )}
    </div>
  )
}
