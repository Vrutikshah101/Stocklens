'use client'

import { useEffect, useMemo, useState } from 'react'

import { useMarketStatus } from '@/hooks/useMarketStatus'
import {
  getMarketIndices,
  getNewsfeed,
  getSectorHeatmap,
  getTopMovers,
} from '@/lib/utils/constants'
import { cn, formatCurrency, formatPct, formatTime } from '@/lib/utils/formatters'

const compactCurrency = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

const fiiDii = [
  {
    label: 'FII (Foreign)',
    value: '+₹1,842 Cr',
    detail: 'Buy ₹22,400 Cr · Sell ₹20,558 Cr',
    tone: 'gain',
  },
  {
    label: 'DII (Domestic)',
    value: '-₹634 Cr',
    detail: 'Buy ₹14,200 Cr · Sell ₹14,834 Cr',
    tone: 'loss',
  },
] as const

export default function DashboardPage() {
  const marketStatus = useMarketStatus()
  const [step, setStep] = useState(0)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const indices = useMemo(() => getMarketIndices(step), [step])
  const movers = useMemo(() => getTopMovers(step), [step])
  const heatmap = useMemo(() => getSectorHeatmap(step), [step])
  const news = useMemo(() => getNewsfeed(step), [step])

  const indexCards = useMemo(
    () => [
      ...indices.map((index) => ({
        key: index.symbol,
        label: index.name,
        value: compactCurrency.format(index.value),
        change: `${index.change >= 0 ? '+' : '-'}${compactCurrency.format(Math.abs(index.change))} (${formatPct(index.changePct)})`,
        tone: index.changePct >= 0 ? 'gain' : 'loss',
      })),
      {
        key: 'NASDAQ',
        label: 'Nasdaq',
        value: '19,842',
        change: '+124 (+0.63%)',
        tone: 'gain',
      },
    ],
    [indices],
  )

  const visibleMovers = useMemo(() => {
    const rows = selectedSector ? movers.filter((mover) => mover.sector === selectedSector) : movers
    return [...rows].sort((left, right) => right.changePct - left.changePct).slice(0, 5)
  }, [movers, selectedSector])

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-5 lg:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold leading-tight text-[#e6edf3]">Market Overview</h1>
            <p className="mt-1 text-xs text-[#8b949e]">Thu, 18 Jun 2026 · live demo tape</p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3fb950]">
            <span className="h-2 w-2 rounded-full bg-[#3fb950] shadow-[0_0_0_4px_rgba(63,185,80,0.12)]" />
            {marketStatus.isOpen ? 'Market Open' : 'Market Closed'}
          </div>
        </header>

        <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {indexCards.slice(0, 5).map((card) => (
            <article
              key={card.key}
              className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 transition hover:border-[#484f58]"
            >
              <p className="text-[10px] font-medium text-[#8b949e]">{card.label}</p>
              <p className="mt-1 font-mono text-lg font-bold text-[#e6edf3]">{card.value}</p>
              <p className={cn('mt-1 font-mono text-[11px]', card.tone === 'gain' ? 'text-[#3fb950]' : 'text-[#f85149]')}>
                {card.change}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Panel title="Sector Heatmap">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
              {heatmap.map((cell) => {
                const isPositive = cell.changePct >= 0
                const active = selectedSector === cell.sector

                return (
                  <button
                    key={cell.sector}
                    type="button"
                    onClick={() => setSelectedSector(active ? null : cell.sector)}
                    className={cn(
                      'min-h-16 rounded px-2 py-2 text-left transition hover:opacity-90',
                      active ? 'ring-2 ring-[#2f81f7]' : '',
                    )}
                    style={{ background: sectorColor(cell.changePct) }}
                  >
                    <p className="truncate text-xs font-semibold text-[#e6edf3]">{cell.sector}</p>
                    <p className={cn('mt-1 font-mono text-[11px]', isPositive ? 'text-[#7ee787]' : 'text-[#ff7b72]')}>
                      {formatPct(cell.changePct)}
                    </p>
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel title={selectedSector ? `${selectedSector} movers` : 'Top Gainers'}>
            <div className="divide-y divide-[#21262d]">
              {visibleMovers.map((mover) => (
                <button
                  key={mover.ticker}
                  type="button"
                  className="flex w-full items-center justify-between gap-3 py-2 text-left transition hover:text-[#2f81f7]"
                >
                  <span>
                    <span className="block text-xs font-semibold">{mover.ticker}</span>
                    <span className="block font-mono text-[10px] text-[#8b949e]">
                      {formatCurrency(mover.price)}
                    </span>
                  </span>
                  <span className={cn('font-mono text-xs font-semibold', mover.changePct >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]')}>
                    {formatPct(mover.changePct)}
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </section>

        <Panel title="FII / DII Activity · Today">
          <div className="grid gap-3 md:grid-cols-2">
            {fiiDii.map((item) => (
              <div key={item.label} className="rounded-md bg-[#0d1117] p-3">
                <p className="text-[10px] text-[#8b949e]">{item.label}</p>
                <p className={cn('mt-1 font-mono text-lg font-bold', item.tone === 'gain' ? 'text-[#3fb950]' : 'text-[#f85149]')}>
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] text-[#484f58]">{item.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Market News">
          <div className="divide-y divide-[#21262d]">
            {news.slice(0, 6).map((item) => (
              <article key={item.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-xs leading-5 text-[#e6edf3]">{item.headline}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#8b949e]">
                  <span>{item.source}</span>
                  <span className="text-[#484f58]">·</span>
                  <span>{formatTime(item.publishedAt)}</span>
                  <span className="rounded-full bg-[#2f81f725] px-2 py-0.5 font-semibold text-[#2f81f7]">
                    {item.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

function Panel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 sm:p-4">
      <h2 className="mb-3 text-sm font-semibold text-[#e6edf3]">{title}</h2>
      {children}
    </section>
  )
}

function sectorColor(changePct: number) {
  if (changePct > 2) {
    return '#14532d'
  }

  if (changePct > 1) {
    return '#166534'
  }

  if (changePct > 0) {
    return '#1a4d25'
  }

  if (changePct > -1) {
    return '#7f1d1d'
  }

  if (changePct > -2) {
    return '#991b1b'
  }

  return '#450a0a'
}
