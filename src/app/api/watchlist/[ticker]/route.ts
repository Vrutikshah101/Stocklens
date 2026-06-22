import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'
import { DEMO_USER_ID } from '@/lib/services/server/mappers'

export const dynamic = 'force-dynamic'

interface WatchlistItemContext {
  params: {
    ticker: string
  }
}

export async function DELETE(_request: Request, { params }: WatchlistItemContext) {
  const ticker = params.ticker.toUpperCase()
  const watchlist = await prisma.watchlist.findFirst({
    where: {
      deletedAt: null,
      userId: DEMO_USER_ID,
    },
  })

  if (!watchlist) {
    return NextResponse.json({ ok: true })
  }

  await prisma.watchlistItem.deleteMany({
    where: {
      ticker,
      watchlistId: watchlist.id,
    },
  })

  return NextResponse.json({ ok: true })
}
