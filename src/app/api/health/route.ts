import { NextResponse } from 'next/server'

import { getSystemHealth } from '@/lib/observability/health'
import { withApiTiming } from '@/lib/observability/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  return withApiTiming('GET /api/health', async () => {
    const health = await getSystemHealth()

    return NextResponse.json(health, {
      status: health.ok ? 200 : 503,
    })
  })
}
