'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Map, MapMarker, MarkerContent, MapPopup } from '@/components/ui/map'
import { REACTORS } from '@/lib/nuclear-mock-data'
import { statusMeta } from './theme'

const VIEWPORT = { center: [-63, -36] as [number, number], zoom: 3.6 }

/**
 * Inline map of reactor locations. Pins coloured by status; hovering or
 * focusing a pin shows a small popup with the name + capacity, linking to the
 * reactor anchor.
 */
export function ReactorsMap() {
  const t = useTranslations('reactors')
  const [active, setActive] = useState<string | null>(null)

  const activeReactor = REACTORS.find((r) => r.id === active) ?? null

  return (
    <section className="container pb-16">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
            {t('map.eyebrow')}
          </span>
          <h2 className="mt-2 font-display text-3xl leading-none text-nd-text-display md:text-4xl">
            {t('map.title')}
          </h2>
        </div>
        <Legend />
      </div>

      <div className="relative h-[58vh] min-h-[380px] overflow-hidden border border-nd-border bg-nd-surface">
        <Map viewport={VIEWPORT} className="h-full w-full">
          {REACTORS.map((r) => {
            const sm = statusMeta(r.status)
            const isResearch = r.category === 'research'
            return (
              <MapMarker
                key={r.id}
                longitude={r.longitude}
                latitude={r.latitude}
                onMouseEnter={() => setActive(r.id)}
                onMouseLeave={() => setActive((cur) => (cur === r.id ? null : cur))}
                onClick={() => setActive(r.id)}
              >
                <MarkerContent>
                  <span
                    className="block -translate-x-1/2 -translate-y-1/2"
                    title={r.name}
                    aria-label={r.name}
                  >
                    <span
                      className="block size-3 border"
                      style={{
                        backgroundColor: sm.dot,
                        borderColor: 'var(--nd-text-display)',
                        opacity: isResearch ? 0.7 : 1,
                      }}
                    />
                  </span>
                </MarkerContent>
              </MapMarker>
            )
          })}

          {activeReactor ? (
            <MapPopup
              longitude={activeReactor.longitude}
              latitude={activeReactor.latitude}
              onClose={() => setActive(null)}
              closeButton
            >
              <div className="min-w-[12rem] border border-nd-border bg-nd-surface p-3">
                <span className="block text-[10px] uppercase tracking-[0.1em] text-nd-text-secondary font-mono">
                  {activeReactor.type} · {activeReactor.province}
                </span>
                <span className="font-display text-xl text-nd-text-display">
                  {activeReactor.name}
                </span>
                <span className="mt-1 block text-sm tabular-nums text-nd-text-primary font-mono" data-numeric>
                  {activeReactor.capacityMwe != null
                    ? `${activeReactor.capacityMwe} MWe`
                    : `${activeReactor.capacityMwt} MWt`}
                </span>
              </div>
            </MapPopup>
          ) : null}
        </Map>
      </div>
    </section>
  )
}

function Legend() {
  const t = useTranslations('reactors')
  const items = [
    { color: '#34e89e', label: t('map.legend.operational') },
    { color: '#4a9eff', label: t('map.legend.construction') },
    { color: '#5bc0eb', label: t('map.legend.research') },
  ]
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex items-center gap-1.5 text-[11px] text-nd-text-secondary font-mono"
        >
          <span className="inline-block size-2.5" style={{ backgroundColor: it.color }} aria-hidden />
          {it.label}
        </span>
      ))}
    </div>
  )
}
