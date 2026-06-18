'use client'

import { useState } from 'react'

interface AddTransactionFormProps {
  defaultTicker: string
  onSubmit: (transaction: {
    ticker: string
    quantity: number
    price: number
    date: string
    type: 'BUY' | 'SELL'
  }) => void
  onTickerChange: (ticker: string) => void
}

export function AddTransactionForm({
  defaultTicker,
  onSubmit,
  onTickerChange,
}: AddTransactionFormProps) {
  const [ticker, setTicker] = useState(defaultTicker)
  const [quantity, setQuantity] = useState(10)
  const [price, setPrice] = useState(1000)
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY')
  const [date, setDate] = useState('2026-06-18')

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-base font-semibold text-primary">Add Transaction</h3>
      <p className="mt-1 text-sm text-secondary">
        Demo transactions update the portfolio model immediately.
      </p>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({ ticker, quantity, price, date, type })
        }}
      >
        <label className="space-y-2 text-xs text-secondary">
          Ticker
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => {
              const nextTicker = event.target.value.toUpperCase()
              setTicker(nextTicker)
              onTickerChange(nextTicker)
            }}
            value={ticker}
          />
        </label>
        <label className="space-y-2 text-xs text-secondary">
          Type
          <select
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setType(event.target.value as 'BUY' | 'SELL')}
            value={type}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
        <label className="space-y-2 text-xs text-secondary">
          Quantity
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            min={1}
            onChange={(event) => setQuantity(Number(event.target.value))}
            type="number"
            value={quantity}
          />
        </label>
        <label className="space-y-2 text-xs text-secondary">
          Price
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            min={1}
            onChange={(event) => setPrice(Number(event.target.value))}
            type="number"
            value={price}
          />
        </label>
        <label className="space-y-2 text-xs text-secondary md:col-span-2">
          Trade Date
          <input
            className="h-9 w-full rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus:border-accent"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
        </label>

        <button
          className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110 md:col-span-2"
          type="submit"
        >
          Add to Portfolio
        </button>
      </form>
    </section>
  )
}
