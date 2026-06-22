import { getMarketOverview, type MarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'
import type { StockDetail } from '@/types/stock'

type YahooChartResult = {
  indicators?: {
    quote?: Array<{
      high?: Array<number | null>
      low?: Array<number | null>
      open?: Array<number | null>
      volume?: Array<number | null>
    }>
  }
  meta?: {
    chartPreviousClose?: number
    currency?: string
    currentTradingPeriod?: unknown
    exchangeName?: string
    instrumentType?: string
    longName?: string
    previousClose?: number
    regularMarketPrice?: number
    regularMarketTime?: number
    shortName?: string
    symbol?: string
  }
  timestamp?: number[]
}

type YahooChartResponse = {
  chart?: {
    error?: { code?: string; description?: string } | null
    result?: YahooChartResult[]
  }
}

const yahooSymbolOverrides: Record<string, string> = {
  NIFTY: '^NSEI',
  SENSEX: '^BSESN',
}

const indexSymbols = [
  { fallbackSymbol: 'NIFTY', name: 'NIFTY 50', yahooSymbol: '^NSEI' },
  { fallbackSymbol: 'BANKNIFTY', name: 'NIFTY Bank', yahooSymbol: '^NSEBANK' },
  { fallbackSymbol: 'SENSEX', name: 'BSE Sensex', yahooSymbol: '^BSESN' },
]

function toYahooSymbol(ticker: string) {
  const normalized = ticker.toUpperCase()

  return yahooSymbolOverrides[normalized] ?? `${normalized}.NS`
}

async function fetchYahooChart(symbol: string): Promise<YahooChartResult> {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`)
  url.searchParams.set('interval', '1d')
  url.searchParams.set('range', '5d')

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'StockLens/1.0',
    },
    next: {
      revalidate: 300,
    },
  })

  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed for ${symbol}: ${response.status}`)
  }

  const payload = await response.json() as YahooChartResponse
  const error = payload.chart?.error

  if (error) {
    throw new Error(error.description ?? error.code ?? `Yahoo Finance returned an error for ${symbol}`)
  }

  const result = payload.chart?.result?.[0]

  if (!result?.meta?.regularMarketPrice) {
    throw new Error(`Yahoo Finance returned no quote for ${symbol}`)
  }

  return result
}

function lastNumber(values?: Array<number | null>, fallback = 0) {
  const value = values?.slice().reverse().find((item): item is number => typeof item === 'number')

  return value ?? fallback
}

function mapChartToStockDetail(ticker: string, fallback: StockDetail, chart: Awaited<ReturnType<typeof fetchYahooChart>>): StockDetail {
  const quote = chart.indicators?.quote?.[0]
  const current = chart.meta?.regularMarketPrice ?? fallback.price.current
  const previousClose = chart.meta?.chartPreviousClose ?? chart.meta?.previousClose ?? fallback.price.previousClose
  const change = Number((current - previousClose).toFixed(2))
  const changePct = previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : fallback.price.changePct
  const updatedAt = chart.meta?.regularMarketTime
    ? new Date(chart.meta.regularMarketTime * 1000).toISOString()
    : new Date().toISOString()

  return {
    ...fallback,
    info: {
      ...fallback.info,
      name: chart.meta?.longName ?? chart.meta?.shortName ?? fallback.info.name,
      ticker: ticker.toUpperCase(),
    },
    price: {
      change,
      changePct,
      current,
      high: lastNumber(quote?.high, fallback.price.high),
      low: lastNumber(quote?.low, fallback.price.low),
      open: lastNumber(quote?.open, fallback.price.open),
      previousClose,
      ticker: ticker.toUpperCase(),
      updatedAt,
      volume: lastNumber(quote?.volume, fallback.price.volume),
    },
  }
}

export const yahooMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'live',
  name: 'yahoo',
  async getMarketOverview(step) {
    const fallback = getMarketOverview(step)

    try {
      const indices = await Promise.all(
        indexSymbols.map(async (index, position) => {
          const chart = await fetchYahooChart(index.yahooSymbol)
          const current = chart.meta?.regularMarketPrice ?? fallback.indices[position]?.value ?? 0
          const previousClose = chart.meta?.chartPreviousClose ?? chart.meta?.previousClose ?? current
          const change = Number((current - previousClose).toFixed(2))
          const changePct = previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : 0

          return {
            breadth: fallback.indices[position]?.breadth ?? 'Live quote',
            change,
            changePct,
            name: index.name,
            symbol: fallback.indices[position]?.symbol ?? index.fallbackSymbol,
            value: current,
          }
        }),
      )

      return {
        ...fallback,
        generatedAt: new Date().toISOString(),
        indices,
        source: 'yahoo' as MarketOverview['source'],
      }
    } catch {
      return fallback
    }
  },
  async getStockDetail(ticker, step) {
    const fallback = getStockDetailByTicker(ticker, step)

    try {
      const chart = await fetchYahooChart(toYahooSymbol(ticker))

      return mapChartToStockDetail(ticker, fallback, chart)
    } catch {
      return fallback
    }
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    try {
      await fetchYahooChart('RELIANCE.NS')

      return {
        cacheTtlSeconds: this.cacheTtlSeconds,
        checkedAt: new Date().toISOString(),
        mode: this.mode,
        name: this.name,
        ok: true,
      }
    } catch (error) {
      return {
        cacheTtlSeconds: this.cacheTtlSeconds,
        checkedAt: new Date().toISOString(),
        mode: this.mode,
        name: this.name,
        ok: false,
        reason: error instanceof Error ? error.message : 'Yahoo Finance health check failed',
      }
    }
  },
}
