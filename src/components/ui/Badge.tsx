'use client'

import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils/formatters'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'muted'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  dot?: boolean
  icon?: ReactNode
  size?: BadgeSize
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-[rgba(124,156,255,0.24)] bg-[var(--color-accent-blue-soft)] text-[var(--color-accent-blue)]',
  success: 'border-[rgba(109,216,174,0.24)] bg-[var(--color-green-soft)] text-[var(--color-green)]',
  danger: 'border-[rgba(255,139,139,0.24)] bg-[var(--color-red-soft)] text-[var(--color-red)]',
  warning: 'border-[rgba(255,203,107,0.24)] bg-[var(--color-amber-soft)] text-[var(--color-amber)]',
  info: 'border-[rgba(119,216,219,0.24)] bg-[rgba(119,216,219,0.14)] text-[var(--color-teal)]',
  outline: 'border-border bg-transparent text-primary',
  muted: 'border-border bg-[var(--color-surface-soft)] text-secondary',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-[10px]',
  md: 'px-3 py-1.5 text-[11px]',
}

export function Badge({
  children,
  className,
  dot = false,
  icon,
  size = 'md',
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-[0.18em]',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {icon}
      {children}
    </span>
  )
}

export default Badge
