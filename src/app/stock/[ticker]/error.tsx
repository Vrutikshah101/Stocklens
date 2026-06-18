'use client'

import Link from 'next/link'

import { RefreshCcw, TriangleAlert } from 'lucide-react'

interface StockErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: StockErrorPageProps) {
  const detail =
    error.message && error.message !== 'NEXT_NOT_FOUND'
      ? error.message
      : 'The stock detail screen hit an unexpected issue while loading the demo analysis.'

  return (
    <div className="text-primary">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-lg border border-[color:var(--color-red-soft)] bg-surface p-5">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-[color:var(--color-red-soft)] text-loss">
            <TriangleAlert className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold text-primary">
            Unable to load this stock view
          </h1>
          <p className="mt-3 text-sm leading-6 text-secondary">{detail}</p>
          <p className="mt-4 rounded-md border border-border bg-base/70 p-4 text-sm text-secondary">
            Try refreshing the slice or jump back into the demo universe while
            the rest of the prototype keeps loading.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
              onClick={reset}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry slice
            </button>
            <Link
              className="inline-flex items-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-primary transition hover:border-accent hover:bg-base"
              href="/stock/RELIANCE"
            >
              Open demo coverage
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
