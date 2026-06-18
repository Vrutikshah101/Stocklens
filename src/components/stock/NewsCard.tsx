import { Newspaper } from 'lucide-react'

import { formatDate } from '@/lib/utils/formatters'
import type { NewsItem } from '@/types/stock'

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-base/70 p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-secondary">
            {item.category}
          </span>
          <span className="text-xs text-secondary">{item.source}</span>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-2.5 text-secondary">
          <Newspaper className="h-4 w-4" />
        </div>
      </div>
      <h3 className="mt-4 text-base font-semibold leading-6 text-primary">
        {item.headline}
      </h3>
      <p className="mt-3 text-sm leading-6 text-secondary">{item.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-secondary">
        <span>{formatDate(item.publishedAt)}</span>
        <span>Demo feed</span>
      </div>
    </article>
  )
}
