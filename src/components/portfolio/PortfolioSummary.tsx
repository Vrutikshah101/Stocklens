'use client'

import { ArrowUpRight, ShieldCheck, Wallet } from 'lucide-react'

import { formatCurrency, formatPct, formatSignedCurrency } from '@/lib/utils/formatters'
import type { PortfolioModel } from '@/types/portfolio'

interface PortfolioSummaryProps {
  portfolio: PortfolioModel
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const cards = [
    {
      label: 'Current NAV',
      value: formatCurrency(portfolio.snapshot.nav),
      meta: formatSignedCurrency(portfolio.snapshot.dayChange),
      icon: Wallet,
      tone: portfolio.snapshot.dayChange >= 0 ? 'text-gain' : 'text-loss',
    },
    {
      label: 'Total P&L',
      value: formatSignedCurrency(portfolio.snapshot.totalPnl),
      meta: formatPct(portfolio.snapshot.totalPnlPct),
      icon: ArrowUpRight,
      tone: portfolio.snapshot.totalPnl >= 0 ? 'text-gain' : 'text-loss',
    },
    {
      label: 'Portfolio XIRR',
      value: `${portfolio.snapshot.xirr.toFixed(1)}%`,
      meta: portfolio.strategy,
      icon: ShieldCheck,
      tone: 'text-accent',
    },
  ]

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <article className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel" key={card.label}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.tone}`} />
          </div>
          <div className="mt-4 text-3xl font-semibold text-primary">{card.value}</div>
          <div className={`mt-2 text-sm ${card.tone}`}>{card.meta}</div>
        </article>
      ))}
    </section>
  )
}

