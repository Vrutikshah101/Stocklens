import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [users, stocks] = await Promise.all([
      prisma.user.count(),
      prisma.stock.count(),
    ])

    return NextResponse.json({
      ok: true,
      stocks,
      users,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown database error',
        ok: false,
      },
      { status: 500 },
    )
  }
}
