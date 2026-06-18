'use client'

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils/formatters'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  children: ReactElement
  className?: string
  content: ReactNode
  side?: TooltipSide
}

const sideClasses: Record<TooltipSide, string> = {
  bottom: 'left-1/2 top-[calc(100%+0.75rem)] -translate-x-1/2',
  left: 'right-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2',
  right: 'left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2',
  top: 'bottom-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2',
}

export function Tooltip({ children, className, content, side = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const show = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setOpen(false), 60)
  }

  if (!isValidElement(children)) {
    return null
  }

  const child = children as ReactElement<{ 'aria-describedby'?: string }>

  return (
    <span className={cn('relative inline-flex', className)} onBlur={hide} onFocus={show} onMouseEnter={show} onMouseLeave={hide}>
      {cloneElement(child, {
        'aria-describedby': open ? tooltipId : undefined,
      })}
      {open ? (
        <span
          className={cn(
            'pointer-events-none absolute z-50 max-w-[16rem] rounded-2xl border border-border bg-[var(--color-surface-strong)] px-3 py-2 text-xs leading-5 text-secondary shadow-[var(--shadow-float)] transition-all duration-150 opacity-100',
            sideClasses[side],
          )}
          id={tooltipId}
          role="tooltip"
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}

export default Tooltip
