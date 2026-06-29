import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { NuclearPageShell } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { ControlRoomHero } from '@/components/ArgentinaNuclear/ControlRoomHero'
import { KpiGrid } from '@/components/ArgentinaNuclear/KpiGrid'
import { FuelCycleNav } from '@/components/ArgentinaNuclear/FuelCycleNav'
import { KPI_DATA } from '@/lib/nuclear-mock-data'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('controlRoom')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/control-room'),
  }
}

const SIDEBAR_LINKS = [
  { href: '/historia', glyph: '📜', labelKey: 'sidebar.history' },
  { href: '/contexto-global', glyph: '🌍', labelKey: 'sidebar.global' },
  { href: '/mapa', glyph: '📍', labelKey: 'sidebar.map' },
  { href: '/reactores', glyph: '⚛', labelKey: 'sidebar.reactors' },
  { href: '/ciclo-combustible', glyph: '🔄', labelKey: 'sidebar.fuelCycle' },
] as const

export default async function ControlRoomPage() {
  const t = await getTranslations('controlRoom')
  const freshness = new Date(KPI_DATA.dataFreshness).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <NuclearPageShell backdrop="graticule" fullscreen>
      <ControlRoomHero />

      <div className="container grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_15rem]">
        {/* Main column */}
        <div className="min-w-0">
          <KpiGrid />
          <FuelCycleNav />
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <nav className="border border-nd-border bg-nd-surface">
            <span className="block border-b border-nd-border px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
              {t('sidebar.eyebrow')}
            </span>
            <ul>
              {SIDEBAR_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-3 border-b border-nd-border px-4 py-3 text-sm text-nd-text-primary font-sans transition-colors last:border-b-0 hover:bg-nd-surface-raised"
                  >
                    <span className="grid size-6 place-items-center text-xs" aria-hidden>
                      {l.glyph}
                    </span>
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
              <span className="nd-live-dot inline-block size-1.5" style={{ backgroundColor: 'var(--nd-accent)' }} aria-hidden />
              {t('sidebar.freshness', { date: freshness })}
            </div>
          </nav>
        </aside>
      </div>
    </NuclearPageShell>
  )
}
