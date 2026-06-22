import { PrismaPg } from '@prisma/adapter-pg'

export function createPrismaPgAdapter() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize Prisma.')
  }

  return new PrismaPg({ connectionString })
}
