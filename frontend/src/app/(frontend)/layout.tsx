import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { NewsletterModalLoader } from '@/components/Nothing/NewsletterModalLoader'
import { Providers } from '@/providers'
import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/shared'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Big_Shoulders, Hanken_Grotesk, Martian_Mono } from 'next/font/google'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getSocialImageURL } from '@/utilities/getSocialImageURL'

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const martianMono = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-martian-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      className={cn(bigShoulders.variable, hankenGrotesk.variable, martianMono.variable)}
      lang={locale}
      suppressHydrationWarning={true}
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function getImplicitPreference() {
                  var mediaQuery = '(prefers-color-scheme: dark)'
                  var mql = window.matchMedia(mediaQuery)
                  var hasImplicitPreference = typeof mql.matches === 'boolean'

                  if (hasImplicitPreference) {
                    return mql.matches ? 'dark' : 'light'
                  }

                  return null
                }

                function themeIsValid(theme) {
                  return theme === 'light' || theme === 'dark'
                }

                var themeToSet = '${defaultTheme}'
                var preference = window.localStorage.getItem('${themeLocalStorageKey}')

                if (themeIsValid(preference)) {
                  themeToSet = preference
                } else {
                  var implicitPreference = getImplicitPreference()

                  if (implicitPreference) {
                    themeToSet = implicitPreference
                  }
                }

                document.documentElement.setAttribute('data-theme', themeToSet)
              })();
            `,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        {/* Warm up the CARTO basemap CDN (style, glyphs, sprite, tiles) so the
            map paints faster once its chunk loads. crossOrigin matches the CORS
            fetches the WebGL map makes. */}
        <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://b.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://c.basemaps.cartocdn.com" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            {children}
            <NewsletterModalLoader />
          </Providers>
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Argentina Nuclear — el atlas de la industria nuclear argentina',
    template: '%s | Argentina Nuclear',
  },
  description:
    'Argentina Nuclear — el atlas definitivo de la industria nuclear argentina: uranio, ciclo de combustible, reactores e isótopos médicos. Por Zirconio.',
  keywords: [
    'Argentina',
    'nuclear',
    'uranio',
    'CNEA',
    'NA-SA',
    'Atucha',
    'Embalse',
    'CAREM',
    'isótopos',
    'ciclo de combustible',
    'energy',
    'energía nuclear',
  ],
  authors: [{ name: 'Zirconio', url: getServerSideURL() }],
  creator: 'Zirconio',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    title: 'Argentina Nuclear — atlas de la industria nuclear argentina',
    description:
      'Uranio, ciclo de combustible, reactores e isótopos: el atlas de la industria nuclear argentina. Por Zirconio.',
    images: [
      { url: getSocialImageURL(), width: 1200, height: 630, alt: 'Argentina Nuclear' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: getServerSideURL(),
  },
}
