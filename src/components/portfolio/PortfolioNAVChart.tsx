'use client'

import type { PortfolioPoint } from '@/types/portfolio'

interface PortfolioNAVChartProps {
  points: PortfolioPoint[]
}

export function PortfolioNAVChart({ points }: PortfolioNAVChartProps) {
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100
      const y = 100 - ((point.value - min) / Math.max(max - min, 1)) * 100
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-primary">NAV Trend</h3>
          <p className="mt-1 text-sm text-secondary">A simple trailing 30-session equity curve.</p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border bg-base/70 p-3">
        <svg className="h-56 w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="navFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(47, 129, 247, 0.35)" />
              <stop offset="100%" stopColor="rgba(47, 129, 247, 0.02)" />
            </linearGradient>
          </defs>
          <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#navFill)" />
          <path d={path} fill="none" stroke="#2F81F7" strokeWidth="2.2" />
        </svg>
      </div>
    </section>
  )
}
