'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils/formatters'

import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  leadingIcon?: ReactNode
  size?: ButtonSize
  trailingIcon?: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,rgba(124,156,255,0.92),rgba(98,185,255,0.82))] text-slate-950 shadow-[0_16px_36px_rgba(103,145,255,0.28)] hover:brightness-110',
  secondary:
    'bg-[var(--color-surface-strong)] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[var(--color-bg-elevated)]',
  ghost: 'bg-transparent text-secondary hover:bg-[var(--color-surface-soft)] hover:text-primary',
  outline: 'border border-border bg-transparent text-primary hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]',
  danger:
    'bg-[linear-gradient(135deg,rgba(255,139,139,0.94),rgba(255,112,112,0.88))] text-slate-950 shadow-[0_16px_36px_rgba(255,112,112,0.22)] hover:brightness-105',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-11 w-11',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    isLoading = false,
    leadingIcon,
    size = 'md',
    trailingIcon,
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] disabled:pointer-events-none disabled:opacity-60',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leadingIcon}
      {children}
      {!isLoading ? trailingIcon : null}
    </button>
  )
})

export default Button
