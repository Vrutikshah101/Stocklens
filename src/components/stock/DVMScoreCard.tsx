import { ShieldCheck, TrendingUp, WalletCards } from 'lucide-react'

import { clamp, cn, formatCurrency, formatPct } from '@/lib/utils/formatters'
import type { DVMScore, StockInfo } from '@/types/stock'

interface DVMScoreCardProps {
  dvm: DVMScore
  currentPrice: number
  fairValue: number
  riskLevel: StockInfo['riskLevel']
  analystConsensus: StockInfo['analystConsensus']
}

const toneMap: Record<
  DVMScore['tone'],
  { bar: string; panel: string; ring: string }
> = {
  gain: {
    bar: 'bg-gain',
    panel: 'border-[color:var(--color-green-soft)] bg-[color:var(--color-green-soft)]',
    ring: 'var(--color-green)',
  },
  warn: {
    bar: 'bg-warn',
    panel: 'border-[color:var(--color-amber-soft)] bg-[color:var(--color-amber-soft)]',
    ring: 'var(--color-amber)',
  },
  loss: {
    bar: 'bg-loss',
    panel: 'border-[color:var(--color-red-soft)] bg-[color:var(--color-red-soft)]',
    ring: 'var(--color-red)',
  },
}

export function DVMScoreCard({
  dvm,
  currentPrice,
  fairValue,
  riskLevel,
  analystConsensus,
}: DVMScoreCardProps) {
  const fairValueGap = ((fairValue - currentPrice) / currentPrice) * 100
  const tone = toneMap[dvm.tone]
  const metrics = [
    { label: 'Durability', value: dvm.durability, icon: ShieldCheck },
    { label: 'Valuation', value: dvm.valuation, icon: WalletCards },
    { label: 'Momentum', value: dvm.momentum, icon: TrendingUp },
  ]

  return (
    <section
      className={cn(
        'rounded-lg border p-4',
        tone.panel,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            DVM framework
          </p>
          <h2 className="mt-1 text-xl font-semibold text-primary">
            Composite conviction map
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Durability, valuation, and price participation are blended into one
            score so the prototype can surface a fast read before deeper
            diligence.
          </p>
        </div>
        <div
          className="relative h-24 w-24 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${tone.ring} ${dvm.composite * 3.6}deg, color-mix(in srgb, var(--color-bg-elevated) 95%, transparent) 0deg)`,
          }}
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-surface text-center">
            <span className="font-mono text-2xl font-semibold text-primary">
              {dvm.composite}
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-secondary">
              Composite
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Icon className="h-4 w-4 text-secondary" />
                {label}
              </div>
              <span className="text-sm font-medium text-primary">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-base">
              <div
                className={cn('h-2 rounded-full transition-all', tone.bar)}
                style={{ width: `${clamp(value, 0, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">
            Label
          </p>
          <p className="mt-2 break-words text-sm font-medium text-primary">{dvm.label}</p>
        </div>
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">
            Fair value gap
          </p>
          <p className="mt-2 break-words text-sm font-medium text-primary">
            {formatPct(fairValueGap)} vs {formatCurrency(fairValue)}
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">
            Overlay
          </p>
          <p className="mt-2 break-words text-sm font-medium text-primary">
            {analystConsensus} consensus · {riskLevel} risk
          </p>
        </div>
      </div>
    </section>
  )
}
