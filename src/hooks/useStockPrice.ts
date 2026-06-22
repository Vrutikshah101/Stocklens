'use client'

import { useEffect, useMemo, useState } from 'react'

import { getStockLivePrice } from '@/lib/services/stockService'

export function useStockPrice(ticker: string) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const price = useMemo(() => getStockLivePrice(ticker, step), [step, ticker])

  return {
    price,
    step,
    isPositive: price.change >= 0,
  }
}
