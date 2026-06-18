'use client'

import { cn } from '@/lib/utils/formatters'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('animate-spin text-current', sizeClasses[size], className)}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  )
}

export default Spinner
