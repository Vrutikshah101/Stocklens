'use client'

import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/formatters'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md bg-[var(--color-bg-elevated)]',
        shimmer && 'relative before:absolute before:inset-0 before:animate-[shimmer_1.8s_linear_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] before:content-[""]',
        className,
      )}
      {...props}
    />
  )
}

export default Skeleton
