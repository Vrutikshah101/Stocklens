'use client'

import { useEffect, useMemo, useState } from 'react'

import { fetchJson } from '@/lib/services/clientApi'
import { getMarketOverview, type MarketOverview } from '@/lib/services/marketService'

export function useMarketOverview() {
  const [step, setStep] = useState(0)
  const [remoteData, setRemoteData] = useState<MarketOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchJson<MarketOverview>('/api/market/overview', controller.signal)
      .then((overview) => {
        setRemoteData(overview)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setError(requestError instanceof Error ? requestError.message : 'Unable to load market overview')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [step])

  const fallbackData = useMemo(() => getMarketOverview(step), [step])

  return {
    data: remoteData ?? fallbackData,
    error,
    isLoading,
    source: remoteData ? 'database' as const : 'sample' as const,
    step,
  }
}
