'use client'

import { useMemo, useState } from 'react'

import { cn, formatCurrency, formatPct, formatSignedCurrency } from '@/lib/utils/formatters'
import type { PortfolioPoint, PortfolioSnapshot } from '@/types/portfolio'

type RangeKey = '1W' | '1M' | 'ALL'

interface PortfolioNAVChartProps {
  history: PortfolioPoint[]
  snapshot: PortfolioSnapshot
  portfolioName?: string
  className?: string
}

export function PortfolioNAVChart({
  history,
  snapshot,
  portfolioName,
  className,
}: PortfolioNAVChartProps) {
  const [range, setRange] = useState<RangeKey>('1M')
  const [activeIndex, setActiveIndex] = useState(0)
  const hasHistory = history.length > 0

  const visibleHistory = useMemo(() => {
    if (!hasHistory) {
      return []
    }

    if (range === '1W') {
      return history.slice(-7)
    }

    if (range === '1M') {
      return history.slice(-20)
    }

    return history
  }, [hasHistory, history, range])

  const path = useMemo(() => buildPortfolioPath(visibleHistory), [visibleHistory])

  if (!hasHistory) {
    return (
      <div className={cn('rounded-3xl border border-border bg-surface p-5 shadow-panel', className)}>
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Portfolio NAV</p>
        <h3 className="mt-1 text-xl font-semibold text-primary">{portfolioName ?? 'Core portfolio'}</h3>
        <div className="mt-5 rounded-3xl border border-dashed border-border bg-base px-4 py-12 text-center text-sm text-secondary">
          Add holdings to see the NAV curve here.
        </div>
      </div>
    )
  }
  const clampedIndex = Math.min(activeIndex, Math.max(visibleHistory.length - 1, 0))
  const activePoint = visibleHistory[clampedIndex]
  const rangeChange =
    visibleHistory.length > 1
      ? ((visibleHistory.at(-1)?.value ?? 0) - (visibleHistory[0]?.value ?? 0)) / Math.max(visibleHistory[0]?.value ?? 1, 1)
      : 0

  return (
    <div className={cn('rounded-3xl border border-border bg-surface p-5 shadow-panel', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Portfolio NAV</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">{portfolioName ?? 'Core portfolio'}</h3>
          <p className="mt-2 text-sm text-secondary">Live demo curve based on the current holdings basket.</p>
        </div>

        <div className="inline-flex rounded-full border border-border bg-base p-1">
          {(['1W', '1M', 'ALL'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={cn(
                'rounded-full px-3 py-2 text-sm font-medium transition',
                range === item ? 'bg-elevated text-primary' : 'text-secondary hover:text-primary',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-border bg-base p-4">
        <svg viewBox="0 0 720 290" className="h-[290px] w-full">
          <defs>
            <linearGradient id="nav-fill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-green)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1="48"
              x2="682"
              y1={36 + line * 58}
              y2={36 + line * 58}
              stroke="var(--color-border)"
              strokeDasharray="4 6"
            />
          ))}

          <path d={`${path.area} L 682 238 L 48 238 Z`} fill="url(#nav-fill)" />
          <path
            d={path.line}
            fill="none"
            stroke="var(--color-green)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />

          {path.points.map((point, index) => (
            <g key={`${visibleHistory[index]?.date}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={index === clampedIndex ? 6 : 0}
                fill="var(--color-green)"
                stroke="var(--color-bg-base)"
                strokeWidth="2"
              />
              <rect
                x={point.x - 18}
                y="26"
                width="36"
                height="216"
                fill="transparent"
                onMouseEnter={() => setActiveIndex(index)}
              />
            </g>
          ))}
        </svg>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard label="Current NAV" value={formatCurrency(snapshot.nav)} detail={portfolioName ?? 'Tracked basket'} />
          <SnapshotCard
            label="Total return"
            value={formatSignedCurrency(snapshot.totalPnl)}
            detail={formatPct(snapshot.totalPnlPct)}
            tone={snapshot.totalPnl >= 0 ? 'gain' : 'loss'}
          />
          <SnapshotCard
            label="Day move"
            value={formatSignedCurrency(snapshot.dayChange)}
            detail="Session drift"
            tone={snapshot.dayChange >= 0 ? 'gain' : 'loss'}
          />
          <SnapshotCard label="XIRR" value={`${snapshot.xirr.toFixed(1)}%`} detail={`Range ${formatPct(rangeChange * 100)}`} tone="gain" />
        </div>

        {activePoint ? (
          <div className="mt-4 rounded-3xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Hovered checkpoint</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-sm text-secondary">{new Date(activePoint.date).toLocaleDateString('en-IN')}</p>
              <p className="font-mono text-lg font-semibold text-primary">{formatCurrency(activePoint.value)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function SnapshotCard({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string
  value: string
  detail: string
  tone?: 'gain' | 'loss' | 'neutral'
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p
        className={cn(
          'mt-2 text-lg font-semibold text-primary',
          tone === 'gain' ? 'text-gain' : tone === 'loss' ? 'text-loss' : '',
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-secondary">{detail}</p>
    </div>
  )
}

function buildPortfolioPath(history: PortfolioPoint[]) {
  if (!history.length) {
    return { line: '', area: '', points: [] as Array<{ x: number; y: number }> }
  }

  const values = history.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = Math.max(max - min, 1)

  const points = values.map((value, index) => {
    const x = 48 + (634 / Math.max(values.length - 1, 1)) * index
    const y = 238 - ((value - min) / span) * 170
    return { x, y }
  })

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return { line, area, points }
}
