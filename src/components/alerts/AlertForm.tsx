'use client'

import { useState } from 'react'

import type { AlertMetric } from '@/types/alert'

interface AlertFormProps {
  onCreate: (payload: {
    ticker: string
    title: string
    metric: AlertMetric
    threshold: number
    channel: 'Web' | 'Email'
    active: boolean
  }) => void
}

export function AlertForm({ onCreate }: AlertFormProps) {
  const [ticker, setTicker] = useState('RELIANCE')
  const [title, setTitle] = useState('Reliance breakout')
  const [metric, setMetric] = useState<AlertMetric>('priceAbove')
  const [threshold, setThreshold] = useState(3000)
  const [channel, setChannel] = useState<'Web' | 'Email'>('Web')

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-base font-semibold text-primary">Create Alert</h3>
      <p className="mt-1 text-sm text-secondary">Wire price, DVM, and event thresholds in one place.</p>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          onCreate({ ticker, title, metric, threshold, channel, active: true })
          setTitle('')
        }}
      >
        <label className="space-y-2 text-xs text-secondary">
          Ticker
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setTicker(event.target.value.toUpperCase())}
            value={ticker}
          />
        </label>

        <label className="space-y-2 text-xs text-secondary">
          Title
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </label>

        <label className="space-y-2 text-xs text-secondary">
          Metric
          <select
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setMetric(event.target.value as AlertMetric)}
            value={metric}
          >
            <option value="priceAbove">Price Above</option>
            <option value="priceBelow">Price Below</option>
            <option value="dvmAbove">DVM Above</option>
            <option value="volumeSpike">Volume Spike</option>
            <option value="ratingChange">Rating Change</option>
            <option value="earningsDate">Earnings Date</option>
          </select>
        </label>

        <label className="space-y-2 text-xs text-secondary">
          Threshold
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setThreshold(Number(event.target.value))}
            type="number"
            value={threshold}
          />
        </label>

        <label className="space-y-2 text-xs text-secondary md:col-span-2">
          Channel
          <select
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setChannel(event.target.value as 'Web' | 'Email')}
            value={channel}
          >
            <option value="Web">Web</option>
            <option value="Email">Email</option>
          </select>
        </label>

        <button
          className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110 md:col-span-2"
          type="submit"
        >
          Save Alert
        </button>
      </form>
    </section>
  )
}
