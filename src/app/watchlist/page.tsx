'use client'

import Link from 'next/link'
import { Eye, Plus } from 'lucide-react'

import { searchStocks } from '@/lib/utils/constants'
import { formatCurrency, formatPct } from '@/lib/utils/formatters'
import { useWatchlist } from '@/hooks/useWatchlist'

export default function WatchlistPage() {
  const { rows, addTicker, removeTicker } = useWatchlist()
  const suggestions = searchStocks('')

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-base p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-warn/10 p-3 text-warn">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-primary">Watchlists</h1>
            <p className="mt-2 max-w-3xl text-sm text-secondary">
              Keep a lightweight pulse on your shortlist with live sample price moves, DVM changes, and analyst stance.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Suggested Adds</h3>
            <p className="mt-1 text-sm text-secondary">Pulled from the same stock universe as the screener.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map((stock) => (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border bg-base px-3 py-1.5 text-xs text-primary transition hover:border-accent"
              key={stock.ticker}
              onClick={() => addTicker(stock.ticker)}
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              {stock.ticker}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Sector</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">1D</th>
                <th className="py-3 pr-4">DVM</th>
                <th className="py-3 pr-4">Analyst</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {rows.map((row) => (
                <tr className="transition hover:bg-base/50" key={row.ticker}>
                  <td className="py-4 pr-4">
                    <Link className="font-medium text-primary hover:text-accent" href={`/stock/${row.ticker}`}>
                      {row.ticker}
                    </Link>
                    <div className="text-xs text-secondary">{row.name}</div>
                  </td>
                  <td className="py-4 pr-4 text-primary">{row.sector}</td>
                  <td className="py-4 pr-4 text-primary">{formatCurrency(row.price)}</td>
                  <td className={`py-4 pr-4 ${row.changePct >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {formatPct(row.changePct)}
                  </td>
                  <td className="py-4 pr-4 text-primary">{row.dvm}</td>
                  <td className="py-4 pr-4 text-primary">{row.analystConsensus}</td>
                  <td className="py-4 pr-4">
                    <button
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-primary transition hover:border-loss hover:text-loss"
                      onClick={() => removeTicker(row.ticker)}
                      type="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

