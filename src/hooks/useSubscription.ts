'use client'

import { useMemo } from 'react'

import { useAuth } from '@/hooks/useAuth'

export function useSubscription() {
  const { user, updatePlan } = useAuth()

  return useMemo(
    () => ({
      plan: user?.plan ?? 'FREE',
      canAccessAI: user?.plan === 'PRO' || user?.plan === 'ELITE',
      canSaveUnlimitedScreeners: user?.plan === 'ELITE',
      updatePlan,
    }),
    [updatePlan, user],
  )
}

