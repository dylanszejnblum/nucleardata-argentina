import React from 'react'
import { cn } from '@/utilities/ui'

type DataCardProps = {
  /** Eyebrow label (mono, uppercase). */
  eyebrow: string
  /** Large display value — the headline number or short claim. */
  value: string
  /** Supporting subtitle / body text. */
  subtitle?: string
  /** Optional metadata footer (e.g. source attribution). */
  metadata?: string
  /** Optional accent stripe colour; defaults to the uranium accent. */
  accent?: string
  className?: string
}

/**
 * Reusable data card: a mono eyebrow, a large display value, a subtitle, and an
 * optional metadata footer. Schematic / brutalist — sharp corners, hairline
 * border, a 2px accent stripe on the leading edge.
 */
export function DataCard({
  eyebrow,
  value,
  subtitle,
  metadata,
  accent = 'var(--nd-accent)',
  className,
}: DataCardProps) {
  return (
    <div className={cn('relative flex flex-col gap-3 border border-nd-border bg-nd-surface p-5 md:p-6', className)}>
      <span
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <span className="text-[10px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
        {eyebrow}
      </span>
      <span className="font-display text-2xl leading-tight text-nd-text-display md:text-3xl">
        {value}
      </span>
      {subtitle ? (
        <span className="text-pretty text-sm leading-relaxed text-nd-text-secondary font-sans">
          {subtitle}
        </span>
      ) : null}
      {metadata ? (
        <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
          {metadata}
        </span>
      ) : null}
    </div>
  )
}
