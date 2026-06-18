'use client'

import { useEffect, useMemo, useState } from 'react'

import { getScreenerResults, getScreenerTemplates } from '@/lib/utils/constants'
import { useScreenerStore } from '@/store/screenerStore'
import type { ScreenerFilter } from '@/types/screener'

export function useScreener() {
  const store = useScreenerStore()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const templates = useMemo(() => getScreenerTemplates(), [])
  const results = useMemo(() => getScreenerResults(step, store.filters), [step, store.filters])

  const createFilter = (): ScreenerFilter => ({
    id: `filter-${Date.now()}`,
    field: 'dvm',
    operator: '>=',
    value: 70,
  })

  return {
    ...store,
    results,
    templates,
    resultCount: results.length,
    createFilter,
  }
}
