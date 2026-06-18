'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Activity,
  BarChart3,
  CalendarClock,
  LineChart,
  ShieldCheck,
} from 'lucide-react'

import { StockPageSkeleton } from '@/app/stock/[ticker]/loading'
import { AnalystCallsTable } from '@/components/stock/AnalystCallsTable'
import { CorporateEventsList } from '@/components/stock/CorporateEventsList'
import { DVMScoreCard } from '@/components/stock/DVMScoreCard'
import { FinancialsTable } from '@/components/stock/FinancialsTable'
import { ForecasterTable } from '@/components/stock/ForecasterTable'
import { NewsCard } from '@/components/stock/NewsCard'
import { PeersTable } from '@/components/stock/PeersTable'
import { StockHeader } from '@/components/stock/StockHeader'
import { SWOTCard } from '@/components/stock/SWOTCard'
import { TechnicalChart } from '@/components/stock/TechnicalChart'
import { useMarketStatus } from '@/hooks/useMarketStatus'
import { useStockData } from '@/hooks/useStockData'
import { cn, formatCurrency, formatPct } from '@/lib/utils/formatters'

type StockTab = 'overview' | 'fundamentals' | 'street' | 'catalysts'

interface StockDetailPageProps {
  params: {
    ticker: string
  }
}

const TABS: Array<{
  id: StockTab
  label: string
  description: string
  icon: typeof LineChart
}> = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Price action, DVM setup, and SWOT framing',
    icon: LineChart,
  },
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    description: 'Financial trend and peer positioning',
    icon: BarChart3,
  },
  {
    id: 'street',
    label: 'Street view',
    description: 'Analyst calls and forecast stack',
    icon: ShieldCheck,
  },
  {
    id: 'catalysts',
    label: 'Catalysts',
    description: 'Events calendar and latest coverage',
    icon: CalendarClock,
  },
]

