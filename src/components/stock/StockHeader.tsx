import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Building2,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import {
  cn,
  formatCurrency,
  formatLargeNumber,
  formatPct,
  formatSignedCurrency,
  formatTime,
} from '@/lib/utils/formatters'
import type { DVMScore, StockInfo, StockPrice } from '@/types/stock'

interface StockHeaderProps {
  info: StockInfo
  price: StockPrice
  dvm: DVMScore
  marketState: {
    isOpen: boolean
    label: string
    hint: string
  }
  requestedTicker?: string
}

const consensusTone: Record<StockInfo['analystConsensus'], string> = {
  Buy: 'border-[color:var(--color-green)] bg-[color:var(--color-green-soft)] text-gain',
  Hold: 'border-[color:var(--color-amber)] bg-[color:var(--color-amber-soft)] text-warn',
  Sell: 'border-[color:var(--color-red)] bg-[color:var(--color-red-soft)] text-loss',
}

const riskTone: Record<StockInfo['riskLevel'], string> = {
  Low: 'border-[color:var(--color-green)] bg-[color:var(--color-green-soft)] text-gain',
  Medium: 'border-[color:var(--color-amber)] bg-[color:var(--color-amber-soft)] text-warn',
  High: 'border-[color:var(--color-red)] bg-[color:var(--color-red-soft)] text-loss',
}

export function StockHeader({
  info,
  price,
  dvm,
  marketState,
  requestedTicker,
}: StockHeaderProps) {
  const isPositive = price.change >= 0
  const fairValueGap = ((info.fairValue - price.current) / price.current) * 100
  const isFallback = requestedTicker && requestedTicker !== info.ticker

  const stats = [
    {
      label: 'Market cap',
      value: formatLargeNumber(info.marketCap),
      detail: `${info.exchange} large-cap coverage`,
      icon: Building2,
    },
    {
      label: 'Fair value gap',
      value: formatPct(fairValueGap),
      detail: `Base case at ${formatCurrency(info.fairValue)}`,
      icon: BadgeIndianRupee,
    },
    {
      label: 'Valuation',
      value: `${info.pe.toFixed(1)}× P/E`,
      detail: `${info.pb.toFixed(1)}× P/B`,
      icon: Sparkles,
    },
    {
      label: 'Ownership & flows',
      value:
        info.promoterHolding > 0
          ? `${info.promoterHolding.toFixed(1)}% promoter`
          : 'Widely held',
      detail: `FII flow ${formatPct(info.fiiFlow)}`,
      icon: Landmark,
    },
  ]

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="grid gap-4 xl:grid-cols-[1.45fr,0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-border bg-base/70 px-2.5 py-1 text-xs uppercase tracking-[0.24em] text-secondary">
              {info.exchange} · {info.ticker}
            </span>
            <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
              {info.sector}
            </span>
            <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
              {info.industry}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words text-2xl font-semibold tracking-tight text-primary">
                {info.name}
              </h1>
              <span
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium',
                  consensusTone[info.analystConsensus],
                )}
              >
                Consensus · {info.analystConsensus}
              </span>
              <span
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium',
                  riskTone[info.riskLevel],
                )}
              >
                Risk · {info.riskLevel}
              </span>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-5 text-secondary">
              {info.description}
            </p>
          </div>

          {isFallback && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
              No direct sample feed exists for{' '}
              <span className="font-semibold">{requestedTicker}</span>, so this
              prototype is showing the nearest stocked demo coverage for{' '}
              <span className="font-semibold">{info.ticker}</span>.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map(({ detail, icon: Icon, label, value }) => (
              <article
                className="rounded-lg border border-border bg-base/70 p-3"
                key={label}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-primary">
                      {value}
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-surface p-2 text-secondary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-secondary">{detail}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-base/70 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                Live demo price
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <p className="break-words font-mono text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                  {formatCurrency(price.current)}
                </p>
                <div
                  className={cn(
                    'mb-1 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium',
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-700'
                      : 'bg-rose-500/10 text-rose-700',
                  )}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {formatSignedCurrency(price.change)}
                  <span className="text-xs">{formatPct(price.changePct)}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 rounded-lg border border-border bg-surface px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                DVM
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-primary">
                {dvm.composite}
              </p>
              <p className="text-xs text-secondary">{dvm.label}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  {marketState.label}
                </p>
                <p className="text-xs text-secondary">{marketState.hint}</p>
              </div>
              <div
                className={cn(
                  'h-3 w-3 rounded-full',
                  marketState.isOpen
                    ? 'bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.6)]'
                    : 'bg-secondary',
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-secondary">
              <div className="rounded-md border border-border bg-base/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Open
                </p>
                <p className="mt-1 font-medium text-primary">
                  {formatCurrency(price.open)}
                </p>
              </div>
              <div className="rounded-md border border-border bg-base/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Day range
                </p>
                <p className="mt-1 font-medium text-primary">
                  {formatCurrency(price.low)} – {formatCurrency(price.high)}
                </p>
              </div>
            </div>
            <p className="text-xs text-secondary">
              Last simulated tick · {formatTime(price.updatedAt)}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-sm leading-5 text-amber-100">
            <div className="mb-2 flex items-center gap-2 font-medium text-amber-100">
              <ShieldAlert className="h-4 w-4" />
              SEBI disclaimer
            </div>
            StockLens is a demo research prototype. It is not a SEBI-registered
            investment adviser, not a solicitation to buy or sell securities,
            and the simulated outputs shown here should not be the sole basis
            for investment decisions.
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-secondary">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            Use this page for workflow validation, not live execution.
          </div>
        </aside>
      </div>
    </section>
  )
}
