import { subDays } from 'date-fns'

import type { AlertRecord } from '@/types/alert'
import type {
  AnalystCall,
  CorporateEvent,
  DVMScore,
  FinancialStatement,
  ForecastPoint,
  IndexSnapshot,
  MarketMover,
  NewsItem,
  OHLCV,
  PeerComparison,
  SectorHeatCell,
  StockDetail,
  StockInfo,
  StockPrice,
} from '@/types/stock'
import type { PortfolioTransaction } from '@/types/portfolio'
import type { ScreenerField, ScreenerFilter, ScreenerResult, ScreenerTemplate } from '@/types/screener'
import type { UserProfile } from '@/types/user'

type StockSeed = Omit<
  StockInfo,
  'description' | 'analystConsensus' | 'fairValue' | 'riskLevel'
> & {
  basePrice: number
  description: string
  analystConsensus: 'Buy' | 'Hold' | 'Sell'
  fairValue: number
  riskLevel: 'Low' | 'Medium' | 'High'
  durability: number
  valuation: number
  momentum: number
}

const STOCK_SEEDS: StockSeed[] = [
  {
    ticker: 'RELIANCE',
    exchange: 'NSE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy',
    industry: 'Integrated Energy',
    description: 'A diversified energy and consumer platform with telecom and retail scale advantages.',
    marketCap: 2_120_000_000_000,
    pe: 25.8,
    pb: 2.3,
    dividendYield: 0.38,
    revenueCagr3Y: 13.4,
    debtToEquity: 0.42,
    promoterHolding: 50.1,
    fiiFlow: 1.8,
    analystConsensus: 'Buy',
    fairValue: 3220,
    riskLevel: 'Low',
    durability: 84,
    valuation: 68,
    momentum: 74,
    basePrice: 2935,
  },
  {
    ticker: 'TCS',
    exchange: 'NSE',
    name: 'Tata Consultancy Services Ltd',
    sector: 'Information Technology',
    industry: 'IT Services',
    description: 'A cash-rich software services compounder with resilient margins and global delivery depth.',
    marketCap: 1_520_000_000_000,
    pe: 28.7,
    pb: 12.2,
    dividendYield: 3.2,
    revenueCagr3Y: 11.7,
    debtToEquity: 0.04,
    promoterHolding: 72.3,
    fiiFlow: 0.6,
    analystConsensus: 'Hold',
    fairValue: 4235,
    riskLevel: 'Low',
    durability: 91,
    valuation: 58,
    momentum: 62,
    basePrice: 4036,
  },
  {
    ticker: 'HDFCBANK',
    exchange: 'NSE',
    name: 'HDFC Bank Ltd',
    sector: 'Financials',
    industry: 'Private Banks',
    description: 'A leading private bank balancing credit growth, margins, and retail deposit strength.',
    marketCap: 1_310_000_000_000,
    pe: 19.4,
    pb: 2.8,
    dividendYield: 1.1,
    revenueCagr3Y: 15.2,
    debtToEquity: 0.0,
    promoterHolding: 0,
    fiiFlow: 2.4,
    analystConsensus: 'Buy',
    fairValue: 1988,
    riskLevel: 'Low',
    durability: 87,
    valuation: 72,
    momentum: 66,
    basePrice: 1842,
  },
  {
    ticker: 'INFY',
    exchange: 'NSE',
    name: 'Infosys Ltd',
    sector: 'Information Technology',
    industry: 'IT Services',
    description: 'A large-cap IT exporter with steady digital transformation demand and disciplined capital returns.',
    marketCap: 695_000_000_000,
    pe: 24.6,
    pb: 7.7,
    dividendYield: 2.4,
    revenueCagr3Y: 9.1,
    debtToEquity: 0.05,
    promoterHolding: 14.7,
    fiiFlow: 0.8,
    analystConsensus: 'Hold',
    fairValue: 1675,
    riskLevel: 'Low',
    durability: 82,
    valuation: 63,
    momentum: 55,
    basePrice: 1584,
  },
  {
    ticker: 'ICICIBANK',
    exchange: 'NSE',
    name: 'ICICI Bank Ltd',
    sector: 'Financials',
    industry: 'Private Banks',
    description: 'A broad-based lender benefiting from improving asset quality and operating leverage.',
    marketCap: 920_000_000_000,
    pe: 18.2,
    pb: 3.1,
    dividendYield: 0.8,
    revenueCagr3Y: 17.9,
    debtToEquity: 0.0,
    promoterHolding: 0,
    fiiFlow: 2.9,
    analystConsensus: 'Buy',
    fairValue: 1375,
    riskLevel: 'Low',
    durability: 85,
    valuation: 77,
    momentum: 79,
    basePrice: 1315,
  },
  {
    ticker: 'BHARTIARTL',
    exchange: 'NSE',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecom',
    industry: 'Telecom Services',
    description: 'A telecom leader compounding ARPU growth, enterprise wins, and capital discipline.',
    marketCap: 885_000_000_000,
    pe: 39.4,
    pb: 7.3,
    dividendYield: 0.4,
    revenueCagr3Y: 16.8,
    debtToEquity: 1.14,
    promoterHolding: 55.9,
    fiiFlow: 1.2,
    analystConsensus: 'Buy',
    fairValue: 1610,
    riskLevel: 'Medium',
    durability: 78,
    valuation: 61,
    momentum: 83,
    basePrice: 1526,
  },
  {
    ticker: 'LT',
    exchange: 'NSE',
    name: 'Larsen & Toubro Ltd',
    sector: 'Industrials',
    industry: 'Engineering & Construction',
    description: 'An infrastructure bellwether with strong order book visibility and diversified execution.',
    marketCap: 510_000_000_000,
    pe: 31.2,
    pb: 4.7,
    dividendYield: 0.9,
    revenueCagr3Y: 14.6,
    debtToEquity: 0.82,
    promoterHolding: 0,
    fiiFlow: 1.5,
    analystConsensus: 'Buy',
    fairValue: 4060,
    riskLevel: 'Medium',
    durability: 80,
    valuation: 65,
    momentum: 72,
    basePrice: 3872,
  },
  {
    ticker: 'SBIN',
    exchange: 'NSE',
    name: 'State Bank of India',
    sector: 'Financials',
    industry: 'Public Banks',
    description: 'A public-sector banking franchise benefiting from improving efficiency and operating scale.',
    marketCap: 705_000_000_000,
    pe: 11.4,
    pb: 2.1,
    dividendYield: 1.7,
    revenueCagr3Y: 18.3,
    debtToEquity: 0.0,
    promoterHolding: 57.4,
    fiiFlow: 2.1,
    analystConsensus: 'Buy',
    fairValue: 985,
    riskLevel: 'Medium',
    durability: 73,
    valuation: 86,
    momentum: 77,
    basePrice: 932,
  },
  {
    ticker: 'SUNPHARMA',
    exchange: 'NSE',
    name: 'Sun Pharmaceutical Industries Ltd',
    sector: 'Healthcare',
    industry: 'Pharmaceuticals',
    description: 'A specialty-led pharma major with improving product mix and global market optionality.',
    marketCap: 410_000_000_000,
    pe: 34.5,
    pb: 4.9,
    dividendYield: 1.1,
    revenueCagr3Y: 12.4,
    debtToEquity: 0.09,
    promoterHolding: 54.5,
    fiiFlow: 0.7,
    analystConsensus: 'Buy',
    fairValue: 1815,
    riskLevel: 'Low',
    durability: 79,
    valuation: 60,
    momentum: 69,
    basePrice: 1710,
  },
  {
    ticker: 'MARUTI',
    exchange: 'NSE',
    name: 'Maruti Suzuki India Ltd',
    sector: 'Consumer Discretionary',
    industry: 'Automobiles',
    description: 'A passenger vehicle leader leveraging mix upgrade and demand recovery in mass premium segments.',
    marketCap: 390_000_000_000,
    pe: 27.8,
    pb: 4.4,
    dividendYield: 1.2,
    revenueCagr3Y: 15.7,
    debtToEquity: 0.0,
    promoterHolding: 58.2,
    fiiFlow: 0.9,
    analystConsensus: 'Hold',
    fairValue: 13450,
    riskLevel: 'Low',
    durability: 76,
    valuation: 67,
    momentum: 64,
    basePrice: 12840,
  },
]

