'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { fetchJson } from '@/lib/services/clientApi'
import { getDemoUserProfile } from '@/lib/services/userService'
import { cn } from '@/lib/utils/formatters'
import { useUIStore } from '@/store/uiStore'
import type { UserProfile } from '@/types/user'

import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const AUTH_KEY = 'stocklens-user'
const AUTH_CHANGED_EVENT = 'stocklens-auth-changed'
const THEME_KEY = 'stocklens-theme'

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(AUTH_KEY)

  if (!raw) {
    const demoUser = getDemoUserProfile()
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser))
    return demoUser
  }

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    const demoUser = getDemoUserProfile()
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser))
    return demoUser
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { setSidebarOpen, sidebarOpen, theme } = useUIStore()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [shellReady, setShellReady] = useState(false)
  const initialTheme = useRef(theme)

  useEffect(() => {
    document.documentElement.dataset.theme = initialTheme.current
    document.documentElement.style.colorScheme = initialTheme.current
    window.localStorage.setItem(THEME_KEY, initialTheme.current)

    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }

    setUser(readStoredUser())
    setShellReady(true)

    fetchJson<{ user: UserProfile }>('/api/me')
      .then((payload) => {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(payload.user))
        setUser(payload.user)
      })
      .catch(() => undefined)
  }, [setSidebarOpen])

  useEffect(() => {
    if (!shellReady) {
      return
    }

    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [shellReady, theme])

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser())

    window.addEventListener(AUTH_CHANGED_EVENT, syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname, setSidebarOpen])

  const mainWidthClass = useMemo(
    () => (sidebarOpen ? 'lg:pl-[15rem]' : 'lg:pl-[4.75rem]'),
    [sidebarOpen],
  )

  const contentWidthClass = pathname?.startsWith('/login') || pathname?.startsWith('/register') ? 'max-w-6xl' : 'max-w-[1520px]'

  return (
    <div className="shell-backdrop min-h-screen">
      <Sidebar user={user} />
      <TopBar user={user} />
      <div className={cn('relative flex min-h-screen flex-col transition-[padding] duration-300', mainWidthClass)}>
        <main className="flex-1 bg-base px-4 pb-24 pt-20 md:px-5 lg:px-6 lg:pb-8 lg:pt-20">
          <div className={cn('mx-auto w-full', contentWidthClass)}>{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default Providers
