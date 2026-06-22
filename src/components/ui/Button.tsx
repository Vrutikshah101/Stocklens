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
    'border border-accent bg-accent text-white shadow-sm hover:brightness-110',
  secondary:
    'border border-border bg-surface text-primary shadow-sm hover:bg-[var(--color-surface-soft)]',
  ghost: 'bg-transparent text-secondary hover:bg-[var(--color-surface-soft)] hover:text-primary',
  outline: 'border border-border bg-transparent text-primary hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]',
  danger:
    'border border-loss bg-loss text-white hover:brightness-110',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-3.5 text-sm',
  lg: 'h-10 px-4 text-sm',
  icon: 'h-9 w-9',
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
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] disabled:pointer-events-none disabled:opacity-60',
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
