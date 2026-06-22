import { prisma } from '@/lib/db/prisma'
import { hasDatabaseUrl } from '@/lib/db/adapter'
import { getMarketDataProviderHealth } from '@/lib/providers/marketData/providerRegistry'

async function getDatabaseHealth() {
  const startedAt = performance.now()

  if (!hasDatabaseUrl()) {
    return {
      error: 'DATABASE_URL is not configured',
      latencyMs: Math.round(performance.now() - startedAt),
      ok: false,
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1`

    return {
      latencyMs: Math.round(performance.now() - startedAt),
      ok: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown database error',
      latencyMs: Math.round(performance.now() - startedAt),
      ok: false,
    }
  }
}

export async function getSystemHealth() {
  const checkedAt = new Date().toISOString()
  const [database, marketData] = await Promise.all([
    getDatabaseHealth(),
    getMarketDataProviderHealth(),
  ])
  const ok = database.ok && marketData.ok

  return {
    checkedAt,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    ok,
    services: {
      database,
      marketData,
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
  }
}
