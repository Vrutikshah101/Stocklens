'use client'

import { useEffect, useState } from 'react'

import { DEMO_ALERTS, getStockDetail } from '@/lib/utils/constants'
import type { AlertRecord } from '@/types/alert'

const STORAGE_KEY = 'stocklens-alerts'

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(DEMO_ALERTS)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setAlerts(JSON.parse(raw) as AlertRecord[])
    }
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) => {
        const detail = getStockDetail(alert.ticker, step)
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
    persist([
      {
        ...alert,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'armed',
      },
      ...alerts,
    ])
  }

  return {
    alerts,
    createAlert,
    toggleAlert: (id: string) =>
      persist(
        alerts.map((alert) =>
          alert.id === id
            ? {
                ...alert,
                active: !alert.active,
                status: alert.active ? 'muted' : 'armed',
              }
            : alert,
        ),
      ),
    removeAlert: (id: string) => persist(alerts.filter((alert) => alert.id !== id)),
  }
}
