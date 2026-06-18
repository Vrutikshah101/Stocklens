import { ArrowUpRight, MessagesSquare } from 'lucide-react'

import { formatCurrency, formatDate, formatPct } from '@/lib/utils/formatters'
import type { AnalystCall } from '@/types/stock'

interface AnalystCallsTableProps {
  analysts: AnalystCall[]
  currentPrice: number
}

const ratingTone: Record<AnalystCall['rating'], string> = {
  Buy: 'border-[color:var(--color-green)] bg-[color:var(--color-green-soft)] text-gain',
  Hold: 'border-[color:var(--color-amber)] bg-[color:var(--color-amber-soft)] text-warn',
  Sell: 'border-[color:var(--color-red)] bg-[color:var(--color-red-soft)] text-loss',
}

export function AnalystCallsTable({
  analysts,
  currentPrice,
}: AnalystCallsTableProps) {
  const counts = analysts.reduce(
    (acc, call) => {
      acc[call.rating] += 1
      return acc
    },
    { Buy: 0, Hold: 0, Sell: 0 },
  )

  const averageTarget =
    analysts.reduce((total, call) => total + call.targetPrice, 0) /
    Math.max(analysts.length, 1)
  const impliedUpside = ((averageTarget - currentPrice) / currentPrice) * 100

  return (
    <section className="min-w-0 rounded-lg border border-border bg-surface p-4">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Broker tape
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Analyst calls
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Coverage is condensed into targets, ratings, and timing so the
            prototype can summarize the current street posture at a glance.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-md border border-border bg-base p-3">
            <div className="flex items-center gap-2 text-secondary">
              <MessagesSquare className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em] text-secondary">
                Rating mix
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">
              {counts.Buy} Buy · {counts.Hold} Hold · {counts.Sell} Sell
            </p>
          </article>
          <article className="rounded-md border border-border bg-base p-3">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary">
              Average target
            </span>
            <p className="mt-2 text-sm font-semibold text-primary">
              {formatCurrency(averageTarget)}
            </p>
          </article>
          <article className="rounded-md border border-border bg-base p-3">
            <div className="flex items-center gap-2 text-secondary">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em] text-secondary">
                Implied upside
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">
              {formatPct(impliedUpside)}
            </p>
          </article>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <th className="px-3 py-3 font-medium">Broker</th>
              <th className="px-3 py-3 font-medium">Rating</th>
              <th className="px-3 py-3 font-medium">Target</th>
              <th className="px-3 py-3 font-medium">Upside</th>
              <th className="px-3 py-3 font-medium">Published</th>
            </tr>
          </thead>
          <tbody>
            {analysts.map((call) => (
              <tr
                className="border-b border-border text-primary last:border-0"
                key={`${call.broker}-${call.publishedAt}`}
              >
                <td className="px-3 py-4 font-medium text-primary">
                  {call.broker}
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium ${ratingTone[call.rating]}`}
                  >
                    {call.rating}
                  </span>
                </td>
                <td className="px-3 py-4">
                  {formatCurrency(call.targetPrice)}
                </td>
                <td className="px-3 py-4">{formatPct(call.upsidePct)}</td>
                <td className="px-3 py-4 text-secondary">
                  {formatDate(call.publishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
