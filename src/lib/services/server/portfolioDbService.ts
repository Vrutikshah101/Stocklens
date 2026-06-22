import { prisma } from '@/lib/db/prisma'
import { hasDatabaseUrl } from '@/lib/db/adapter'
import { getInitialPortfolioTransactions, getPortfolioOptions } from '@/lib/services/portfolioService'

export async function getPortfolioOptionsFromDb(userId: string) {
  if (!hasDatabaseUrl()) {
    return getPortfolioOptions()
  }

  try {
    const accounts = await prisma.portfolioAccount.findMany({
      orderBy: { createdAt: 'asc' },
      where: { deletedAt: null, userId },
    })

    if (!accounts.length) {
      return getPortfolioOptions()
    }

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      strategy: account.strategy ?? 'Custom strategy',
    }))
  } catch {
    return getPortfolioOptions()
  }
}

export async function getPortfolioTransactionsFromDb(portfolioId?: string) {
  if (!hasDatabaseUrl()) {
    return getInitialPortfolioTransactions()
  }

  try {
    if (!portfolioId) {
      return getInitialPortfolioTransactions()
    }

    const transactions = await prisma.portfolioTransaction.findMany({
      orderBy: { tradeDate: 'desc' },
      where: { portfolioId },
    })

    if (!transactions.length) {
      return getInitialPortfolioTransactions()
    }

    return transactions.map((transaction) => ({
      date: transaction.tradeDate.toISOString(),
      id: transaction.id,
      price: Number(transaction.price),
      quantity: Number(transaction.quantity),
      ticker: transaction.ticker,
      type: transaction.type === 'SELL' ? 'SELL' as const : 'BUY' as const,
    }))
  } catch {
    return getInitialPortfolioTransactions()
  }
}
