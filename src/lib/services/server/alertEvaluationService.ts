import { AlertMetric, AlertStatus } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import { getStockDetailFromDb } from '@/lib/services/server/stockDbService'
import type { StockDetail } from '@/types/stock'

type TriggerResult = {
  currentValue: number | string
  triggered: boolean
}

function evaluateAlert(metric: AlertMetric, threshold: number, detail: StockDetail): TriggerResult {
  switch (metric) {
    case AlertMetric.PRICE_ABOVE:
      return {
        currentValue: detail.price.current,
        triggered: detail.price.current >= threshold,
      }
    case AlertMetric.PRICE_BELOW:
      return {
        currentValue: detail.price.current,
        triggered: detail.price.current <= threshold,
      }
    case AlertMetric.DVM_ABOVE:
      return {
        currentValue: detail.dvm.composite,
        triggered: detail.dvm.composite >= threshold,
      }
    case AlertMetric.VOLUME_SPIKE:
      return {
        currentValue: detail.price.volume,
        triggered: detail.price.volume >= threshold,
      }
    case AlertMetric.RATING_CHANGE:
      return {
        currentValue: detail.info.analystConsensus,
        triggered: detail.info.analystConsensus === 'Buy',
      }
    case AlertMetric.EARNINGS_DATE:
      return {
        currentValue: detail.events[0]?.title ?? 'No upcoming event',
        triggered: detail.events.some((event) => event.type.toLowerCase().includes('result')),
      }
  }
}

export async function evaluateActiveAlerts(step = 0) {
  const alerts = await prisma.alert.findMany({
    where: {
      active: true,
      status: AlertStatus.ARMED,
    },
  })
  const triggeredAlerts: string[] = []

  for (const alert of alerts) {
    const detail = await getStockDetailFromDb(alert.ticker, step)
    const result = evaluateAlert(alert.metric, Number(alert.threshold), detail)

    if (!result.triggered) {
      continue
    }

    await prisma.$transaction([
      prisma.alert.update({
        data: {
          lastTriggeredAt: new Date(),
          status: AlertStatus.TRIGGERED,
        },
        where: { id: alert.id },
      }),
      prisma.alertEvent.create({
        data: {
          alertId: alert.id,
          payload: {
            currentValue: result.currentValue,
            metric: alert.metric,
            threshold: Number(alert.threshold),
            ticker: alert.ticker,
          },
          userId: alert.userId,
        },
      }),
    ])

    triggeredAlerts.push(alert.id)
  }

  return {
    evaluated: alerts.length,
    triggered: triggeredAlerts.length,
    triggeredAlerts,
    evaluatedAt: new Date().toISOString(),
  }
}