const STOCK_MAP = Object.fromEntries(STOCK_SEEDS.map((seed) => [seed.ticker, seed]))

export const DEMO_USER: UserProfile = {
  id: 'demo-user',
  name: 'Vrutik Shah',
  email: 'vrutik@stocklens.app',
  plan: 'PRO',
  avatarInitials: 'VS',
  notifications: true,
}

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/stock/RELIANCE', label: 'Stocks' },
  { href: '/screener', label: 'Screener' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/ipo', label: 'IPO' },
]

export const SCREENER_FIELDS: { label: string; value: ScreenerField }[] = [
  { label: 'Price', value: 'price' },
  { label: 'P/E', value: 'pe' },
  { label: 'P/B', value: 'pb' },
  { label: 'ROE', value: 'roe' },
  { label: 'Debt / Equity', value: 'debtToEquity' },
  { label: 'Dividend Yield', value: 'dividendYield' },
  { label: 'Revenue CAGR (3Y)', value: 'revenueCagr3Y' },
  { label: 'Daily Change %', value: 'changePct' },
  { label: 'DVM Score', value: 'dvm' },
  { label: 'Market Cap', value: 'marketCap' },
]

export const DEMO_WATCHLIST = ['RELIANCE', 'TCS', 'ICICIBANK', 'LT']

