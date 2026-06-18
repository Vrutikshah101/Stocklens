import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { cn, formatLargeNumber, formatPct } from '@/lib/utils/formatters'
import type { PeerComparison } from '@/types/stock'

interface SubjectRow extends PeerComparison {}

interface PeersTableProps {
  current: SubjectRow
  peers: PeerComparison[]
}

export function PeersTable({ current, peers }: PeersTableProps) {
  const rows = [current, ...peers]
  const sectorAveragePe =
    rows.reduce((total, row) => total + row.pe, 0) / Math.max(rows.length, 1)
  const topDvm = rows.reduce(
    (best, row) => (row.dvm > best.dvm ? row : best),
    rows[0],
  )

  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Relative view
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Peer comparison
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Benchmark the current stock against close sector comparables across
            valuation, quality, scale, and trailing price participation.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-base p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">
              Sector average P/E
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {sectorAveragePe.toFixed(1)}×
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-base p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">
              Highest DVM
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {topDvm.ticker} · {topDvm.dvm}
            </p>
          </article>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <th className="px-3 py-3 font-medium">Company</th>
              <th className="px-3 py-3 font-medium">P/E</th>
              <th className="px-3 py-3 font-medium">ROE</th>
              <th className="px-3 py-3 font-medium">Market Cap</th>
              <th className="px-3 py-3 font-medium">1Y Perf</th>
              <th className="px-3 py-3 font-medium">DVM</th>
              <th className="px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isCurrent = row.ticker === current.ticker

              return (
                <tr
                  className={cn(
                    'border-b border-border last:border-0',
                    isCurrent ? 'bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-bg-base))] text-primary' : 'text-primary',
                  )}
                  key={row.ticker}
                >
                  <td className="px-3 py-4">
                    <div>
                      <p className="font-medium text-primary">{row.ticker}</p>
                      <p className="text-xs text-secondary">{row.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-4">{row.pe.toFixed(1)}×</td>
                  <td className="px-3 py-4">{row.roe.toFixed(1)}%</td>
                  <td className="px-3 py-4">
                    {formatLargeNumber(row.marketCap)}
                  </td>
                  <td className="px-3 py-4">{formatPct(row.performance1Y)}</td>
                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium',
                        row.dvm >= 75
                          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700'
                          : row.dvm >= 60
                            ? 'border-sky-500/25 bg-sky-500/10 text-sky-700'
                            : 'border-amber-500/25 bg-amber-500/10 text-amber-700',
                      )}
                    >
                      {row.dvm}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {isCurrent ? (
                      <span className="text-xs text-secondary">Current</span>
                    ) : (
                      <Link
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-primary"
                        href={`/stock/${row.ticker}`}
                      >
                        Open
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
