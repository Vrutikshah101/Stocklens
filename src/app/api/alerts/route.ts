import { NextResponse } from 'next/server'

import { hasDatabaseUrl } from '@/lib/db/adapter'
import { prisma } from '@/lib/db/prisma'
import { getInitialAlerts } from '@/lib/services/alertService'
import {
  alertChannelFromPrisma,
  alertChannelToPrisma,
  alertMetricFromPrisma,
  alertMetricToPrisma,
  alertStatusFromPrisma,
  DEMO_USER_ID,
} from '@/lib/services/server/mappers'
import type { AlertRecord } from '@/types/alert'

export const dynamic = 'force-dynamic'

function toAlertRecord(alert: Awaited<ReturnType<typeof prisma.alert.findMany>>[number]): AlertRecord {
  return {
    active: alert.active,
    channel: alertChannelFromPrisma(alert.channels),
    createdAt: alert.createdAt.toISOString(),
    id: alert.id,
    lastTriggeredAt: alert.lastTriggeredAt?.toISOString(),
    metric: alertMetricFromPrisma[alert.metric],
    status: alertStatusFromPrisma[alert.status],
    threshold: Number(alert.threshold),
    ticker: alert.ticker,
    title: alert.title,
  }
}

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ alerts: getInitialAlerts() })
  }

  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      where: { userId: DEMO_USER_ID },
    })

    return NextResponse.json({
      alerts: alerts.length ? alerts.map(toAlertRecord) : getInitialAlerts(),
    })
  } catch {
    return NextResponse.json({ alerts: getInitialAlerts() })
  }
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured for alert writes' },
      { status: 503 },
    )
  }

  const payload = await request.json() as Omit<AlertRecord, 'id' | 'createdAt' | 'status'>
  const alert = await prisma.alert.create({
    data: {
      active: payload.active,
      channels: [alertChannelToPrisma(payload.channel)],
      metric: alertMetricToPrisma[payload.metric],
      threshold: payload.threshold,
      ticker: payload.ticker.toUpperCase(),
      title: payload.title,
      userId: DEMO_USER_ID,
    },
  })

  return NextResponse.json(toAlertRecord(alert))
}
