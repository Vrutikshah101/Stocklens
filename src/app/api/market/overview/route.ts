import { NextResponse } from 'next/server'

import { withApiTiming } from '@/lib/observability/api'
import { getMarketOverviewFromDb } from '@/lib/services/server/marketDbService'

export const dynamic = 'force-dynamic'

export async function GET() {
  return withApiTiming('GET /api/market/overview', async () => {
    const step = Math.floor(Date.now() / 5000)
    const overview = await getMarketOverviewFromDb(step)

    return NextResponse.json(overview)
  })
}
