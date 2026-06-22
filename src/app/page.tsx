'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, BrainCircuit, LineChart, RadioTower, ShieldCheck, Sparkles } from 'lucide-react'

import { IndexSnapshot } from '@/components/dashboard/IndexSnapshot'
import { NewsfeedWidget, type NewsfeedEntry } from '@/components/dashboard/NewsfeedWidget'
import { SectorHeatmapWidget } from '@/components/dashboard/SectorHeatmapWidget'
import { TopMoversTable } from '@/components/dashboard/TopMoversTable'
import { useMarketStatus } from '@/hooks/useMarketStatus'
import { useMarketOverview } from '@/hooks/useMarketOverview'
import { cn, formatPct } from '@/lib/utils/formatters'

const fiiDii = [
  {
    label: 'FII flow',
    value: '+₹1,842 Cr',
    detail: 'Foreign desks are net buyers on banks and energy.',
    tone: 'gain',
  },
  {
    label: 'DII flow',
    value: '-₹634 Cr',
    detail: 'Domestic funds are trimming defensives after the open.',
    tone: 'loss',
  },
  {
    label: 'Advance / decline',
    value: '1.46×',
    detail: 'Breadth stays constructive across the large-cap tape.',
    tone: 'gain',
  },
] as const

export default function DashboardPage() {
  const marketStatus = useMarketStatus()
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [selectedTicker, setSelectedTicker] = useState('RELIANCE')
  const [selectedIndex, setSelectedIndex] = useState('NIFTY')
  const marketOverview = useMarketOverview()
  const { heatmap, indices, movers, news: rawNews } = marketOverview.data

  const focusedMovers = useMemo(
    () => (selectedSector ? movers.filter((mover) => mover.sector === selectedSector) : movers),
    [movers, selectedSector],
  )

  const focusedTicker = focusedMovers.find((mover) => mover.ticker === selectedTicker) ?? focusedMovers[0] ?? movers[0]
  const topIndex = indices.find((index) => index.symbol === selectedIndex) ?? indices[0]
  const strongestSector = [...heatmap].sort((left, right) => right.changePct - left.changePct)[0]

  const news = useMemo<NewsfeedEntry[]>(
    () =>
      rawNews.map((item, index) => {
        const mover = movers[index % movers.length]

        return {
          ...item,
          ticker: mover?.ticker ?? 'NIFTY',
          company: mover?.name ?? 'Market desk',
          changePct: mover?.changePct ?? 0,
        }
      }),
    [movers, rawNews],
  )

  return (
    <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-5 text-primary">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-5 shadow-panel sm:p-6 xl:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--color-accent-blue-soft)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[var(--color-green-soft)] blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill isOpen={marketStatus.isOpen}>{marketStatus.label}</StatusPill>
              <span className="rounded-full border border-border bg-base px-3 py-1 text-xs font-medium text-secondary">
                {marketOverview.source === 'database' ? 'Prisma-backed market data' : 'Sample fallback data'} · updates every 5s
              </span>
              {marketOverview.error ? (
                <span className="rounded-full border border-warn bg-[var(--color-amber-soft)] px-3 py-1 text-xs font-medium text-warn">
                  API fallback active
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-4xl text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl xl:text-5xl">
              StockLens market command center for Indian equity decisions.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-secondary">
              A white-theme dashboard built around readable cards, breathable spacing, focused sector rotation,
              and synced market intelligence—no text collisions, even when the viewport gets tight.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                href={`/stock/${focusedTicker?.ticker ?? 'RELIANCE'}`}
              >
                Open {focusedTicker?.ticker ?? 'RELIANCE'} lens
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-base px-4 py-3 text-sm font-semibold text-primary transition hover:border-accent"
                href="/screener"
              >
                Build a screener
                <Sparkles className="h-4 w-4 text-accent" />
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <HeroMetric
              icon={<LineChart className="h-4 w-4" />}
              label={topIndex?.symbol ?? 'NIFTY'}
              value={topIndex ? formatPct(topIndex.changePct) : '—'}
              detail={`${topIndex?.name ?? 'Benchmark'} · breadth ${topIndex?.breadth ?? '—'}`}
              tone={(topIndex?.changePct ?? 0) >= 0 ? 'gain' : 'loss'}
            />
            <HeroMetric
              icon={<RadioTower className="h-4 w-4" />}
              label="Focused sector"
              value={selectedSector ?? strongestSector?.sector ?? 'All sectors'}
              detail={`Leaders: ${(strongestSector?.leaders ?? []).join(', ') || '—'}`}
              tone={(strongestSector?.changePct ?? 0) >= 0 ? 'gain' : 'loss'}
            />
            <HeroMetric
              icon={<BrainCircuit className="h-4 w-4" />}
              label="Secondary AI harness"
              value="Nex draft-only"
              detail="AI suggestions stay reviewed before implementation."
              tone="info"
            />
          </div>
        </div>
      </section>

      <IndexSnapshot
        indices={indices}
        marketStatus={marketStatus}
        onSelectSymbol={setSelectedIndex}
        selectedSymbol={selectedIndex}
      />

      <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <SectorHeatmapWidget
          cells={heatmap}
          onSelectSector={(sector) => {
            setSelectedSector(sector)
            if (sector) {
              const firstTicker = movers.find((mover) => mover.sector === sector)?.ticker
              if (firstTicker) setSelectedTicker(firstTicker)
            }
          }}
          selectedSector={selectedSector}
        />

        <section className="grid min-w-0 gap-3">
          {fiiDii.map((item) => (
            <FlowCard key={item.label} {...item} />
          ))}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-panel">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[var(--color-accent-blue-soft)] p-3 text-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Trust note
                </p>
                <h2 className="mt-1 text-lg font-semibold text-primary">
                  Demo analytics, not financial advice
                </h2>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Sample data keeps flows realistic for UX validation. Production AI and market APIs stay server-side only.
                </p>
              </div>
            </div>
          </section>
        </section>
      </section>

      <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.8fr)]">
        <TopMoversTable
          movers={focusedMovers}
          onSelectTicker={setSelectedTicker}
          selectedTicker={focusedTicker?.ticker}
        />
        <NewsfeedWidget
          items={news}
          onSelectTicker={setSelectedTicker}
          selectedTicker={focusedTicker?.ticker}
        />
      </section>
    </div>
  )
}

