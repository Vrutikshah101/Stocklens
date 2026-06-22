import { NextResponse } from 'next/server'

import { getMarketDataProviderHealth } from '@/lib/providers/marketData/providerRegistry'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = await getMarketDataProviderHealth()

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
  })
}
