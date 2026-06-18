'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { cn, formatCurrency, formatDate, formatLargeNumber, formatPct } from '@/lib/utils/formatters'
import type { OHLCV } from '@/types/stock'

type RangeKey = '2W' | '1M' | 'ALL'

interface CandlestickChartProps {
  data: OHLCV[]
  ticker?: string
  className?: string
}

export function CandlestickChart({ data, ticker, className }: CandlestickChartProps) {
  const [range, setRange] = useState<RangeKey>('1M')
  const [activeIndex, setActiveIndex] = useState(0)
  const hasData = data.length > 0

  const visibleData = useMemo(() => {
    if (!hasData) {
      return []
    }

    if (range === '2W') {
      return data.slice(-14)
    }

    if (range === '1M') {
      return data.slice(-28)
    }

    return data
  }, [data, hasData, range])

  useEffect(() => {
    setActiveIndex(Math.max(visibleData.length - 1, 0))
  }, [visibleData])

  const chart = useMemo(() => buildCandlestickLayout(visibleData), [visibleData])

  if (!hasData) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4', className)}>
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Price Action</p>
        <h3 className="mt-1 text-xl font-semibold text-primary">{ticker ? `${ticker} candlestick tape` : 'Candlestick tape'}</h3>
        <div className="mt-4 rounded-lg border border-dashed border-border bg-base px-4 py-12 text-center text-sm text-secondary">
          Price history is unavailable for this chart.
        </div>
      </div>
    )
  }
  const activeCandle = visibleData[Math.min(activeIndex, Math.max(visibleData.length - 1, 0))]
  const firstClose = visibleData[0]?.close ?? 0
  const lastClose = visibleData.at(-1)?.close ?? 0
  const periodMove = firstClose ? ((lastClose - firstClose) / firstClose) * 100 : 0

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!visibleData.length) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = event.clientX - rect.left
    const plotWidth = rect.width - 92
    const clampedX = Math.max(0, Math.min(plotWidth, relativeX - 46))
    const index = Math.round((clampedX / Math.max(plotWidth, 1)) * Math.max(visibleData.length - 1, 0))
    setActiveIndex(index)
  }

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Price Action</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">{ticker ? `${ticker} candlestick tape` : 'Candlestick tape'}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={cn('text-sm font-medium', periodMove >= 0 ? 'text-gain' : 'text-loss')}>
            {formatPct(periodMove)}
          </span>
          <div className="inline-flex rounded-md border border-border bg-base p-1">
            {(['2W', '1M', 'ALL'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition',
                  range === item ? 'bg-elevated text-primary' : 'text-secondary hover:text-primary',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-base p-3">
        <svg
          viewBox="0 0 720 360"
          className="h-[360px] w-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(Math.max(visibleData.length - 1, 0))}
        >
          <defs>
            <linearGradient id="ma-line" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1="46"
              x2="684"
              y1={32 + line * 58}
              y2={32 + line * 58}
              stroke="var(--color-border)"
              strokeDasharray="4 6"
            />
          ))}

          <path
            d={chart.movingAveragePath}
            fill="none"
            stroke="url(#ma-line)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />

          {chart.candles.map((candle, index) => {
            const isPositive = visibleData[index].close >= visibleData[index].open
            return (
              <g key={`${visibleData[index].time}-${index}`}>
                <line
                  x1={candle.x}
                  x2={candle.x}
                  y1={candle.highY}
                  y2={candle.lowY}
                  stroke={isPositive ? 'var(--color-green)' : 'var(--color-red)'}
                  strokeWidth="2"
                />
                <rect
                  x={candle.x - candle.width / 2}
                  y={Math.min(candle.openY, candle.closeY)}
                  width={candle.width}
                  height={Math.max(2, Math.abs(candle.closeY - candle.openY))}
                  rx="2"
                  fill={isPositive ? 'var(--color-green)' : 'var(--color-red)'}
                />
                <rect
                  x={candle.x - candle.width / 2}
                  y={candle.volumeY}
                  width={candle.width}
                  height={322 - candle.volumeY}
                  rx="2"
                  fill={isPositive ? 'var(--color-green)' : 'var(--color-red)'}
                  fillOpacity="0.28"
                />
              </g>
            )
          })}

          {chart.candles[activeIndex] ? (
            <line
              x1={chart.candles[activeIndex].x}
              x2={chart.candles[activeIndex].x}
              y1="28"
              y2="322"
              stroke="var(--color-accent-blue)"
              strokeDasharray="4 6"
            />
          ) : null}

          {chart.candles.map((candle, index) => (
            <text
              key={`label-${visibleData[index].time}`}
              x={candle.x}
              y="348"
              textAnchor="middle"
              fill={index === activeIndex ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
              fontSize="11"
              fontWeight={index === activeIndex ? 700 : 500}
            >
              {new Date(visibleData[index].time).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })}
            </text>
          ))}
        </svg>

        {activeCandle ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <ReadingTile label="Date" value={formatDate(activeCandle.time)} detail={ticker ?? 'Selected'} />
            <ReadingTile label="Open / Close" value={`${formatCurrency(activeCandle.open)} / ${formatCurrency(activeCandle.close)}`} detail="Daily body" />
            <ReadingTile label="Range" value={`${formatCurrency(activeCandle.low)} — ${formatCurrency(activeCandle.high)}`} detail="Intraday wick" />
            <ReadingTile label="Volume" value={formatLargeNumber(activeCandle.volume)} detail="Simulated activity" />
            <ReadingTile
              label="Session move"
              value={formatPct(((activeCandle.close - activeCandle.open) / Math.max(activeCandle.open, 1)) * 100)}
              detail="Open to close"
              tone={activeCandle.close >= activeCandle.open ? 'gain' : 'loss'}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ReadingTile({
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
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p
        className={cn(
          'mt-2 text-sm font-semibold text-primary',
          tone === 'gain' ? 'text-gain' : tone === 'loss' ? 'text-loss' : '',
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-secondary">{detail}</p>
    </div>
  )
}

function buildCandlestickLayout(data: OHLCV[]) {
  if (!data.length) {
    return {
      candles: [] as Array<{
        x: number
        width: number
        highY: number
        lowY: number
        openY: number
        closeY: number
        volumeY: number
      }>,
      movingAveragePath: '',
    }
  }

  const high = Math.max(...data.map((item) => item.high))
  const low = Math.min(...data.map((item) => item.low))
  const volumeMax = Math.max(...data.map((item) => item.volume))
  const priceSpan = Math.max(high - low, 1)
  const candleWidth = Math.max(8, 420 / Math.max(data.length, 1))

  const candles = data.map((item, index) => {
    const x = 56 + (620 / Math.max(data.length - 1, 1)) * index
    const highY = 28 + ((high - item.high) / priceSpan) * 190
    const lowY = 28 + ((high - item.low) / priceSpan) * 190
    const openY = 28 + ((high - item.open) / priceSpan) * 190
    const closeY = 28 + ((high - item.close) / priceSpan) * 190
    const volumeY = 322 - (item.volume / Math.max(volumeMax, 1)) * 52

    return {
      x,
      width: candleWidth,
      highY,
      lowY,
      openY,
      closeY,
      volumeY,
    }
  })

  const movingAverage = data.map((_, index) => {
    const window = data.slice(Math.max(0, index - 4), index + 1)
    return window.reduce((total, item) => total + item.close, 0) / window.length
  })

  const movingAveragePath = movingAverage
    .map((value, index) => {
      const x = candles[index].x
      const y = 28 + ((high - value) / priceSpan) * 190
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return {
    candles,
    movingAveragePath,
  }
}
