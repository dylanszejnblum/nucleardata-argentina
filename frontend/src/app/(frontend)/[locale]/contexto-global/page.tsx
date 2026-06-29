import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { NuclearPageShell, NuclearSectionHeading } from '@/components/ArgentinaNuclear/NuclearPageShell'
import { GlobalContextHero } from '@/components/ArgentinaNuclear/GlobalContextHero'
import { DataCard } from '@/components/ArgentinaNuclear/DataCard'
import { PriceChart, ProductionBarChart, DataCenterChart } from '@/components/ArgentinaNuclear/GlobalCharts'
import { buildAlternates } from '@/i18n/alternates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('globalContext')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/contexto-global'),
  }
}

type Bi = { es: string; en: string }
type CardData = { eyebrow: Bi; value: Bi; subtitle: Bi; metadata?: Bi }

const RENAISSANCE: CardData[] = [
  {
    eyebrow: { es: 'Demanda de uranio', en: 'Uranium demand' },
    value: { es: '+30–140% hacia 2050', en: '+30–140% by 2050' },
    subtitle: {
      es: 'La NEA/OIEA proyecta un fuerte crecimiento de la demanda según el escenario de.triplicación nuclear.',
      en: 'NEA/IAEA projects strong demand growth under the nuclear tripling scenario.',
    },
    metadata: { es: 'NEA · OIEA', en: 'NEA · IAEA' },
  },
  {
    eyebrow: { es: 'Producción global', en: 'Global production' },
    value: { es: 'Kazajstán >40%', en: 'Kazakhstan >40%' },
    subtitle: {
      es: 'Concentración creciente en Kazajstán, con desvío de suministro hacia China y Rusia.',
      en: 'Growing concentration in Kazakhstan, with supply shifting toward China and Russia.',
    },
  },
  {
    eyebrow: { es: 'Estados Unidos', en: 'United States' },
    value: { es: 'Veta el uranio ruso', en: 'Bans Russian uranium' },
    subtitle: {
      es: 'US$ 2.7B en impulso doméstico y restricciones a importaciones de uranio enriquecido ruso.',
      en: '$2.7B domestic push and curbs on Russian enriched-uranium imports.',
    },
  },
  {
    eyebrow: { es: 'Níger', en: 'Niger' },
    value: { es: 'Nacionaliza Orano', en: 'Nationalizes Orano' },
    subtitle: {
      es: 'Revoca la subsidiaria de Orano y reconfigura la propiedad de la minería de uranio.',
      en: 'Revokes Orano subsidiary and reshapes uranium mining ownership.',
    },
  },
  {
    eyebrow: { es: 'Suecia', en: 'Sweden' },
    value: { es: 'Debate levantar veto', en: 'Considers lifting ban' },
    subtitle: {
      es: 'Evalúa eliminar la prohibición de minería de uranio vigente desde 2018.',
      en: 'Weighs removing the uranium mining ban in place since 2018.',
    },
  },
  {
    eyebrow: { es: 'Banco Mundial', en: 'World Bank' },
    value: { es: 'Levanta veto de 60 años', en: 'Ends 60-year ban' },
    subtitle: {
      es: 'Pone fin a seis décadas de prohibición de financiar proyectos nucleares.',
      en: 'Ends six decades of prohibition on financing nuclear projects.',
    },
  },
]

const DATA_CENTERS: CardData[] = [
  {
    eyebrow: { es: 'Demanda energética', en: 'Power demand' },
    value: { es: '+160% hacia 2030', en: '+160% by 2030' },
    subtitle: {
      es: 'Los centros de datos agregan el equivalente a una nueva economía industrial al sistema eléctrico.',
      en: 'Data centres add the equivalent of a new industrial economy to the grid.',
    },
    metadata: { es: 'Goldman Sachs, 2024', en: 'Goldman Sachs, 2024' },
  },
  {
    eyebrow: { es: 'xAI · Colossus', en: 'xAI · Colossus' },
    value: { es: '150 MW', en: '150 MW' },
    subtitle: {
      es: 'Un único sitio de cómputo consume la potencia de un barrio entero.',
      en: 'A single compute site draws the power of an entire neighbourhood.',
    },
  },
  {
    eyebrow: { es: 'Google', en: 'Google' },
    value: { es: '+ Kairos Power', en: '+ Kairos Power' },
    subtitle: {
      es: 'Acuerdo para comprar energía de SMRs (reactores de sales fundidas).',
      en: 'Deal to buy power from SMRs (molten-salt reactors).',
    },
  },
  {
    eyebrow: { es: 'Amazon', en: 'Amazon' },
    value: { es: 'US$ 500M en SMRs', en: '$500M in SMRs' },
    subtitle: {
      es: 'Inversiones en X-Energy y Dominion para alimentar centros de datos.',
      en: 'Investments in X-Energy and Dominion to power data centres.',
    },
  },
  {
    eyebrow: { es: 'Microsoft', en: 'Microsoft' },
    value: { es: 'Reabre Three Mile Island', en: 'Reopens Three Mile Island' },
    subtitle: {
      es: 'Contrato para reactivar la central y dedicar su output a IA.',
      en: 'Contract to restart the plant and dedicate its output to AI.',
    },
  },
]

