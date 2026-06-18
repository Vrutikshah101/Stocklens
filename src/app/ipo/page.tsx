'use client'

import { CalendarRange } from 'lucide-react'

import { DEMO_IPOS } from '@/lib/utils/constants'

export default function IpoPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-base p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-ai/10 p-3 text-ai">
            <CalendarRange className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-primary">IPO Center</h1>
            <p className="mt-2 max-w-3xl text-sm text-secondary">
              Track upcoming issues, pricing bands, and grey-market mood in a compact launch monitor.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {DEMO_IPOS.map((ipo) => (
          <article className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel" key={ipo.name}>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">{ipo.name}</div>
              <span className="rounded-full border border-ai/30 bg-ai/10 px-3 py-1 text-xs text-ai">
                {ipo.subscription}
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-secondary">Dates</dt>
                <dd className="text-primary">{ipo.dates}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-secondary">Lot Size</dt>
                <dd className="text-primary">{ipo.lotSize}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-secondary">Price Band</dt>
                <dd className="text-primary">{ipo.priceBand}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-secondary">GMP</dt>
                <dd className="text-gain">{ipo.gmp}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  )
}
