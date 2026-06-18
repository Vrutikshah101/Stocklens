'use client'

import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/formatters'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('panel-elevated rounded-[28px] p-5 md:p-6', className)} {...props} />
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
})

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h2 ref={ref} className={cn('text-lg font-semibold tracking-tight text-primary', className)} {...props} />
})

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn('text-sm leading-6 text-secondary', className)} {...props} />
  },
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('mt-5', className)} {...props} />
})

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('mt-5 flex items-center justify-between gap-3', className)} {...props} />
})

export default Card
