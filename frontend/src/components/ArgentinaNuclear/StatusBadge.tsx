import { cn } from '@/utilities/ui'

type StatusBadgeProps = {
  /** Hex/oklch colour for the dot. */
  color: string
  label: string
  /** When true, render as a filled chip; default is a dot + label. */
  variant?: 'dot' | 'chip'
  className?: string
}

/** Inline status indicator: coloured dot + label (mono, uppercase). */
export function StatusBadge({ color, label, variant = 'dot', className }: StatusBadgeProps) {
  if (variant === 'chip') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-mono',
          className,
        )}
        style={{ borderColor: color, color }}
      >
        <span className="inline-block size-1.5" style={{ backgroundColor: color }} aria-hidden />
        {label}
      </span>
    )
  }
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-[11px] font-mono', className)}
      style={{ color: 'var(--nd-text-secondary)' }}
    >
      <span
        className="inline-block size-2"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="uppercase tracking-[0.08em]">{label}</span>
    </span>
  )
}
