'use client'

import { useEffect, useState } from 'react'

import { DEMO_USER } from '@/lib/utils/constants'
import type { UserPlan, UserProfile } from '@/types/user'

const AUTH_KEY = 'stocklens-user'
const AUTH_EVENT = 'stocklens-auth-changed'

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      const raw = window.localStorage.getItem(AUTH_KEY)
      if (raw) {
        setUser(JSON.parse(raw) as UserProfile)
      } else {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER))
        setUser(DEMO_USER)
      }
      setIsLoading(false)
    }

    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(AUTH_EVENT, sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(AUTH_EVENT, sync)
    }
  }, [])

  const saveUser = (nextUser: UserProfile | null) => {
    setUser(nextUser)
    if (nextUser) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
    } else {
      window.localStorage.removeItem(AUTH_KEY)
    }
    window.dispatchEvent(new Event(AUTH_EVENT))
  }

  const signIn = (plan: UserPlan = 'PRO') => {
    saveUser({ ...DEMO_USER, plan })
  }

  const signOut = () => saveUser(null)

  const updatePlan = (plan: UserPlan) => {
    if (!user) {
      return
    }

    saveUser({ ...user, plan })
  }

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    signIn,
    signOut,
    updatePlan,
  }
}
