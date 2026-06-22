# StockLens Prisma Schema

This schema implements the database foundation from `files/FULLSTACK_DEVELOPMENT_PLAN.md`.

## Local Setup

1. Keep `DATABASE_URL` in `.env.local`; never commit the real password. `prisma.config.ts` loads `.env.local` for local CLI commands.
2. Generate the client:

```bash
pnpm db:generate
```

3. Apply the schema locally:

```bash
pnpm db:push
```

Use `pnpm db:migrate` after the schema stabilizes and migrations should be committed.

## Seed Data

Seed local demo data with:

```bash
pnpm db:seed
```

The seed is idempotent for the demo user-owned records and refreshes market cache rows from current sample data.
