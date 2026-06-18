'use client'

import { useMemo, useState } from 'react'

import { cn, formatDate, formatTime } from '@/lib/utils/formatters'
import type { NewsItem } from '@/types/stock'

export interface NewsfeedEntry extends NewsItem {
  ticker: string
  company: string
  changePct: number
}

interface NewsfeedWidgetProps {
  items: NewsfeedEntry[]
  selectedTicker?: string
  onSelectTicker?: (ticker: string) => void
  className?: string
}

export function NewsfeedWidget({
  items,
  selectedTicker,
  onSelectTicker,
  className,
}: NewsfeedWidgetProps) {
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.category)))], [items])
  const [category, setCategory] = useState('All')

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => category === 'All' || item.category === category)
        .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()),
    [category, items],
  )

  return (
    <section className={cn('rounded-3xl border border-border bg-surface p-5 shadow-panel', className)}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Personalized Newsfeed</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">Stories linked to the live dashboard tape</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                'rounded-full border px-3 py-2 text-sm font-medium transition',
                category === item ? 'border-accent bg-elevated text-primary' : 'border-border bg-base text-secondary hover:text-primary',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filteredItems.length ? (
          filteredItems.map((item) => {
            const isPositive = item.changePct >= 0
            const isSelected = item.ticker === selectedTicker

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTicker?.(item.ticker)}
                className={cn(
                  'w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent',
                  isSelected ? 'border-accent bg-elevated' : 'border-border bg-base',
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border px-2 py-1 text-[11px] font-medium text-secondary">
                        {item.category}
                      </span>
                      <span className="text-xs text-secondary">{item.company}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-6 text-primary">{item.headline}</p>
                  </div>
                  <span className={cn('text-xs font-medium', isPositive ? 'text-gain' : 'text-loss')}>
                    {item.ticker} {isPositive ? '▲' : '▼'}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-secondary">{item.summary}</p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-secondary">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>{formatTime(item.publishedAt)}</span>
                </div>
              </button>
            )
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-base px-4 py-8 text-center text-sm text-secondary">
            No stories match this filter right now.
          </div>
        )}
      </div>
    </section>
  )
}
