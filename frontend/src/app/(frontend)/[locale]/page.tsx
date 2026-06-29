import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { NothingHeader } from '@/components/Nothing/Header'
import { NothingFooter } from '@/components/Nothing/Footer'
import { HomeHero } from '@/components/ArgentinaNuclear/HomeHero'
import { InstrumentReadout } from '@/components/ArgentinaNuclear/InstrumentReadout'
import { FuelCycle3D } from '@/components/ArgentinaNuclear/FuelCycle3D'
import { AtlasIndex } from '@/components/ArgentinaNuclear/AtlasIndex'
import { getSocialImageURL } from '@/utilities/getSocialImageURL'
import { buildAlternates } from '@/i18n/alternates'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: buildAlternates('/'),
    openGraph: {
      images: [{ url: getSocialImageURL(), width: 1200, height: 630, alt: 'Argentina Nuclear' }],
    },
  }
}

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
      <div>
        <span className="block text-[10px] uppercase tracking-label text-nd-text-disabled font-mono">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-display font-bold uppercase tracking-display-tight leading-[0.92] text-4xl sm:text-5xl md:text-6xl text-nd-text-display">
          {title}
        </h2>
      </div>
      {children != null && (
        <p className="max-w-md text-sm md:text-base text-nd-text-secondary font-sans leading-snug">
          {children}
        </p>
      )}
    </div>
  )
}

export default async function HomePage() {
  const t = await getTranslations('home')
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'

  const kpiLabels =
    locale === 'en'
      ? [
          'Nuclear power reactors in operation',
          'Indigenous modular reactor · CAREM-25',
          'Years of nuclear program · CNEA 1950',
          'Stages of the national fuel cycle',
        ]
      : [
          'Reactores nucleoeléctricos en operación',
          'Reactor modular propio · CAREM-25',
          'Años de programa nuclear · CNEA 1950',
          'Etapas del ciclo de combustible nacional',
        ]

  return (
    <>
      <NothingHeader floating />
      <main className="flex-1 w-full overflow-x-clip">
        <HomeHero />

        {/* Atlas index — the full gateway, within one scroll of the hero */}
        <section id="atlas" className="container py-16 md:py-24 scroll-mt-24">
          <SectionHead eyebrow={t('atlasEyebrow')} title={t('atlasTitle')}>
            {t('atlasBody')}
          </SectionHead>
          <AtlasIndex />
        </section>

        {/* KPI instrument readouts */}
        <section className="container py-16 md:py-24 border-t border-nd-border">
          <SectionHead eyebrow={t('kpiEyebrow')} title={t('kpiTitle')}>
            {t('kpiBody')}
          </SectionHead>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4 md:gap-x-10 border-t border-nd-border">
            <InstrumentReadout index="01" value={3} label={kpiLabels[0]} />
            <InstrumentReadout index="02" value={1} label={kpiLabels[1]} />
            <InstrumentReadout index="03" value={76} pad={0} label={kpiLabels[2]} />
            <InstrumentReadout index="04" value={6} label={kpiLabels[3]} />
          </div>
        </section>

        {/* Fuel cycle flow */}
        <section className="container py-16 md:py-24 border-t border-nd-border">
          <SectionHead eyebrow={t('cycleEyebrow')} title={t('cycleTitle')}>
            {t('cycleBody')}
          </SectionHead>
          <div className="border border-nd-border bg-nd-surface p-4 md:p-6 overflow-hidden">
            <FuelCycle3D />
          </div>
        </section>

        {/* About band */}
        <section className="container py-16 md:py-24 border-t border-nd-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="block text-[10px] uppercase tracking-label text-nd-text-disabled font-mono">
                {t('aboutEyebrow')}
              </span>
              <p className="mt-4 font-display font-medium uppercase tracking-display-tight text-2xl sm:text-3xl md:text-4xl leading-[1.1] text-nd-text-display">
                {t('aboutTitle')}
              </p>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-nd-text-secondary font-sans leading-relaxed">
                {t('aboutBody')}
              </p>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-nd-border lg:pl-16 flex flex-col gap-6 justify-end">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-nd-accent nd-live-dot" />
                <span className="font-mono text-[11px] uppercase tracking-label text-nd-text-disabled">
                  Zirconio · Argentina Nuclear
                </span>
              </div>
              <Link
                href="/metodologia"
                className="inline-flex items-center gap-2 self-start border border-nd-border px-4 py-2 font-mono text-[11px] uppercase tracking-label text-nd-text-primary hover:bg-nd-surface-raised transition-colors"
              >
                {t('aboutCta')} →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NothingFooter />
    </>
  )
}
