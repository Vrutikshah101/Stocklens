'use client'

import { useEffect, useMemo, useState } from 'react'

import { CandlestickChart } from '@/components/charts/CandlestickChart'
import { FinancialLineChart } from '@/components/charts/FinancialLineChart'
import { PortfolioNAVChart } from '@/components/charts/PortfolioNAVChart'
import { RadarChart } from '@/components/charts/RadarChart'
import { IndexSnapshot } from '@/components/dashboard/IndexSnapshot'
import { NewsfeedWidget, type NewsfeedEntry } from '@/components/dashboard/NewsfeedWidget'
import { SectorHeatmapWidget } from '@/components/dashboard/SectorHeatmapWidget'
import { TopMoversTable } from '@/components/dashboard/TopMoversTable'
import { useMarketStatus } from '@/hooks/useMarketStatus'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useStockData } from '@/hooks/useStockData'
import {
  getMarketIndices,
  getNewsfeed,
  getSectorHeatmap,
  getTopMovers,
  getUniverseTickers,
} from '@/lib/utils/constants'
import { cn, formatCurrency, formatPct, formatSignedCurrency } from '@/lib/utils/formatters'
import type { MarketMover } from '@/types/stock'

const priceFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export default function DashboardPage() {
  const marketStatus = useMarketStatus()
  const {
    portfolio,
    pendingTicker,
    setPendingTicker,
    selectedPortfolioId,
    setSelectedPortfolioId,
    portfolios,
  } = usePortfolio()
  const [selectedTicker, setSelectedTicker] = useState(pendingTicker)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState('NIFTY')
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setSelectedTicker(pendingTicker)
  }, [pendingTicker])

  useEffect(() => {
    setPendingTicker(selectedTicker)
  }, [selectedTicker, setPendingTicker])

  const { data: stock, isLoading } = useStockData(selectedTicker)

  const indices = useMemo(() => getMarketIndices(step), [step])
  const allMovers = useMemo(() => getTopMovers(step), [step])
  const heatmap = useMemo(() => getSectorHeatmap(step), [step])
  const selectedIndexModel = indices.find((index) => index.symbol === selectedIndex) ?? indices[0]

  const filteredMovers = useMemo(
    () => (selectedSector ? allMovers.filter((mover) => mover.sector === selectedSector) : allMovers),
    [allMovers, selectedSector],
  )

  const heroUniverse = useMemo(() => getUniverseTickers().slice(0, 8), [])

  const newsEntries = useMemo<NewsfeedEntry[]>(() => {
    const moverMap = new Map(allMovers.map((mover) => [mover.ticker, mover]))

    const baseFeed = getNewsfeed(step).map((item) => {
      const ticker = item.id.split('-news-')[0] ?? selectedTicker
      const mover = moverMap.get(ticker)
      return {
        ...item,
        ticker,
        company: mover?.name ?? ticker,
        changePct: mover?.changePct ?? 0,
      }
    })

    const selectedFeed = stock.news.slice(0, 2).map((item) => ({
      ...item,
      ticker: stock.info.ticker,
      company: stock.info.name,
      changePct: stock.price.changePct,
    }))

    return [...selectedFeed, ...baseFeed]
      .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
      .filter((item) => {
        if (!selectedSector) {
          return true
        }

        const mover = moverMap.get(item.ticker)
        return mover?.sector === selectedSector || item.ticker === stock.info.ticker
      })
  }, [allMovers, selectedSector, selectedTicker, step, stock])

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker)
  }

  const selectedSectorLabel = selectedSector ?? stock.info.sector
  const leadingMover = filteredMovers[0] ?? allMovers[0]
  const trailingMover = [...filteredMovers].sort((left, right) => left.changePct - right.changePct)[0] ?? allMovers.at(-1)

  return (
    <main className="min-h-screen bg-base text-primary">
      <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-border bg-surface p-5 shadow-panel sm:p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-secondary">StockLens Dashboard</p>
              <h1 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-primary sm:text-3xl xl:text-4xl">
                Interactive Indian market command center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary sm:text-base">
                Track live demo indices, sector rotation, portfolio NAV, and a selected stock&apos;s
                price structure from one dense workspace.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {heroUniverse.map((ticker) => (
                  <button
                    key={ticker}
                    type="button"
                    onClick={() => handleTickerSelect(ticker)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-sm font-medium transition',
                      selectedTicker === ticker
                        ? 'border-accent bg-elevated text-primary'
                        : 'border-border bg-base text-secondary hover:text-primary',
                    )}
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-full xl:max-w-[560px] xl:grid-cols-3">
              <HeroStat
                label="Selected stock"
                value={isLoading ? 'Loading…' : `₹${priceFormatter.format(stock.price.current)}`}
                detail={stock.info.name}
                tone={stock.price.changePct >= 0 ? 'gain' : 'loss'}
                subValue={formatPct(stock.price.changePct)}
              />
              <HeroStat
                label="Portfolio NAV"
                value={formatCurrency(portfolio.snapshot.nav)}
                detail={portfolio.name}
                tone={portfolio.snapshot.totalPnl >= 0 ? 'gain' : 'loss'}
                subValue={formatSignedCurrency(portfolio.snapshot.dayChange)}
              />
              <HeroStat
                label="Breadth"
                value={selectedIndexModel?.breadth ?? '—'}
                detail={selectedIndexModel?.name ?? 'Live benchmark'}
                tone={selectedIndexModel?.changePct && selectedIndexModel.changePct >= 0 ? 'gain' : 'loss'}
                subValue={selectedIndexModel ? formatPct(selectedIndexModel.changePct) : '—'}
              />
            </div>
          </div>
        </section>

        <IndexSnapshot
          indices={indices}
          marketStatus={marketStatus}
          selectedSymbol={selectedIndex}
          onSelectSymbol={setSelectedIndex}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">Selected Stock</p>
                  <h2 className="mt-1 text-xl font-semibold text-primary sm:text-2xl">
                    {stock.info.ticker} · {stock.info.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{stock.info.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:w-full xl:max-w-[360px]">
                  <MetricChip label="Consensus" value={stock.info.analystConsensus} />
                  <MetricChip label="Fair value" value={formatCurrency(stock.info.fairValue)} />
                  <MetricChip label="Risk" value={stock.info.riskLevel} />
                  <MetricChip label="Sector focus" value={selectedSectorLabel} />
                </div>
              </div>

              <div className="mt-5">
                <CandlestickChart ticker={stock.info.ticker} data={stock.history} />
              </div>
            </div>

            <FinancialLineChart ticker={stock.info.ticker} financials={stock.financials} />
          </div>

          <div className="min-w-0 space-y-6">
            <RadarChart ticker={stock.info.ticker} score={stock.dvm} />

            <PortfolioNAVChart
              history={portfolio.navHistory}
              snapshot={portfolio.snapshot}
              portfolioName={portfolio.name}
            />

            <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">Quick Read</p>
                  <h3 className="mt-1 text-xl font-semibold text-primary">{stock.info.ticker} setup summary</h3>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-2 text-sm font-medium',
                    stock.dvm.tone === 'gain'
                      ? 'text-gain'
                      : stock.dvm.tone === 'warn'
                        ? 'text-warn'
                        : 'text-loss',
                  )}
                  style={{
                    background:
                      stock.dvm.tone === 'gain'
                        ? 'color-mix(in srgb, var(--color-green) 14%, var(--color-bg-surface))'
                        : stock.dvm.tone === 'warn'
                          ? 'color-mix(in srgb, var(--color-amber) 14%, var(--color-bg-surface))'
                          : 'color-mix(in srgb, var(--color-red) 14%, var(--color-bg-surface))',
                  }}
                >
                  {stock.dvm.label}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MiniReadCard label="Current price" value={formatCurrency(stock.price.current)} detail={formatPct(stock.price.changePct)} tone={stock.price.changePct >= 0 ? 'gain' : 'loss'} />
                <MiniReadCard label="Market cap" value={formatCurrency(stock.info.marketCap)} detail={stock.info.sector} />
                <MiniReadCard label="Promoter holding" value={`${stock.info.promoterHolding.toFixed(1)}%`} detail="Ownership signal" />
                <MiniReadCard label="FII flow" value={`${stock.info.fiiFlow.toFixed(1)}`} detail="Institutional trend" tone={stock.info.fiiFlow >= 0 ? 'gain' : 'loss'} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <SectorHeatmapWidget
            cells={heatmap}
            className="xl:order-2"
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
          />
          <TopMoversTable
            className="xl:order-1"
            movers={filteredMovers}
            selectedTicker={selectedTicker}
            onSelectTicker={handleTickerSelect}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">Rotation Summary</p>
                <h3 className="mt-1 text-xl font-semibold text-primary">What the dashboard is saying now</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:max-w-[420px]">
                <SummaryBadge label="Focus sector" value={selectedSectorLabel} detail="Heatmap sync" />
                <SummaryBadge label="Leader" value={leadingMover?.ticker ?? '—'} detail={leadingMover ? formatPct(leadingMover.changePct) : '—'} tone={leadingMover?.changePct && leadingMover.changePct >= 0 ? 'gain' : 'loss'} />
                <SummaryBadge label="Laggard" value={trailingMover?.ticker ?? '—'} detail={trailingMover ? formatPct(trailingMover.changePct) : '—'} tone={trailingMover?.changePct && trailingMover.changePct >= 0 ? 'gain' : 'loss'} />
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {stock.analysts.map((analyst) => (
                <div key={analyst.broker} className="rounded-3xl border border-border bg-base p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">{analyst.broker}</p>
                      <p className="mt-1 text-xs text-secondary">{analyst.rating} · published view</p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        analyst.rating === 'Buy'
                          ? 'text-gain'
                          : analyst.rating === 'Hold'
                            ? 'text-warn'
                            : 'text-loss',
                      )}
                      style={{
                        background:
                          analyst.rating === 'Buy'
                            ? 'color-mix(in srgb, var(--color-green) 14%, var(--color-bg-surface))'
                            : analyst.rating === 'Hold'
                              ? 'color-mix(in srgb, var(--color-amber) 14%, var(--color-bg-surface))'
                              : 'color-mix(in srgb, var(--color-red) 14%, var(--color-bg-surface))',
                      }}
                    >
                      {analyst.rating}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-secondary">Target</p>
                      <p className="mt-1 font-mono text-lg font-semibold text-primary">
                        {formatCurrency(analyst.targetPrice)}
                      </p>
                    </div>
                    <p className="text-sm text-secondary">{analyst.upsidePct.toFixed(0)}% implied move</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <NewsfeedWidget items={newsEntries} selectedTicker={selectedTicker} onSelectTicker={handleTickerSelect} />
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">Portfolio Context</p>
              <h3 className="mt-1 text-xl font-semibold text-primary">Switch demo baskets without leaving the dashboard</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {portfolios.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPortfolioId(item.id)}
                  className={cn(
                    'rounded-full border px-3 py-2 text-sm font-medium transition',
                    selectedPortfolioId === item.id
                      ? 'border-accent bg-elevated text-primary'
                      : 'border-border bg-base text-secondary hover:text-primary',
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function HeroStat({
  label,
  value,
  detail,
  subValue,
  tone = 'neutral',
}: {
  label: string
  value: string
  detail: string
  subValue: string
  tone?: 'gain' | 'loss' | 'neutral'
}) {
  return (
    <div className="rounded-3xl border border-border bg-base p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold leading-tight text-primary sm:text-xl">{value}</p>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-sm text-secondary">{detail}</p>
        <p
          className={cn(
            'text-sm font-medium',
            tone === 'gain' ? 'text-gain' : tone === 'loss' ? 'text-loss' : 'text-primary',
          )}
        >
          {subValue}
        </p>
      </div>
    </div>
  )
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-base px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-primary">{value}</p>
    </div>
  )
}

function MiniReadCard({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string
  value: string
  detail: string
  tone?: 'gain' | 'loss' | 'neutral'
}) {
  return (
    <div className="rounded-3xl border border-border bg-base p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p
        className={cn(
          'mt-2 text-lg font-semibold leading-tight text-primary',
          tone === 'gain' ? 'text-gain' : tone === 'loss' ? 'text-loss' : '',
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-secondary">{detail}</p>
    </div>
  )
}

function SummaryBadge({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string
  value: string
  detail: string
  tone?: 'gain' | 'loss' | 'neutral'
}) {
  return (
    <div className="rounded-3xl border border-border bg-base px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{label}</p>
      <p
        className={cn(
          'mt-2 break-words text-sm font-semibold text-primary',
          tone === 'gain' ? 'text-gain' : tone === 'loss' ? 'text-loss' : '',
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-secondary">{detail}</p>
    </div>
  )
}
