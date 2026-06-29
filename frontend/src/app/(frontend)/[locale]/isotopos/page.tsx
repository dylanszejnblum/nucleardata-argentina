import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { SectionPlaceholder } from '@/components/ArgentinaNuclear/SectionPlaceholder'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sections')
  return {
    title: t('isotopos'),
    description: t('isotoposDesc'),
    alternates: buildAlternates('/isotopos'),
  }
}

const CONTENT = {
  es: {
    tagline: 'Argentina, entre los mayores proveedores mundiales de radioisótopos médicos.',
    description:
      'El CNEA produce Mo-99 para diagnóstico, Co-60 (también generado en Embalse) para radioterapia y usos industriales, e I-131. Esta sección mapea la producción, los destinos de exportación y la participación de Argentina en el abastecimiento global de isótopos.',
    coming: [
      'Producción anual de Mo-99, Co-60 e I-131',
      'Mapa de destinos de exportación',
      'Participación de Argentina en el suministro mundial',
      'Cadena logística: del reactor al hospital',
    ],
  },
  en: {
    tagline: 'Argentina, among the world’s largest suppliers of medical radioisotopes.',
    description:
      'CNEA produces Mo-99 for diagnostics, Co-60 (also generated at Embalse) for radiotherapy and industrial use, and I-131. This section maps production, export destinations and Argentina’s share of global isotope supply.',
    coming: [
      'Annual production of Mo-99, Co-60 and I-131',
      'Export-destination map',
      'Argentina’s share of global supply',
      'The logistics chain: reactor to hospital',
    ],
  },
}

export default async function IsotoposPage() {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'
  const t = await getTranslations('sections')
  const c = CONTENT[locale]
  return (
    <SectionPlaceholder
      index="03 · Isótopos"
      title={t('isotopos')}
      tagline={c.tagline}
      description={c.description}
      coming={c.coming}
    />
  )
}
