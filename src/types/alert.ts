export type AlertMetric =
  | 'priceAbove'
  | 'priceBelow'
  | 'dvmAbove'
  | 'volumeSpike'
  | 'ratingChange'
  | 'earningsDate'

export interface AlertRecord {
  id: string
  ticker: string
  title: string
  metric: AlertMetric
  threshold: number
  channel: 'Web' | 'Email'
  active: boolean
  createdAt: string
  lastTriggeredAt?: string
  status: 'armed' | 'triggered' | 'muted'
}

