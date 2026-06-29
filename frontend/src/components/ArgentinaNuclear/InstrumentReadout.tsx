'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { animateCounter, useInView } from '@/components/Petrodata/uranium/anim'
import { cn } from '@/utilities/ui'

type InstrumentReadoutProps = {
  /** Numeric value to display (and animate toward). */
  value: number
  /** Format the animated value into a string. */
  format?: (v: number) => string
  /** Eyebrow label above the value (mono, uppercase). */
  label?: string
  /** Optional unit suffix rendered inline. */
  unit?: string
  /** Optional delta indicator: positive renders ▲ green, negative ▼ red. */
  delta?: number
  /** Optional href — wraps the readout in a locale-aware link. */
  href?: string
  /** When true, the value is rendered in giant display face. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZES: Record<NonNullable<InstrumentReadoutProps['size']>, string> = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-6xl',
  xl: 'text-6xl md:text-8xl',
}

/**
 * Animated counter-up KPI readout. Ticks 0 → value when scrolled into view,
 * reduced-motion safe. Numbers are always tabular-nums in the display face —
 * the "instrument" feel of an atomic-age control panel.
 */
export function InstrumentReadout({
  value,
  format,
  label,
  unit,
  delta,
  href,
  size = 'lg',
  className,
}: InstrumentReadoutProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const numRef = useRef<HTMLSpanElement>(null)
  const locale = useLocale()
  const fmt =
    format ?? ((v: number) => Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-AR').format(v))

  useEffect(() => {
    if (!inView || !numRef.current) return
    const anim = animateCounter(numRef.current, value, {
      duration: 1600,
      format: fmt,
    })
    return () => {
      anim?.pause?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value])

  const deltaUp = typeof delta === 'number' && delta > 0
  const deltaDown = typeof delta === 'number' && delta < 0
  const deltaColor = deltaUp
    ? 'oklch(62% 0.13 145deg)'
    : deltaDown
      ? 'oklch(60% 0.17 25deg)'
      : 'var(--nd-text-disabled)'

  const body = (
    <div ref={ref} className={cn('flex flex-col gap-1', className)}>
      {label ? (
        <span className="text-[10px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {label}
        </span>
      ) : null}
      <div className="flex items-baseline gap-2">
        <span
          className={cn('font-display leading-none tabular-nums', SIZES[size])}
          data-numeric
          style={{ color: 'var(--nd-text-display)' }}
        >
          <span ref={numRef}>{fmt(0)}</span>
          {unit ? (
            <span className="ml-1 text-[0.4em] font-mono text-nd-text-secondary">{unit}</span>
          ) : null}
        </span>
        {typeof delta === 'number' ? (
          <span
            className="text-[11px] font-mono tabular-nums"
            style={{ color: deltaColor }}
            data-numeric
          >
            {deltaUp ? '▲' : deltaDown ? '▼' : '—'} {Math.abs(delta)}%
          </span>
        ) : null}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group block">
        <span className="block transition-opacity group-hover:opacity-80">{body}</span>
      </Link>
    )
  }
  return body
}
