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
    <main className="min-h-screen bg-base px-4 py-8 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[color:var(--color-red-soft)] bg-surface/95 p-8 shadow-panel">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-red-soft)] text-loss">
            <TriangleAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
            Unable to load this stock view
          </h1>
          <p className="mt-3 text-sm leading-6 text-secondary">{detail}</p>
          <p className="mt-4 rounded-2xl border border-border bg-base/70 p-4 text-sm text-secondary">
            Try refreshing the slice or jump back into the demo universe while
            the rest of the prototype keeps loading.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
              onClick={reset}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry slice
            </button>
            <Link
              className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-primary transition hover:border-accent hover:bg-base"
              href="/stock/RELIANCE"
            >
              Open demo coverage
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
