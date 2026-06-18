'use client'

import { forwardRef, type HTMLAttributes, type TableHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/formatters'

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(function Table(
  { className, ...props },
  ref,
) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="overflow-x-auto">
        <table ref={ref} className={cn('min-w-full border-collapse text-left text-sm', className)} {...props} />
      </div>
    </div>
  )
})

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={cn('bg-[var(--color-surface-soft)] text-muted', className)} {...props} />
  },
)

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={cn('divide-y divide-border', className)} {...props} />
  },
)

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow(
  { className, ...props },
  ref,
) {
  return <tr ref={ref} className={cn('transition-colors hover:bg-[rgba(148,163,184,0.06)]', className)} {...props} />
})

export const TableHead = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  function TableHead({ className, ...props }, ref) {
    return (
      <th
        ref={ref}
        className={cn('px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted', className)}
        {...props}
      />
    )
  },
)

export const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  function TableCell({ className, ...props }, ref) {
    return <td ref={ref} className={cn('px-4 py-3 text-secondary', className)} {...props} />
  },
)

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={cn('px-4 py-3 text-left text-xs text-muted', className)} {...props} />
  },
)

export default Table
