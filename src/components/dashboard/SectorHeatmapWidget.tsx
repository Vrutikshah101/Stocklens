'use client'

import { SectorHeatmap } from '@/components/charts/SectorHeatmap'
import { cn } from '@/lib/utils/formatters'
import type { SectorHeatCell } from '@/types/stock'

interface SectorHeatmapWidgetProps {
  cells: SectorHeatCell[]
  selectedSector?: string | null
  onSelectSector?: (sector: string | null) => void
  className?: string
}

export function SectorHeatmapWidget({
  cells,
  selectedSector,
  onSelectSector,
  className,
}: SectorHeatmapWidgetProps) {
  const strongest = [...cells].sort((left, right) => right.changePct - left.changePct)[0]
  const weakest = [...cells].sort((left, right) => left.changePct - right.changePct)[0]
  const activeCell = cells.find((cell) => cell.sector === selectedSector) ?? strongest

  return (
    <section className={cn('min-w-0 overflow-hidden rounded-lg border border-border bg-surface p-4 sm:p-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-secondary">Sector rotation</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">Heatmap pulse</h3>
          <p className="mt-2 max-w-xl text-sm text-secondary">
            Tap a sector to focus the movers table and news stream on the current pocket of strength or
            weakness.
          </p>
        </div>

        {selectedSector ? (
          <button
            type="button"
            onClick={() => onSelectSector?.(null)}
            className="rounded-md border border-border bg-base px-3 py-2 text-sm font-medium text-secondary transition hover:border-accent hover:text-primary"
          >
            Clear filter
          </button>
        ) : null}
      </div>

      {activeCell ? (
        <div className="mt-5 rounded-lg border border-border bg-base p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-secondary">Focused sector</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-semibold text-primary">{activeCell.sector}</h4>
                <span
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium',
                    activeCell.changePct >= 0 ? 'text-gain' : 'text-loss',
                  )}
                  style={{
                    background:
                      activeCell.changePct >= 0
                        ? 'color-mix(in srgb, var(--color-green) 14%, var(--color-bg-surface))'
                        : 'color-mix(in srgb, var(--color-red) 14%, var(--color-bg-surface))',
                  }}
                >
                  {formatChange(activeCell.changePct)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-secondary">
                Leadership is concentrated in{' '}
                <span className="font-medium text-primary">{activeCell.leaders.join(', ')}</span>.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[300px] lg:grid-cols-1">
              <SignalPill
                label="Strongest pocket"
                value={strongest?.sector ?? '—'}
                detail={formatChange(strongest?.changePct)}
                tone="gain"
              />
              <SignalPill
                label="Weakest pocket"
                value={weakest?.sector ?? '—'}
                detail={formatChange(weakest?.changePct)}
                tone="loss"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <SectorHeatmap
          cells={cells}
          selectedSector={selectedSector}
          onSelectSector={(sector) => onSelectSector?.(selectedSector === sector ? null : sector)}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InsightTile
          label="Current focus"
          value={activeCell?.sector ?? 'All sectors'}
          detail={`${activeCell?.leaders.length ?? 0} leaders tracked`}
          tone={activeCell?.changePct && activeCell.changePct < 0 ? 'loss' : 'gain'}
        />
        <InsightTile label="Leader" value={strongest?.sector ?? '—'} detail={formatChange(strongest?.changePct)} tone="gain" />
        <InsightTile label="Laggard" value={weakest?.sector ?? '—'} detail={formatChange(weakest?.changePct)} tone="loss" />
      </div>
    </section>
  )
}

function InsightTile({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: 'gain' | 'loss'
}) {
  return (
    <div className="rounded-lg border border-border bg-base p-4">
      <p className="text-xs font-medium uppercase text-secondary">{label}</p>
      <p className="mt-2 text-lg font-semibold text-primary">{value}</p>
      <p className={cn('mt-1 text-sm', tone === 'gain' ? 'text-gain' : 'text-loss')}>{detail}</p>
    </div>
  )
}

function SignalPill({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: 'gain' | 'loss'
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs font-medium uppercase text-secondary">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-primary">{value}</p>
        <p className={cn('text-sm font-medium', tone === 'gain' ? 'text-gain' : 'text-loss')}>{detail}</p>
      </div>
    </div>
  )
}

function formatChange(value?: number) {
  if (value === undefined) {
    return '—'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}
