import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { SectionPlaceholder } from '@/components/ArgentinaNuclear/SectionPlaceholder'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sections')
  return {
    title: t('metodologia'),
    description: t('metodologiaDesc'),
    alternates: buildAlternates('/metodologia'),
  }
}

const CONTENT = {
  es: {
    tagline: 'Fuentes, linaje de datos y cómo se construye cada cifra.',
    description:
      'Argentina Nuclear documenta de dónde proviene cada dato: memorias del CNEA, informes de NA-SA y del ARN, datos de CAMMESA, reportes del INVAP y fuentes públicas. Aquí se detallan las fuentes por sección, la frecuencia de actualización y la metodología de cálculo.',
    coming: [
      'Tabla de fuentes por sección (CNEA, NA-SA, ARN, CAMMESA, INVAP)',
      'Linaje de datos y frecuencia de actualización',
      'Metodología de cálculo de cada indicador',
      'Sobre Zirconio',
    ],
  },
  en: {
    tagline: 'Sources, data lineage and how each figure is built.',
    description:
      'Argentina Nuclear documents where every figure comes from: CNEA memorias, NA-SA and ARN reports, CAMMESA data, INVAP reports and public sources. This section details sources per section, update frequency and the calculation methodology.',
    coming: [
      'Source table per section (CNEA, NA-SA, ARN, CAMMESA, INVAP)',
      'Data lineage and update frequency',
      'Calculation methodology per indicator',
      'About Zirconio',
    ],
  },
}

export default async function MetodologiaPage() {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'
  const t = await getTranslations('sections')
  const c = CONTENT[locale]
  return (
    <SectionPlaceholder
      index="00 · Metodología"
      title={t('metodologia')}
      tagline={c.tagline}
      description={c.description}
      coming={c.coming}
    />
  )
}
