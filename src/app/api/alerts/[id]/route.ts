import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'
import {
  alertChannelFromPrisma,
  alertMetricFromPrisma,
  alertStatusFromPrisma,
  alertStatusToPrisma,
} from '@/lib/services/server/mappers'
import type { AlertRecord } from '@/types/alert'

export const dynamic = 'force-dynamic'

interface AlertContext {
  params: {
    id: string
  }
}

function toAlertRecord(alert: Awaited<ReturnType<typeof prisma.alert.update>>): AlertRecord {
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

export async function PATCH(request: Request, { params }: AlertContext) {
  const payload = await request.json() as Partial<Pick<AlertRecord, 'active' | 'status'>>
  const alert = await prisma.alert.update({
    data: {
      active: payload.active,
      status: payload.status ? alertStatusToPrisma[payload.status] : undefined,
    },
    where: { id: params.id },
  })

  return NextResponse.json(toAlertRecord(alert))
}

export async function DELETE(_request: Request, { params }: AlertContext) {
  await prisma.alert.deleteMany({
    where: { id: params.id },
  })

  return NextResponse.json({ ok: true })
}
