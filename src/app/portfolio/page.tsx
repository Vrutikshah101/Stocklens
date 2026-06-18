'use client'

import { BriefcaseBusiness } from 'lucide-react'

import { AddTransactionForm } from '@/components/portfolio/AddTransactionForm'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { PortfolioNAVChart } from '@/components/portfolio/PortfolioNAVChart'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { usePortfolio } from '@/hooks/usePortfolio'

export default function PortfolioPage() {
  const { portfolio, portfolios, selectedPortfolioId, setSelectedPortfolioId, pendingTicker, setPendingTicker, addTransaction } =
    usePortfolio()

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-base p-6 shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-gain/10 p-3 text-gain">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-primary">Portfolio Manager</h1>
              <p className="mt-2 max-w-3xl text-sm text-secondary">
                Track holdings, monitor live sample P&amp;L, and test decision workflows with reusable portfolio modules.
              </p>
            </div>
          </div>

          <select
            className="h-11 rounded-2xl border border-border bg-base px-4 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setSelectedPortfolioId(event.target.value)}
            value={selectedPortfolioId}
          >
            {portfolios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <PortfolioSummary portfolio={portfolio} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <PortfolioNAVChart points={portfolio.navHistory} />
        <AddTransactionForm
          defaultTicker={pendingTicker}
          onSubmit={addTransaction}
          onTickerChange={setPendingTicker}
        />
      </div>

      <HoldingsTable holdings={portfolio.holdings} />
    </div>
  )
}