export default function StockDetailPage({ params }: StockDetailPageProps) {
  const requestedTicker = useMemo(() => {
    const decoded = decodeURIComponent(params.ticker ?? '')
    const sanitized = decoded.replace(/[^a-z]/gi, '').toUpperCase()
    return sanitized || 'RELIANCE'
  }, [params.ticker])

  const { data, isLoading, error } = useStockData(requestedTicker)
  const marketState = useMarketStatus()
  const [activeTab, setActiveTab] = useState<StockTab>('overview')

  useEffect(() => {
    setActiveTab('overview')
  }, [requestedTicker])

  if (error) {
    throw new Error(error)
  }

  if (isLoading) {
    return <StockPageSkeleton />
  }

  const latestFinancial = data.financials.at(-1)
  const buyCalls = data.analysts.filter((call) => call.rating === 'Buy').length
  const upcomingEvents = data.events.filter(
    (event) => new Date(event.date).getTime() >= Date.now(),
  ).length
  const fairValueGap =
    ((data.info.fairValue - data.price.current) / data.price.current) * 100

  const peerSubject = {
    ticker: data.info.ticker,
    name: data.info.name,
    pe: data.info.pe,
    roe: latestFinancial?.roe ?? 0,
    marketCap: data.info.marketCap,
    performance1Y: data.price.changePct * 6.4,
    dvm: data.dvm.composite,
  }

  const insightCards = [
    {
      title: 'Valuation setup',
      value: formatPct(fairValueGap),
      body: `Fair value sits at ${formatCurrency(data.info.fairValue)} with ${data.dvm.label.toLowerCase()}.`,
      icon: Activity,
      tone:
        fairValueGap >= 0
          ? 'border-[color:var(--color-green-soft)] bg-[color:var(--color-green-soft)] text-gain'
          : 'border-[color:var(--color-amber-soft)] bg-[color:var(--color-amber-soft)] text-warn',
    },
    {
      title: 'Financial quality',
      value: `${data.info.revenueCagr3Y.toFixed(1)}% CAGR`,
      body: `Debt / equity at ${data.info.debtToEquity.toFixed(2)} and latest ROE at ${latestFinancial?.roe.toFixed(1) ?? '—'}%.`,
      icon: BarChart3,
      tone: 'border-[color:var(--color-accent-blue-soft)] bg-[color:var(--color-accent-blue-soft)] text-accent',
    },
    {
      title: 'Street pulse',
      value: `${buyCalls}/${data.analysts.length} Buy`,
      body: `${data.analysts.length} tracked calls with ${data.info.analystConsensus.toLowerCase()} consensus.`,
      icon: ShieldCheck,
      tone: 'border-[color:var(--color-accent-blue-soft)] bg-[color:var(--color-accent-blue-soft)] text-ai',
    },
    {
      title: 'Catalyst stack',
      value: `${upcomingEvents} upcoming`,
      body: `${data.news.length} fresh coverage items and ${data.events.length} listed corporate milestones.`,
      icon: CalendarClock,
      tone: 'border-[color:var(--color-amber-soft)] bg-[color:var(--color-amber-soft)] text-warn',
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 text-primary">
        <StockHeader
          dvm={data.dvm}
          info={data.info}
          marketState={marketState}
          price={data.price}
          requestedTicker={requestedTicker}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {insightCards.map(({ body, icon: Icon, title, tone, value }) => (
            <article
              key={title}
              className={cn(
                'rounded-lg border p-4',
                tone,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-current/70">
                    {title}
                  </p>
                  <p className="mt-2 break-words font-mono text-xl font-semibold text-primary">
                    {value}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-base/70 p-2 text-current">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-5 text-secondary">{body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-surface p-1.5">
          <div
            aria-label="Stock detail sections"
            className="grid gap-2 md:grid-cols-2 xl:grid-cols-4"
            role="tablist"
          >
            {TABS.map(({ description, icon: Icon, id, label }) => {
              const isActive = activeTab === id

              return (
                <button
                  aria-selected={isActive}
                  className={cn(
                    'rounded-md border px-3 py-3 text-left transition',
                    isActive
                      ? 'border-accent bg-accent/10'
                      : 'border-transparent bg-transparent hover:border-border hover:bg-base/70',
                  )}
                  key={id}
                  onClick={() => setActiveTab(id)}
                  role="tab"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'rounded-md border p-2',
                        isActive
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-base text-secondary',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{label}</p>
                      <p className="text-xs leading-5 text-secondary">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 xl:grid-cols-[1.6fr,0.95fr]">
              <TechnicalChart
                currentPrice={data.price.current}
                history={data.history}
                previousClose={data.price.previousClose}
                volume={data.price.volume}
              />
              <DVMScoreCard
                analystConsensus={data.info.analystConsensus}
                currentPrice={data.price.current}
                dvm={data.dvm}
                fairValue={data.info.fairValue}
                riskLevel={data.info.riskLevel}
              />
            </div>

            <SWOTCard swot={data.swot} />

            <div className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
              <CorporateEventsList events={data.events} />
              <section className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                      Coverage radar
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-primary">
                      Latest headlines
                    </h2>
                  </div>
                  <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
                    {data.news.length} items
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.news.slice(0, 2).map((item) => (
                    <NewsCard item={item} key={item.id} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'fundamentals' && (
          <div className="flex flex-col gap-4">
            <FinancialsTable financials={data.financials} />
            <PeersTable current={peerSubject} peers={data.peers} />
          </div>
        )}

        {activeTab === 'street' && (
          <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
            <AnalystCallsTable
              analysts={data.analysts}
              currentPrice={data.price.current}
            />
            <ForecasterTable forecasts={data.forecasts} />
          </div>
        )}

        {activeTab === 'catalysts' && (
          <div className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
            <CorporateEventsList events={data.events} />
            <section className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                    Narrative flow
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-primary">
                    News and desk notes
                  </h2>
                </div>
                <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
                  Demo coverage
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {data.news.map((item) => (
                  <NewsCard item={item} key={item.id} />
                ))}
              </div>
            </section>
          </div>
        )}
    </div>
  )
}
