import { useTranslations } from 'next-intl'
import { REACTORS } from '@/lib/nuclear-mock-data'
import { StatusBadge } from './StatusBadge'
import { statusMeta } from './theme'

/**
 * Compact schematic table for the research reactor fleet (RA-1/3/4/6/10).
 * Monospaced, minimal, tabular-nums — reads like an instrument log.
 */
export function ResearchFleetTable() {
  const t = useTranslations('reactors')

  const research = REACTORS.filter((r) => r.category === 'research').sort((a, b) => {
    const ay = a.firstCriticality ? new Date(a.firstCriticality).getFullYear() : 9999
    const by = b.firstCriticality ? new Date(b.firstCriticality).getFullYear() : 9999
    return ay - by
  })

  return (
    <section className="container pb-12">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
            {t('research.eyebrow')}
          </span>
          <h2 className="mt-2 font-display text-3xl leading-none text-nd-text-display md:text-4xl">
            {t('research.title')}
          </h2>
        </div>
        <p className="max-w-md text-pretty text-sm leading-6 text-nd-text-secondary font-sans">
          {t('research.blurb')}
        </p>
      </div>

      <div className="overflow-x-auto border border-nd-border bg-nd-surface">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-nd-border bg-nd-surface-raised">
              {[
                t('research.col.name'),
                t('research.col.type'),
                t('research.col.mwt'),
                t('research.col.year'),
                t('research.col.location'),
                t('research.col.status'),
                t('research.col.purpose'),
              ].map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] text-nd-text-secondary font-mono"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {research.map((r) => {
              const sm = statusMeta(r.status)
              const purpose = RESEARCH_PURPOSE[r.id] ?? ''
              return (
                <tr
                  key={r.id}
                  className="border-b border-nd-border last:border-b-0 hover:bg-nd-surface-raised"
                >
                  <td className="px-3 py-3 font-display text-base text-nd-text-display">{r.name}</td>
                  <td className="px-3 py-3 text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
                    {r.type}
                  </td>
                  <td
                    className="px-3 py-3 font-mono tabular-nums text-nd-text-primary"
                    data-numeric
                  >
                    {r.capacityMwt}
                  </td>
                  <td
                    className="px-3 py-3 font-mono tabular-nums text-nd-text-primary"
                    data-numeric
                  >
                    {r.firstCriticality ? new Date(r.firstCriticality).getFullYear() : '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-nd-text-primary font-sans">
                    {r.city}, {r.province}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge color={sm.color} label={sm.labelEs} />
                  </td>
                  <td className="px-3 py-3 text-sm text-nd-text-secondary font-sans">{purpose}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const RESEARCH_PURPOSE: Record<string, string> = {
  'ra-1': 'Investigación · primer reactor del hemisferio sur',
  'ra-3': 'Producción de radioisótopos médicos',
  'ra-4': 'Enseñanza e investigación (UNR)',
  'ra-6': 'Investigación y formación (CAB / IB)',
  'ra-10': 'Multipropósito · radioisótopos y ensayos (en construcción)',
}
