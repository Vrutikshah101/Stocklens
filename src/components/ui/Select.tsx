'use client'

import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'

import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils/formatters'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  hint?: string
  label?: string
  leading?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, className, error, hint, id, label, leading, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-secondary" htmlFor={id}>
      {label ? <span className="font-medium text-primary">{label}</span> : null}
      <span
        className={cn(
          'field-surface flex h-12 items-center gap-3 rounded-2xl px-4 transition-all duration-200 focus-within:border-[var(--color-accent-blue)] focus-within:ring-2 focus-within:ring-[rgba(124,156,255,0.18)]',
          error && 'border-[rgba(255,139,139,0.42)] focus-within:border-[var(--color-red)] focus-within:ring-[rgba(255,139,139,0.18)]',
        )}
      >
        {leading ? <span className="text-muted">{leading}</span> : null}
        <select
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-full w-full appearance-none bg-transparent text-sm text-primary outline-none',
            className,
          )}
          id={id}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="h-4 w-4 text-muted" />
      </span>
      {error ? <span className="text-xs text-[var(--color-red)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  )
})

export default Select
