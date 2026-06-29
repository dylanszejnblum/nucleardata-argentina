'use client'

import { useTranslations } from 'next-intl'
import { SLIDER_RANGE, SLIDER_MARKERS } from './argentina-provinces'

type TimelineSliderProps = {
  year: number
  onChange: (year: number) => void
}

/**
 * Range track from 1984 → 2026. As the slider advances, the parent map tints
 * provinces whose restriction year has passed. Markers call out the key years.
 */
export function TimelineSlider({ year, onChange }: TimelineSliderProps) {
  const t = useTranslations('mapNuclear')
  const pct = ((year - SLIDER_RANGE.min) / (SLIDER_RANGE.max - SLIDER_RANGE.min)) * 100

  return (
    <div className="border border-nd-border bg-nd-surface p-4 md:p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {t('slider.eyebrow')}
        </span>
        <span className="font-display text-3xl tabular-nums leading-none text-nd-text-display" data-numeric>
          {year}
        </span>
      </div>

      <div className="relative pt-2">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-nd-border-visible" aria-hidden />
        {/* Filled */}
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2"
          style={{ width: `${pct}%`, backgroundColor: 'var(--nd-accent)' }}
          aria-hidden
        />
        <input
          type="range"
          min={SLIDER_RANGE.min}
          max={SLIDER_RANGE.max}
          step={1}
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={t('slider.eyebrow')}
          className="relative z-10 w-full cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[var(--nd-accent)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--nd-text-display)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--nd-accent)]"
        />
        {/* Markers */}
        <div className="relative mt-2 h-8">
          {SLIDER_MARKERS.map((m) => {
            const mp = ((m - SLIDER_RANGE.min) / (SLIDER_RANGE.max - SLIDER_RANGE.min)) * 100
            const passed = m <= year
            return (
              <div
                key={m}
                className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5"
                style={{ left: `${mp}%` }}
              >
                <span
                  className="inline-block size-1.5"
                  style={{
                    backgroundColor: passed ? 'var(--nd-accent)' : 'var(--nd-border-visible)',
                  }}
                  aria-hidden
                />
                <span
                  className="text-[10px] tabular-nums font-mono"
                  style={{ color: passed ? 'var(--nd-text-secondary)' : 'var(--nd-text-disabled)' }}
                  data-numeric
                >
                  {m}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
