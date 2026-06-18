'use client'

import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils/formatters'
import type { DVMScore } from '@/types/stock'

type AxisKey = 'durability' | 'valuation' | 'momentum'

interface RadarChartProps {
  score: DVMScore
  ticker?: string
  className?: string
}

const AXES: Array<{
  key: AxisKey
  label: string
  description: string
}> = [
  {
    key: 'durability',
    label: 'Durability',
    description: 'Business quality, balance sheet resilience, and staying power through cycles.',
  },
  {
    key: 'valuation',
    label: 'Valuation',
    description: 'Current pricing versus fair value, capital efficiency, and margin of safety.',
  },
  {
    key: 'momentum',
    label: 'Momentum',
    description: 'Trend persistence, market participation, and price/volume follow-through.',
  },
]

export function RadarChart({ score, ticker, className }: RadarChartProps) {
  const [activeAxis, setActiveAxis] = useState<AxisKey>('durability')

  const polygon = useMemo(() => buildPolygon(score), [score])
  const activeMeta = AXES.find((axis) => axis.key === activeAxis) ?? AXES[0]
  const activeValue = score[activeAxis]

  return (
    <div className={cn('rounded-3xl border border-border bg-surface p-5 shadow-panel', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">DVM Radar</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">{ticker ? `${ticker} quality map` : 'Quality map'}</h3>
        </div>
        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-right',
            score.tone === 'gain' ? 'text-gain' : score.tone === 'warn' ? 'text-warn' : 'text-loss',
          )}
          style={{
            background:
              score.tone === 'gain'
                ? 'color-mix(in srgb, var(--color-green) 14%, var(--color-bg-surface))'
                : score.tone === 'warn'
                  ? 'color-mix(in srgb, var(--color-amber) 14%, var(--color-bg-surface))'
                  : 'color-mix(in srgb, var(--color-red) 14%, var(--color-bg-surface))',
          }}
        >
          <p className="text-xs uppercase tracking-[0.16em]">Composite</p>
          <p className="mt-1 font-mono text-2xl font-semibold">{score.composite.toFixed(0)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 2xl:grid-cols-[220px_minmax(0,1fr)] 2xl:items-center">
        <svg viewBox="0 0 220 220" className="mx-auto h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]">
          <g transform="translate(110,110)">
            {[40, 70, 100].map((value) => (
              <polygon
                key={value}
                points={buildRing(value)}
                fill="none"
                stroke="var(--color-border)"
                strokeDasharray={value === 100 ? '0' : '4 6'}
                strokeWidth="1"
              />
            ))}

            {AXES.map((axis, index) => {
              const angle = -Math.PI / 2 + (Math.PI * 2 * index) / AXES.length
              const x = Math.cos(angle) * 84
              const y = Math.sin(angle) * 84
              const labelX = Math.cos(angle) * 102
              const labelY = Math.sin(angle) * 102
              const isActive = axis.key === activeAxis

              return (
                <g key={axis.key}>
                  <line
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={isActive ? 'var(--color-accent-blue)' : 'var(--color-border)'}
                    strokeWidth={isActive ? 2 : 1}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
                    fontSize="11"
                    fontWeight={isActive ? 700 : 500}
                  >
                    {axis.label}
                  </text>
                </g>
              )
            })}

            <polygon
              points={polygon}
              fill="color-mix(in srgb, var(--color-accent-blue) 22%, transparent)"
              stroke="var(--color-accent-blue)"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {AXES.map((axis, index) => {
              const angle = -Math.PI / 2 + (Math.PI * 2 * index) / AXES.length
              const radius = (score[axis.key] / 100) * 84
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              const isActive = axis.key === activeAxis

              return (
                <circle
                  key={axis.key}
                  cx={x}
                  cy={y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? 'var(--color-green)' : 'var(--color-accent-blue)'}
                  stroke="var(--color-bg-surface)"
                  strokeWidth="2"
                />
              )
            })}
          </g>
        </svg>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {AXES.map((axis) => (
              <button
                key={axis.key}
                type="button"
                onClick={() => setActiveAxis(axis.key)}
                className={cn(
                  'rounded-full border px-3 py-2 text-sm font-medium transition',
                  activeAxis === axis.key ? 'border-accent bg-elevated text-primary' : 'border-border bg-base text-secondary hover:text-primary',
                )}
              >
                {axis.label}: {score[axis.key].toFixed(0)}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-base p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Focused lens</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-primary">{activeMeta.label}</p>
                <p className="mt-2 text-sm leading-6 text-secondary">{activeMeta.description}</p>
              </div>
              <p className="font-mono text-3xl font-semibold text-primary">{activeValue.toFixed(0)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-base p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Signal</p>
            <p
              className={cn(
                'mt-2 text-lg font-semibold',
                score.tone === 'gain' ? 'text-gain' : score.tone === 'warn' ? 'text-warn' : 'text-loss',
              )}
            >
              {score.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function buildRing(value: number) {
  return AXES.map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / AXES.length
    const radius = (value / 100) * 84
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return `${x},${y}`
  }).join(' ')
}

function buildPolygon(score: DVMScore) {
  return AXES.map((axis, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / AXES.length
    const radius = (score[axis.key] / 100) * 84
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return `${x},${y}`
  }).join(' ')
}
