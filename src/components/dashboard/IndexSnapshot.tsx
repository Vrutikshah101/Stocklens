'use client'

import { cn } from '@/lib/utils/formatters'
import type { IndexSnapshot as MarketIndexSnapshot } from '@/types/stock'

interface MarketStatus {
  isOpen: boolean
  label: string
  hint: string
}

interface IndexSnapshotProps {
  indices: MarketIndexSnapshot[]
  marketStatus: MarketStatus
  selectedSymbol?: string
  onSelectSymbol?: (symbol: string) => void
  className?: string
}

const indexFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

export function IndexSnapshot({
  indices,
  marketStatus,
  selectedSymbol,
  onSelectSymbol,
  className,
}: IndexSnapshotProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Market Snapshot</p>
          <h2 className="mt-1 text-xl font-semibold text-primary">Benchmarks, breadth, and momentum</h2>
        </div>

        <div
          className={cn(
            'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm',
            marketStatus.isOpen ? 'border-gain text-primary' : 'border-border text-primary',
          )}
          style={{
            background: marketStatus.isOpen
              ? 'color-mix(in srgb, var(--color-green) 14%, var(--color-bg-surface))'
              : 'var(--color-bg-surface)',
          }}
        >
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              marketStatus.isOpen ? 'bg-gain shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-green)_18%,transparent)]' : 'bg-secondary',
            )}
          />
          <div>
            <p className="font-medium">{marketStatus.label}</p>
            <p className="text-xs text-secondary">{marketStatus.hint}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indices.map((index) => {
          const isPositive = index.change >= 0
          const isActive = index.symbol === selectedSymbol

          return (
            <button
              key={index.symbol}
              type="button"
              onClick={() => onSelectSymbol?.(index.symbol)}
              className={cn(
                'rounded-3xl border p-4 text-left transition duration-150 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent',
                isActive ? 'border-accent bg-elevated shadow-panel' : 'border-border bg-surface',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-secondary">{index.symbol}</p>
                  <p className="mt-1 text-sm text-secondary">{index.name}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    isPositive ? 'text-gain' : 'text-loss',
                  )}
                  style={{
                    background: isPositive
                      ? 'color-mix(in srgb, var(--color-green) 16%, var(--color-bg-surface))'
                      : 'color-mix(in srgb, var(--color-red) 16%, var(--color-bg-surface))',
                  }}
                >
                  {index.changePct > 0 ? '▲' : '▼'} {Math.abs(index.changePct).toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-2xl font-semibold tabular-nums text-primary">
                    {indexFormatter.format(index.value)}
                  </p>
                  <p className={cn('mt-1 font-mono text-sm', isPositive ? 'text-gain' : 'text-loss')}>
                    {formatSignedNumber(index.change)} pts
                  </p>
                </div>
                <div className="w-full max-w-24 self-end">
                  <MiniSparkline value={index.value} changePct={index.changePct} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-base px-3 py-2 text-xs">
                <span className="text-secondary">Breadth</span>
                <span className="font-medium text-primary">{index.breadth}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function MiniSparkline({ value, changePct }: { value: number; changePct: number }) {
  const amplitude = 9 + Math.min(Math.abs(changePct) * 6, 18)
  const direction = changePct >= 0 ? -1 : 1
  const points = Array.from({ length: 7 }, (_, index) => {
    const x = index * 16
    const wave = Math.sin(index * 0.9 + value / 9000) * amplitude
    const y = 18 + wave * 0.35 * direction + (6 - index) * direction * 0.55
    return `${x},${Math.max(4, Math.min(32, y)).toFixed(2)}`
  }).join(' ')

  const stroke = changePct >= 0 ? 'var(--color-green)' : 'var(--color-red)'

  return (
    <svg viewBox="0 0 96 36" className="h-10 w-full">
      <defs>
        <linearGradient id={`spark-${changePct >= 0 ? 'gain' : 'loss'}`} x1="0%" x2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        points={points}
        stroke={`url(#spark-${changePct >= 0 ? 'gain' : 'loss'})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

function formatSignedNumber(value: number) {
  const formatted = indexFormatter.format(Math.abs(value))
  return `${value >= 0 ? '+' : '-'}${formatted}`
}
