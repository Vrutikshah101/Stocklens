import { NextResponse } from 'next/server'

import { withApiTiming } from '@/lib/observability/api'
import { evaluateActiveAlerts } from '@/lib/services/server/alertEvaluationService'
import { validateCronRequest } from '@/lib/services/server/cronAuth'

export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  return withApiTiming('CRON /api/cron/evaluate-alerts', async () => {
    const unauthorized = validateCronRequest(request)

    if (unauthorized) {
      return unauthorized
    }

    const result = await evaluateActiveAlerts()

    return NextResponse.json({
      ok: true,
      ...result,
    })
  })
}

export async function GET(request: Request) {
  return handler(request)
}

export async function POST(request: Request) {
  return handler(request)
}
