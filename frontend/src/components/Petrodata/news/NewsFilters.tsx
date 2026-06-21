'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useDebounce } from '@/utilities/useDebounce'
import type { NewsFacets } from '@/api/news'

type ChipGroupProps = {
  label: string
  param: string
  active: string | null
  options: { value: string; count: number }[]
  onToggle: (param: string, value: string) => void
}

function ChipGroup({ label, param, active, options, onToggle }: ChipGroupProps) {
  if (!options.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.08em] text-nd-text-disabled">
        {label}
      </span>
      {options.map((o) => {
        const isActive = active === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(param, o.value)}
            aria-pressed={isActive}
            className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.04em] transition-colors"
            style={{
              borderColor: isActive ? 'var(--nd-accent)' : 'var(--nd-border)',
              color: isActive ? 'var(--nd-accent)' : 'var(--nd-text-secondary)',
              background: isActive ? 'color-mix(in srgb, var(--nd-accent) 12%, transparent)' : 'transparent',
            }}
          >
            {o.value}
            <span className="ml-1 text-nd-text-disabled">{o.count}</span>
          </button>
        )
      })}
    </div>
  )
}

export function NewsFilters({ facets }: { facets: NewsFacets }) {
  const t = useTranslations('noticias')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const get = useCallback((k: string) => searchParams.get(k), [searchParams])

  const sort = get('sort') === 'recent' ? 'recent' : 'importance'
  const [qInput, setQInput] = useState(get('q') ?? '')
  const debouncedQ = useDebounce(qInput, 350)

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      mutate(params)
      params.delete('page') // any filter change resets pagination
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router, searchParams],
  )

  // Reflect debounced search into the URL (only when it actually changed).
  useEffect(() => {
    const current = get('q') ?? ''
    if (debouncedQ === current) return
    pushParams((p) => {
      if (debouncedQ) p.set('q', debouncedQ)
      else p.delete('q')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  const toggle = useCallback(
    (param: string, value: string) => {
      pushParams((p) => {
        if (p.get(param) === value) p.delete(param)
        else p.set(param, value)
      })
    },
    [pushParams],
  )

  const setSort = useCallback(
    (value: 'importance' | 'recent') => {
      pushParams((p) => {
        if (value === 'importance') p.delete('sort')
        else p.set('sort', value)
      })
    },
    [pushParams],
  )

  const clearAll = useCallback(() => {
    setQInput('')
    router.push(pathname)
  }, [pathname, router])

  const hasFilters = useMemo(
    () => ['family', 'topic', 'entity', 'region', 'q'].some((k) => get(k)),
    [get],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full border border-nd-border bg-nd-surface px-3 py-2 font-sans text-sm text-nd-text-display placeholder:text-nd-text-disabled focus:border-nd-text-disabled focus:outline-none"
            aria-label={t('searchPlaceholder')}
          />
        </div>
        <div className="inline-flex border border-nd-border" role="group" aria-label={t('sortLabel')}>
          {(['importance', 'recent'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              aria-pressed={sort === value}
              className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors"
              style={{
                color: sort === value ? 'var(--nd-text-display)' : 'var(--nd-text-disabled)',
                background: sort === value ? 'var(--nd-surface-raised)' : 'transparent',
              }}
            >
              {value === 'importance' ? t('sortImportance') : t('sortRecent')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <ChipGroup label={t('filterFamily')} param="family" active={get('family')} options={facets.families} onToggle={toggle} />
        <ChipGroup label={t('filterTopic')} param="topic" active={get('topic')} options={facets.topics.slice(0, 14)} onToggle={toggle} />
        <ChipGroup label={t('filterRegion')} param="region" active={get('region')} options={facets.regions} onToggle={toggle} />
        <ChipGroup label={t('filterEntity')} param="entity" active={get('entity')} options={facets.entities.slice(0, 14)} onToggle={toggle} />
      </div>

      {hasFilters ? (
        <div>
          <button
            type="button"
            onClick={clearAll}
            className="font-mono text-[11px] uppercase tracking-[0.06em] text-nd-text-disabled transition-colors hover:text-nd-text-display"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
