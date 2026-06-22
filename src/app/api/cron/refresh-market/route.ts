import { NextResponse } from 'next/server'

import { withApiTiming } from '@/lib/observability/api'
import { validateCronRequest } from '@/lib/services/server/cronAuth'
import { refreshMarketCache } from '@/lib/services/server/marketRefreshService'

export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  return withApiTiming('CRON /api/cron/refresh-market', async () => {
    const unauthorized = validateCronRequest(request)

    if (unauthorized) {
      return unauthorized
    }

    const result = await refreshMarketCache()

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
