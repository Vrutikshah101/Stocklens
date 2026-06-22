import { NextResponse } from 'next/server'

import { hasDatabaseUrl } from '@/lib/db/adapter'
import { prisma } from '@/lib/db/prisma'
import { getDemoUserProfile } from '@/lib/services/userService'
import {
  DEMO_USER_ID,
  userPlanToPrisma,
  userProfileFromPrisma,
} from '@/lib/services/server/mappers'
import type { UserPlan } from '@/types/user'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ user: getDemoUserProfile() })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: DEMO_USER_ID },
    })

    return NextResponse.json({
      user: user ? userProfileFromPrisma(user) : getDemoUserProfile(),
    })
  } catch {
    return NextResponse.json({ user: getDemoUserProfile() })
  }
}

export async function PATCH(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured for profile updates' },
      { status: 503 },
    )
  }

  const payload = await request.json().catch(() => ({})) as {
    email?: string
    name?: string
    notifications?: boolean
    plan?: UserPlan
  }
  const current = getDemoUserProfile()
  const plan = payload.plan ?? current.plan

  const user = await prisma.user.upsert({
    create: {
      avatarInitials: current.avatarInitials,
      email: payload.email ?? current.email,
      id: DEMO_USER_ID,
      name: payload.name ?? current.name,
      plan: userPlanToPrisma(plan),
      preferences: {
        notifications: payload.notifications ?? current.notifications,
      },
    },
    update: {
      email: payload.email,
      name: payload.name,
      plan: payload.plan ? userPlanToPrisma(payload.plan) : undefined,
      preferences:
        payload.notifications === undefined
          ? undefined
          : {
              notifications: payload.notifications,
            },
    },
    where: { id: DEMO_USER_ID },
  })

  return NextResponse.json({
    user: userProfileFromPrisma(user),
  })
}
