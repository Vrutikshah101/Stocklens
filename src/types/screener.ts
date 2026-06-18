export type ScreenerField =
  | 'price'
  | 'pe'
  | 'pb'
  | 'roe'
  | 'debtToEquity'
  | 'dividendYield'
  | 'revenueCagr3Y'
  | 'changePct'
  | 'dvm'
  | 'marketCap'

export type ScreenerOperator = '>=' | '<=' | 'between'

export interface ScreenerFilter {
  id: string
  field: ScreenerField
  operator: ScreenerOperator
  value: number
  maxValue?: number
}

export interface ScreenerResult {
  ticker: string
  name: string
  sector: string
  price: number
  changePct: number
  pe: number
  pb: number
  roe: number
  debtToEquity: number
  dividendYield: number
  revenueCagr3Y: number
  dvm: number
  marketCap: number
}

export interface ScreenerTemplate {
  id: string
  name: string
  description: string
  filters: ScreenerFilter[]
}
