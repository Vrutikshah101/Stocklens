# StockLens

StockLens is a `Next.js` frontend prototype for an interactive Indian market dashboard with sample real-time data.

## Local development

```bash
pnpm install
pnpm dev
```

App runs locally at [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## AI development harness

StockLens uses an AI development harness for planning, review, and quality gates. Nex AGI `nex-agi/nex-n2-pro:free` can be used through OpenRouter as a secondary drafting agent only; it is not a production app runtime.

```bash
pnpm harness:brief -- "revamp stock dashboard"
pnpm harness:nex -- "review this task brief"
pnpm quality
```

See `files/AI_DEVELOPMENT_HARNESS.md` for agent roles, MCP usage, hooks, and acceptance checks.

## Full-stack development plan

The frontend in Git is treated as the approved UI contract. See `files/FULLSTACK_DEVELOPMENT_PLAN.md` for the backend, database, API, auth, real-data, AI, and Vercel roadmap.

## Deploy to Vercel

### Option 1: GitHub + Vercel

1. Initialize git in this folder:

```bash
git init
git add .
git commit -m "Initial StockLens frontend"
```

2. Create a GitHub repository and push:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

3. In Vercel:
   - Open [https://vercel.com](https://vercel.com)
   - Click **Add New** → **Project**
   - Import your GitHub repo
   - Let Vercel auto-detect `Next.js`
   - Deploy

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Environment variables

This project currently uses sample market data by default.

- `DATABASE_URL` is required when using the Prisma-backed API routes.
- `MARKET_DATA_PROVIDER=sample` keeps the market provider deterministic.
- `MARKET_DATA_PROVIDER=yahoo` enables server-only unofficial Yahoo Finance quote attempts with sample fallback.
- `MARKET_DATA_PROVIDER=multi` tries FMP, Twelve Data, Alpha Vantage, Yahoo, then sample fallback.
- `FMP_API_KEY`, `TWELVE_DATA_API_KEY`, and `ALPHA_VANTAGE_API_KEY` are server-only optional provider keys.
- `CRON_SECRET` is recommended for protected Vercel cron routes.
- `API_TIMING_LOGS=true` enables lightweight server-side timing logs for selected API routes.
- OpenRouter variables are optional and only used by the local AI development harness.
