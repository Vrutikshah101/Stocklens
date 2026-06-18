'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils/formatters'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

interface DialogProps {
  children: ReactNode
  className?: string
  description?: ReactNode
  footer?: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  size?: DialogSize
  title: ReactNode
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export function Dialog({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  size = 'md',
  title,
}: DialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onOpenChange, open])

  if (!mounted || !open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6">
      <button
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-slate-950/72 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <div
        aria-modal="true"
        className={cn(
          'panel-elevated relative z-10 w-full rounded-lg p-4 md:p-5',
          sizeClasses[size],
          className,
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 pr-6">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            {description ? <div className="text-sm leading-6 text-secondary">{description}</div> : null}
          </div>
          <button
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-[var(--color-bg-elevated)] text-secondary transition hover:text-primary"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

export default Dialog
