'use client'

import Link from 'next/link'

import { formatCurrency, formatPct, formatSignedCurrency } from '@/lib/utils/formatters'
import type { PortfolioHolding } from '@/types/portfolio'

interface HoldingsTableProps {
  holdings: PortfolioHolding[]
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Holdings</h3>
          <p className="mt-1 text-sm text-secondary">Live sample pricing updates every few seconds.</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="py-3 pr-4">Stock</th>
              <th className="py-3 pr-4">Qty</th>
              <th className="py-3 pr-4">Avg Cost</th>
              <th className="py-3 pr-4">LTP</th>
              <th className="py-3 pr-4">Market Value</th>
              <th className="py-3 pr-4">P&L</th>
              <th className="py-3 pr-4">DVM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {holdings.map((holding) => (
              <tr className="transition hover:bg-base/50" key={holding.ticker}>
                <td className="py-4 pr-4">
                  <Link className="font-medium text-primary hover:text-accent" href={`/stock/${holding.ticker}`}>
                    {holding.ticker}
                  </Link>
                  <div className="text-xs text-secondary">{holding.name}</div>
                </td>
                <td className="py-4 pr-4 text-primary">{holding.quantity}</td>
                <td className="py-4 pr-4 text-primary">{formatCurrency(holding.avgCost)}</td>
                <td className="py-4 pr-4 text-primary">{formatCurrency(holding.currentPrice)}</td>
                <td className="py-4 pr-4 text-primary">{formatCurrency(holding.marketValue)}</td>
                <td className={`py-4 pr-4 ${holding.pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
                  <div>{formatSignedCurrency(holding.pnl)}</div>
                  <div className="text-xs">{formatPct(holding.pnlPct)}</div>
                </td>
                <td className="py-4 pr-4 text-primary">{holding.dvm.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

