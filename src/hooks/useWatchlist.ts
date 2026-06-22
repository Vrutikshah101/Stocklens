'use client'

import { useEffect, useMemo, useState } from 'react'

import { fetchJson, sendJson } from '@/lib/services/clientApi'
import { getStockDetailByTicker } from '@/lib/services/stockService'
import { getInitialWatchlistTickers } from '@/lib/services/watchlistService'

const STORAGE_KEY = 'stocklens-watchlist'

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(getInitialWatchlistTickers)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setTickers(JSON.parse(raw) as string[])
    }

    const controller = new AbortController()
    fetchJson<{ tickers: string[] }>('/api/watchlist', controller.signal)
      .then((payload) => {
        setTickers(payload.tickers)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.tickers))
      })
      .catch(() => undefined)

    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [])

  const persist = (nextTickers: string[]) => {
    setTickers(nextTickers)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTickers))
  }

  const rows = useMemo(
    () =>
      tickers.map((ticker) => {
        const detail = getStockDetailByTicker(ticker, step)
        return {
          ticker,
          name: detail.info.name,
          sector: detail.info.sector,
          price: detail.price.current,
          changePct: detail.price.changePct,
          dvm: detail.dvm.composite,
          analystConsensus: detail.info.analystConsensus,
        }
      }),
    [step, tickers],
  )

  return {
    rows,
    addTicker: (ticker: string) => {
      const nextTicker = ticker.toUpperCase()
      persist(Array.from(new Set([nextTicker, ...tickers])))
      sendJson<{ tickers: string[] }>('/api/watchlist', {
        body: JSON.stringify({ ticker: nextTicker }),
        method: 'POST',
      })
        .then((payload) => persist(payload.tickers))
        .catch(() => undefined)
    },
    removeTicker: (ticker: string) => {
      persist(tickers.filter((item) => item !== ticker))
      sendJson<{ ok: boolean }>(`/api/watchlist/${encodeURIComponent(ticker)}`, {
        method: 'DELETE',
      }).catch(() => undefined)
    },
    toggleTicker: (ticker: string) =>
      persist(tickers.includes(ticker) ? tickers.filter((item) => item !== ticker) : [ticker, ...tickers]),
  }
}
