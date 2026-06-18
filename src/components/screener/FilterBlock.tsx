'use client'

import { Trash2 } from 'lucide-react'

import { SCREENER_FIELDS } from '@/lib/utils/constants'
import type { ScreenerFilter } from '@/types/screener'

interface FilterBlockProps {
  filter: ScreenerFilter
  onChange: (id: string, updates: Partial<ScreenerFilter>) => void
  onRemove: (id: string) => void
}

export function FilterBlock({ filter, onChange, onRemove }: FilterBlockProps) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-base/70 p-3 md:grid-cols-[1.2fr_0.8fr_1fr_1fr_auto]">
      <label className="space-y-2 text-xs text-secondary">
        Field
        <select
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-accent"
          onChange={(event) => onChange(filter.id, { field: event.target.value as ScreenerFilter['field'] })}
          value={filter.field}
        >
          {SCREENER_FIELDS.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-xs text-secondary">
        Operator
        <select
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-accent"
          onChange={(event) => onChange(filter.id, { operator: event.target.value as ScreenerFilter['operator'] })}
          value={filter.operator}
        >
          <option value=">=">{'>='}</option>
          <option value="<=">{'<='}</option>
          <option value="between">Between</option>
        </select>
      </label>

      <label className="space-y-2 text-xs text-secondary">
        Value
        <input
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-accent"
          onChange={(event) => onChange(filter.id, { value: Number(event.target.value) })}
          type="number"
          value={filter.value}
        />
      </label>

      <label className="space-y-2 text-xs text-secondary">
        Max
        <input
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-accent"
          disabled={filter.operator !== 'between'}
          onChange={(event) => onChange(filter.id, { maxValue: Number(event.target.value) })}
          type="number"
          value={filter.maxValue ?? ''}
        />
      </label>

      <button
        className="inline-flex h-9 items-center justify-center self-end rounded-md border border-border bg-surface px-3 text-secondary transition hover:border-loss hover:text-loss"
        onClick={() => onRemove(filter.id)}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
