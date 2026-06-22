import { CorporateEventImpact, Exchange } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import { resolveMarketDataProvider } from '@/lib/providers/marketData/providerRegistry'

const eventImpactMap = {
  negative: CorporateEventImpact.NEGATIVE,
  neutral: CorporateEventImpact.NEUTRAL,
  positive: CorporateEventImpact.POSITIVE,
} as const

function toExchange(value: string) {
  return value === 'BSE' ? Exchange.BSE : Exchange.NSE
}

export async function refreshMarketCache(step = 0) {
  const provider = resolveMarketDataProvider()
  const tickers = await provider.getSupportedTickers()
  const counts = {
    dvmScores: 0,
    events: 0,
    financials: 0,
    news: 0,
    prices: 0,
    stocks: 0,
  }

  for (const ticker of tickers) {
    const detail = await provider.getStockDetail(ticker, step)
    const exchange = toExchange(detail.info.exchange)
    const stock = await prisma.stock.upsert({
      create: {
        description: detail.info.description,
        exchange,
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
          exchange,
          ticker: detail.info.ticker,
        },
      },
    })

    await prisma.$transaction([
      prisma.stockPrice.deleteMany({ where: { stockId: stock.id } }),
      prisma.stockFinancial.deleteMany({ where: { stockId: stock.id } }),
      prisma.stockEvent.deleteMany({ where: { stockId: stock.id } }),
      prisma.newsItem.deleteMany({ where: { stockId: stock.id } }),
      prisma.dvmScore.deleteMany({ where: { stockId: stock.id } }),
    ])

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

    if (detail.financials.length > 0) {
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
    }

    if (detail.events.length > 0) {
      await prisma.stockEvent.createMany({
        data: detail.events.map((event) => ({
          eventDate: new Date(event.date),
          impact: eventImpactMap[event.impact],
          stockId: stock.id,
          title: event.title,
          type: event.type,
        })),
      })
    }

    if (detail.news.length > 0) {
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

    counts.dvmScores += 1
    counts.events += detail.events.length
    counts.financials += detail.financials.length
    counts.news += detail.news.length
    counts.prices += 1
    counts.stocks += 1
  }

  return {
    counts,
    provider: provider.name,
    refreshedAt: new Date().toISOString(),
  }
}
