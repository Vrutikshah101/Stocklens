import 'dotenv/config'
import { config as loadEnv } from 'dotenv'

import {
  AlertChannel,
  AlertMetric,
  AlertStatus,
  CorporateEventImpact,
  Prisma,
  Exchange,
  PrismaClient,
  TransactionType,
  UserPlan,
} from '@prisma/client'

import {
  DEMO_ALERTS,
  DEMO_TRANSACTIONS,
  DEMO_USER,
  DEMO_WATCHLIST,
  getPortfolioNames,
  getScreenerResults,
  getScreenerTemplates,
  getStockDetail,
  getUniverseTickers,
} from '../src/lib/utils/constants'
import { createPrismaPgAdapter } from '../src/lib/db/adapter'

loadEnv({ path: '.env.local', override: true })

const prisma = new PrismaClient({
  adapter: createPrismaPgAdapter(),
})
const seedStep = 0

const alertMetricMap: Record<(typeof DEMO_ALERTS)[number]['metric'], AlertMetric> = {
  dvmAbove: AlertMetric.DVM_ABOVE,
  earningsDate: AlertMetric.EARNINGS_DATE,
  priceAbove: AlertMetric.PRICE_ABOVE,
  priceBelow: AlertMetric.PRICE_BELOW,
  ratingChange: AlertMetric.RATING_CHANGE,
  volumeSpike: AlertMetric.VOLUME_SPIKE,
}

const alertStatusMap: Record<(typeof DEMO_ALERTS)[number]['status'], AlertStatus> = {
  armed: AlertStatus.ARMED,
  muted: AlertStatus.MUTED,
  triggered: AlertStatus.TRIGGERED,
}

const eventImpactMap = {
  negative: CorporateEventImpact.NEGATIVE,
  neutral: CorporateEventImpact.NEUTRAL,
  positive: CorporateEventImpact.POSITIVE,
} as const

function toExchange(value: string) {
  return value === 'BSE' ? Exchange.BSE : Exchange.NSE
}

async function seedUser() {
  return prisma.user.upsert({
    create: {
      avatarInitials: DEMO_USER.avatarInitials,
      email: DEMO_USER.email,
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      plan: UserPlan.PRO,
      preferences: {
        notifications: DEMO_USER.notifications,
      },
    },
    update: {
      avatarInitials: DEMO_USER.avatarInitials,
      name: DEMO_USER.name,
      plan: UserPlan.PRO,
      preferences: {
        notifications: DEMO_USER.notifications,
      },
    },
    where: {
      email: DEMO_USER.email,
    },
  })
}

async function seedStocks() {
  const tickers = getUniverseTickers()

  for (const ticker of tickers) {
    const detail = getStockDetail(ticker, seedStep)
    const stock = await prisma.stock.upsert({
      create: {
        description: detail.info.description,
        exchange: toExchange(detail.info.exchange),
        industry: detail.info.industry,
        name: detail.info.name,
        sector: detail.info.sector,
        ticker: detail.info.ticker,
      },
      update: {
        description: detail.info.description,
        industry: detail.info.industry,
        name: detail.info.name,
        sector: detail.info.sector,
      },
      where: {
        ticker_exchange: {
          exchange: toExchange(detail.info.exchange),
          ticker: detail.info.ticker,
        },
      },
    })

    await prisma.stockPrice.deleteMany({ where: { stockId: stock.id } })
    await prisma.stockFinancial.deleteMany({ where: { stockId: stock.id } })
    await prisma.stockEvent.deleteMany({ where: { stockId: stock.id } })
    await prisma.newsItem.deleteMany({ where: { stockId: stock.id } })
    await prisma.dvmScore.deleteMany({ where: { stockId: stock.id } })

    await prisma.stockPrice.create({
      data: {
        capturedAt: new Date(detail.price.updatedAt),
        change: detail.price.change,
        changePct: detail.price.changePct,
        current: detail.price.current,
        high: detail.price.high,
        low: detail.price.low,
        open: detail.price.open,
        previousClose: detail.price.previousClose,
        stockId: stock.id,
        volume: BigInt(detail.price.volume),
      },
    })

    await prisma.dvmScore.create({
      data: {
        composite: detail.dvm.composite,
        durability: detail.dvm.durability,
        label: detail.dvm.label,
        momentum: detail.dvm.momentum,
        stockId: stock.id,
        tone: detail.dvm.tone,
        valuation: detail.dvm.valuation,
      },
    })

    await prisma.stockFinancial.createMany({
      data: detail.financials.map((financial) => ({
        debtToEquity: financial.debtToEquity,
        ebitda: financial.ebitda,
        eps: financial.eps,
        freeCashFlow: financial.freeCashFlow,
        netProfit: financial.netProfit,
        period: financial.period,
        revenue: financial.revenue,
        roe: financial.roe,
        stockId: stock.id,
      })),
    })

    await prisma.stockEvent.createMany({
      data: detail.events.map((event) => ({
        eventDate: new Date(event.date),
        impact: eventImpactMap[event.impact],
        stockId: stock.id,
        title: event.title,
        type: event.type,
      })),
    })

    await prisma.newsItem.createMany({
      data: detail.news.map((item) => ({
        category: item.category,
        headline: item.headline,
        publishedAt: new Date(item.publishedAt),
        source: item.source,
        stockId: stock.id,
        summary: item.summary,
      })),
    })
  }
}

