export type Exchange = 'NSE' | 'BSE'

export interface StockPrice {
  ticker: string
  current: number
  previousClose: number
  open: number
  high: number
  low: number
  volume: number
  updatedAt: string
  change: number
  changePct: number
}

export interface OHLCV {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface DVMScore {
  durability: number
  valuation: number
  momentum: number
  composite: number
  label: 'Strong Buy Zone' | 'Buy Zone' | 'Hold / Caution' | 'Weak / Avoid'
  tone: 'gain' | 'warn' | 'loss'
}

export interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface FinancialStatement {
  period: string
  revenue: number
  ebitda: number
  netProfit: number
  eps: number
  freeCashFlow: number
  roe: number
  debtToEquity: number
}

export interface AnalystCall {
  broker: string
  rating: 'Buy' | 'Hold' | 'Sell'
  targetPrice: number
  upsidePct: number
  publishedAt: string
}

export interface ForecastPoint {
  metric: string
  year: string
  estimate: number
  analysts: number
}

export interface CorporateEvent {
  type: string
  title: string
  date: string
  impact: 'positive' | 'neutral' | 'negative'
}

export interface NewsItem {
  id: string
  source: string
  headline: string
  summary: string
  publishedAt: string
  category: string
}

export interface PeerComparison {
  ticker: string
  name: string
  pe: number
  roe: number
  marketCap: number
  performance1Y: number
  dvm: number
}

export interface StockInfo {
  ticker: string
  exchange: Exchange
  name: string
  sector: string
  industry: string
  description: string
  marketCap: number
  pe: number
  pb: number
  dividendYield: number
  revenueCagr3Y: number
  debtToEquity: number
  promoterHolding: number
  fiiFlow: number
  analystConsensus: 'Buy' | 'Hold' | 'Sell'
  fairValue: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

export interface StockDetail {
  info: StockInfo
  price: StockPrice
  dvm: DVMScore
  swot: SWOTAnalysis
  history: OHLCV[]
  financials: FinancialStatement[]
  analysts: AnalystCall[]
  forecasts: ForecastPoint[]
  events: CorporateEvent[]
  news: NewsItem[]
  peers: PeerComparison[]
}

export interface MarketMover {
  ticker: string
  name: string
  price: number
  changePct: number
  volumeRatio: number
  sector: string
  dvm: number
}

export interface IndexSnapshot {
  symbol: string
  name: string
  value: number
  change: number
  changePct: number
  breadth: string
}

export interface SectorHeatCell {
  sector: string
  changePct: number
  leaders: string[]
  value: number
}

