import { prisma } from '@/lib/db/prisma'
import { hasDatabaseUrl } from '@/lib/db/adapter'
import { getStockDetailByTicker } from '@/lib/services/stockService'
import type { StockDetail } from '@/types/stock'

export async function getStockDetailFromDb(ticker: string, step: number): Promise<StockDetail> {
  if (!hasDatabaseUrl()) {
    return getStockDetailByTicker(ticker, step)
  }

  try {
    const stock = await prisma.stock.findUnique({
      include: {
        dvmScores: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
        events: {
          orderBy: { eventDate: 'asc' },
        },
        financials: {
          orderBy: { period: 'asc' },
        },
        newsItems: {
          orderBy: { publishedAt: 'desc' },
        },
        prices: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
      },
      where: {
        ticker_exchange: {
          exchange: 'NSE',
          ticker: ticker.toUpperCase(),
        },
      },
    })

    if (!stock) {
      return getStockDetailByTicker(ticker, step)
    }

    const fallback = getStockDetailByTicker(stock.ticker, step)
    const price = stock.prices[0]
    const dvm = stock.dvmScores[0]

    return {
      ...fallback,
      dvm: dvm
        ? {
            composite: dvm.composite,
            durability: dvm.durability,
            label: dvm.label as StockDetail['dvm']['label'],
            momentum: dvm.momentum,
            tone: dvm.tone as StockDetail['dvm']['tone'],
            valuation: dvm.valuation,
          }
        : fallback.dvm,
      events: stock.events.map((event) => ({
        date: event.eventDate.toISOString(),
        impact: event.impact.toLowerCase() as StockDetail['events'][number]['impact'],
        title: event.title,
        type: event.type,
      })),
      financials: stock.financials.map((financial) => ({
        debtToEquity: Number(financial.debtToEquity),
        ebitda: Number(financial.ebitda),
        eps: Number(financial.eps),
        freeCashFlow: Number(financial.freeCashFlow),
        netProfit: Number(financial.netProfit),
        period: financial.period,
        revenue: Number(financial.revenue),
        roe: Number(financial.roe),
      })),
      info: {
        ...fallback.info,
        description: stock.description ?? fallback.info.description,
        exchange: stock.exchange,
        industry: stock.industry ?? fallback.info.industry,
        name: stock.name,
        sector: stock.sector,
        ticker: stock.ticker,
      },
      news: stock.newsItems.map((item) => ({
        category: item.category,
        headline: item.headline,
        id: item.id,
        publishedAt: item.publishedAt.toISOString(),
        source: item.source,
        summary: item.summary,
      })),
      price: price
        ? {
            change: Number(price.change),
            changePct: Number(price.changePct),
            current: Number(price.current),
            high: Number(price.high),
            low: Number(price.low),
            open: Number(price.open),
            previousClose: Number(price.previousClose),
            ticker: stock.ticker,
            updatedAt: price.capturedAt.toISOString(),
            volume: Number(price.volume),
          }
        : fallback.price,
    }
  } catch {
    return getStockDetailByTicker(ticker, step)
  }
}
