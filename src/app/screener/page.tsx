'use client'

import { Filter } from 'lucide-react'

import { MarketMindChat } from '@/components/ai/MarketMindChat'
import { ScreenerBuilder } from '@/components/screener/ScreenerBuilder'
import { ScreenerResults } from '@/components/screener/ScreenerResults'
import { useScreener } from '@/hooks/useScreener'

export default function ScreenerPage() {
  const screener = useScreener()

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md border border-border bg-base p-2 text-accent">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary">Stock Screener</h1>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-secondary">
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

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
        <ScreenerResults results={screener.results} />
        <MarketMindChat />
      </div>
    </div>
  )
}
