import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Argentina Nuclear rebrand — renamed and cut routes. Keep both locale shapes
  // (Spanish at root, English under /en) and wildcards for subpaths.
  const rebrandRedirects = [
    // renamed kept sections
    { source: '/map', destination: '/mapa' },
    { source: '/map/:path*', destination: '/mapa/:path*' },
    { source: '/companies', destination: '/actores' },
    { source: '/companies/:path*', destination: '/actores/:path*' },
    { source: '/noticias', destination: '/novedades' },
    { source: '/noticias/:path*', destination: '/novedades/:path*' },
    // uranium promoted out of /minerals
    { source: '/minerals/uranium', destination: '/uranio' },
    { source: '/minerals', destination: '/uranio' },
    { source: '/minerals/:path*', destination: '/uranio' },
    // cut sections → home
    { source: '/provincias', destination: '/' },
    { source: '/provincias/:path*', destination: '/' },
    { source: '/indicadores', destination: '/' },
    { source: '/indicadores/:path*', destination: '/' },
    { source: '/exportaciones', destination: '/' },
    { source: '/exportaciones/:path*', destination: '/' },
    // English variants
    { source: '/en/map', destination: '/en/mapa' },
    { source: '/en/map/:path*', destination: '/en/mapa/:path*' },
    { source: '/en/companies', destination: '/en/actores' },
    { source: '/en/companies/:path*', destination: '/en/actores/:path*' },
    { source: '/en/noticias', destination: '/en/novedades' },
    { source: '/en/noticias/:path*', destination: '/en/novedades/:path*' },
    { source: '/en/minerals/uranium', destination: '/en/uranio' },
    { source: '/en/minerals', destination: '/en/uranio' },
    { source: '/en/minerals/:path*', destination: '/en/uranio' },
    { source: '/en/provincias', destination: '/en' },
    { source: '/en/provincias/:path*', destination: '/en' },
    { source: '/en/indicadores', destination: '/en' },
    { source: '/en/indicadores/:path*', destination: '/en' },
    { source: '/en/exportaciones', destination: '/en' },
    { source: '/en/exportaciones/:path*', destination: '/en' },
    // legacy inversiones → indicadores → home (indicadores was cut)
    { source: '/inversiones', destination: '/' },
    { source: '/inversiones/:path*', destination: '/' },
    { source: '/en/inversiones', destination: '/en' },
    { source: '/en/inversiones/:path*', destination: '/en' },
  ].map((r) => ({ ...r, permanent: true }))

  return [internetExplorerRedirect, ...rebrandRedirects]
}
