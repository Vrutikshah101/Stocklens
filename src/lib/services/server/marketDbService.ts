import { prisma } from '@/lib/db/prisma'
import { hasDatabaseUrl } from '@/lib/db/adapter'
import { getMarketOverview, type MarketOverview } from '@/lib/services/marketService'
import type { IndexSnapshot, MarketMover, NewsItem, SectorHeatCell } from '@/types/stock'

export async function getMarketOverviewFromDb(step: number): Promise<MarketOverview> {
  if (!hasDatabaseUrl()) {
    return getMarketOverview(step)
  }

  try {
    const stocks = await prisma.stock.findMany({
      include: {
        dvmScores: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
        newsItems: {
          orderBy: { publishedAt: 'desc' },
          take: 1,
        },
        prices: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { ticker: 'asc' },
    })

    if (!stocks.length) {
      return getMarketOverview(step)
    }

    const movers: MarketMover[] = stocks
      .map((stock) => {
        const price = stock.prices[0]
        const dvm = stock.dvmScores[0]

        return {
          changePct: Number(price?.changePct ?? 0),
          dvm: dvm?.composite ?? 0,
          name: stock.name,
          price: Number(price?.current ?? 0),
          sector: stock.sector,
          ticker: stock.ticker,
          volumeRatio: 1 + Math.abs(Number(price?.changePct ?? 0)) / 2,
        }
      })
      .sort((left, right) => right.changePct - left.changePct)

    const grouped = new Map<string, { total: number; count: number; leaders: string[] }>()
    for (const mover of movers) {
      const group = grouped.get(mover.sector) ?? { total: 0, count: 0, leaders: [] }
      group.total += mover.changePct
      group.count += 1
      group.leaders.push(mover.ticker)
      grouped.set(mover.sector, group)
    }

    const heatmap: SectorHeatCell[] = Array.from(grouped.entries()).map(([sector, group]) => {
      const changePct = Number((group.total / group.count).toFixed(2))

      return {
        changePct,
        leaders: group.leaders.slice(0, 3),
        sector,
        value: Math.abs(changePct) * 10 + group.count * 8,
      }
    })

    const news: NewsItem[] = stocks
      .flatMap((stock) => stock.newsItems)
      .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime())
      .slice(0, 6)
      .map((item) => ({
        category: item.category,
        headline: item.headline,
        id: item.id,
        publishedAt: item.publishedAt.toISOString(),
        source: item.source,
        summary: item.summary,
      }))

    return {
      generatedAt: new Date().toISOString(),
      heatmap,
      indices: getMarketOverview(step).indices as IndexSnapshot[],
      movers,
      news,
      source: 'sample',
    }
  } catch {
    return getMarketOverview(step)
  }
}
