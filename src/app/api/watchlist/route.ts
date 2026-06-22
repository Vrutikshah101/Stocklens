import { NextResponse } from 'next/server'

import { hasDatabaseUrl } from '@/lib/db/adapter'
import { prisma } from '@/lib/db/prisma'
import { getInitialWatchlistTickers } from '@/lib/services/watchlistService'
import { DEMO_USER_ID } from '@/lib/services/server/mappers'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ tickers: getInitialWatchlistTickers() })
  }

  try {
    const watchlist = await prisma.watchlist.findFirst({
      include: {
        items: {
          orderBy: { addedAt: 'desc' },
        },
      },
      where: {
        deletedAt: null,
        userId: DEMO_USER_ID,
      },
    })

    return NextResponse.json({
      tickers: watchlist?.items.map((item) => item.ticker) ?? getInitialWatchlistTickers(),
    })
  } catch {
    return NextResponse.json({ tickers: getInitialWatchlistTickers() })
  }
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured for watchlist writes' },
      { status: 503 },
    )
  }

  const body = await request.json() as { ticker?: string }
  const ticker = body.ticker?.toUpperCase()

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 })
  }

  const watchlist = await prisma.watchlist.findFirst({
    where: {
      deletedAt: null,
      userId: DEMO_USER_ID,
    },
  })

  if (!watchlist) {
    return NextResponse.json({ error: 'Watchlist not found' }, { status: 404 })
  }

  await prisma.watchlistItem.upsert({
    create: {
      ticker,
      watchlistId: watchlist.id,
    },
    update: {},
    where: {
      watchlistId_ticker_exchange: {
        exchange: 'NSE',
        ticker,
        watchlistId: watchlist.id,
      },
    },
  })

  return GET()
}
