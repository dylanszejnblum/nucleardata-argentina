'use client'

import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

interface AtlasEntry {
  index: string
  href: '/uranio' | '/reactores' | '/isotopos' | '/ciclo-combustible' | '/mapa' | '/actores' | '/novedades'
  es: { title: string; tagline: string }
  en: { title: string; tagline: string }
  status?: 'live' | 'soon'
}

const ENTRIES: AtlasEntry[] = [
  {
    index: '01',
    href: '/uranio',
    status: 'live',
    es: { title: 'Uranio', tagline: 'Depósitos, proyectos y geografía' },
    en: { title: 'Uranium', tagline: 'Deposits, projects and geography' },
  },
  {
    index: '02',
    href: '/reactores',
    status: 'soon',
    es: { title: 'Reactores', tagline: 'Atucha, Embalse y CAREM' },
    en: { title: 'Reactors', tagline: 'Atucha, Embalse and CAREM' },
  },
  {
    index: '03',
    href: '/isotopos',
    status: 'soon',
    es: { title: 'Isótopos', tagline: 'Mo-99 y Co-60 médicos' },
    en: { title: 'Isotopes', tagline: 'Medical Mo-99 and Co-60' },
  },
  {
    index: '04',
    href: '/ciclo-combustible',
    status: 'soon',
    es: { title: 'Ciclo de combustible', tagline: 'De la mina al reactor' },
    en: { title: 'Fuel cycle', tagline: 'From mine to reactor' },
  },
  {
    index: '05',
    href: '/mapa',
    status: 'live',
    es: { title: 'Mapa', tagline: 'El atlas geolocalizado' },
    en: { title: 'Map', tagline: 'The geolocated atlas' },
  },
  {
    index: '06',
    href: '/actores',
    status: 'live',
    es: { title: 'Actores clave', tagline: 'CNEA, NA-SA, INVAP, ARN…' },
    en: { title: 'Key players', tagline: 'CNEA, NA-SA, INVAP, ARN…' },
  },
  {
    index: '07',
    href: '/novedades',
    status: 'live',
    es: { title: 'Novedades', tagline: 'Seguimiento del sector' },
    en: { title: 'News', tagline: 'Sector tracking' },
  },
]

export function AtlasIndex() {
  const locale = (useLocale() as Locale) === 'en' ? 'en' : 'es'

  return (
    <ul className="flex flex-col">
      {ENTRIES.map((e) => (
        <li key={e.index} className="group">
          <Link
            href={e.href}
            className="relative grid grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-8 border-t border-nd-border py-6 md:py-8 transition-colors hover:bg-nd-surface-raised/40 px-1 md:px-3 -mx-1 md:-mx-3"
          >
            <span className="font-mono text-sm tabular-nums text-nd-text-disabled group-hover:text-nd-accent transition-colors">
              {e.index}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display font-bold uppercase tracking-display-tight text-3xl sm:text-4xl md:text-5xl leading-none text-nd-text-display">
                {e[locale].title}
              </span>
              <span className="font-sans text-sm text-nd-text-secondary">{e[locale].tagline}</span>
            </span>
            <span className="flex items-center gap-3">
              {e.status === 'soon' && (
                <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-label text-nd-text-disabled border border-nd-border rounded-full px-2 py-0.5">
                  {locale === 'en' ? 'Soon' : 'Próx.'}
                </span>
              )}
              <span
                aria-hidden="true"
                className="font-mono text-lg text-nd-text-disabled group-hover:text-nd-accent transition-all group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
      <li className="border-t border-nd-border" />
    </ul>
  )
}
