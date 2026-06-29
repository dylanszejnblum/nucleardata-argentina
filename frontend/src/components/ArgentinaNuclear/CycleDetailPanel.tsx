import { useLocale, useTranslations } from 'next-intl'
import type { FuelCycleStep } from '@/lib/nuclear-mock-data'
import { capabilityMeta } from './theme'
import { Link } from '@/i18n/navigation'

/**
 * Detail panel for the currently selected fuel-cycle step. Shows the step's
 * title, a large capability badge, full description, related actors, and a link
 * to the most relevant section when applicable.
 */
export function CycleDetailPanel({ step }: { step: FuelCycleStep }) {
  const t = useTranslations('fuelCycle')
  const locale = useLocale()
  const cap = capabilityMeta(step.capability)
  const name = locale === 'en' ? step.nameEn : step.nameEs
  const description = locale === 'en' ? step.descriptionEn : step.descriptionEs
  const detail = locale === 'en' ? step.detailEn : step.detailEs

  const link = STEP_LINK[step.key]

  return (
    <div
      id={`step-${step.id}`}
      className="grid grid-cols-1 gap-px border border-nd-border bg-nd-border lg:grid-cols-[1.3fr_1fr]"
    >
      {/* Main */}
      <div className="bg-nd-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 border px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] font-mono"
            style={{ borderColor: cap.color, color: cap.color }}
          >
            <span className="inline-block size-2" style={{ backgroundColor: cap.color }} aria-hidden />
            {locale === 'en' ? cap.labelEn : cap.labelEs}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-nd-text-disabled font-mono">
            {t('stepOf', { n: step.id, total: 10 })}
          </span>
        </div>
        <h3 className="mt-4 font-display text-4xl leading-none text-nd-text-display md:text-5xl">
          {name}
        </h3>
        <p className="mt-2 text-sm uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
          {description}
        </p>
        <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-nd-text-primary font-sans">
          {detail}
        </p>
      </div>

      {/* Actors + link */}
      <div className="bg-nd-surface-raised p-6 md:p-8">
        <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {t('actors')}
        </span>
        {step.relatedActors.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {step.relatedActors.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm text-nd-text-primary font-sans">
                <span
                  className="inline-block size-1.5"
                  style={{ backgroundColor: 'var(--nd-accent)' }}
                  aria-hidden
                />
                {a}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-nd-text-disabled font-sans">{t('noActors')}</p>
        )}

        {link ? (
          <Link
            href={link.href}
            className="mt-6 inline-flex items-center gap-2 border border-nd-border-visible px-3 py-2 text-[11px] uppercase tracking-[0.1em] font-mono transition-colors hover:bg-nd-surface"
          >
            {link.label ?? t('related')} →
          </Link>
        ) : null}
      </div>
    </div>
  )
}

const STEP_LINK: Record<string, { href: string; label?: string }> = {
  exploration: { href: '/contexto-global' },
  mining: { href: '/contexto-global' },
  milling: { href: '/contexto-global' },
  fabrication: { href: '/reactores' },
  generation: { href: '/reactores' },
  'spent-fuel': { href: '/reactores' },
  storage: { href: '/reactores' },
  disposal: { href: '/historia#gastre' },
}
