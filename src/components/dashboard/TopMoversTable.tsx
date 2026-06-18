'use client'

import { useMemo, useState } from 'react'

import { cn, formatPct } from '@/lib/utils/formatters'
import type { MarketMover } from '@/types/stock'

type ViewMode = 'gainers' | 'losers' | 'volume'

interface TopMoversTableProps {
  movers: MarketMover[]
  selectedTicker?: string
  onSelectTicker?: (ticker: string) => void
  className?: string
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export function TopMoversTable({
  movers,
  selectedTicker,
  onSelectTicker,
  className,
}: TopMoversTableProps) {
  const [view, setView] = useState<ViewMode>('gainers')

  const rows = useMemo(() => {
    const base = [...movers]

    if (view === 'losers') {
      return base.sort((left, right) => left.changePct - right.changePct).slice(0, 6)
    }

    if (view === 'volume') {
      return base.sort((left, right) => right.volumeRatio - left.volumeRatio).slice(0, 6)
    }

    return base.sort((left, right) => right.changePct - left.changePct).slice(0, 6)
  }, [movers, view])

  return (
    <section className={cn('min-w-0 overflow-hidden rounded-lg border border-border bg-surface p-4 sm:p-5', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-secondary">Top movers</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">Gainers, laggards, and volume leaders</h3>
        </div>

        <div className="inline-flex w-full rounded-lg border border-border bg-base p-1 sm:w-auto">
          {([
            ['gainers', 'Gainers'],
            ['losers', 'Losers'],
            ['volume', 'Volume'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              className={cn(
                'flex-1 rounded-md px-3 py-2 text-sm font-medium transition sm:flex-none',
                view === value ? 'bg-elevated text-primary' : 'text-secondary hover:text-primary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:hidden">
        {rows.map((row) => {
          const isActive = row.ticker === selectedTicker
          const isPositive = row.changePct >= 0

          return (
            <button
              key={row.ticker}
              type="button"
              onClick={() => onSelectTicker?.(row.ticker)}
              className={cn(
                'rounded-lg border p-4 text-left transition',
                isActive ? 'border-accent bg-elevated' : 'border-border bg-base hover:border-accent',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">{row.ticker}</p>
                  <p className="mt-1 text-xs text-secondary">{row.sector}</p>
                </div>
                <span
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium',
                    row.dvm >= 70 ? 'text-gain' : row.dvm >= 55 ? 'text-warn' : 'text-loss',
                  )}
                  style={{
                    background:
                      row.dvm >= 70
                        ? 'color-mix(in srgb, var(--color-green) 15%, var(--color-bg-surface))'
                        : row.dvm >= 55
                          ? 'color-mix(in srgb, var(--color-amber) 15%, var(--color-bg-surface))'
                          : 'color-mix(in srgb, var(--color-red) 15%, var(--color-bg-surface))',
                  }}
                >
                  DVM {row.dvm.toFixed(0)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Price" value={`₹${currencyFormatter.format(row.price)}`} />
                <Metric label="Volume" value={`${row.volumeRatio.toFixed(1)}×`} />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-secondary">Change</span>
                  <span className={cn('text-sm font-medium', isPositive ? 'text-gain' : 'text-loss')}>
                    {formatPct(row.changePct)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn('h-full rounded-full', isPositive ? 'bg-gain' : 'bg-loss')}
                    style={{ width: `${Math.min(100, 18 + Math.abs(row.changePct) * 20)}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="min-w-[560px] divide-y divide-border text-left text-sm">
          <thead className="bg-base text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Change</th>
              <th className="px-4 py-3 font-medium">Volume</th>
              <th className="px-4 py-3 font-medium">DVM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const isActive = row.ticker === selectedTicker
              const isPositive = row.changePct >= 0

              return (
                <tr
                  key={row.ticker}
                  className={cn(
                    'cursor-pointer bg-surface transition hover:bg-elevated',
                    isActive ? 'bg-elevated' : '',
                  )}
                  onClick={() => onSelectTicker?.(row.ticker)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-base text-xs font-semibold text-primary"
                        aria-hidden="true"
                      >
                        {row.ticker.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{row.ticker}</p>
                        <p className="text-xs text-secondary">{row.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-primary">₹{currencyFormatter.format(row.price)}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className={cn('font-mono', isPositive ? 'text-gain' : 'text-loss')}>{formatPct(row.changePct)}</p>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-base">
                        <div
                          className={cn('h-full rounded-full', isPositive ? 'bg-gain' : 'bg-loss')}
                          style={{ width: `${Math.min(100, 18 + Math.abs(row.changePct) * 20)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-primary">{row.volumeRatio.toFixed(1)}×</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-md px-2.5 py-1 text-xs font-medium',
                        row.dvm >= 70 ? 'text-gain' : row.dvm >= 55 ? 'text-warn' : 'text-loss',
                      )}
                      style={{
                        background:
                          row.dvm >= 70
                            ? 'color-mix(in srgb, var(--color-green) 15%, var(--color-bg-surface))'
                            : row.dvm >= 55
                              ? 'color-mix(in srgb, var(--color-amber) 15%, var(--color-bg-surface))'
                              : 'color-mix(in srgb, var(--color-red) 15%, var(--color-bg-surface))',
                      }}
                    >
                      {row.dvm.toFixed(0)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-secondary">
        Click a row to sync the price chart, DVM radar, and fundamentals panel to that stock.
      </p>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3">
      <p className="text-[11px] font-medium uppercase text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
    </div>
  )
}
