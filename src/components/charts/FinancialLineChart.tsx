'use client'

import { useMemo, useState } from 'react'

import { cn, formatCurrency } from '@/lib/utils/formatters'
import type { FinancialStatement } from '@/types/stock'

type MetricKey = 'revenue' | 'ebitda' | 'netProfit' | 'freeCashFlow' | 'roe'

interface FinancialLineChartProps {
  financials: FinancialStatement[]
  ticker?: string
  className?: string
}

const METRICS: Array<{
  key: MetricKey
  label: string
  accent: string
}> = [
  { key: 'revenue', label: 'Revenue', accent: 'var(--color-accent-blue)' },
  { key: 'ebitda', label: 'EBITDA', accent: 'var(--color-purple)' },
  { key: 'netProfit', label: 'Net Profit', accent: 'var(--color-green)' },
  { key: 'freeCashFlow', label: 'Free Cash Flow', accent: 'var(--color-amber)' },
  { key: 'roe', label: 'ROE', accent: 'var(--color-teal)' },
]

export function FinancialLineChart({ financials, ticker, className }: FinancialLineChartProps) {
  const [metric, setMetric] = useState<MetricKey>('revenue')
  const [activeIndex, setActiveIndex] = useState(financials.length - 1)
  const hasFinancials = financials.length > 0

  const series = useMemo(
    () => (hasFinancials ? financials.map((item) => item[metric]) : []),
    [financials, hasFinancials, metric],
  )
  const path = useMemo(() => buildLinePath(series), [series])

  if (!hasFinancials) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4', className)}>
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Financials</p>
        <h3 className="mt-1 text-xl font-semibold text-primary">{ticker ? `${ticker} multi-year trend` : 'Multi-year trend'}</h3>
        <div className="mt-4 rounded-lg border border-dashed border-border bg-base px-4 py-12 text-center text-sm text-secondary">
          No financial history is available for this view.
        </div>
      </div>
    )
  }
  const activePoint = financials[Math.min(activeIndex, financials.length - 1)]
  const activeValue = activePoint?.[metric] ?? 0
  const metricConfig = METRICS.find((item) => item.key === metric) ?? METRICS[0]
  const trendDelta = series.length > 1 ? ((series.at(-1) ?? 0) - series[0]) / Math.max(Math.abs(series[0]), 1) : 0

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Financials</p>
            <h3 className="mt-1 text-xl font-semibold text-primary">
              {ticker ? `${ticker} multi-year trend` : 'Multi-year trend'}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {METRICS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setMetric(item.key)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-sm font-medium transition',
                  metric === item.key ? 'border-accent bg-elevated text-primary' : 'border-border bg-base text-secondary hover:text-primary',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-base p-3">
          <svg viewBox="0 0 720 300" className="h-[300px] w-full">
            <defs>
              <linearGradient id="financial-area" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={metricConfig.accent} stopOpacity="0.34" />
                <stop offset="100%" stopColor={metricConfig.accent} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3].map((line) => (
              <line
                key={line}
                x1="52"
                x2="680"
                y1={40 + line * 60}
                y2={40 + line * 60}
                stroke="var(--color-border)"
                strokeDasharray="4 6"
              />
            ))}

            <path d={`${path.area} L 680 248 L 52 248 Z`} fill="url(#financial-area)" />
            <path
              d={path.line}
              fill="none"
              stroke={metricConfig.accent}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />

            {path.points.map((point, index) => (
              <g key={financials[index]?.period}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === activeIndex ? 7 : 4}
                  fill={index === activeIndex ? metricConfig.accent : 'var(--color-bg-base)'}
                  stroke={metricConfig.accent}
                  strokeWidth="2"
                />
                <rect
                  x={point.x - 22}
                  y="32"
                  width="44"
                  height="226"
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(index)}
                />
                <text
                  x={point.x}
                  y="280"
                  textAnchor="middle"
                  fill={index === activeIndex ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
                  fontSize="12"
                  fontWeight={index === activeIndex ? 700 : 500}
                >
                  {financials[index]?.period}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <MetricCard label="Active period" value={activePoint?.period ?? '—'} detail={metricConfig.label} />
            <MetricCard label="Selected value" value={formatFinancialValue(metric, activeValue)} detail="Demo fundamentals" />
            <MetricCard
              label="Trend since start"
              value={`${trendDelta > 0 ? '+' : ''}${(trendDelta * 100).toFixed(1)}%`}
              detail={trendDelta >= 0 ? 'Expansion trend' : 'Compression trend'}
              tone={trendDelta >= 0 ? 'gain' : 'loss'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
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

function buildLinePath(values: number[]) {
  if (!values.length) {
    return { line: '', area: '', points: [] as Array<{ x: number; y: number }> }
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = Math.max(max - min, 1)

  const points = values.map((value, index) => {
    const x = 52 + (628 / Math.max(values.length - 1, 1)) * index
    const y = 248 - ((value - min) / span) * 180
    return { x, y }
  })

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return { line, area, points }
}

function formatFinancialValue(metric: MetricKey, value: number) {
  if (metric === 'roe') {
    return `${value.toFixed(1)}%`
  }

  return formatCurrency(value)
}
