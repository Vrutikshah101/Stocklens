import { format } from 'date-fns'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  if (value === 0) {
    return '₹0'
  }

  if (Math.abs(value) >= 10_000_000) {
    return `₹${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value / 10_000_000)}Cr`
  }

  if (Math.abs(value) >= 100_000) {
    return `₹${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value / 100_000)}L`
  }

  return `₹${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value)}`
}

export function formatLargeNumber(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  if (Math.abs(value) >= 10_000_000) {
    return `${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value / 10_000_000)}Cr`
  }

  if (Math.abs(value) >= 100_000) {
    return `${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value / 100_000)}L`
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPct(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  if (value === 0) {
    return '0.00%'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatDate(value: string) {
  return format(new Date(value), 'dd MMM yyyy')
}

export function formatTime(value: string) {
  return format(new Date(value), 'hh:mm a')
}

export function formatSignedCurrency(value: number) {
  return `${value >= 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`
}

