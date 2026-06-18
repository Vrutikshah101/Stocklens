'use client'

import { CalendarRange } from 'lucide-react'

import { DEMO_IPOS } from '@/lib/utils/constants'

export default function IpoPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md border border-border bg-base p-2 text-ai">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary">IPO Center</h1>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-secondary">
              Track upcoming issues, pricing bands, and grey-market mood in a compact launch monitor.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {DEMO_IPOS.map((ipo) => (
          <article className="rounded-lg border border-border bg-surface p-4" key={ipo.name}>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">{ipo.name}</div>
              <span className="rounded-md border border-ai/30 bg-ai/10 px-2.5 py-1 text-xs text-ai">
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