export const DEMO_TRANSACTIONS: PortfolioTransaction[] = [
  { id: 'txn-1', ticker: 'RELIANCE', quantity: 18, price: 2670, date: '2026-01-14', type: 'BUY' },
  { id: 'txn-2', ticker: 'TCS', quantity: 12, price: 3824, date: '2026-02-21', type: 'BUY' },
  { id: 'txn-3', ticker: 'HDFCBANK', quantity: 25, price: 1712, date: '2026-03-11', type: 'BUY' },
  { id: 'txn-4', ticker: 'ICICIBANK', quantity: 20, price: 1188, date: '2026-04-08', type: 'BUY' },
  { id: 'txn-5', ticker: 'LT', quantity: 8, price: 3560, date: '2026-04-28', type: 'BUY' },
]

export const DEMO_ALERTS: AlertRecord[] = [
  {
    id: 'alert-1',
    ticker: 'RELIANCE',
    title: 'Reliance breakout',
    metric: 'priceAbove',
    threshold: 3000,
    channel: 'Web',
    active: true,
    createdAt: '2026-06-12T09:10:00.000Z',
    status: 'armed',
  },
  {
    id: 'alert-2',
    ticker: 'ICICIBANK',
    title: 'ICICI DVM upgrade',
    metric: 'dvmAbove',
    threshold: 80,
    channel: 'Email',
    active: true,
    createdAt: '2026-06-10T11:45:00.000Z',
    status: 'armed',
  },
]

export const DEMO_IPOS = [
  {
    name: 'Nova Green Infra',
    dates: '22 Jun — 25 Jun 2026',
    lotSize: '42 shares',
    priceBand: '₹410 — ₹432',
    gmp: '+₹36',
    subscription: '3.2×',
  },
  {
    name: 'Asterix Finance',
    dates: '28 Jun — 1 Jul 2026',
    lotSize: '28 shares',
    priceBand: '₹515 — ₹548',
    gmp: '+₹12',
    subscription: 'Pre-open',
  },
  {
    name: 'UrbanGrid Mobility',
    dates: '5 Jul — 8 Jul 2026',
    lotSize: '36 shares',
    priceBand: '₹210 — ₹225',
    gmp: '+₹18',
    subscription: 'Opens next week',
  },
]

export const DEMO_CHAT_SUGGESTIONS = [
  'Show me high ROE compounders',
  'Summarize portfolio risk',
  'What changed in banking today?',
  'Find momentum names with low debt',
]

export function getUniverseTickers() {
  return STOCK_SEEDS.map((seed) => seed.ticker)
}

