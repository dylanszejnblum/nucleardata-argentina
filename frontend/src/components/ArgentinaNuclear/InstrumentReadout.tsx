'use client'

import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

interface InstrumentReadoutProps {
  index: string
  value: number
  label: string
  /** Pad the integer part to this width (e.g. 2 → "03"). */
  pad?: number
  suffix?: string
}

/** A monospaced instrument readout that counts up when scrolled into view. */
export function InstrumentReadout({
  index,
  value,
  label,
  pad = 2,
  suffix = '',
}: InstrumentReadoutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      setDone(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return
        setDone(true)
        const duration = 1500
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setDisplay(value * easeOutExpo(p))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, done])

  const integer = Math.round(display)
  const shown = pad > 0 ? String(integer).padStart(pad, '0') : String(integer)

  return (
    <div ref={ref} className="flex flex-col gap-2 py-6 md:py-0">
      <span className="font-mono text-[10px] tracking-label-wide uppercase text-nd-text-disabled">
        {index}
      </span>
      <span className="font-mono font-medium tabular-nums leading-none text-nd-text-display text-5xl sm:text-6xl md:text-7xl">
        {shown}
        {suffix && (
          <span className="text-2xl md:text-3xl text-nd-accent ml-0.5">{suffix}</span>
        )}
      </span>
      <span className="font-sans text-sm text-nd-text-secondary max-w-[16ch] leading-snug">
        {label}
      </span>
    </div>
  )
}
