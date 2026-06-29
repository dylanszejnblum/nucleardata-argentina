import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { SectionPlaceholder } from '@/components/ArgentinaNuclear/SectionPlaceholder'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sections')
  return {
    title: t('reactores'),
    description: t('reactoresDesc'),
    alternates: buildAlternates('/reactores'),
  }
}

const CONTENT = {
  es: {
    tagline: 'Tres centrales nucleoeléctricas, un SMR propio y la flota de investigación del CNEA.',
    description:
      'Argentina opera Atucha I y II (PHWR) y Embalse (CANDU), desarrolla el prototipo de reactor modular CAREM-25 y mantiene una flota de reactores de investigación (RA-1 a RA-10). Esta sección los reúne con fichas técnicas, estado operativo y el corte esquemático interactivo.',
    coming: [
      'Corte esquemático 3D interactivo (PHWR · CANDU · CAREM)',
      'Fichas técnicas por reactor: potencia, tecnología, año, operador',
      'Estado operativo y factor de capacidad cuando los datos estén disponibles',
      'Línea de tiempo de la flota de investigación del CNEA',
    ],
  },
  en: {
    tagline: 'Three nuclear power plants, an indigenous SMR and CNEA’s research fleet.',
    description:
      'Argentina operates Atucha I & II (PHWR) and Embalse (CANDU), is developing the CAREM-25 SMR prototype, and runs a research-reactor fleet (RA-1 through RA-10). This section brings them together with spec sheets, operational status and the interactive schematic cutaway.',
    coming: [
      'Interactive 3D schematic cutaway (PHWR · CANDU · CAREM)',
      'Per-reactor spec sheets: capacity, technology, year, operator',
      'Operational status and capacity factor where data is available',
      'Timeline of CNEA’s research-reactor fleet',
    ],
  },
}

export default async function ReactoresPage() {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'
  const t = await getTranslations('sections')
  const c = CONTENT[locale]
  return (
    <SectionPlaceholder
      index="02 · Reactores"
      title={t('reactores')}
      tagline={c.tagline}
      description={c.description}
      coming={c.coming}
    />
  )
}
