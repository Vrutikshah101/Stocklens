'use client'

import { useEffect, useMemo, useState } from 'react'

import { getStockDetail } from '@/lib/utils/constants'

export function useStockData(ticker: string) {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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

  const data = useMemo(() => getStockDetail(ticker, step), [step, ticker])

  return {
    data,
    isLoading,
    error: null as string | null,
  }
}

