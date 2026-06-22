'use client'

import { useEffect, useMemo, useState } from 'react'

import { fetchJson, sendJson } from '@/lib/services/clientApi'
import { getScreenerTemplateCatalog, runScreenerQuery } from '@/lib/services/screenerService'
import { useScreenerStore } from '@/store/screenerStore'
import type { ScreenerFilter } from '@/types/screener'

export function useScreener() {
  const store = useScreenerStore()
  const [step, setStep] = useState(0)
  const [remoteTemplates, setRemoteTemplates] = useState<ReturnType<typeof getScreenerTemplateCatalog> | null>(null)
  const [remoteResults, setRemoteResults] = useState<ReturnType<typeof runScreenerQuery> | null>(null)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchJson<ReturnType<typeof getScreenerTemplateCatalog>>('/api/screener/templates', controller.signal)
      .then(setRemoteTemplates)
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  useEffect(() => {
    let active = true

    sendJson<ReturnType<typeof runScreenerQuery>>('/api/screener/query', {
      body: JSON.stringify({ filters: store.filters }),
      method: 'POST',
    })
      .then((rows) => {
        if (active) setRemoteResults(rows)
      })
      .catch(() => {
        if (active) setRemoteResults(null)
      })

    return () => {
      active = false
    }
  }, [store.filters, step])

  const templates = remoteTemplates ?? getScreenerTemplateCatalog()
  const fallbackResults = useMemo(() => runScreenerQuery(step, store.filters), [step, store.filters])
  const results = remoteResults ?? fallbackResults

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
