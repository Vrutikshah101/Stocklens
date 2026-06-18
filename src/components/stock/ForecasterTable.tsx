import { BrainCircuit, Users } from 'lucide-react'

import { formatCurrency } from '@/lib/utils/formatters'
import type { ForecastPoint } from '@/types/stock'

interface ForecasterTableProps {
  forecasts: ForecastPoint[]
}

function formatEstimate(metric: string, estimate: number) {
  if (metric === 'Revenue' || metric === 'Net Profit') {
    return formatCurrency(estimate)
  }

  return `₹${estimate.toFixed(2)}`
}

function getSignal(analysts: number) {
  if (analysts >= 18) {
    return 'Broad coverage'
  }

  if (analysts >= 15) {
    return 'Street watched'
  }

  return 'Selective coverage'
}

export function ForecasterTable({ forecasts }: ForecasterTableProps) {
  const totalAnalysts = forecasts.reduce(
    (total, forecast) => total + forecast.analysts,
    0,
  )
  const mostTracked = forecasts.reduce((current, forecast) =>
    forecast.analysts > current.analysts ? forecast : current,
  )

  return (
    <section className="min-w-0 rounded-lg border border-border bg-surface p-4">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Forward lens
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Forecast tracker
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            The prototype keeps consensus-style estimates visible next to
            analyst participation so users can judge how deep the forecast stack
            really is.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-md border border-border bg-base p-3">
            <div className="flex items-center gap-2 text-secondary">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em] text-secondary">
                Coverage depth
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">
              {totalAnalysts} total analyst datapoints
            </p>
          </article>
          <article className="rounded-md border border-border bg-base p-3">
            <div className="flex items-center gap-2 text-secondary">
              <BrainCircuit className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em] text-secondary">
                Most tracked
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">
              {mostTracked.metric} · {mostTracked.year}
            </p>
          </article>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <th className="px-3 py-3 font-medium">Metric</th>
              <th className="px-3 py-3 font-medium">Year</th>
              <th className="px-3 py-3 font-medium">Estimate</th>
              <th className="px-3 py-3 font-medium">Analysts</th>
              <th className="px-3 py-3 font-medium">Signal</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((forecast) => (
              <tr
                className="border-b border-border text-primary last:border-0"
                key={`${forecast.metric}-${forecast.year}`}
              >
                <td className="px-3 py-4 font-medium text-primary">
                  {forecast.metric}
                </td>
                <td className="px-3 py-4">{forecast.year}</td>
                <td className="px-3 py-4">
                  {formatEstimate(forecast.metric, forecast.estimate)}
                </td>
                <td className="px-3 py-4">{forecast.analysts}</td>
                <td className="px-3 py-4 text-secondary">
                  {getSignal(forecast.analysts)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