function StatusPill({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        isOpen ? 'border-gain bg-[var(--color-green-soft)] text-gain' : 'border-warn bg-[var(--color-amber-soft)] text-warn',
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_0_5px_color-mix(in_srgb,currentColor_16%,transparent)]" />
      {children}
    </span>
  )
}

function HeroMetric({
  detail,
  icon,
  label,
  tone,
  value,
}: {
  detail: string
  icon: ReactNode
  label: string
  tone: 'gain' | 'loss' | 'info'
  value: string
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-base/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'rounded-xl p-2',
            tone === 'gain' && 'bg-[var(--color-green-soft)] text-gain',
            tone === 'loss' && 'bg-[var(--color-red-soft)] text-loss',
            tone === 'info' && 'bg-[var(--color-accent-blue-soft)] text-accent',
          )}
        >
          {icon}
        </div>
        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {label}
        </p>
      </div>
      <p className="mt-3 truncate text-xl font-semibold text-primary">{value}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-secondary">{detail}</p>
    </article>
  )
}

function FlowCard({
  detail,
  label,
  tone,
  value,
}: {
  detail: string
  label: string
  tone: 'gain' | 'loss'
  value: string
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{label}</p>
      <p className={cn('mt-3 font-mono text-2xl font-semibold', tone === 'gain' ? 'text-gain' : 'text-loss')}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-secondary">{detail}</p>
    </article>
  )
}
