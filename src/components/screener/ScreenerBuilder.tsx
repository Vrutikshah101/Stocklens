'use client'

import { Plus, RotateCcw } from 'lucide-react'

import { FilterBlock } from '@/components/screener/FilterBlock'
import { SavedScreeners } from '@/components/screener/SavedScreeners'
import type { ScreenerFilter, ScreenerTemplate } from '@/types/screener'

interface ScreenerBuilderProps {
  filters: ScreenerFilter[]
  activeTemplateId: string | null
  templates: ScreenerTemplate[]
  onAddFilter: () => void
  onClear: () => void
  onApplyTemplate: (template: ScreenerTemplate) => void
  onChangeFilter: (id: string, updates: Partial<ScreenerFilter>) => void
  onRemoveFilter: (id: string) => void
}

export function ScreenerBuilder({
  filters,
  activeTemplateId,
  templates,
  onAddFilter,
  onClear,
  onApplyTemplate,
  onChangeFilter,
  onRemoveFilter,
}: ScreenerBuilderProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-primary">Screener Builder</h2>
            <p className="mt-1 text-sm text-secondary">
              Mix valuation, quality, growth, and momentum filters with instant sample results.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-base px-3 text-sm text-primary transition hover:border-accent"
              onClick={onClear}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-white transition hover:brightness-110"
              onClick={onAddFilter}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filters.length ? (
            filters.map((filter) => (
              <FilterBlock
                filter={filter}
                key={filter.id}
                onChange={onChangeFilter}
                onRemove={onRemoveFilter}
              />
            ))
          ) : (
            <div className="rounded-md border border-dashed border-border bg-base/40 px-4 py-8 text-center text-sm text-secondary">
              No active filters yet. Start with a template or add one manually.
            </div>
          )}
        </div>
      </section>

      <SavedScreeners
        activeTemplateId={activeTemplateId}
        onApplyTemplate={onApplyTemplate}
        templates={templates}
      />
    </div>
  )
}
