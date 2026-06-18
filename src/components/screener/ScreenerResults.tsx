'use client'

import Link from 'next/link'

import { formatCurrency, formatPct } from '@/lib/utils/formatters'
import type { ScreenerResult } from '@/types/screener'

interface ScreenerResultsProps {
  results: ScreenerResult[]
}

export function ScreenerResults({ results }: ScreenerResultsProps) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-primary">Results</h3>
          <p className="mt-1 text-sm text-secondary">
            {results.length} stocks match the current thesis.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="py-3 pr-4">Stock</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">1D</th>
              <th className="py-3 pr-4">P/E</th>
              <th className="py-3 pr-4">ROE</th>
              <th className="py-3 pr-4">Debt/Eq</th>
              <th className="py-3 pr-4">DVM</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {results.map((result) => (
              <tr className="transition hover:bg-base/50" key={result.ticker}>
                <td className="py-4 pr-4">
                  <div className="font-medium text-primary">{result.ticker}</div>
                  <div className="text-xs text-secondary">{result.name}</div>
                </td>
                <td className="py-4 pr-4 text-primary">{formatCurrency(result.price)}</td>
                <td className={`py-4 pr-4 ${result.changePct >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {formatPct(result.changePct)}
                </td>
                <td className="py-4 pr-4 text-primary">{result.pe.toFixed(1)}</td>
                <td className="py-4 pr-4 text-primary">{result.roe.toFixed(1)}%</td>
                <td className="py-4 pr-4 text-primary">{result.debtToEquity.toFixed(2)}</td>
                <td className="py-4 pr-4 text-primary">{result.dvm.toFixed(0)}</td>
                <td className="py-4 pr-4">
                  <Link
                    className="rounded-md border border-border px-3 py-1.5 text-xs text-primary transition hover:border-accent hover:text-accent"
                    href={`/stock/${result.ticker}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
