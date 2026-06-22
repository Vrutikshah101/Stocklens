import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'
import { DEMO_USER_ID, transactionTypeToPrisma } from '@/lib/services/server/mappers'
import type { PortfolioTransaction } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const payload = await request.json() as Omit<PortfolioTransaction, 'id'>
  const account = await prisma.portfolioAccount.findFirst({
    where: {
      deletedAt: null,
      userId: DEMO_USER_ID,
    },
  })

  if (!account) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
  }

  const transaction = await prisma.portfolioTransaction.create({
    data: {
      portfolioId: account.id,
      price: payload.price,
      quantity: payload.quantity,
      ticker: payload.ticker.toUpperCase(),
      tradeDate: new Date(payload.date),
      type: transactionTypeToPrisma(payload.type),
    },
  })

  return NextResponse.json({
    date: transaction.tradeDate.toISOString().slice(0, 10),
    id: transaction.id,
    price: Number(transaction.price),
    quantity: Number(transaction.quantity),
    ticker: transaction.ticker,
    type: transaction.type === 'SELL' ? 'SELL' : 'BUY',
  })
}
