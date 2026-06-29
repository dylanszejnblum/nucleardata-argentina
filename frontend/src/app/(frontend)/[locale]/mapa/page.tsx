import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NuclearPageShell } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { ProvinceMap } from '@/components/ArgentinaNuclear/ProvinceMap'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('mapNuclear')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/mapa'),
  }
}

export default async function NuclearMapPage() {
  const t = await getTranslations('mapNuclear')

  return (
    <NuclearPageShell>
      <section className="container pt-10 pb-6 md:pt-16 md:pb-8">
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
          {t('eyebrow')}
        </span>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl leading-[0.95] text-nd-text-display md:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-nd-text-secondary font-sans">
          {t('blurb')}
        </p>
      </section>

      <ProvinceMap />
    </NuclearPageShell>
  )
}
