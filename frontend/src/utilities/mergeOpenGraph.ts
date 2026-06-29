import type { Metadata } from 'next'
import { getSocialImageURL } from './getSocialImageURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Argentina Nuclear — el atlas de la industria nuclear argentina: uranio, ciclo de combustible, reactores e isótopos médicos. Por Zirconio.',
  images: [
    {
      url: getSocialImageURL(),
      width: 1200,
      height: 630,
      alt: 'Argentina Nuclear — atlas de la industria nuclear argentina',
    },
  ],
  siteName: 'Argentina Nuclear',
  title: 'Argentina Nuclear — atlas de la industria nuclear argentina',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
