import React from 'react'
import { NothingHeader } from '@/components/Nothing/Header'
import { NothingFooter } from '@/components/Nothing/Footer'

export interface SectionPlaceholderProps {
  /** Short code shown as the monospaced eyebrow, e.g. "02 · REACTORES". */
  index: string
  /** Section name, shown large in the display face. */
  title: string
  /** One-line definition of the section. */
  tagline: string
  /** Longer description paragraph. */
  description: string
  /** What this section will contain, rendered as a numbered schematic list. */
  coming: string[]
}

/**
 * On-brand "in construction" state for sections whose data layer lands later.
 * Schematic-modernist: dot-grid graticule, monospaced readouts, display headline,
 * numbered list. Avoids the generic 404/coming-soon template.
 */
export function SectionPlaceholder({
  index,
  title,
  tagline,
  description,
  coming,
}: SectionPlaceholderProps) {
  return (
    <>
      <NothingHeader />
      <main className="flex-1 w-full overflow-x-clip">
        <section className="container pt-12 md:pt-24 pb-16 md:pb-24 dot-grid-subtle">
          <span className="text-nd-text-disabled text-[11px] tracking-label-wide uppercase font-mono">
            {index}
          </span>
          <h1 className="mt-3 font-display font-bold uppercase tracking-display-tight leading-[0.92] text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-nd-text-display">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-nd-text-secondary font-sans leading-snug">
            {tagline}
          </p>
        </section>

        <section className="container pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="block text-[10px] uppercase tracking-label text-nd-text-disabled font-mono">
                Sobre esta sección
              </span>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-nd-text-primary font-sans max-w-prose">
                {description}
              </p>
            </div>
            <div className="lg:col-span-5">
              <span className="block text-[10px] uppercase tracking-label text-nd-text-disabled font-mono">
                Próximamente
              </span>
              <ol className="mt-4 flex flex-col">
                {coming.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 border-t border-nd-border py-3.5 first:border-t-0"
                  >
                    <span className="font-mono text-[11px] text-nd-accent tabular-nums pt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-nd-text-secondary font-sans leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="container pb-20 md:pb-28">
          <div className="border border-nd-border bg-nd-surface px-5 py-3 flex items-center gap-3 text-[11px] uppercase tracking-label text-nd-text-disabled font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-nd-accent nd-live-dot" />
            En construcción · Zirconio
          </div>
        </section>
      </main>
      <NothingFooter />
    </>
  )
}
