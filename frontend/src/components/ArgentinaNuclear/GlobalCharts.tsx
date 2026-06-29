import { useLocale } from 'next-intl'

/**
 * U₃O₈ spot price schematic (2005→2026) with annotated shock events.
 * Static SVG polyline — no charting lib. Numbers are illustrative annual
 * averages in USD/lb U₃O₈.
 */
const SERIES: { year: number; price: number }[] = [
  { year: 2005, price: 20 },
  { year: 2007, price: 95 },
  { year: 2010, price: 45 },
  { year: 2011, price: 60 },
  { year: 2014, price: 35 },
  { year: 2017, price: 22 },
  { year: 2020, price: 20 },
  { year: 2021, price: 40 },
  { year: 2023, price: 60 },
  { year: 2024, price: 85 },
  { year: 2026, price: 65 },
]

const EVENTS: { year: number; key: string }[] = [
  { year: 2007, key: 'price' },
  { year: 2011, key: 'fukushima' },
  { year: 2024, key: 'russia' },
]

export function PriceChart() {
  const locale = useLocale()
  const W = 640
  const H = 240
  const PAD = 40
  const minY = 0
  const maxY = 110
  const minX = SERIES[0].year
  const maxX = SERIES[SERIES.length - 1].year
  const x = (yr: number) => PAD + ((yr - minX) / (maxX - minX)) * (W - PAD * 2)
  const y = (p: number) => H - PAD - ((p - minY) / (maxY - minY)) * (H - PAD * 2)

  const line = SERIES.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.year)} ${y(d.price)}`).join(' ')
  const area = `${line} L ${x(maxX)} ${H - PAD} L ${x(minX)} ${H - PAD} Z`
  const labels: Record<string, { es: string; en: string }> = {
    price: { es: 'Pico 2007', en: '2007 peak' },
    fukushima: { es: 'Fukushima 2011', en: 'Fukushima 2011' },
    russia: { es: 'Sanciones a Rusia 2024', en: 'Russia sanctions 2024' },
  }

  return (
    <div className="border border-nd-border bg-nd-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {locale === 'en' ? 'U₃O₈ spot price (USD/lb)' : 'Precio spot U₃O₈ (USD/lb)'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">
          2005–2026
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="U3O8 price chart">
        {/* Y grid */}
        {[0, 50, 100].map((p) => (
          <g key={p}>
            <line x1={PAD} y1={y(p)} x2={W - PAD} y2={y(p)} stroke="var(--nd-border)" strokeWidth={1} />
            <text x={PAD - 8} y={y(p) + 3} textAnchor="end" fontSize={9} fill="var(--nd-text-disabled)" fontFamily="var(--font-martian-mono), monospace">
              {p}
            </text>
          </g>
        ))}
        {/* Area + line */}
        <path d={area} fill="var(--nd-accent-subtle)" />
        <path d={line} fill="none" stroke="var(--nd-accent)" strokeWidth={1.5} />
        {/* Points + events */}
        {SERIES.map((d) => (
          <circle key={d.year} cx={x(d.year)} cy={y(d.price)} r={2.5} fill="var(--nd-accent)" />
        ))}
        {EVENTS.map((e) => {
          const d = SERIES.find((s) => s.year === e.year)!
          return (
            <g key={e.key}>
              <line x1={x(d.year)} y1={y(d.price)} x2={x(d.year)} y2={PAD - 6} stroke="var(--nd-text-disabled)" strokeWidth={0.75} strokeDasharray="2 2" />
              <text x={x(d.year)} y={PAD - 10} textAnchor="middle" fontSize={9} fill="var(--nd-text-secondary)" fontFamily="var(--font-hanken-grotesk), sans-serif">
                {labels[e.key][locale === 'en' ? 'en' : 'es']}
              </text>
            </g>
          )
        })}
        {/* X axis years */}
        {[2005, 2010, 2015, 2020, 2026].map((yr) => (
          <text key={yr} x={x(yr)} y={H - PAD + 16} textAnchor="middle" fontSize={9} fill="var(--nd-text-disabled)" fontFamily="var(--font-martian-mono), monospace">
            {yr}
          </text>
        ))}
      </svg>
    </div>
  )
}

/** Horizontal bar chart of uranium production by country (tU/year). */
const PRODUCERS = [
  { country: 'Kazakhstan', tu: 23000 },
  { country: 'Canadá', tu: 7300 },
  { country: 'Namibia', tu: 5400 },
  { country: 'Australia', tu: 4100 },
  { country: 'Uzbekistán', tu: 3300 },
  { country: 'Rusia', tu: 2800 },
  { country: 'Níger', tu: 2100 },
  { country: 'Argentina', tu: 0 },
]

export function ProductionBarChart() {
  const locale = useLocale()
  const max = Math.max(...PRODUCERS.map((p) => p.tu))
  const label = (c: string) =>
    locale === 'en' ? c.replace('Canadá', 'Canada').replace('Uzbekistán', 'Uzbekistan').replace('Níger', 'Niger') : c
  return (
    <div className="border border-nd-border bg-nd-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {locale === 'en' ? 'Uranium production (tU/year)' : 'Producción de uranio (tU/año)'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">WNA</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {PRODUCERS.map((p) => {
          const w = p.tu === 0 ? 2 : Math.max(2, (p.tu / max) * 100)
          const isAr = p.country === 'Argentina'
          return (
            <li key={p.country} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[11px] uppercase tracking-[0.06em] text-nd-text-secondary font-mono">
                {label(p.country)}
              </span>
              <div className="h-3 flex-1 bg-nd-surface-raised">
                <div
                  className="h-full"
                  style={{
                    width: `${w}%`,
                    backgroundColor: isAr ? 'var(--nd-warning)' : 'var(--nd-accent)',
                    opacity: isAr ? 1 : 0.85,
                  }}
                />
              </div>
              <span
                className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-nd-text-primary"
                data-numeric
              >
                {p.tu.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Two-bar projection of data-centre power demand 2024 → 2030. */
export function DataCenterChart() {
  const locale = useLocale()
  const rows = [
    { year: 2024, twh: 200, label: '2024' },
    { year: 2030, twh: 520, label: '2030' },
  ]
  const max = 520
  return (
    <div className="border border-nd-border bg-nd-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
          {locale === 'en' ? 'Data-centre power demand (TWh)' : 'Demanda de data centers (TWh)'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-nd-text-disabled font-mono">Goldman Sachs</span>
      </div>
      <div className="flex items-end gap-8 px-4" style={{ height: 160 }}>
        {rows.map((r) => {
          const h = (r.twh / max) * 140
          return (
            <div key={r.year} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-display text-2xl tabular-nums text-nd-text-display" data-numeric>
                {r.twh}
              </span>
              <div className="flex w-full items-end justify-center" style={{ height: 140 }}>
                <div
                  className="w-full max-w-[4rem]"
                  style={{ height: h, backgroundColor: 'var(--nd-accent)' }}
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.08em] text-nd-text-secondary font-mono">
                {r.label}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
        {locale === 'en' ? '+160% projected' : '+160% proyectado'}
      </p>
    </div>
  )
}
