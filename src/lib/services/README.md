# StockLens Service Layer

This folder is the Milestone 1 API-contract seam. UI components and hooks should import from these services instead of reaching into sample constants directly.

## Current Mode

- Services are synchronous and backed by sample data.
- Existing UI behavior is preserved.
- Each function name mirrors the future backend responsibility.

## Replacement Path

When real APIs are introduced, replace service internals in this order:

1. Keep exported function names and response shapes stable.
2. Add API fetching, caching, and fallback inside the service.
3. Preserve sample fallback for provider failure.
4. Only change UI components if the approved contract itself changes.

## Service Map

- `marketService.ts` — dashboard overview, indices, movers, heatmap, news.
- `stockService.ts` — stock search, live price, stock detail.
- `screenerService.ts` — screener templates and query execution.
- `portfolioService.ts` — portfolio options and initial transaction data.
- `alertService.ts` — initial alert rules.
- `watchlistService.ts` — initial watchlist tickers.
- `ipoService.ts` — IPO calendar.
- `userService.ts` — demo user bootstrap.
- `aiHarnessService.ts` — non-production MarketMind suggestion seed.

## Market Data Provider Seam

- `src/lib/providers/marketData/types.ts` defines the provider contract for market overview, stock detail, supported tickers, and health.
- `src/lib/providers/marketData/sampleProvider.ts` is the default provider and keeps the app deterministic.
- `MARKET_DATA_PROVIDER=sample` is the only supported provider until a real vendor is approved.
- `GET /api/providers/market-data/health` reports the active provider, mode, cache TTL, and health.

## Server-Side Prisma Reads

- `server/marketDbService.ts` — Prisma-backed market overview with sample fallback.
- `server/stockDbService.ts` — Prisma-backed stock detail with sample fallback.
- `server/portfolioDbService.ts` — Prisma-backed portfolio options/transactions with sample fallback.
- `server/marketRefreshService.ts` — idempotent sample-market cache refresh for cron execution.
- `server/alertEvaluationService.ts` — active alert evaluator that records triggered alert events.
- `server/cronAuth.ts` — optional `CRON_SECRET` protection for scheduled routes.

The first HTTP contracts are:

- `GET /api/db/health`
- `GET /api/health`
- `GET /api/providers/market-data/health`
- `GET /api/me`
- `PATCH /api/me`
- `GET /api/market/overview`
- `GET /api/stocks/[ticker]`
- `GET /api/portfolio`
- `POST /api/portfolio/transactions`
- `GET /api/watchlist`
- `POST /api/watchlist`
- `DELETE /api/watchlist/[ticker]`
- `GET /api/alerts`
- `POST /api/alerts`
- `PATCH /api/alerts/[id]`
- `DELETE /api/alerts/[id]`
- `GET /api/screener/templates`
- `POST /api/screener/query`
- `GET/POST /api/cron/refresh-market`
- `GET/POST /api/cron/evaluate-alerts`

## Scheduled Jobs

- `vercel.json` uses once-daily schedules so Vercel Hobby deployments do not fail.
- Upgrade the schedules to every five minutes only on a Vercel plan that supports that frequency.
- `CRON_SECRET` is optional for local development and recommended for Vercel production.
- Cron handlers are idempotent for the current demo cache: market data is refreshed in place, and only armed alerts are triggered.

## Observability

- `GET /api/health` aggregates database and market-data-provider health.
- `API_TIMING_LOGS=true` enables lightweight server-side timing logs for selected critical API routes.
- Timing logs intentionally stay server-only and do not expose request payloads or secrets.
