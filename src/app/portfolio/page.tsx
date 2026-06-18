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
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md border border-border bg-base p-2 text-gain">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Portfolio Manager</h1>
              <p className="mt-1 max-w-3xl text-sm leading-5 text-secondary">
                Track holdings, monitor live sample P&amp;L, and test decision workflows with reusable portfolio modules.
              </p>
            </div>
          </div>

          <select
            className="h-9 rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
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

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
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
