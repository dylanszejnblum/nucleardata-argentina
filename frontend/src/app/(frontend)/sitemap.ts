import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

// Public, indexable routes. Spanish lives at the root, English under /en (see
// i18n routing `localePrefix: 'as-needed'`). Each entry advertises both locale
// variants via hreflang alternates so crawlers index the right one per language.
//
// Dynamic detail pages (actores/[slug], novedades/[docId]) are not enumerated
// here yet.
const PATHS = [
  '',
  '/uranio',
  '/reactores',
  '/isotopos',
  '/ciclo-combustible',
  '/mapa',
  '/actores',
  '/novedades',
  '/metodologia',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getServerSideURL().replace(/\/$/, '')
  const lastModified = new Date()

  return PATHS.map((path) => {
    const es = `${base}${path || '/'}`
    const en = `${base}/en${path}`
    return {
      url: es,
      lastModified,
      changeFrequency: 'weekly',
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: { es, en } },
    }
  })
}
