import { NextResponse } from 'next/server'

import { runScreenerQuery } from '@/lib/services/screenerService'
import type { ScreenerFilter } from '@/types/screener'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ filters: [] }))
  const filters = Array.isArray(body.filters) ? body.filters as ScreenerFilter[] : []
  const step = Math.floor(Date.now() / 5000)

  return NextResponse.json(runScreenerQuery(step, filters))
}
