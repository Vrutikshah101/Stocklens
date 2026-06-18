'use client'

import type { ScreenerTemplate } from '@/types/screener'

interface SavedScreenersProps {
  activeTemplateId: string | null
  templates: ScreenerTemplate[]
  onApplyTemplate: (template: ScreenerTemplate) => void
}

export function SavedScreeners({
  activeTemplateId,
  templates,
  onApplyTemplate,
}: SavedScreenersProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-primary">Expert Screeners</h3>
          <p className="mt-1 text-sm text-secondary">
            Start from a proven lens, then refine your filters interactively.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {templates.map((template) => {
          const isActive = template.id === activeTemplateId
          return (
            <button
              key={template.id}
              className={`w-full rounded-md border px-3 py-3 text-left transition ${
                isActive
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-base/60 hover:border-accent/40'
              }`}
              onClick={() => onApplyTemplate(template)}
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{template.name}</span>
                <span className="rounded-md border border-border px-2 py-1 text-[11px] text-secondary">
                  {template.filters.length} filters
                </span>
              </div>
              <p className="mt-2 text-sm text-secondary">{template.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
