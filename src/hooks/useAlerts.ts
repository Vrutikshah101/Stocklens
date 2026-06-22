'use client'

import { useEffect, useState } from 'react'

import { fetchJson, sendJson } from '@/lib/services/clientApi'
import { getInitialAlerts } from '@/lib/services/alertService'
import { getStockDetailByTicker } from '@/lib/services/stockService'
import type { AlertRecord } from '@/types/alert'

const STORAGE_KEY = 'stocklens-alerts'

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(getInitialAlerts)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setAlerts(JSON.parse(raw) as AlertRecord[])
    }

    const controller = new AbortController()
    fetchJson<{ alerts: AlertRecord[] }>('/api/alerts', controller.signal)
      .then((payload) => {
        setAlerts(payload.alerts)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.alerts))
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

  useEffect(() => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) => {
        const detail = getStockDetailByTicker(alert.ticker, step)
        let triggered = false

        if (alert.metric === 'priceAbove') {
          triggered = detail.price.current >= alert.threshold
        } else if (alert.metric === 'priceBelow') {
          triggered = detail.price.current <= alert.threshold
        } else if (alert.metric === 'dvmAbove') {
          triggered = detail.dvm.composite >= alert.threshold
        } else if (alert.metric === 'volumeSpike') {
          triggered = detail.price.volume >= alert.threshold
        } else if (alert.metric === 'earningsDate') {
          triggered = detail.events.some((event) => event.type === 'Results')
        } else {
          triggered = detail.info.analystConsensus === 'Buy'
        }

        if (!triggered || !alert.active || alert.status === 'triggered') {
          return alert
        }

        return {
          ...alert,
          status: 'triggered' as const,
          lastTriggeredAt: new Date().toISOString(),
        }
      }),
    )
  }, [step])

  const persist = (nextAlerts: AlertRecord[]) => {
    setAlerts(nextAlerts)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAlerts))
  }

  const createAlert = (alert: Omit<AlertRecord, 'id' | 'createdAt' | 'status'>) => {
    const optimisticAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'armed' as const,
    }

    persist([
      optimisticAlert,
      ...alerts,
    ])

    sendJson<AlertRecord>('/api/alerts', {
      body: JSON.stringify(alert),
      method: 'POST',
    })
      .then((createdAlert) =>
        persist([
          createdAlert,
          ...alerts,
        ]),
      )
      .catch(() => undefined)
  }

  return {
    alerts,
    createAlert,
    toggleAlert: (id: string) => {
      const currentAlert = alerts.find((alert) => alert.id === id)
      const nextAlerts = alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              active: !alert.active,
              status: alert.active ? 'muted' as const : 'armed' as const,
            }
          : alert,
      )
      persist(nextAlerts)

      if (currentAlert) {
        sendJson<AlertRecord>(`/api/alerts/${encodeURIComponent(id)}`, {
          body: JSON.stringify({
            active: !currentAlert.active,
            status: currentAlert.active ? 'muted' : 'armed',
          }),
          method: 'PATCH',
        }).catch(() => undefined)
      }
    },
    removeAlert: (id: string) => {
      persist(alerts.filter((alert) => alert.id !== id))
      sendJson<{ ok: boolean }>(`/api/alerts/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch(() => undefined)
    },
  }
}
