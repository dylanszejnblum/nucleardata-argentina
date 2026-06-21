import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Pagination } from '@/api/news'

function buildHref(base: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(base)) {
    if (v && k !== 'page') params.set(k, v)
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/noticias?${qs}` : '/noticias'
}

export async function NewsPager({
  pagination,
  params,
}: {
  pagination: Pagination
  params: Record<string, string | undefined>
}) {
  const t = await getTranslations('noticias')
  const { page, limit, total } = pagination
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null

  const hasPrev = page > 1
  const hasNext = page < totalPages

  const linkCls =
    'px-3 py-2 border border-nd-border font-mono text-[11px] uppercase tracking-[0.06em] transition-colors hover:border-nd-text-disabled hover:text-nd-text-display'
  const disabledCls =
    'px-3 py-2 border border-nd-border font-mono text-[11px] uppercase tracking-[0.06em] text-nd-text-disabled opacity-40 cursor-not-allowed'

  return (
    <nav className="flex items-center justify-between gap-4 pt-2" aria-label={t('pagination')}>
      {hasPrev ? (
        <Link href={buildHref(params, page - 1)} className={linkCls}>
          ← {t('prev')}
        </Link>
      ) : (
        <span className={disabledCls}>← {t('prev')}</span>
      )}

      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-nd-text-secondary">
        {t('pageOf', { page, total: totalPages })}
      </span>

      {hasNext ? (
        <Link href={buildHref(params, page + 1)} className={linkCls}>
          {t('next')} →
        </Link>
      ) : (
        <span className={disabledCls}>{t('next')} →</span>
      )}
    </nav>
  )
}
