'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { staggerIn, useInView } from './anim'
import { URANIUM } from './theme'
import { getArgentinaTimeline, type Locale } from './content'

export function ArgentinaContext({ locale }: { locale: Locale }) {
  const t = useTranslations('uraniumHub')
  const data = getArgentinaTimeline(locale)

  const { ref, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    if (!inView || !ref.current) return
    staggerIn(Array.from(ref.current.querySelectorAll('.ctx-event')), { step: 60 })
  }, [inView, ref])

  return (
    <section className="container pb-16">
      <p className="text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
        {t('context.eyebrow')}
      </p>
      <h2 className="font-display text-nd-text-display text-3xl md:text-4xl mt-2">
        {t('context.title')}
      </h2>

      <div
        ref={ref}
        className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-nd-border border border-nd-border"
      >
        {data.map((event, i) => (
          <div key={`${event.year}-${i}`} className="ctx-event bg-nd-surface p-4">
            <div className="font-display text-2xl" style={{ color: URANIUM.teal }}>
              {event.year}
            </div>
            <p className="mt-2 font-mono text-[11px] text-nd-text-secondary line-clamp-3">
              {event.text}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-sans text-pretty max-w-2xl text-nd-text-secondary">
        {t('context.today')}
      </p>

      <a
        href="#projects"
        className="mt-6 inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-mono text-nd-text-display transition-colors hover:bg-nd-surface-raised"
        style={{ borderColor: URANIUM.teal }}
      >
        <span>{t('context.exploreProjects')}</span>
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    </section>
  )
}
