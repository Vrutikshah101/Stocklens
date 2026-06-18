'use client'

import { cn } from '@/lib/utils/formatters'
import type { SectorHeatCell } from '@/types/stock'

interface SectorHeatmapProps {
  cells: SectorHeatCell[]
  selectedSector?: string | null
  onSelectSector?: (sector: string) => void
  className?: string
}

export function SectorHeatmap({
  cells,
  selectedSector,
  onSelectSector,
  className,
}: SectorHeatmapProps) {
  const orderedCells = [...cells].sort((left, right) => right.value - left.value)

  return (
    <>
      <div className={cn('grid gap-3 md:hidden', className)}>
        {orderedCells.map((cell) => {
          const isPositive = cell.changePct >= 0
          const isActive = selectedSector === cell.sector
          const tone = isPositive ? 'var(--color-green)' : 'var(--color-red)'

          return (
            <button
              key={cell.sector}
              type="button"
              onClick={() => onSelectSector?.(cell.sector)}
              className={cn(
                'group rounded-lg border p-4 text-left transition duration-150 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent',
                isActive ? 'ring-2 ring-accent/40' : '',
              )}
              style={{
                borderColor: isActive
                  ? 'var(--color-accent-blue)'
                  : `color-mix(in srgb, ${tone} 32%, var(--color-border))`,
                background: `linear-gradient(135deg, color-mix(in srgb, ${tone} ${12 + Math.min(Math.abs(cell.changePct) * 10, 24)}%, var(--color-bg-surface)), color-mix(in srgb, var(--color-bg-elevated) 88%, black))`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-secondary">Sector</p>
                  <p className="mt-1 text-base font-semibold text-primary">{cell.sector}</p>
                </div>
                <span className={cn('text-sm font-semibold', isPositive ? 'text-gain' : 'text-loss')}>
                  {cell.changePct > 0 ? '+' : ''}
                  {cell.changePct.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {cell.leaders.map((leader) => (
                  <span
                    key={leader}
                    className="rounded-md border border-border bg-base px-2 py-1 text-[11px] font-medium text-secondary"
                  >
                    {leader}
                  </span>
                ))}
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-base">
                <div
                  className={cn('h-full rounded-full', isPositive ? 'bg-gain' : 'bg-loss')}
                  style={{ width: `${Math.min(100, 35 + Math.abs(cell.changePct) * 18)}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div
        className={cn('hidden gap-3 md:grid', className)}
        style={{
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gridAutoRows: '78px',
        }}
      >
        {orderedCells.map((cell, index) => {
          const span = getSpan(index, orderedCells.length)
          const isPositive = cell.changePct >= 0
          const isActive = selectedSector === cell.sector
          const tone = isPositive ? 'var(--color-green)' : 'var(--color-red)'

          return (
            <button
              key={cell.sector}
              type="button"
              onClick={() => onSelectSector?.(cell.sector)}
              className={cn(
                'group rounded-lg border p-4 text-left transition duration-150 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent',
                isActive ? 'ring-2 ring-accent/40' : '',
              )}
              style={{
                gridColumn: `span ${span.col} / span ${span.col}`,
                gridRow: `span ${span.row} / span ${span.row}`,
                borderColor: isActive
                  ? 'var(--color-accent-blue)'
                  : `color-mix(in srgb, ${tone} 32%, var(--color-border))`,
                background: `linear-gradient(135deg, color-mix(in srgb, ${tone} ${12 + Math.min(Math.abs(cell.changePct) * 10, 24)}%, var(--color-bg-surface)), color-mix(in srgb, var(--color-bg-elevated) 88%, black))`,
              }}
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary">Sector</p>
                    <p className="mt-1 text-lg font-semibold text-primary">{cell.sector}</p>
                  </div>
                  <span className={cn('text-sm font-semibold', isPositive ? 'text-gain' : 'text-loss')}>
                    {cell.changePct > 0 ? '+' : ''}
                    {cell.changePct.toFixed(2)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {cell.leaders.map((leader) => (
                      <span
                        key={leader}
                        className="rounded-md border border-border bg-base px-2 py-1 text-[11px] font-medium text-secondary"
                      >
                        {leader}
                      </span>
                    ))}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-base">
                    <div
                      className={cn('h-full rounded-full', isPositive ? 'bg-gain' : 'bg-loss')}
                      style={{ width: `${Math.min(100, 35 + Math.abs(cell.changePct) * 18)}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function getSpan(index: number, total: number) {
  if (total <= 4) {
    return { col: 6, row: 2 }
  }

  if (index === 0) {
    return { col: 6, row: 2 }
  }

  if (index === 1 || index === 2) {
    return { col: 3, row: 2 }
  }

  if (index === total - 1) {
    return { col: 6, row: 1 }
  }

  return { col: 3, row: 1 }
}
