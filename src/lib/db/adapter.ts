import { PrismaPg } from '@prisma/adapter-pg'

const FALLBACK_DATABASE_URL = 'postgresql://stocklens:stocklens@127.0.0.1:5432/stocklens'

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL)
}

export function createPrismaPgAdapter() {
  const connectionString = process.env.DATABASE_URL || FALLBACK_DATABASE_URL

  return new PrismaPg({ connectionString })
}
