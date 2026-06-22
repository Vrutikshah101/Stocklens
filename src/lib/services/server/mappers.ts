import {
  AlertChannel,
  AlertMetric as PrismaAlertMetric,
  AlertStatus as PrismaAlertStatus,
  TransactionType as PrismaTransactionType,
  UserPlan as PrismaUserPlan,
} from '@prisma/client'

import type { AlertMetric, AlertRecord } from '@/types/alert'
import type { PortfolioTransaction } from '@/types/portfolio'
import type { UserPlan, UserProfile } from '@/types/user'

export const DEMO_USER_ID = 'demo-user'

export const alertMetricToPrisma: Record<AlertMetric, PrismaAlertMetric> = {
  dvmAbove: PrismaAlertMetric.DVM_ABOVE,
  earningsDate: PrismaAlertMetric.EARNINGS_DATE,
  priceAbove: PrismaAlertMetric.PRICE_ABOVE,
  priceBelow: PrismaAlertMetric.PRICE_BELOW,
  ratingChange: PrismaAlertMetric.RATING_CHANGE,
  volumeSpike: PrismaAlertMetric.VOLUME_SPIKE,
}

export const alertMetricFromPrisma: Record<PrismaAlertMetric, AlertMetric> = {
  DVM_ABOVE: 'dvmAbove',
  EARNINGS_DATE: 'earningsDate',
  PRICE_ABOVE: 'priceAbove',
  PRICE_BELOW: 'priceBelow',
  RATING_CHANGE: 'ratingChange',
  VOLUME_SPIKE: 'volumeSpike',
}

export const alertStatusFromPrisma: Record<PrismaAlertStatus, AlertRecord['status']> = {
  ARMED: 'armed',
  MUTED: 'muted',
  TRIGGERED: 'triggered',
}

export const alertStatusToPrisma: Record<AlertRecord['status'], PrismaAlertStatus> = {
  armed: PrismaAlertStatus.ARMED,
  muted: PrismaAlertStatus.MUTED,
  triggered: PrismaAlertStatus.TRIGGERED,
}

export function alertChannelToPrisma(channel: AlertRecord['channel']) {
  return channel === 'Email' ? AlertChannel.EMAIL : AlertChannel.WEB
}

export function alertChannelFromPrisma(channels: AlertChannel[]) {
  return channels.includes(AlertChannel.EMAIL) ? 'Email' as const : 'Web' as const
}

export function transactionTypeToPrisma(type: PortfolioTransaction['type']) {
  return type === 'SELL' ? PrismaTransactionType.SELL : PrismaTransactionType.BUY
}

export function userPlanToPrisma(plan: UserPlan) {
  return plan === 'FREE' ? PrismaUserPlan.DEMO : PrismaUserPlan[plan]
}

export function userPlanFromPrisma(plan: PrismaUserPlan): UserPlan {
  return plan === PrismaUserPlan.DEMO ? 'FREE' : plan
}

export function userProfileFromPrisma(user: {
  avatarInitials: string | null
  email: string
  id: string
  name: string | null
  plan: PrismaUserPlan
  preferences: unknown
}): UserProfile {
  const preferences =
    user.preferences && typeof user.preferences === 'object'
      ? user.preferences as { notifications?: unknown }
      : {}

  return {
    avatarInitials: user.avatarInitials ?? 'SL',
    email: user.email,
    id: user.id,
    name: user.name ?? 'StockLens User',
    notifications: typeof preferences.notifications === 'boolean' ? preferences.notifications : true,
    plan: userPlanFromPrisma(user.plan),
  }
}
