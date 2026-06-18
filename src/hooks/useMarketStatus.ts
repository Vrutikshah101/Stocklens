'use client'

import { useEffect, useMemo, useState } from 'react'

function getIndiaNow() {
  const now = new Date()
  return new Date(
    now.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    }),
  )
}

function computeMarketState() {
  const now = getIndiaNow()
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const isWeekday = day >= 1 && day <= 5
  const isOpen = isWeekday && minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30

  return {
    isOpen,
    label: isOpen ? 'Market Open' : 'Market Closed',
    hint: isOpen ? 'Live simulated prices are ticking' : 'Using the latest demo close and overnight prep',
  }
}

const DEFAULT_MARKET_STATE = {
  isOpen: false,
  label: 'Market Closed',
  hint: 'Using the latest demo close and overnight prep',
}

export function useMarketStatus() {
  const [state, setState] = useState(DEFAULT_MARKET_STATE)

  useEffect(() => {
    setState(computeMarketState())
    const timer = window.setInterval(() => {
      setState(computeMarketState())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  return useMemo(() => state, [state])
}
