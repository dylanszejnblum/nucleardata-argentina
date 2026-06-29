'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PROVINCES_NUCLEAR, REACTORS } from '@/lib/nuclear-mock-data'
import {
  ARGENTINA_VIEWBOX,
  PROVINCE_SHAPES,
  REACTOR_PIN_OFFSETS,
  type ProvinceShape,
} from './argentina-provinces'
import { ProvinceTooltip } from './ProvinceTooltip'
import { TimelineSlider } from './TimelineSlider'
import { statusMeta } from './theme'

type LayerKey = 'reactors' | 'centers' | 'mines' | 'zones'
const LAYERS: { key: LayerKey; labelKey: string }[] = [
  { key: 'reactors', labelKey: 'layers.reactors' },
  { key: 'centers', labelKey: 'layers.centers' },
  { key: 'mines', labelKey: 'layers.mines' },
  { key: 'zones', labelKey: 'layers.zones' },
]

const TYPE_COLOR: Record<string, string> = {
  none: '#34e89e',
  legal: '#e89e34',
  constitutional: '#e83434',
}

export function ProvinceMap() {
  const t = useTranslations('mapNuclear')
  const [year, setYear] = useState(2026)
  const [hovered, setHovered] = useState<{ shape: ProvinceShape; x: number; y: number } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    reactors: true,
    centers: true,
    mines: true,
    zones: true,
  })

  const provinceByCode = useMemo(
    () => Object.fromEntries(PROVINCES_NUCLEAR.map((p) => [p.code, p])),
    [],
  )

  const fillColor = (shape: ProvinceShape) => {
    const info = provinceByCode[shape.code]
    if (!info) return 'var(--nd-surface-raised)'
    const base = TYPE_COLOR[info.restrictionType] ?? '#9aa0a6'
    if (info.nuclearAllowed || shape.restrictionYear == null) return base
    // If the restriction year is in the future relative to the slider, fade it.
    if (shape.restrictionYear > year) {
      return info.restrictionType === 'constitutional' ? '#3a1a1a' : '#3a2a14'
    }
    return base
  }

  const fillOpacity = (shape: ProvinceShape) => {
    const info = provinceByCode[shape.code]
    if (!info || info.nuclearAllowed) return 0.85
    if (shape.restrictionYear == null) return 0.85
    return shape.restrictionYear > year ? 0.35 : 0.8
  }

  const toggleLayer = (k: LayerKey) => setLayers((cur) => ({ ...cur, [k]: !cur[k] }))

  // Reactor pins — cluster per province at the schematic centroid + offset.
  const pins = useMemo(() => {
    return REACTORS.map((r, i) => {
      const shape = PROVINCE_SHAPES.find((s) => s.name === r.province) ?? PROVINCE_SHAPES[0]
      const [ox, oy] = REACTOR_PIN_OFFSETS[shape.code] ?? [0, 0]
      const jitter = (i % 3) * 6
      const pinLayer: LayerKey = r.category === 'research' ? 'centers' : 'reactors'
      return {
        reactor: r,
        x: shape.label[0] + ox + jitter,
        y: shape.label[1] + oy,
        layer: pinLayer,
        provinceCode: shape.code,
      }
    })
  }, [])

  const selectedInfo = selected ? provinceByCode[selected] : null
  const selectedShape = selected ? PROVINCE_SHAPES.find((s) => s.code === selected) : null

  return (
    <section className="container py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Map column */}
        <div className="min-w-0">
          {/* Layer toggles */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {LAYERS.map((l) => {
              const on = layers[l.key]
              return (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => toggleLayer(l.key)}
                  aria-pressed={on}
                  className="border px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] font-mono transition-colors"
                  style={
                    on
                      ? { borderColor: 'var(--nd-accent)', color: 'var(--nd-text-display)', backgroundColor: 'var(--nd-accent-subtle)' }
                      : { borderColor: 'var(--nd-border-visible)', color: 'var(--nd-text-disabled)' }
                  }
                >
                  {t(l.labelKey)}
                </button>
              )
            })}
          </div>

          <div className="relative border border-nd-border bg-nd-surface">
            <div className="dot-grid-subtle pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <svg
              viewBox={`0 0 ${ARGENTINA_VIEWBOX.w} ${ARGENTINA_VIEWBOX.h}`}
              className="relative block w-full"
              role="img"
              aria-label={t('mapAria')}
            >
              {/* Provinces */}
              {PROVINCE_SHAPES.map((shape) => {
                const isSel = selected === shape.code
                return (
                  <polygon
                    key={shape.code}
                    points={shape.points}
                    fill={layers.zones ? fillColor(shape) : 'var(--nd-surface-raised)'}
                    fillOpacity={layers.zones ? fillOpacity(shape) : 0.4}
                    stroke={isSel ? 'var(--nd-accent)' : 'var(--nd-border-visible)'}
                    strokeWidth={isSel ? 2 : 1}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => setHovered({ shape, x: shape.label[0], y: shape.label[1] })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(shape.code)}
                  />
                )
              })}

              {/* Province labels */}
              {PROVINCE_SHAPES.map((shape) => (
                <text
                  key={shape.code}
                  x={shape.label[0]}
                  y={shape.label[1]}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-martian-mono), monospace"
                  fill="var(--nd-text-primary)"
                  pointerEvents="none"
                >
                  {shape.code}
                </text>
              ))}

              {/* Reactor / center pins */}
              {pins.map(({ reactor, x, y, layer, provinceCode }) => {
                if (!layers[layer]) return null
                const sm = statusMeta(reactor.status)
                const isResearch = reactor.category === 'research'
                return (
                  <g
                    key={reactor.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(provinceCode)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isResearch ? 3 : 4.5}
                      fill={sm.dot}
                      stroke="var(--nd-text-display)"
                      strokeWidth={0.75}
                    />
                    <title>{reactor.name} — {reactor.province}</title>
                  </g>
                )
              })}
            </svg>

            {/* Hover tooltip */}
            {hovered ? (
              <ProvinceTooltip
                province={hovered.shape}
                detail={provinceByCode[hovered.shape.code]?.notes ?? ''}
                nuclearAllowed={provinceByCode[hovered.shape.code]?.nuclearAllowed ?? false}
                restrictionType={provinceByCode[hovered.shape.code]?.restrictionType ?? 'none'}
                legislationRef={provinceByCode[hovered.shape.code]?.notes}
                x={hovered.x}
                y={hovered.y}
              />
            ) : null}
          </div>

          {/* Legend */}
          <Legend />
        </div>

        {/* Sidebar: timeline + selected province detail */}
        <div className="flex flex-col gap-4">
          <TimelineSlider year={year} onChange={setYear} />

          {selectedShape && selectedInfo ? (
            <div className="border border-nd-border bg-nd-surface p-5">
              <span className="text-[10px] uppercase tracking-[0.12em] text-nd-text-secondary font-mono">
                {t('detail.eyebrow')}
              </span>
              <h3 className="mt-1 font-display text-2xl text-nd-text-display">{selectedShape.name}</h3>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-mono">
                <span
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.08em]"
                  style={{ color: TYPE_COLOR[selectedInfo.restrictionType] }}
                >
                  <span className="inline-block size-2" style={{ backgroundColor: TYPE_COLOR[selectedInfo.restrictionType] }} aria-hidden />
                  {selectedInfo.nuclearAllowed ? t('detail.allowed') : t('detail.restricted')}
                </span>
                {selectedShape.restrictionYear ? (
                  <span className="text-nd-text-secondary tabular-nums" data-numeric>
                    {t('detail.since', { year: selectedShape.restrictionYear })}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-nd-text-secondary font-sans">
                {selectedInfo.notes}
              </p>
            </div>
          ) : (
            <div className="border border-dashed border-nd-border-visible bg-nd-surface p-5 text-[11px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
              {t('detail.empty')}
            </div>
          )}

          {/* Río Negro paradox */}
          {selected === 'RN' ? (
            <div className="border bg-nd-surface p-5" style={{ borderColor: 'var(--nd-warning)' }}>
              <span className="text-[11px] uppercase tracking-[0.1em] font-mono" style={{ color: 'var(--nd-warning)' }}>
                ⚠ {t('paradox.title')}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-nd-text-primary font-sans">
                {t('paradox.body', { year: 2017, law: '5.227' })}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Legend() {
  const t = useTranslations('mapNuclear')
  const items = [
    { color: '#34e89e', labelKey: 'legend.allowed' },
    { color: '#e89e34', labelKey: 'legend.mining' },
    { color: '#e83434', labelKey: 'legend.legal' },
    { color: '#9aa0a6', labelKey: 'legend.constitutional' },
  ]
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((it) => (
        <span
          key={it.labelKey}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.06em] text-nd-text-secondary font-mono"
        >
          <span className="inline-block size-2.5" style={{ backgroundColor: it.color }} aria-hidden />
          {t(it.labelKey)}
        </span>
      ))}
      <span className="ml-auto text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled font-mono">
        {t('legend.disclaimer')}
      </span>
    </div>
  )
}