const ARGENTINA: CardData[] = [
  {
    eyebrow: { es: 'Reservas', en: 'Reserves' },
    value: { es: '~20.000 tU', en: '~20,000 tU' },
    subtitle: {
      es: 'Reservas probadas identificadas por CNEA, con cero minas en operación hoy.',
      en: 'Proven reserves identified by CNEA, with zero mines operating today.',
    },
  },
  {
    eyebrow: { es: 'Capacidad integrada', en: 'Integrated capability' },
    value: { es: 'Ciclo completo', en: 'Full fuel cycle' },
    subtitle: {
      es: 'Know-how de ciclo completo → INVAP exporta reactores → radioisótopos globales (Mo-99).',
      en: 'Full-cycle know-how → INVAP exports reactors → global radioisotopes (Mo-99).',
    },
  },
  {
    eyebrow: { es: 'Ventaja geopolítica', en: 'Geopolitical edge' },
    value: { es: 'Estable, remoto', en: 'Stable, remote' },
    subtitle: {
      es: 'Jurisdicción estable alejada de conflictos: suministro confiable para aliados.',
      en: 'Stable jurisdiction remote from conflicts: reliable supply for allies.',
    },
  },
]

const RECOMMENDATIONS: CardData[] = [
  {
    eyebrow: { es: '01 · Compensación', en: '01 · Compensation' },
    value: { es: 'Ley ambiental', en: 'Environmental law' },
    subtitle: {
      es: 'Modelo de compensación a comunidades (EE.UU./Canadá) para viabilizar minería.',
      en: 'Community compensation model (US/Canada) to enable mining.',
    },
  },
  {
    eyebrow: { es: '02 · Gobernanza', en: '02 · Governance' },
    value: { es: 'Consejo Federal Nuclear', en: 'Federal Nuclear Council' },
    subtitle: {
      es: 'Coordinación federal entre provincias y Nación para armonizar el marco legal.',
      en: 'Federal coordination between provinces and Nation to harmonize the legal frame.',
    },
  },
  {
    eyebrow: { es: '03 · Transparencia', en: '03 · Transparency' },
    value: { es: 'Blockchain', en: 'Blockchain' },
    subtitle: {
      es: 'Trazabilidad inmutable de combustible y materiales nucleares.',
      en: 'Immutable traceability of nuclear fuel and materials.',
    },
  },
  {
    eyebrow: { es: '04 · Inversión', en: '04 · Investment' },
    value: { es: 'PPPs privados', en: 'Private PPPs' },
    subtitle: {
      es: 'Asociaciones público-privadas para destrabar capital en minería y reactores.',
      en: 'Public-private partnerships to unlock capital in mining and reactors.',
    },
  },
]

function pick(b: Bi, locale: string) {
  return locale === 'en' ? b.en : b.es
}

export default async function GlobalContextPage() {
  const t = await getTranslations('globalContext')
  const locale = await getLocale()

  return (
    <NuclearPageShell>
      <GlobalContextHero />

      {/* Section 1 — Renaissance */}
      <section className="container py-10">
        <NuclearSectionHeading
          eyebrow={t('s1.eyebrow')}
          title={t('s1.title')}
          blurb={t('s1.blurb')}
        />
        <div className="mt-6 grid grid-cols-1 gap-px bg-nd-border md:grid-cols-2 lg:grid-cols-3">
          {RENAISSANCE.map((c) => (
            <DataCard
              key={c.value.es}
              eyebrow={pick(c.eyebrow, locale)}
              value={pick(c.value, locale)}
              subtitle={c.subtitle ? pick(c.subtitle, locale) : undefined}
              metadata={c.metadata ? pick(c.metadata, locale) : undefined}
            />
          ))}
        </div>
        <div className="mt-6">
          <PriceChart />
        </div>
      </section>

      {/* Section 2 — Data centres */}
      <section className="container py-10">
        <NuclearSectionHeading eyebrow={t('s2.eyebrow')} title={t('s2.title')} blurb={t('s2.blurb')} />
        <div className="mt-6 grid grid-cols-1 gap-px bg-nd-border md:grid-cols-2 lg:grid-cols-3">
          {DATA_CENTERS.map((c) => (
            <DataCard
              key={c.value.es}
              eyebrow={pick(c.eyebrow, locale)}
              value={pick(c.value, locale)}
              subtitle={c.subtitle ? pick(c.subtitle, locale) : undefined}
              metadata={c.metadata ? pick(c.metadata, locale) : undefined}
            />
          ))}
        </div>
        <div className="mt-6">
          <DataCenterChart />
        </div>
      </section>

      {/* Section 3 — Argentina */}
      <section className="container py-10">
        <NuclearSectionHeading eyebrow={t('s3.eyebrow')} title={t('s3.title')} blurb={t('s3.blurb')} />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-px bg-nd-border">
            {ARGENTINA.map((c) => (
              <DataCard
                key={c.value.es}
                eyebrow={pick(c.eyebrow, locale)}
                value={pick(c.value, locale)}
                subtitle={c.subtitle ? pick(c.subtitle, locale) : undefined}
              />
            ))}
          </div>
          <ProductionBarChart />
        </div>
      </section>

      {/* Section 4 — Recommendations */}
      <section className="container py-10 pb-20">
        <NuclearSectionHeading eyebrow={t('s4.eyebrow')} title={t('s4.title')} blurb={t('s4.blurb')} />
        <div className="mt-6 grid grid-cols-1 gap-px bg-nd-border md:grid-cols-2 lg:grid-cols-4">
          {RECOMMENDATIONS.map((c) => (
            <DataCard
              key={c.value.es}
              eyebrow={pick(c.eyebrow, locale)}
              value={pick(c.value, locale)}
              subtitle={c.subtitle ? pick(c.subtitle, locale) : undefined}
            />
          ))}
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
          {t('source')}
        </p>
      </section>
    </NuclearPageShell>
  )
}
