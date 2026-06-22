'use client'

import { useEffect, useState } from 'react'

import { fetchJson, sendJson } from '@/lib/services/clientApi'
import { getDemoUserProfile } from '@/lib/services/userService'
import type { UserPlan, UserProfile } from '@/types/user'

const AUTH_KEY = 'stocklens-user'
const AUTH_EVENT = 'stocklens-auth-changed'

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const sync = () => {
      const raw = window.localStorage.getItem(AUTH_KEY)
      if (raw) {
        setUser(JSON.parse(raw) as UserProfile)
      } else {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(getDemoUserProfile()))
        setUser(getDemoUserProfile())
      }
      setIsLoading(false)
    }

    sync()

    fetchJson<{ user: UserProfile }>('/api/me')
      .then((payload) => {
        if (!active) {
          return
        }

        setUser(payload.user)
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(payload.user))
        setIsLoading(false)
      })
      .catch(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    window.addEventListener('storage', sync)
    window.addEventListener(AUTH_EVENT, sync)

    return () => {
      active = false
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
    const nextUser = { ...getDemoUserProfile(), plan }
    saveUser(nextUser)
    sendJson<{ user: UserProfile }>('/api/me', {
      body: JSON.stringify({ plan }),
      method: 'PATCH',
    })
      .then((payload) => saveUser(payload.user))
      .catch(() => undefined)
  }

  const signOut = () => saveUser(null)

  const updatePlan = (plan: UserPlan) => {
    if (!user) {
      return
    }

    const nextUser = { ...user, plan }
    saveUser(nextUser)
    sendJson<{ user: UserProfile }>('/api/me', {
      body: JSON.stringify({ plan }),
      method: 'PATCH',
    })
      .then((payload) => saveUser(payload.user))
      .catch(() => undefined)
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
