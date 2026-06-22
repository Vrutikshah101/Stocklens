'use client'

import { useEffect, useMemo, useState } from 'react'

import { fetchJson } from '@/lib/services/clientApi'
import { getStockDetailByTicker } from '@/lib/services/stockService'
import type { StockDetail } from '@/types/stock'

export function useStockData(ticker: string) {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [remoteData, setRemoteData] = useState<StockDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const readyTimer = window.setTimeout(() => setIsLoading(false), 450)
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => {
      window.clearTimeout(readyTimer)
      window.clearInterval(timer)
    }
  }, [ticker])

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    fetchJson<StockDetail>(`/api/stocks/${encodeURIComponent(ticker)}`, controller.signal)
      .then((detail) => {
        setRemoteData(detail)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setRemoteData(null)
        setError(requestError instanceof Error ? requestError.message : 'Unable to load stock detail')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [ticker, step])

  const fallbackData = useMemo(() => getStockDetailByTicker(ticker, step), [step, ticker])
  const data = remoteData ?? fallbackData

  return {
    data,
    isLoading,
    error,
    source: remoteData ? 'database' as const : 'sample' as const,
  }
}
