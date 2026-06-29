import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** Compact hides the "by Zirconio" attribution. */
  compact?: boolean
}

/**
 * Argentina Nuclear wordmark — a schematic hexagon (fuel-assembly cross-section)
 * with seven rod dots, paired with the wordmark in Big Shoulders Display.
 * Theme-aware via CSS vars, so no invert hack is needed.
 */
export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    compact = false,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <span
      aria-label="Argentina Nuclear, por Zirconio"
      className={clsx(
        'inline-flex items-center gap-2.5 text-nd-text-display',
        className,
      )}
      data-loading={loading}
      data-fetch-priority={priority}
    >
      {/* Hex fuel-assembly mark */}
      <svg
        width="26"
        height="30"
        viewBox="0 0 26 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M13 0.577L25.291 7.663V21.837L13 28.923L0.709 21.837V7.663L13 0.577Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
        {/* rod dots: center + ring of six */}
        <circle cx="13" cy="14.5" r="2.2" fill="var(--nd-accent)" />
        <circle cx="13" cy="8.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
        <circle cx="18.2" cy="11.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
        <circle cx="18.2" cy="17.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
        <circle cx="13" cy="20.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
        <circle cx="7.8" cy="17.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
        <circle cx="7.8" cy="11.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display font-bold uppercase tracking-display-tight text-[0.95rem] leading-[0.95]">
          Argentina<span style={{ color: 'var(--nd-accent)' }}>.</span>Nuclear
        </span>
        {!compact && (
          <span className="font-mono text-[0.5rem] uppercase tracking-label-wide text-nd-text-secondary mt-[3px]">
            por Zirconio
          </span>
        )}
      </span>
    </span>
  )
}
