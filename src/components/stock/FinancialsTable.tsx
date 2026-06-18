import { ArrowDownRight, ArrowUpRight, Landmark, Wallet } from 'lucide-react'

import { formatCurrency, formatPct } from '@/lib/utils/formatters'
import type { FinancialStatement } from '@/types/stock'

interface FinancialsTableProps {
  financials: FinancialStatement[]
}

function formatPerShare(value: number) {
  return `₹${value.toFixed(2)}`
}

export function FinancialsTable({ financials }: FinancialsTableProps) {
  const first = financials[0]
  const latest = financials.at(-1)

  if (!first || !latest) {
    return null
  }

  const revenueGrowth = ((latest.revenue - first.revenue) / first.revenue) * 100
  const profitGrowth =
    ((latest.netProfit - first.netProfit) / first.netProfit) * 100
  const leverageTrend = latest.debtToEquity - first.debtToEquity

  const summaries = [
    {
      label: 'Revenue trend',
      value: formatPct(revenueGrowth),
      detail: `Latest ${formatCurrency(latest.revenue)}`,
      icon: revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight,
      tone: revenueGrowth >= 0 ? 'text-gain' : 'text-loss',
    },
    {
      label: 'Profit compounding',
      value: formatPct(profitGrowth),
      detail: `Net profit ${formatCurrency(latest.netProfit)}`,
      icon: profitGrowth >= 0 ? Wallet : ArrowDownRight,
      tone: profitGrowth >= 0 ? 'text-gain' : 'text-loss',
    },
    {
      label: 'Balance sheet',
      value: leverageTrend <= 0 ? 'Deleveraging' : 'Leverage rising',
      detail: `Debt / equity ${latest.debtToEquity.toFixed(2)}`,
      icon: Landmark,
      tone: leverageTrend <= 0 ? 'text-accent' : 'text-warn',
    },
  ]

  return (
    <section className="min-w-0 rounded-lg border border-border bg-surface p-4">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Financial engine
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Five-period trend table
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Revenue, profitability, cash flow, and leverage are stacked together
            so you can scan quality and operating momentum in one pass.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {summaries.map(({ detail, icon: Icon, label, tone, value }) => (
            <article
              className="rounded-md border border-border bg-base p-3"
              key={label}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  {label}
                </p>
                <Icon className={`h-4 w-4 ${tone}`} />
              </div>
              <p className="mt-2 text-sm font-semibold text-primary">{value}</p>
              <p className="mt-1 text-xs text-secondary">{detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <th className="px-3 py-3 font-medium">Period</th>
              <th className="px-3 py-3 font-medium">Revenue</th>
              <th className="px-3 py-3 font-medium">EBITDA</th>
              <th className="px-3 py-3 font-medium">Net Profit</th>
              <th className="px-3 py-3 font-medium">EPS</th>
              <th className="px-3 py-3 font-medium">Free Cash Flow</th>
              <th className="px-3 py-3 font-medium">ROE</th>
              <th className="px-3 py-3 font-medium">Debt / Equity</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((row) => (
              <tr
                className="border-b border-border text-primary last:border-0"
                key={row.period}
              >
                <td className="px-3 py-4 font-medium text-primary">
                  {row.period}
                </td>
                <td className="px-3 py-4">{formatCurrency(row.revenue)}</td>
                <td className="px-3 py-4">{formatCurrency(row.ebitda)}</td>
                <td className="px-3 py-4">{formatCurrency(row.netProfit)}</td>
                <td className="px-3 py-4">{formatPerShare(row.eps)}</td>
                <td className="px-3 py-4">
                  {formatCurrency(row.freeCashFlow)}
                </td>
                <td className="px-3 py-4">{row.roe.toFixed(1)}%</td>
                <td className="px-3 py-4">{row.debtToEquity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
