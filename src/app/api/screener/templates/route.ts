import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'
import { getScreenerTemplateCatalog } from '@/lib/services/screenerService'
import { DEMO_USER_ID } from '@/lib/services/server/mappers'
import type { ScreenerFilter } from '@/types/screener'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const screeners = await prisma.screener.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        deletedAt: null,
        userId: DEMO_USER_ID,
      },
    })

    if (!screeners.length) {
      return NextResponse.json(getScreenerTemplateCatalog())
    }

    return NextResponse.json(
      screeners.map((screener) => ({
        description: screener.description ?? '',
        filters: screener.filters as unknown as ScreenerFilter[],
        id: screener.id,
        name: screener.name,
      })),
    )
  } catch {
    return NextResponse.json(getScreenerTemplateCatalog())
  }
}
