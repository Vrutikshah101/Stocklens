import { NextResponse } from 'next/server'

import { hasDatabaseUrl } from '@/lib/db/adapter'
import { prisma } from '@/lib/db/prisma'
import { getInitialPortfolioTransactions, getPortfolioOptions } from '@/lib/services/portfolioService'
import { DEMO_USER_ID } from '@/lib/services/server/mappers'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      portfolios: getPortfolioOptions(),
      transactions: getInitialPortfolioTransactions(),
    })
  }

  try {
    const accounts = await prisma.portfolioAccount.findMany({
      include: {
        transactions: {
          orderBy: { tradeDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
      where: {
        deletedAt: null,
        userId: DEMO_USER_ID,
      },
    })

    if (!accounts.length) {
      return NextResponse.json({
        portfolios: getPortfolioOptions(),
        transactions: getInitialPortfolioTransactions(),
      })
    }

    const selected = accounts[0]

    return NextResponse.json({
      portfolios: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        strategy: account.strategy ?? 'Custom strategy',
      })),
      selectedPortfolioId: selected.id,
      transactions: selected.transactions.map((transaction) => ({
        date: transaction.tradeDate.toISOString().slice(0, 10),
        id: transaction.id,
        price: Number(transaction.price),
        quantity: Number(transaction.quantity),
        ticker: transaction.ticker,
        type: transaction.type === 'SELL' ? 'SELL' : 'BUY',
      })),
    })
  } catch {
    return NextResponse.json({
      portfolios: getPortfolioOptions(),
      transactions: getInitialPortfolioTransactions(),
    })
  }
}
