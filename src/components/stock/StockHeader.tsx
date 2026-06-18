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
  Buy: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700',
  Hold: 'border-amber-500/25 bg-amber-500/10 text-amber-700',
  Sell: 'border-rose-500/25 bg-rose-500/10 text-rose-700',
}

const riskTone: Record<StockInfo['riskLevel'], string> = {
  Low: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700',
  Medium: 'border-amber-500/25 bg-amber-500/10 text-amber-700',
  High: 'border-rose-500/25 bg-rose-500/10 text-rose-700',
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
    <section className="relative overflow-hidden rounded-[30px] border border-border bg-surface/95 p-6 shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_32%)]" />

      <div className="relative grid gap-6 xl:grid-cols-[1.45fr,0.9fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border bg-base/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-secondary">
              {info.exchange} · {info.ticker}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-secondary">
              {info.sector}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-secondary">
              {info.industry}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                {info.name}
              </h1>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium',
                  consensusTone[info.analystConsensus],
                )}
              >
                Consensus · {info.analystConsensus}
              </span>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium',
                  riskTone[info.riskLevel],
                )}
              >
                Risk · {info.riskLevel}
              </span>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-secondary sm:text-base">
              {info.description}
            </p>
          </div>

          {isFallback && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              No direct sample feed exists for{' '}
              <span className="font-semibold">{requestedTicker}</span>, so this
              prototype is showing the nearest stocked demo coverage for{' '}
              <span className="font-semibold">{info.ticker}</span>.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map(({ detail, icon: Icon, label, value }) => (
              <article
                className="rounded-3xl border border-border bg-base/70 p-4 shadow-panel"
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
                  <div className="rounded-2xl border border-border bg-surface p-2.5 text-secondary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-secondary">{detail}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-border bg-base/70 p-5 shadow-panel">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                Live demo price
              </p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-4xl font-semibold tracking-tight text-primary">
                  {formatCurrency(price.current)}
                </p>
                <div
                  className={cn(
                    'mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium',
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
            <div className="rounded-3xl border border-border bg-surface/90 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                DVM
              </p>
              <p className="mt-1 text-3xl font-semibold text-primary">
                {dvm.composite}
              </p>
              <p className="text-xs text-secondary">{dvm.label}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-3xl border border-border bg-surface/90 p-4">
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
              <div className="rounded-2xl border border-border bg-base/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Open
                </p>
                <p className="mt-1 font-medium text-primary">
                  {formatCurrency(price.open)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-base/70 p-3">
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

          <div className="mt-5 rounded-3xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900">
            <div className="mb-2 flex items-center gap-2 font-medium text-amber-800">
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
