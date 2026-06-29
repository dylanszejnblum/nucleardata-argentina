import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { SectionPlaceholder } from '@/components/ArgentinaNuclear/SectionPlaceholder'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sections')
  return {
    title: t('ciclo'),
    description: t('cicloDesc'),
    alternates: buildAlternates('/ciclo-combustible'),
  }
}

const CONTENT = {
  es: {
    tagline: 'De la mina al reactor y al almacenamiento: el ciclo del combustible nuclear argentino.',
    description:
      'Argentina es uno de los pocos países con ciclo de combustible prácticamente completo: minería de uranio, fabricación de combustibles (CONUAR/DIOXITEK), enriquecimiento (Pilcaniyeu, planta SIGMA), reactores y gestión del combustible irradiado. Esta sección traza el flujo completo.',
    coming: [
      'Diagrama de flujo del ciclo de combustible',
      'Fichas de cada etapa: minería, conversión, enriquecimiento, fabricación',
      'Planta SIGMA de Pilcaniyeu — enriquecimiento',
      'Gestión del combustible irradiado y almacenamiento seco',
    ],
  },
  en: {
    tagline: 'From mine to reactor to storage: Argentina’s nuclear fuel cycle.',
    description:
      'Argentina is one of the few countries with a nearly complete fuel cycle: uranium mining, fuel fabrication (CONUAR/DIOXITEK), enrichment (Pilcaniyeu, SIGMA plant), reactors and spent-fuel management. This section traces the full flow.',
    coming: [
      'Fuel-cycle flow diagram',
      'Spec sheet per stage: mining, conversion, enrichment, fabrication',
      'Pilcaniyeu SIGMA plant — enrichment',
      'Spent-fuel management and dry storage',
    ],
  },
}

export default async function CicloCombustiblePage() {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'
  const t = await getTranslations('sections')
  const c = CONTENT[locale]
  return (
    <SectionPlaceholder
      index="04 · Ciclo de combustible"
      title={t('ciclo')}
      tagline={c.tagline}
      description={c.description}
      coming={c.coming}
    />
  )
}
