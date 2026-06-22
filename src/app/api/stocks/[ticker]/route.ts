import { NextResponse } from 'next/server'

import { withApiTiming } from '@/lib/observability/api'
import { getStockDetailFromDb } from '@/lib/services/server/stockDbService'

export const dynamic = 'force-dynamic'

interface StockRouteContext {
  params: {
    ticker: string
  }
}

export async function GET(_request: Request, { params }: StockRouteContext) {
  return withApiTiming('GET /api/stocks/[ticker]', async () => {
    const step = Math.floor(Date.now() / 5000)
    const detail = await getStockDetailFromDb(params.ticker, step)

    return NextResponse.json(detail)
  })
}
