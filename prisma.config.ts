import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

loadEnv({ path: '.env.local', override: true })

const fallbackDatabaseUrl = 'postgresql://stocklens:stocklens@127.0.0.1:5432/stocklens'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || fallbackDatabaseUrl,
  },
})
