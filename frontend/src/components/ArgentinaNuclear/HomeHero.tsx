'use client'

import nextDynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { JourneyRibbon } from './JourneyRibbon'

const ReactorCore = nextDynamic(() => import('./ReactorCore'), {
  ssr: false,
  loading: () => null,
})

function useIsDesktop() {
  const [is, setIs] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)')
    const update = () => setIs(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return is
}

/**
 * HomeHero — Embalse CANDU-6 cutaway staged right, with the atlas identity,
 * a superlative pitch and the fuel-cycle gateway at the fold.
 *
 * The reactor is full-bleed behind, shifted stage-right on desktop so a
 * legibility scrim can anchor a left content column. The hero's job is to
 * hand the reader straight to the territory: a primary CTA into the atlas
 * and the JourneyRibbon (Uranium → Fuel cycle → Reactors → Isotopes) sit at
 * the bottom of the first viewport.
 */
export function HomeHero() {
  const t = useTranslations('home')
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] overflow-hidden dot-grid-subtle"
      style={{
        backgroundImage:
          'radial-gradient(120% 90% at 78% 40%, var(--nd-accent-subtle), transparent 58%)',
      }}
    >
      {/* CANDU-6 reactor — composed stage-right on desktop */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <ReactorCore active={active} pan={isDesktop ? 1.3 : 0} />
      </div>

      {/* desktop legibility scrim — content column anchored left */}
      <div
        className="absolute inset-0 z-[1] hidden pointer-events-none lg:block"
        style={{
          background:
            'linear-gradient(90deg, var(--nd-black) 0%, var(--nd-black) 34%, color-mix(in oklch, var(--nd-black) 55%, transparent) 52%, transparent 66%)',
        }}
      />
      {/* mobile legibility scrim — content anchored bottom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in oklch, var(--nd-black) 35%, transparent) 0%, transparent 34%, color-mix(in oklch, var(--nd-black) 70%, transparent) 78%, var(--nd-black) 100%)',
        }}
      />

      {/* identity + gateway */}
      <div className="relative z-[2] container min-h-[100svh] flex flex-col justify-between pb-8 md:pb-10 pt-28">
        <div className="max-w-2xl">
          <span
            className="font-mono text-[11px] tracking-label-wide uppercase text-nd-accent"
            style={{ animation: 'an-reveal 700ms cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {t('eyebrow')}
          </span>

          <h1 className="mt-3 font-display font-black uppercase tracking-display-tight leading-[0.84] text-nd-text-display text-[16vw] sm:text-[13vw] md:text-[6.5rem] lg:text-[7rem] xl:text-[9rem]">
            <span
              className="block"
              style={{ animation: 'an-reveal 700ms cubic-bezier(0.16,1,0.3,1) 120ms both' }}
            >
              {t('titleLine1')}
            </span>
            <span
              className="block"
              style={{ animation: 'an-reveal 700ms cubic-bezier(0.16,1,0.3,1) 240ms both' }}
            >
              {t('titleLine2')}
              <span style={{ color: 'var(--nd-accent)' }}>.</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base md:text-lg text-nd-text-secondary font-sans leading-snug"
            style={{ animation: 'an-reveal 700ms cubic-bezier(0.16,1,0.3,1) 360ms both' }}
          >
            {t('valueProp')}
          </p>

          <div
            className="mt-7 flex flex-wrap items-center gap-4"
            style={{ animation: 'an-reveal 700ms cubic-bezier(0.16,1,0.3,1) 460ms both' }}
          >
            <a
              href="#atlas"
              className="inline-flex items-center gap-2 bg-nd-accent text-nd-black px-5 py-3 font-mono text-[11px] uppercase tracking-label-wide font-medium hover:bg-nd-accent-bright transition-colors active:translate-y-px"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </a>
            <span className="font-mono text-[10px] tracking-label uppercase text-nd-text-disabled">
              {t('proofSource')}
            </span>
          </div>
        </div>

        {/* gateway at the fold — proof strip + fuel-cycle ribbon */}
        <div
          className="mt-10 flex flex-col gap-5"
          style={{ animation: 'an-reveal 800ms cubic-bezier(0.16,1,0.3,1) 560ms both' }}
        >
          <ol className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3 border-t border-nd-border pt-5">
            <li className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-label-wide text-nd-accent">
                {t('proof1Kicker')}
              </span>
              <span className="font-sans text-sm text-nd-text-primary leading-snug">
                {t('proof1')}
              </span>
            </li>
            <li className="flex flex-col gap-1 sm:border-l sm:border-nd-border sm:pl-8">
              <span className="font-mono text-[10px] uppercase tracking-label-wide text-nd-accent">
                {t('proof2Kicker')}
              </span>
              <span className="font-sans text-sm text-nd-text-primary leading-snug">
                {t('proof2')}
              </span>
            </li>
            <li className="flex flex-col gap-1 sm:border-l sm:border-nd-border sm:pl-8">
              <span className="font-mono text-[10px] uppercase tracking-label-wide text-nd-accent">
                {t('proof3Kicker')}
              </span>
              <span className="font-sans text-sm text-nd-text-primary leading-snug">
                {t('proof3')}
              </span>
            </li>
          </ol>
          <JourneyRibbon />
        </div>
      </div>

      <style>{`
        @keyframes an-reveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
