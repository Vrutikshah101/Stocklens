'use client'

import { useMemo, useState } from 'react'

import { Activity, BarChart3 } from 'lucide-react'

import {
  cn,
  formatCurrency,
  formatDate,
  formatLargeNumber,
  formatPct,
} from '@/lib/utils/formatters'
import type { OHLCV } from '@/types/stock'

interface TechnicalChartProps {
  history: OHLCV[]
  currentPrice: number
  previousClose: number
  volume: number
}

type WindowKey = '1W' | '1M' | 'ALL'

const WINDOW_POINTS: Record<WindowKey, number> = {
  '1W': 7,
  '1M': 21,
  ALL: Number.POSITIVE_INFINITY,
}

export function TechnicalChart({
  history,
  currentPrice,
  previousClose,
  volume,
}: TechnicalChartProps) {
  const [windowKey, setWindowKey] = useState<WindowKey>('1M')

  const series = useMemo(() => {
    const pointCount = WINDOW_POINTS[windowKey]
    if (!Number.isFinite(pointCount)) {
      return history
    }
    return history.slice(-pointCount)
  }, [history, windowKey])

  const chart = useMemo(() => {
    if (!series.length) {
      return null
    }

    const width = 760
    const lineHeight = 220
    const volumeHeight = 52
    const closes = series.map((item) => item.close)
    const volumes = series.map((item) => item.volume)
    const minClose = Math.min(...closes)
    const maxClose = Math.max(...closes)
    const maxVolume = Math.max(...volumes)
    const range = Math.max(maxClose - minClose, 1)
    const xStep = series.length > 1 ? width / (series.length - 1) : width

    const linePoints = series.map((item, index) => {
      const x = index * xStep
      const y = lineHeight - ((item.close - minClose) / range) * lineHeight
      return { x, y }
    })

    const linePath = linePoints
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
      )
      .join(' ')

    const areaPath = `${linePath} L ${width.toFixed(2)} ${lineHeight.toFixed(2)} L 0 ${lineHeight.toFixed(2)} Z`

    const volumeBars = series.map((item, index) => {
      const barHeight = (item.volume / Math.max(maxVolume, 1)) * volumeHeight
      const x = index * xStep
      return {
        x,
        y: lineHeight + volumeHeight - barHeight + 18,
        height: barHeight,
      }
    })

    return {
      width,
      lineHeight,
      volumeHeight,
      linePath,
      areaPath,
      volumeBars,
      minClose,
      maxClose,
    }
  }, [series])

  if (!chart) {
    return null
  }

  const firstPoint = series[0]
  const middlePoint = series[Math.floor(series.length / 2)]
  const lastPoint = series[series.length - 1]
  const windowChange =
    ((lastPoint.close - firstPoint.close) / firstPoint.close) * 100

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Technical posture
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Price and volume ribbon
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Shared demo history renders as a quick visual on trend strength,
            price range, and participation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['1W', '1M', 'ALL'] as WindowKey[]).map((item) => (
            <button
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition',
                windowKey === item
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-base/70 text-secondary hover:border-accent',
              )}
              key={item}
              onClick={() => setWindowKey(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <article className="rounded-md border border-border bg-base/70 p-3">
          <div className="flex items-center gap-2 text-secondary">
            <Activity className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em] text-secondary">
              Window move
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-primary">
            {formatPct(windowChange)}
          </p>
        </article>
        <article className="rounded-md border border-border bg-base/70 p-3">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">
            Range high
          </span>
          <p className="mt-2 text-lg font-semibold text-primary">
            {formatCurrency(chart.maxClose)}
          </p>
        </article>
        <article className="rounded-md border border-border bg-base/70 p-3">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">
            Range low
          </span>
          <p className="mt-2 text-lg font-semibold text-primary">
            {formatCurrency(chart.minClose)}
          </p>
        </article>
        <article className="rounded-md border border-border bg-base/70 p-3">
          <div className="flex items-center gap-2 text-secondary">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em] text-secondary">
              Volume
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-primary">
            {formatLargeNumber(volume)}
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-base/70 p-3">
        <svg
          aria-label="Technical chart"
          className="h-auto w-full"
          viewBox={`0 0 ${chart.width} ${chart.lineHeight + chart.volumeHeight + 32}`}
        >
          <defs>
            <linearGradient
              id="stocklens-chart-fill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="rgba(52,84,245,0.26)" />
              <stop offset="100%" stopColor="rgba(52,84,245,0)" />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((fraction) => {
            const y = chart.lineHeight * fraction
            return (
              <line
                key={fraction}
                stroke="rgba(148,163,184,0.18)"
                strokeDasharray="4 8"
                strokeWidth="1"
                x1="0"
                x2={chart.width}
                y1={y}
                y2={y}
              />
            )
          })}

          <path d={chart.areaPath} fill="url(#stocklens-chart-fill)" />
          <path
            d={chart.linePath}
            fill="none"
            stroke="var(--color-accent-blue)"
            strokeLinecap="round"
            strokeWidth="3"
          />

          {chart.volumeBars.map((bar, index) => (
            <rect
              fill="rgba(148,163,184,0.28)"
              height={bar.height}
              key={`${series[index].time}-${index}`}
              rx="3"
              width={Math.max(
                chart.width / Math.max(series.length * 2.6, 1),
                6,
              )}
              x={bar.x}
              y={bar.y}
            />
          ))}
        </svg>

        <div className="mt-3 grid gap-3 text-xs text-secondary sm:grid-cols-3">
          <div>{formatDate(firstPoint.time)}</div>
          <div className="text-center">{formatDate(middlePoint.time)}</div>
          <div className="text-right">{formatDate(lastPoint.time)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
        <p>
          Spot{' '}
          <span className="font-medium text-primary">
            {formatCurrency(currentPrice)}
          </span>{' '}
          vs previous close{' '}
          <span className="font-medium text-primary">
            {formatCurrency(previousClose)}
          </span>
        </p>
        <p>{series.length} sampled candles in this window</p>
      </div>
    </section>
  )
}
