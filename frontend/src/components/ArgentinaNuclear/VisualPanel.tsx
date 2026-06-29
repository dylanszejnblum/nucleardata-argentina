import type { HistoryMilestone } from '@/lib/nuclear-mock-data'
import { CATEGORY, significanceMeta } from './theme'

/**
 * Sticky visual panel for the history scrolly. Renders a category-specific
 * schematic SVG alongside the active milestone's title + description, plus its
 * significance badge. Falls back to a neutral placeholder when nothing is active.
 */
export function VisualPanel({ milestone }: { milestone: HistoryMilestone | null }) {
  if (!milestone) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center border border-nd-border bg-nd-surface-raised p-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-disabled font-mono">
          Seleccioná un hito
        </span>
      </div>
    )
  }

  const sig = significanceMeta(milestone.significance)
  const cat = CATEGORY[milestone.category]

  return (
    <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden border border-nd-border bg-nd-surface p-6 md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dot-grid-subtle"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-2">
        <span
          className="border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-mono"
          style={{ borderColor: sig.color, color: sig.color }}
        >
          {sig.labelEs}
        </span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-nd-text-secondary font-mono">
          {cat.labelEs}
        </span>
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <CategoryIcon category={milestone.category} />
      </div>

      <div className="relative">
        <span
          className="block font-display text-6xl leading-none tabular-nums text-nd-text-display md:text-7xl"
          data-numeric
        >
          {milestone.year}
        </span>
        <h3 className="mt-2 font-display text-2xl leading-tight text-nd-text-display">
          {milestone.title}
        </h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-nd-text-secondary font-sans">
          {milestone.description}
        </p>
        {milestone.sources.length > 0 ? (
          <p className="mt-3 text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
            {milestone.sources.join(' · ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function CategoryIcon({ category }: { category: HistoryMilestone['category'] }) {
  const stroke = 'var(--nd-accent)'
  const common = {
    width: 140,
    height: 140,
    viewBox: '0 0 140 140',
    fill: 'none',
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (category) {
    case 'technical':
      return (
        <svg {...common} aria-hidden>
          <circle cx="70" cy="70" r="46" />
          <circle cx="70" cy="70" r="28" />
          <circle cx="70" cy="70" r="10" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line
                key={i}
                x1={70 + Math.cos(a) * 28}
                y1={70 + Math.sin(a) * 28}
                x2={70 + Math.cos(a) * 46}
                y2={70 + Math.sin(a) * 46}
              />
            )
          })}
        </svg>
      )
    case 'legal':
      return (
        <svg {...common} aria-hidden>
          <rect x="36" y="28" width="68" height="84" />
          <line x1="48" y1="48" x2="92" y2="48" />
          <line x1="48" y1="64" x2="92" y2="64" />
          <line x1="48" y1="80" x2="78" y2="80" />
          <circle cx="70" cy="104" r="4" />
        </svg>
      )
    case 'institutional':
      return (
        <svg {...common} aria-hidden>
          <polygon points="70,28 104,48 36,48" />
          <line x1="44" y1="56" x2="44" y2="104" />
          <line x1="60" y1="56" x2="60" y2="104" />
          <line x1="80" y1="56" x2="80" y2="104" />
          <line x1="96" y1="56" x2="96" y2="104" />
          <line x1="32" y1="104" x2="108" y2="104" />
          <line x1="28" y1="112" x2="112" y2="112" />
        </svg>
      )
    case 'political':
      return (
        <svg {...common} aria-hidden>
          <line x1="40" y1="28" x2="40" y2="112" />
          <path d="M40 32 L96 32 L86 52 L96 72 L40 72" />
        </svg>
      )
    case 'international':
    default:
      return (
        <svg {...common} aria-hidden>
          <circle cx="70" cy="70" r="46" />
          <ellipse cx="70" cy="70" rx="20" ry="46" />
          <ellipse cx="70" cy="70" rx="46" ry="20" />
          <line x1="24" y1="70" x2="116" y2="70" />
          <line x1="70" y1="24" x2="70" y2="116" />
        </svg>
      )
  }
}
