'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

type Step = {
  key: string
  href: '/uranio' | '/ciclo-combustible' | '/reactores' | '/isotopos'
  status: 'live' | 'soon'
}

const STEPS: Step[] = [
  { key: 'uranium', href: '/uranio', status: 'live' },
  { key: 'cycle', href: '/ciclo-combustible', status: 'soon' },
  { key: 'reactors', href: '/reactores', status: 'soon' },
  { key: 'isotopes', href: '/isotopos', status: 'soon' },
]

/**
 * JourneyRibbon — the fuel cycle AS the navigation.
 *
 * The four core atlas sections rendered as a connected flow (the value chain
 * itself): Uranium → Fuel cycle → Reactors → Isotopes. Sits at the hero fold
 * so the territory is visible the moment the reader arrives, turning the hero
 * from a vista into a gateway.
 */
export function JourneyRibbon() {
  const locale = (useLocale() as Locale) === 'en' ? 'en' : 'es'
  const t = useTranslations('home.journey')

  return (
    <ol className="grid grid-cols-2 gap-px overflow-hidden border border-nd-border bg-nd-border md:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s.key} className="bg-nd-surface">
          <Link
            href={s.href}
            className="group relative flex h-full flex-col justify-between gap-3 p-4 transition-colors hover:bg-nd-surface-raised md:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-label-wide text-nd-text-disabled">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.status === 'soon' ? (
                <span className="font-mono text-[9px] uppercase tracking-label text-nd-text-disabled">
                  {locale === 'en' ? 'Soon' : 'Próx.'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-label text-nd-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-nd-accent nd-live-dot" />
                  {locale === 'en' ? 'Live' : 'Live'}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className="flex flex-col gap-1">
                <span className="font-display font-bold uppercase tracking-display-tight text-2xl leading-none text-nd-text-display md:text-3xl">
                  {t(`${s.key}.title`)}
                </span>
                <span className="font-sans text-xs text-nd-text-secondary md:text-[13px]">
                  {t(`${s.key}.tagline`)}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-base text-nd-text-disabled transition-all group-hover:translate-x-1 group-hover:text-nd-accent"
              >
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}
