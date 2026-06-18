'use client'

import { useEffect, useMemo, useState } from 'react'

import { DEMO_WATCHLIST, getStockDetail } from '@/lib/utils/constants'

const STORAGE_KEY = 'stocklens-watchlist'

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(DEMO_WATCHLIST)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setTickers(JSON.parse(raw) as string[])
    }
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  const persist = (nextTickers: string[]) => {
    setTickers(nextTickers)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTickers))
  }

  const rows = useMemo(
    () =>
      tickers.map((ticker) => {
        const detail = getStockDetail(ticker, step)
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
    addTicker: (ticker: string) => persist(Array.from(new Set([ticker, ...tickers]))),
    removeTicker: (ticker: string) => persist(tickers.filter((item) => item !== ticker)),
    toggleTicker: (ticker: string) =>
      persist(tickers.includes(ticker) ? tickers.filter((item) => item !== ticker) : [ticker, ...tickers]),
  }
}

