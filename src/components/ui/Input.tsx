'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils/formatters'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
  label?: string
  leading?: ReactNode
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, id, label, leading, trailing, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-secondary" htmlFor={id}>
      {label ? <span className="font-medium text-primary">{label}</span> : null}
      <span
        className={cn(
          'field-surface flex h-9 items-center gap-2 rounded-md px-3 transition-all duration-150 focus-within:border-[var(--color-accent-blue)] focus-within:ring-2 focus-within:ring-[rgba(47,129,247,0.18)]',
          error && 'border-[rgba(255,139,139,0.42)] focus-within:border-[var(--color-red)] focus-within:ring-[rgba(255,139,139,0.18)]',
        )}
      >
        {leading ? <span className="text-muted">{leading}</span> : null}
        <input
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-full w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted',
            trailing && 'pr-1',
            className,
          )}
          id={id}
          {...props}
        />
        {trailing ? <span className="text-muted">{trailing}</span> : null}
      </span>
      {error ? <span className="text-xs text-[var(--color-red)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  )
})

export default Input