export function searchStocks(query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return STOCK_SEEDS.slice(0, 6)
  }

  return STOCK_SEEDS.filter(
    (seed) =>
      seed.ticker.toLowerCase().includes(normalized) ||
      seed.name.toLowerCase().includes(normalized) ||
      seed.sector.toLowerCase().includes(normalized),
  ).slice(0, 8)
}

function hash(input: string) {
  return input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

function round(value: number, precision = 2) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function priceAtStep(seed: StockSeed, step: number) {
  const momentum = Math.sin((step + hash(seed.ticker)) / 3.6) * 0.018
  const rhythm = Math.cos((step + hash(seed.name)) / 6.4) * 0.011
  const drift = (seed.momentum - 60) / 5000
  return round(seed.basePrice * (1 + momentum + rhythm + drift))
}

function toneForScore(score: number): DVMScore['tone'] {
  if (score >= 60) {
    return 'gain'
  }

  if (score >= 40) {
    return 'warn'
  }

  return 'loss'
}

function labelForScore(score: number): DVMScore['label'] {
  if (score >= 80) {
    return 'Strong Buy Zone'
  }

  if (score >= 60) {
    return 'Buy Zone'
  }

  if (score >= 40) {
    return 'Hold / Caution'
  }

  return 'Weak / Avoid'
}

export function getLivePrice(seedOrTicker: StockSeed | string, step: number): StockPrice {
  const seed = typeof seedOrTicker === 'string' ? STOCK_MAP[seedOrTicker] ?? STOCK_SEEDS[0] : seedOrTicker
  const current = priceAtStep(seed, step)
  const previousClose = priceAtStep(seed, Math.max(step - 1, 0))
  const open = priceAtStep(seed, Math.max(step - 6, 0))
  const high = round(Math.max(current, previousClose, open) * 1.008)
  const low = round(Math.min(current, previousClose, open) * 0.992)
  const change = round(current - previousClose)
  const changePct = round((change / previousClose) * 100)

  return {
    ticker: seed.ticker,
    current,
    previousClose,
    open,
    high,
    low,
    volume: Math.round((seed.marketCap / seed.basePrice / 10000) * (1 + Math.abs(changePct) / 3)),
    updatedAt: new Date().toISOString(),
    change,
    changePct,
  }
}

export function getDvmScore(seedOrTicker: StockSeed | string, step: number): DVMScore {
  const seed = typeof seedOrTicker === 'string' ? STOCK_MAP[seedOrTicker] ?? STOCK_SEEDS[0] : seedOrTicker
  const pulse = Math.sin((step + hash(seed.ticker)) / 7.4) * 3
  const durability = round(seed.durability + pulse / 4)
  const valuation = round(seed.valuation + Math.cos(step / 8 + hash(seed.name)) * 2)
  const momentum = round(seed.momentum + Math.sin(step / 4 + hash(seed.ticker)) * 4)
  const composite = round((durability + valuation + momentum) / 3)

  return {
    durability,
    valuation,
    momentum,
    composite,
    label: labelForScore(composite),
    tone: toneForScore(composite),
  }
}

export function getHistory(seedOrTicker: StockSeed | string, step: number, points = 48): OHLCV[] {
  const seed = typeof seedOrTicker === 'string' ? STOCK_MAP[seedOrTicker] ?? STOCK_SEEDS[0] : seedOrTicker

  return Array.from({ length: points }, (_, index) => {
    const snapshotStep = Math.max(step - (points - index), 0)
    const close = priceAtStep(seed, snapshotStep)
    const open = priceAtStep(seed, Math.max(snapshotStep - 1, 0))
    const high = round(Math.max(open, close) * 1.008)
    const low = round(Math.min(open, close) * 0.992)

    return {
      time: subDays(new Date(), points - index - 1).toISOString(),
      open,
      high,
      low,
      close,
      volume: Math.round((seed.marketCap / seed.basePrice / 15000) * (1 + index / points)),
    }
  })
}

function getFinancials(seed: StockSeed): FinancialStatement[] {
  return Array.from({ length: 5 }, (_, index) => {
    const multiplier = 1 - (4 - index) * 0.07
    return {
      period: `FY${22 + index}`,
      revenue: round(seed.marketCap * 0.18 * multiplier, 0),
      ebitda: round(seed.marketCap * 0.05 * multiplier, 0),
      netProfit: round(seed.marketCap * 0.03 * multiplier, 0),
      eps: round(seed.basePrice * 0.055 * multiplier),
      freeCashFlow: round(seed.marketCap * 0.022 * multiplier, 0),
      roe: round(seed.revenueCagr3Y + 8 + index * 0.9),
      debtToEquity: round(Math.max(seed.debtToEquity - index * 0.03, 0)),
    }
  })
}

function getAnalysts(seed: StockSeed, step: number): AnalystCall[] {
  const base = getLivePrice(seed, step).current
  return [
    { broker: 'Motilal Oswal', rating: 'Buy', targetPrice: round(base * 1.11), upsidePct: 11, publishedAt: subDays(new Date(), 3).toISOString() },
    { broker: 'ICICI Direct', rating: seed.analystConsensus, targetPrice: round(base * 1.08), upsidePct: 8, publishedAt: subDays(new Date(), 8).toISOString() },
    { broker: 'HDFC Securities', rating: 'Hold', targetPrice: round(base * 1.03), upsidePct: 3, publishedAt: subDays(new Date(), 16).toISOString() },
  ]
}

function getForecasts(seed: StockSeed): ForecastPoint[] {
  return [
    { metric: 'Revenue', year: 'FY27', estimate: round(seed.marketCap * 0.21, 0), analysts: 19 },
    { metric: 'Net Profit', year: 'FY27', estimate: round(seed.marketCap * 0.035, 0), analysts: 17 },
    { metric: 'EPS', year: 'FY27', estimate: round(seed.basePrice * 0.064), analysts: 16 },
    { metric: 'Dividend', year: 'FY27', estimate: round(seed.basePrice * 0.012), analysts: 12 },
  ]
}

function getEvents(seed: StockSeed): CorporateEvent[] {
  return [
    { type: 'Results', title: `${seed.name} Q1 earnings`, date: subDays(new Date(), -12).toISOString(), impact: 'neutral' },
    { type: 'Conference Call', title: 'Management commentary on margin outlook', date: subDays(new Date(), 4).toISOString(), impact: 'positive' },
    { type: 'Corporate Action', title: 'Dividend record date announced', date: subDays(new Date(), 18).toISOString(), impact: 'positive' },
  ]
}

function getNews(seed: StockSeed): NewsItem[] {
  return [
    {
      id: `${seed.ticker}-news-1`,
      source: 'Market Pulse',
      headline: `${seed.name} gains on stronger than expected operating momentum`,
      summary: `Investors are responding to improved demand signals, margin resilience, and steadier institutional flows.`,
      publishedAt: subDays(new Date(), 1).toISOString(),
      category: 'Results',
    },
    {
      id: `${seed.ticker}-news-2`,
      source: 'Street Journal India',
      headline: `Broker desks reassess ${seed.ticker} after sector rotation`,
      summary: `Analysts see selective upside if execution stays on track and valuation discipline is preserved.`,
      publishedAt: subDays(new Date(), 2).toISOString(),
      category: 'Analyst',
    },
    {
      id: `${seed.ticker}-news-3`,
      source: 'Exchange Wire',
      headline: `${seed.name} files update on capital allocation priorities`,
      summary: 'Management commentary points to cautious expansion with improving cash conversion.',
      publishedAt: subDays(new Date(), 5).toISOString(),
      category: 'Regulatory',
    },
  ]
}

function getSwot(seed: StockSeed, step: number) {
  const price = getLivePrice(seed, step)
  return {
    strengths: [
      `${seed.revenueCagr3Y.toFixed(1)}% 3Y revenue CAGR`,
      `${seed.promoterHolding.toFixed(1)}% promoter holding indicates long-term conviction`,
      `${getDvmScore(seed, step).durability.toFixed(0)} durability score supports quality bias`,
    ],
    weaknesses: [
      seed.pe > 30 ? 'Premium valuation leaves less room for error' : 'Valuation upside depends on sustained execution',
      seed.debtToEquity > 0.8 ? 'Leverage requires monitoring through the capex cycle' : 'Momentum has cooled versus recent peaks',
      'Delivery volumes remain sensitive to broader market risk-off moves',
    ],
    opportunities: [
      `Fair value at ₹${seed.fairValue.toLocaleString('en-IN')} implies room above spot price`,
      `FII flow at ${seed.fiiFlow.toFixed(1)} indicates institutional support`,
      'A supportive results cycle could expand premium multiples again',
    ],
    threats: [
      `A ${Math.abs(price.changePct).toFixed(1)}% daily swing shows sentiment can reset quickly`,
      'Sector rotation could cap rerating even if fundamentals stay intact',
      'Global macro cues remain a variable for near-term momentum',
    ],
  }
}

function getPeers(seed: StockSeed, step: number): PeerComparison[] {
  return STOCK_SEEDS.filter((item) => item.sector === seed.sector && item.ticker !== seed.ticker)
    .slice(0, 4)
    .map((peer) => ({
      ticker: peer.ticker,
      name: peer.name,
      pe: peer.pe,
      roe: round(peer.revenueCagr3Y + 8),
      marketCap: peer.marketCap,
      performance1Y: round(getLivePrice(peer, step).changePct * 6.4),
      dvm: getDvmScore(peer, step).composite,
    }))
}

export function getStockDetail(ticker: string, step: number): StockDetail {
  const seed = STOCK_MAP[ticker] ?? STOCK_SEEDS[0]

  return {
    info: {
      ticker: seed.ticker,
      exchange: seed.exchange,
      name: seed.name,
      sector: seed.sector,
      industry: seed.industry,
      description: seed.description,
      marketCap: seed.marketCap,
      pe: seed.pe,
      pb: seed.pb,
      dividendYield: seed.dividendYield,
      revenueCagr3Y: seed.revenueCagr3Y,
      debtToEquity: seed.debtToEquity,
      promoterHolding: seed.promoterHolding,
      fiiFlow: seed.fiiFlow,
      analystConsensus: seed.analystConsensus,
      fairValue: seed.fairValue,
      riskLevel: seed.riskLevel,
    },
    price: getLivePrice(seed, step),
    dvm: getDvmScore(seed, step),
    swot: getSwot(seed, step),
    history: getHistory(seed, step, 42),
    financials: getFinancials(seed),
    analysts: getAnalysts(seed, step),
    forecasts: getForecasts(seed),
    events: getEvents(seed),
    news: getNews(seed),
    peers: getPeers(seed, step),
  }
}

export function getMarketIndices(step: number): IndexSnapshot[] {
  const seeds = [
    { symbol: 'NIFTY', name: 'Nifty 50', base: 24582, breadth: '31 / 19' },
    { symbol: 'SENSEX', name: 'Sensex', base: 80641, breadth: '18 / 12' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', base: 52862, breadth: '8 / 4' },
    { symbol: 'NIFTYIT', name: 'Nifty IT', base: 38210, breadth: '7 / 3' },
  ]

  return seeds.map((seed, index) => {
    const shift = Math.sin((step + index * 7) / 4.2) * 0.009
    const value = round(seed.base * (1 + shift))
    const previousValue = round(seed.base * (1 + Math.sin((Math.max(step - 1, 0) + index * 7) / 4.2) * 0.009))
    const change = round(value - previousValue)
    return {
      symbol: seed.symbol,
      name: seed.name,
      value,
      change,
      changePct: round((change / previousValue) * 100),
      breadth: seed.breadth,
    }
  })
}

export function getTopMovers(step: number): MarketMover[] {
  return STOCK_SEEDS.map((seed) => {
    const detail = getStockDetail(seed.ticker, step)
    return {
      ticker: seed.ticker,
      name: seed.name,
      price: detail.price.current,
      changePct: detail.price.changePct,
      volumeRatio: round(1 + Math.abs(detail.price.changePct) / 2),
      sector: seed.sector,
      dvm: detail.dvm.composite,
    }
  }).sort((left, right) => right.changePct - left.changePct)
}

export function getSectorHeatmap(step: number): SectorHeatCell[] {
  const grouped = new Map<string, { total: number; count: number; leaders: string[] }>()

  STOCK_SEEDS.forEach((seed) => {
    const changePct = getLivePrice(seed, step).changePct
    const group = grouped.get(seed.sector) ?? { total: 0, count: 0, leaders: [] }
    group.total += changePct
    group.count += 1
    group.leaders.push(seed.ticker)
    grouped.set(seed.sector, group)
  })

  return Array.from(grouped.entries()).map(([sector, group]) => ({
    sector,
    changePct: round(group.total / group.count),
    leaders: group.leaders.slice(0, 3),
    value: Math.abs(round(group.total / group.count)) * 10 + group.count * 8,
  }))
}

export function getNewsfeed(step: number) {
  return getTopMovers(step)
    .slice(0, 6)
    .flatMap((mover) => getStockDetail(mover.ticker, step).news.slice(0, 1))
}

function getMetricValue(result: ScreenerResult, field: ScreenerField) {
  return result[field]
}

export function getScreenerTemplates(): ScreenerTemplate[] {
  return [
    {
      id: 'value-picks',
      name: 'Graham Value Picks',
      description: 'Lower valuation, cleaner balance sheets, strong return ratios.',
      filters: [
        { id: 'tmpl-1', field: 'pe', operator: '<=', value: 22 },
        { id: 'tmpl-2', field: 'debtToEquity', operator: '<=', value: 0.6 },
        { id: 'tmpl-3', field: 'roe', operator: '>=', value: 15 },
      ],
    },
    {
      id: 'momentum-leaders',
      name: 'Momentum Leaders',
      description: 'Price strength with supportive DVM and trend participation.',
      filters: [
        { id: 'tmpl-4', field: 'changePct', operator: '>=', value: 0.9 },
        { id: 'tmpl-5', field: 'dvm', operator: '>=', value: 72 },
      ],
    },
    {
      id: 'quality-income',
      name: 'Quality Income',
      description: 'Steady growers with healthy yields and balance-sheet quality.',
      filters: [
        { id: 'tmpl-6', field: 'dividendYield', operator: '>=', value: 1 },
        { id: 'tmpl-7', field: 'debtToEquity', operator: '<=', value: 0.5 },
        { id: 'tmpl-8', field: 'revenueCagr3Y', operator: '>=', value: 10 },
      ],
    },
  ]
}

export function getScreenerResults(step: number, filters: ScreenerFilter[]): ScreenerResult[] {
  const rows = STOCK_SEEDS.map((seed) => {
    const detail = getStockDetail(seed.ticker, step)
    return {
      ticker: seed.ticker,
      name: seed.name,
      sector: seed.sector,
      price: detail.price.current,
      changePct: detail.price.changePct,
      pe: seed.pe,
      pb: seed.pb,
      roe: round(seed.revenueCagr3Y + 8),
      debtToEquity: seed.debtToEquity,
      dividendYield: seed.dividendYield,
      revenueCagr3Y: seed.revenueCagr3Y,
      dvm: detail.dvm.composite,
      marketCap: seed.marketCap,
    }
  })

  if (!filters.length) {
    return rows.sort((left, right) => right.dvm - left.dvm)
  }

  return rows.filter((result) =>
    filters.every((filter) => {
      const currentValue = getMetricValue(result, filter.field)
      if (filter.operator === '>=') {
        return currentValue >= filter.value
      }

      if (filter.operator === '<=') {
        return currentValue <= filter.value
      }

      return currentValue >= filter.value && currentValue <= (filter.maxValue ?? filter.value)
    }),
  )
}

export function getPortfolioNames() {
  return [
    { id: 'core-alpha', name: 'Core Alpha', strategy: 'Quality + momentum blend' },
    { id: 'swing-lab', name: 'Swing Lab', strategy: 'Tactical event-driven basket' },
  ]
}
