'use client'

import { Filter } from 'lucide-react'

import { MarketMindChat } from '@/components/ai/MarketMindChat'
import { ScreenerBuilder } from '@/components/screener/ScreenerBuilder'
import { ScreenerResults } from '@/components/screener/ScreenerResults'
import { useScreener } from '@/hooks/useScreener'

export default function ScreenerPage() {
  const screener = useScreener()

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-base p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-accent/10 p-3 text-accent">
            <Filter className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-primary">Stock Screener</h1>
            <p className="mt-2 max-w-3xl text-sm text-secondary">
              Design and test stock-discovery workflows with realtime-feeling sample data, expert templates, and instant result feedback.
            </p>
          </div>
        </div>
      </section>

      <ScreenerBuilder
        activeTemplateId={screener.activeTemplateId}
        filters={screener.filters}
        onAddFilter={() => screener.addFilter(screener.createFilter())}
        onApplyTemplate={(template) => screener.applyTemplate(template.id, template.filters)}
        onChangeFilter={screener.updateFilter}
        onClear={screener.clearFilters}
        onRemoveFilter={screener.removeFilter}
        templates={screener.templates}
      />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <ScreenerResults results={screener.results} />
        <MarketMindChat />
      </div>
    </div>
  )
}

