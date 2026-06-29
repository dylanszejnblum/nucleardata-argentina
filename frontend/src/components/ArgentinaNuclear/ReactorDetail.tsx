import { useTranslations } from 'next-intl'
import type { ReactorData } from '@/lib/nuclear-mock-data'
import { StatusBadge } from './StatusBadge'
import { statusMeta, REACTOR_TYPE } from './theme'

/** Renders a reactor's full spec sheet + construction→operation timeline. */
export function ReactorDetail({ reactor }: { reactor: ReactorData }) {
  const t = useTranslations('reactors')
  const sm = statusMeta(reactor.status)

  const firstCrit = reactor.firstCriticality
    ? new Date(reactor.firstCriticality).getFullYear()
    : null
  const gridConn = reactor.gridConnection
    ? new Date(reactor.gridConnection).getFullYear()
    : null

  const rows: [string, string | null][] = [
    [t('spec.type'), REACTOR_TYPE[reactor.type].label],
    [
      t('spec.capacity'),
      reactor.capacityMwe != null
        ? `${reactor.capacityMwe} MWe / ${reactor.capacityMwt} MWt`
        : `${reactor.capacityMwt} MWt`,
    ],
    [t('spec.coolant'), reactor.coolant],
    [t('spec.moderator'), reactor.moderator],
    [t('spec.fuel'), reactor.fuelType],
    [t('spec.supplier'), reactor.supplier],
    [t('spec.operator'), reactor.operator],
    [t('spec.owner'), reactor.owner],
    [
      t('spec.lifetimeFactor'),
      reactor.lifetimeFactor != null ? `${reactor.lifetimeFactor.toFixed(1)}%` : null,
    ],
  ]

  return (
    <div className="border-t border-nd-border bg-nd-surface-raised p-5 md:p-7">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Spec sheet */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
              {t('spec.eyebrow')}
            </span>
            <StatusBadge color={sm.color} label={sm.labelEs} variant="chip" />
          </div>
          <dl className="divide-y divide-nd-border">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-2.5">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
                  {k}
                </dt>
                <dd className="text-sm text-nd-text-primary font-sans">{v ?? '—'}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-nd-text-secondary font-sans">
            {reactor.statusDetail}
          </p>
        </div>

        {/* Timeline */}
        <div>
          <span className="mb-4 block text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
            {t('timeline.eyebrow')}
          </span>
          <ol className="relative border-l border-nd-border-visible pl-5">
            <TimelineItem
              label={t('timeline.firstCriticality')}
              value={firstCrit}
              highlight={reactor.status !== 'construction'}
            />
            <TimelineItem label={t('timeline.gridConnection')} value={gridConn} />
            <TimelineItem
              label={t('timeline.status')}
              valueText={sm.labelEs}
              dotColor={sm.color}
            />
          </ol>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({
  label,
  value,
  valueText,
  highlight,
  dotColor = 'var(--nd-text-disabled)',
}: {
  label: string
  value?: number | null
  valueText?: string
  highlight?: boolean
  dotColor?: string
}) {
  return (
    <li className="relative pb-5 last:pb-0">
      <span
        className="absolute -left-[1.625rem] top-1 size-2"
        style={{
          backgroundColor: dotColor,
          outline: highlight ? `2px solid ${dotColor}` : undefined,
          outlineOffset: '2px',
        }}
        aria-hidden
      />
      <span className="block text-[10px] uppercase tracking-[0.1em] text-nd-text-secondary font-mono">
        {label}
      </span>
      <span
        className="font-display text-2xl tabular-nums leading-tight text-nd-text-display"
        data-numeric
      >
        {valueText ?? value ?? '—'}
      </span>
    </li>
  )
}
