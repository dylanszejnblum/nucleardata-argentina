import type { LegalMode, NewsCard } from '@/api/news'

/** A document whose full text we may not reproduce — link out to the source. */
export function isMetadataOnly(legalMode: LegalMode): boolean {
  return legalMode !== 'fulltext_internal'
}

/** Color accent per source family (drives the small family tag on each card). */
const FAMILY_COLORS: Record<string, string> = {
  regulatoria: 'var(--nd-success)',
  corporativa: '#0284c7',
  media: '#a855f7',
  prensa: '#a855f7',
  gdelt: '#f59e0b',
  rss: '#f59e0b',
}

export function familyColor(family: string): string {
  return FAMILY_COLORS[family.toLowerCase()] ?? 'var(--nd-accent)'
}

export function familyLabel(family: string): string {
  if (!family) return ''
  return family.charAt(0).toUpperCase() + family.slice(1)
}

/** Importance buckets → 0..3 dots. */
export function importanceLevel(score: number | null): number {
  if (score == null) return 0
  if (score >= 0.75) return 3
  if (score >= 0.5) return 2
  if (score >= 0.25) return 1
  return 0
}

/** Companies + regulators, de-duped, for entity chips. */
export function entityList(card: Pick<NewsCard, 'entities'>): string[] {
  const e = card.entities ?? {}
  const all = [...(e.companies ?? []), ...(e.regulators ?? [])]
  return Array.from(new Set(all.filter(Boolean)))
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

/** Relative time in es-AR ("hace 3 horas"). Rendered server-side only. */
export function relativeTime(iso: string | null, locale = 'es-AR'): string {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const diff = (t - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const abs = Math.abs(diff)
  for (const [unit, secs] of UNITS) {
    if (abs >= secs) return rtf.format(Math.round(diff / secs), unit)
  }
  return rtf.format(Math.round(diff), 'second')
}

export function absoluteDate(iso: string | null, locale = 'es-AR'): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
