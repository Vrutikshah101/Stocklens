export type TransactionType = 'BUY' | 'SELL'

export interface PortfolioTransaction {
  id: string
  ticker: string
  quantity: number
  price: number
  date: string
  type: TransactionType
}

export interface PortfolioHolding {
  ticker: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  marketValue: number
  invested: number
  pnl: number
  pnlPct: number
  dvm: number
}

export interface PortfolioSnapshot {
  nav: number
  invested: number
  totalPnl: number
  totalPnlPct: number
  dayChange: number
  xirr: number
}

export interface PortfolioPoint {
  date: string
  value: number
}

export interface PortfolioModel {
  id: string
  name: string
  strategy: string
  transactions: PortfolioTransaction[]
  holdings: PortfolioHolding[]
  navHistory: PortfolioPoint[]
  snapshot: PortfolioSnapshot
}