async function seedScreeners(userId: string) {
  await prisma.screener.deleteMany({ where: { userId } })

  const templates = getScreenerTemplates()
  const resultCount = getScreenerResults(seedStep, []).length

  await prisma.screener.createMany({
    data: templates.map((template) => ({
      description: template.description,
      filters: template.filters as unknown as Prisma.InputJsonValue,
      lastResultCount: resultCount,
      name: template.name,
      userId,
    })),
  })
}

async function seedWatchlist(userId: string) {
  await prisma.watchlist.deleteMany({ where: { userId } })

  await prisma.watchlist.create({
    data: {
      items: {
        create: DEMO_WATCHLIST.map((ticker) => ({
          exchange: Exchange.NSE,
          ticker,
        })),
      },
      name: 'Core Watchlist',
      userId,
    },
  })
}

async function seedPortfolio(userId: string) {
  await prisma.portfolioAccount.deleteMany({ where: { userId } })

  const portfolioOption = getPortfolioNames()[0]
  const account = await prisma.portfolioAccount.create({
    data: {
      name: portfolioOption.name,
      strategy: portfolioOption.strategy,
      userId,
    },
  })

  await prisma.portfolioTransaction.createMany({
    data: DEMO_TRANSACTIONS.map((transaction) => ({
      exchange: Exchange.NSE,
      portfolioId: account.id,
      price: transaction.price,
      quantity: transaction.quantity,
      ticker: transaction.ticker,
      tradeDate: new Date(transaction.date),
      type: TransactionType[transaction.type],
    })),
  })

  const nav = DEMO_TRANSACTIONS.reduce((total, transaction) => {
    const detail = getStockDetail(transaction.ticker, seedStep)
    return total + detail.price.current * transaction.quantity
  }, 0)
  const invested = DEMO_TRANSACTIONS.reduce(
    (total, transaction) => total + transaction.price * transaction.quantity,
    0,
  )
  const totalPnl = nav - invested

  await prisma.portfolioSnapshot.create({
    data: {
      capturedAt: new Date(),
      dayChange: 0,
      invested,
      nav,
      portfolioId: account.id,
      totalPnl,
      totalPnlPct: invested > 0 ? (totalPnl / invested) * 100 : 0,
      xirr: 18.7,
    },
  })
}

async function seedAlerts(userId: string) {
  await prisma.alert.deleteMany({ where: { userId } })

  await prisma.alert.createMany({
    data: DEMO_ALERTS.map((alert) => ({
      active: alert.active,
      channels: [alert.channel === 'Email' ? AlertChannel.EMAIL : AlertChannel.WEB],
      createdAt: new Date(alert.createdAt),
      exchange: Exchange.NSE,
      lastTriggeredAt: alert.lastTriggeredAt ? new Date(alert.lastTriggeredAt) : null,
      metric: alertMetricMap[alert.metric],
      status: alertStatusMap[alert.status],
      threshold: alert.threshold,
      ticker: alert.ticker,
      title: alert.title,
      userId,
    })),
  })
}

async function main() {
  const user = await seedUser()
  await seedStocks()
  await seedScreeners(user.id)
  await seedWatchlist(user.id)
  await seedPortfolio(user.id)
  await seedAlerts(user.id)

  const [stocks, screeners, watchlists, portfolios, alerts] = await Promise.all([
    prisma.stock.count(),
    prisma.screener.count(),
    prisma.watchlist.count(),
    prisma.portfolioAccount.count(),
    prisma.alert.count(),
  ])

  console.log(
    `Seeded StockLens database: ${stocks} stocks, ${screeners} screeners, ${watchlists} watchlist, ${portfolios} portfolio, ${alerts} alerts.`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
