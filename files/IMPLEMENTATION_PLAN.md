# StockLens — Master Implementation Plan
> Version: 1.1 (verified) | Token-optimized execution guide for AI coding agents
> Read DESIGN.md first. This document tells you HOW to build what DESIGN.md describes.
> Sections 1–16 = core plan. Sections 17–28 = verification addendum (versions, env, fallbacks, tokens, anti-hallucination rules) — READ THE ADDENDUM, it contains values referenced but not defined in the core sections.

---

## HOW TO USE THIS DOCUMENT

This plan is structured for sequential execution by AI coding agents (Claude Sonnet, GPT-4o, Gemini, Cursor, etc.). Each task is:
- **Self-contained** — includes exact file paths, interfaces, and acceptance criteria
- **TDD-first** — write tests before implementation
- **Dependency-ordered** — tasks within a phase are sequenced; never skip ahead
- **Token-efficient** — use the file tree and module map to orient without re-reading everything

### Agent Instructions (read before every task)
1. Read only the relevant TASK block — do not load the entire file
2. Write the failing test first, then implement to pass it
3. Never create a file not listed in the File Tree (Section 1)
4. Always import from `@/lib/`, `@/hooks/`, `@/types/` — never relative `../../`
5. After each task, run: `pnpm test --testPathPattern=<module>` and confirm green
6. Commit message format: `feat(module): task description` or `test(module): add tests`

---

## SECTION 1 — CANONICAL FILE TREE

Every file that will ever exist in this project is listed here.
Do NOT create files outside this tree without explicit instruction.

```
stocklens/
├── .env.example                         # All env vars listed, no values
├── .env.local                           # Local dev secrets (gitignored)
├── .eslintrc.json
├── .prettierrc
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
│
├── prisma/
│   ├── schema.prisma                    # Single source of truth for DB schema
│   └── migrations/                      # Auto-generated, never hand-edit
│
├── public/
│   ├── icons/                           # SVG icons only
│   └── images/                          # Static images
│
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout (fonts, providers)
│   │   ├── page.tsx                     # Home / Market Dashboard
│   │   ├── globals.css                  # CSS variables + Tailwind base
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── stock/
│   │   │   └── [ticker]/
│   │   │       ├── page.tsx             # Stock analysis page
│   │   │       ├── loading.tsx          # Skeleton UI
│   │   │       └── error.tsx
│   │   │
│   │   ├── screener/
│   │   │   └── page.tsx
│   │   │
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   │
│   │   ├── watchlist/
│   │   │   └── page.tsx
│   │   │
│   │   ├── alerts/
│   │   │   └── page.tsx
│   │   │
│   │   ├── ipo/
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                         # Next.js API routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/route.ts
│   │       ├── stock/
│   │       │   ├── [ticker]/route.ts    # GET stock data
│   │       │   ├── search/route.ts      # GET search results
│   │       │   └── screener/route.ts    # POST screener query
│   │       ├── portfolio/
│   │       │   ├── route.ts             # GET/POST portfolios
│   │       │   └── [id]/route.ts        # PATCH/DELETE portfolio
│   │       ├── watchlist/
│   │       │   └── route.ts
│   │       ├── alerts/
│   │       │   └── route.ts
│   │       └── ai/
│   │           ├── swot/route.ts        # POST → Claude SWOT
│   │           └── marketmind/route.ts  # POST → Claude chat
│   │
│   ├── components/
│   │   ├── ui/                          # Primitive / dumb components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── charts/                      # Chart wrapper components
│   │   │   ├── CandlestickChart.tsx     # TradingView Lightweight
│   │   │   ├── FinancialLineChart.tsx   # ECharts line
│   │   │   ├── RadarChart.tsx           # ECharts radar (DVM)
│   │   │   ├── SectorHeatmap.tsx        # ECharts heatmap
│   │   │   └── PortfolioNAVChart.tsx    # ECharts area
│   │   │
│   │   ├── stock/                       # Stock page sections
│   │   │   ├── StockHeader.tsx          # Ticker, price, change, badges
│   │   │   ├── DVMScoreCard.tsx         # DVM badge + radar
│   │   │   ├── SWOTCard.tsx             # SWOT four-quadrant
│   │   │   ├── FinancialsTable.tsx      # P&L / BS / CF tabs
│   │   │   ├── TechnicalChart.tsx       # Candlestick + overlays
│   │   │   ├── AnalystCallsTable.tsx    # Broker recommendations
│   │   │   ├── ForecasterTable.tsx      # Consensus estimates
│   │   │   ├── CorporateEventsList.tsx  # Timeline of events
│   │   │   ├── NewsCard.tsx             # Single news item
│   │   │   └── PeersTable.tsx           # Side-by-side comparison
│   │   │
│   │   ├── screener/
│   │   │   ├── ScreenerBuilder.tsx      # Filter drag-drop UI
│   │   │   ├── FilterBlock.tsx          # Single filter row
│   │   │   ├── ScreenerResults.tsx      # Results table
│   │   │   └── SavedScreeners.tsx       # Saved list sidebar
│   │   │
│   │   ├── portfolio/
│   │   │   ├── PortfolioSummary.tsx     # NAV + P&L header
│   │   │   ├── HoldingsTable.tsx        # Holdings with live prices
│   │   │   ├── AddTransactionForm.tsx   # Manual entry form
│   │   │   └── PortfolioNAVChart.tsx    # NAV over time chart
│   │   │
│   │   ├── dashboard/
│   │   │   ├── IndexSnapshot.tsx        # Nifty/Sensex cards
│   │   │   ├── SectorHeatmapWidget.tsx
│   │   │   ├── TopMoversTable.tsx       # Gainers / Losers / Volume
│   │   │   └── NewsfeedWidget.tsx
│   │   │
│   │   ├── alerts/
│   │   │   ├── AlertForm.tsx            # Create alert modal
│   │   │   └── AlertsList.tsx           # Active alerts list
│   │   │
│   │   ├── ai/
│   │   │   └── MarketMindChat.tsx       # AI chat sidebar
│   │   │
│   │   └── layout/
│   │       ├── Sidebar.tsx              # Desktop left nav
│   │       ├── BottomNav.tsx            # Mobile bottom nav
│   │       ├── TopBar.tsx               # Search + user menu
│   │       └── Providers.tsx            # All context providers
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useStockPrice.ts             # Live price WebSocket hook
│   │   ├── useStockData.ts              # Full stock data (React Query)
│   │   ├── useScreener.ts               # Screener state + results
│   │   ├── usePortfolio.ts              # Portfolio CRUD + NAV
│   │   ├── useWatchlist.ts              # Watchlist CRUD
│   │   ├── useAlerts.ts                 # Alerts CRUD
│   │   ├── useAuth.ts                   # Firebase auth state
│   │   ├── useSubscription.ts           # Plan tier + gating
│   │   └── useMarketStatus.ts           # Market open/closed
│   │
│   ├── lib/                             # Pure logic, no React
│   │   ├── api/
│   │   │   ├── yfinance.ts              # yfinance Python bridge client
│   │   │   ├── finnhub.ts               # Finnhub REST client
│   │   │   ├── finedge.ts               # FinEdge API client
│   │   │   ├── nse-rss.ts               # NSE/BSE RSS parser
│   │   │   └── claude.ts                # Anthropic SDK wrapper
│   │   │
│   │   ├── scoring/
│   │   │   └── dvm.ts                   # DVM score calculation logic
│   │   │
│   │   ├── screener/
│   │   │   └── engine.ts                # Filter evaluation engine
│   │   │
│   │   ├── portfolio/
│   │   │   ├── nav.ts                   # NAV + XIRR calculation
│   │   │   └── pnl.ts                   # P&L realized/unrealized
│   │   │
│   │   ├── alerts/
│   │   │   └── evaluator.ts             # Alert trigger evaluation
│   │   │
│   │   ├── auth/
│   │   │   └── firebase.ts              # Firebase app init + auth
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts            # Currency, %, date formatters
│   │       ├── validators.ts            # Zod schemas
│   │       └── constants.ts             # App-wide constants
│   │
│   ├── types/                           # TypeScript interfaces (no logic)
│   │   ├── stock.ts
│   │   ├── portfolio.ts
│   │   ├── screener.ts
│   │   ├── alert.ts
│   │   ├── user.ts
│   │   └── api.ts                       # API request/response shapes
│   │
│   └── store/                           # Zustand stores (UI state only)
│       ├── screenerStore.ts
│       ├── portfolioStore.ts
│       └── uiStore.ts                   # Sidebar open, theme, etc.
│
├── python-service/                      # FastAPI data microservice
│   ├── main.py                          # FastAPI app entrypoint
│   ├── requirements.txt
│   ├── routers/
│   │   ├── prices.py                    # /prices/{ticker}
│   │   ├── fundamentals.py              # /fundamentals/{ticker}
│   │   ├── screener.py                  # /screener (POST)
│   │   ├── news.py                      # /news/{ticker}
│   │   └── ai.py                        # /ai/swot, /ai/summarize
│   ├── services/
│   │   ├── yfinance_service.py
│   │   ├── nselib_service.py
│   │   ├── finnhub_service.py
│   │   ├── finedge_service.py
│   │   ├── rss_service.py
│   │   └── claude_service.py
│   ├── models/
│   │   └── schemas.py                   # Pydantic models
│   └── tests/
│       ├── test_prices.py
│       ├── test_fundamentals.py
│       └── test_screener.py
│
└── tests/                               # Frontend tests
    ├── unit/
    │   ├── lib/
    │   │   ├── dvm.test.ts
    │   │   ├── nav.test.ts
    │   │   ├── pnl.test.ts
    │   │   ├── screener-engine.test.ts
    │   │   └── alert-evaluator.test.ts
    │   └── hooks/
    │       ├── useStockData.test.ts
    │       ├── usePortfolio.test.ts
    │       └── useScreener.test.ts
    ├── integration/
    │   ├── api/
    │   │   ├── stock.test.ts
    │   │   ├── portfolio.test.ts
    │   │   └── screener.test.ts
    └── e2e/
        ├── stock-page.spec.ts
        ├── portfolio.spec.ts
        └── screener.spec.ts
```

---

## SECTION 2 — TYPE CONTRACTS

These are the canonical TypeScript types. Every component, hook, and API route must use these exactly. Do not redefine locally.

### `src/types/stock.ts`
```typescript
export interface StockPrice {
  ticker: string          // "RELIANCE.NS"
  exchange: 'NSE' | 'BSE'
  lastPrice: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  prevClose: number
  volume: number
  timestamp: string       // ISO 8601
}

export interface OHLCV {
  date: string            // "YYYY-MM-DD"
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockInfo {
  ticker: string
  name: string
  exchange: 'NSE' | 'BSE'
  isin: string
  sector: string
  industry: string
  marketCap: number
  marketCapSegment: 'largecap' | 'midcap' | 'smallcap'
  peRatio: number | null
  pbRatio: number | null
  dividendYield: number | null
  eps: number | null
  bookValue: number | null
  debtToEquity: number | null
  roe: number | null
  roce: number | null
}

export interface FinancialStatement {
  period: string          // "Q1FY25" | "FY24"
  type: 'annual' | 'quarterly'
  revenue: number
  operatingProfit: number
  netProfit: number
  eps: number
  totalAssets: number
  totalDebt: number
  cashAndEquivalents: number
  operatingCashFlow: number
}

export interface DVMScore {
  durability: number      // 0-100
  valuation: number       // 0-100
  momentum: number        // 0-100
  composite: number       // 0-100
  label: 'strong-buy' | 'buy' | 'hold' | 'avoid'
}

export interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  generatedAt: string     // ISO 8601
  source: 'ai' | 'cached'
}

export interface AnalystCall {
  broker: string
  callType: 'buy' | 'sell' | 'hold'
  targetPrice: number
  currentPrice: number
  upside: number          // percentage
  date: string
  analyst: string | null
}

export interface CorporateEvent {
  type: 'result' | 'dividend' | 'split' | 'bonus' | 'agm' | 'board-meeting'
  date: string
  description: string
  isUpcoming: boolean
}

export interface NewsItem {
  id: string
  headline: string
  source: string
  url: string
  publishedAt: string
  category: 'results' | 'corporate-action' | 'analyst' | 'regulatory' | 'general'
}
```

### `src/types/portfolio.ts`
```typescript
export interface Transaction {
  id: string
  portfolioId: string
  ticker: string
  date: string            // "YYYY-MM-DD"
  price: number
  quantity: number
  type: 'buy' | 'sell'
  notes: string | null
}

export interface Holding {
  ticker: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  currentValue: number
  investedValue: number
  unrealizedPnL: number
  unrealizedPnLPct: number
  dayChange: number
  dayChangePct: number
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  createdAt: string
  totalValue: number
  totalInvested: number
  totalPnL: number
  totalPnLPct: number
  dayChange: number
  xirr: number | null
  holdings: Holding[]
  transactions: Transaction[]
}

export interface NAVPoint {
  date: string
  value: number
}
```

### `src/types/screener.ts`
```typescript
export type FilterOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'between'

export type FilterParameter =
  | 'pe_ratio' | 'pb_ratio' | 'ev_ebitda' | 'debt_to_equity'
  | 'roe' | 'roce' | 'net_profit_margin' | 'revenue_growth_1y'
  | 'revenue_growth_3y' | 'promoter_holding' | 'fii_holding'
  | 'rsi_14' | 'macd_signal' | 'market_cap' | 'price_change_1m'
  | 'price_change_3m' | 'price_change_1y' | 'volume_ratio'
  | 'dvm_composite' | 'dvm_durability' | 'dvm_valuation' | 'dvm_momentum'
  | 'sector' | 'market_cap_segment'

export interface ScreenerFilter {
  id: string              // uuid, for React key
  parameter: FilterParameter
  operator: FilterOperator
  value: number | string
  value2?: number         // for 'between'
}

export interface ScreenerQuery {
  id?: string
  name?: string
  filters: ScreenerFilter[]
  logicOperator: 'AND' | 'OR'
  sortBy: FilterParameter
  sortOrder: 'asc' | 'desc'
  limit: number
}

export interface ScreenerResult {
  ticker: string
  name: string
  sector: string
  marketCap: number
  lastPrice: number
  changePct: number
  dvmComposite: number
  peRatio: number | null
  pbRatio: number | null
  roe: number | null
  revenueGrowth1y: number | null
}
```

### `src/types/alert.ts`
```typescript
export type AlertTriggerType =
  | 'price_above' | 'price_below' | 'price_change_pct'
  | 'volume_spike' | 'dvm_change' | 'new_analyst_call'
  | 'corporate_action' | 'earnings_result' | 'insider_trade'

export interface Alert {
  id: string
  userId: string
  ticker: string
  triggerType: AlertTriggerType
  triggerValue: number | null
  isActive: boolean
  lastTriggeredAt: string | null
  createdAt: string
  deliveryChannels: ('push' | 'email' | 'sms')[]
}
```

---

## SECTION 3 — DATABASE SCHEMA

Single source of truth: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String      @id @default(cuid())
  firebaseUid   String      @unique
  email         String      @unique
  displayName   String?
  plan          Plan        @default(FREE)
  createdAt     DateTime    @default(now())
  portfolios    Portfolio[]
  watchlists    Watchlist[]
  alerts        Alert[]
  savedScreeners SavedScreener[]
}

enum Plan {
  FREE
  BASIC
  PRO
  INSTITUTIONAL
}

model Portfolio {
  id           String        @id @default(cuid())
  userId       String
  name         String
  createdAt    DateTime      @default(now())
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
}

model Transaction {
  id          String    @id @default(cuid())
  portfolioId String
  ticker      String
  date        DateTime
  price       Decimal   @db.Decimal(12, 4)
  quantity    Decimal   @db.Decimal(12, 4)
  type        TxType
  notes       String?
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id])
}

enum TxType {
  BUY
  SELL
}

model Watchlist {
  id        String          @id @default(cuid())
  userId    String
  name      String
  isPublic  Boolean         @default(false)
  createdAt DateTime        @default(now())
  user      User            @relation(fields: [userId], references: [id])
  items     WatchlistItem[]
}

model WatchlistItem {
  id          String    @id @default(cuid())
  watchlistId String
  ticker      String
  addedAt     DateTime  @default(now())
  watchlist   Watchlist @relation(fields: [watchlistId], references: [id])
  @@unique([watchlistId, ticker])
}

model Alert {
  id               String    @id @default(cuid())
  userId           String
  ticker           String
  triggerType      String
  triggerValue     Decimal?  @db.Decimal(12, 4)
  isActive         Boolean   @default(true)
  lastTriggeredAt  DateTime?
  deliveryChannels String[]  @default(["push"])
  createdAt        DateTime  @default(now())
  user             User      @relation(fields: [userId], references: [id])
}

model SavedScreener {
  id            String   @id @default(cuid())
  userId        String
  name          String
  queryJson     Json
  lastRunAt     DateTime?
  lastResultCount Int?
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
}

model StockCache {
  ticker      String   @id
  infoJson    Json
  updatedAt   DateTime @default(now())
  @@index([updatedAt])
}
```

---

## SECTION 4 — ENVIRONMENT VARIABLES

All variables that must exist. Never hardcode any of these.
File: `.env.example` (copy to `.env.local` for dev)

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/stocklens"

# Redis
REDIS_URL="redis://localhost:6379"

# Firebase (Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
FIREBASE_ADMIN_SDK_JSON=""          # Base64 encoded service account JSON

# Anthropic (Claude API)
ANTHROPIC_API_KEY=""

# Finnhub
FINNHUB_API_KEY=""

# FinEdge API
FINEDGE_API_KEY=""

# Python microservice
PYTHON_SERVICE_URL="http://localhost:8000"

# Razorpay
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Resend (email)
RESEND_API_KEY=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

---

## SECTION 5 — PLUGIN & TOOL CONFIGURATION

### 5.1 VS Code / Cursor Plugins (install before starting)

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "orta.vscode-jest",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### 5.2 Obsidian Vault Setup (Code Graph + Knowledge Base)

Create an Obsidian vault at `docs/obsidian/` with the following structure for tracking implementation progress and code relationships:

```
docs/obsidian/
├── 00-index.md              # Master index, links to all notes
├── modules/
│   ├── stock-data.md        # yfinance + nselib integration notes
│   ├── dvm-scoring.md       # DVM algorithm decisions
│   ├── screener-engine.md   # Filter logic decisions
│   ├── portfolio-nav.md     # NAV/XIRR calculation notes
│   ├── ai-features.md       # Claude prompt engineering notes
│   └── auth-payments.md     # Firebase + Razorpay setup notes
├── api-contracts/
│   ├── python-service.md    # All Python service endpoints
│   └── nextjs-api.md        # All Next.js API routes
├── decisions/
│   ├── ADR-001-data-source.md    # Why yfinance over broker API
│   ├── ADR-002-python-service.md # Why separate Python microservice
│   └── ADR-003-dvm-algorithm.md  # DVM scoring methodology
└── progress/
    ├── phase-1.md           # Phase 1 checklist + status
    ├── phase-2.md
    └── phase-3.md
```

**Obsidian Plugins to enable:**
- Dataview — query tasks across notes
- Kanban — phase progress board
- Graph View — visualize module dependencies
- Templater — consistent note templates
- Git — sync vault with repo

**Graph relationships to create (use `[[wikilinks]]`):**
- `stock-data.md` → links to all components that consume it
- `dvm-scoring.md` → links to `DVMScoreCard`, `ScreenerResults`, `HoldingsTable`
- Every ADR links to the module it governs

---

## SECTION 6 — TDD STRATEGY

### 6.1 Testing Pyramid

```
         /\
        /e2e\         5% — Playwright, critical user journeys only
       /------\
      /integr  \      25% — API routes + DB interactions
     /----------\
    /  unit tests \   70% — Pure logic: lib/, hooks/, scoring
   /______________\
```

### 6.2 Test Configuration

**`jest.config.ts`**
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThresholds: {
    global: { lines: 80, functions: 80, branches: 75 }
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
}

export default createJestConfig(config)
```

**`jest.setup.ts`**
```typescript
import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Firebase
jest.mock('@/lib/auth/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: jest.fn() },
}))

// Mock environment variables
process.env.PYTHON_SERVICE_URL = 'http://localhost:8000'
process.env.ANTHROPIC_API_KEY = 'test-key'
process.env.FINNHUB_API_KEY = 'test-key'
```

### 6.3 TDD Rule Per Module

For every file in `src/lib/` and `src/hooks/`, the corresponding test file in `tests/unit/` MUST be written first. The pattern is:

```
# For src/lib/scoring/dvm.ts:
1. Write tests/unit/lib/dvm.test.ts with ALL test cases
2. Run → all FAIL (red)
3. Implement src/lib/scoring/dvm.ts
4. Run → all PASS (green)
5. Refactor if needed → still green
```

### 6.4 Unit Test Templates

**Template: Pure calculation function**
```typescript
// tests/unit/lib/dvm.test.ts
import { calculateDVMScore, getDVMLabel } from '@/lib/scoring/dvm'

describe('calculateDVMScore', () => {
  it('returns composite score between 0-100', () => {
    const result = calculateDVMScore({ roe: 20, pe: 15, rsi: 55, revenueGrowth: 15, debtToEquity: 0.3 })
    expect(result.composite).toBeGreaterThanOrEqual(0)
    expect(result.composite).toBeLessThanOrEqual(100)
  })

  it('assigns strong-buy label when composite >= 80', () => {
    const result = calculateDVMScore({ roe: 35, pe: 12, rsi: 60, revenueGrowth: 25, debtToEquity: 0.1 })
    expect(result.label).toBe('strong-buy')
  })

  it('assigns avoid label when composite < 40', () => {
    const result = calculateDVMScore({ roe: 2, pe: 80, rsi: 72, revenueGrowth: -10, debtToEquity: 3.5 })
    expect(result.label).toBe('avoid')
  })

  it('handles null inputs gracefully', () => {
    const result = calculateDVMScore({ roe: null, pe: null, rsi: 50, revenueGrowth: null, debtToEquity: null })
    expect(result.composite).toBeDefined()
    expect(() => calculateDVMScore({ roe: null, pe: null, rsi: 50, revenueGrowth: null, debtToEquity: null })).not.toThrow()
  })
})
```

**Template: Hook test**
```typescript
// tests/unit/hooks/usePortfolio.test.ts
import { renderHook, act } from '@testing-library/react'
import { usePortfolio } from '@/hooks/usePortfolio'

const mockPortfolio = { id: '1', name: 'Test', holdings: [], transactions: [] }

jest.mock('@/lib/api/portfolio', () => ({
  fetchPortfolio: jest.fn().mockResolvedValue(mockPortfolio),
  addTransaction: jest.fn().mockResolvedValue({ id: 'tx-1' }),
}))

describe('usePortfolio', () => {
  it('loads portfolio on mount', async () => {
    const { result } = renderHook(() => usePortfolio('1'))
    expect(result.current.isLoading).toBe(true)
    await act(async () => {})
    expect(result.current.portfolio).toEqual(mockPortfolio)
    expect(result.current.isLoading).toBe(false)
  })
})
```

---

## SECTION 7 — CUSTOM HOOKS SPECIFICATION

Each hook's exact signature, dependencies, and behavior. Implement these exactly.

### `useStockPrice(ticker: string)`
```typescript
// Returns live price, auto-refreshes every 15s during market hours
interface UseStockPriceReturn {
  price: StockPrice | null
  isLoading: boolean
  error: Error | null
  lastUpdated: Date | null
}
// Dependencies: fetch to /api/stock/[ticker] (which calls Python service)
// Polling: setInterval 15000ms when market open, 60000ms when closed
// Uses: useMarketStatus() to decide polling interval
```

### `useStockData(ticker: string)`
```typescript
// Full stock data — cached aggressively (staleTime: 5min)
interface UseStockDataReturn {
  info: StockInfo | null
  financials: FinancialStatement[]
  history: OHLCV[]
  dvmScore: DVMScore | null
  swot: SWOTAnalysis | null
  analystCalls: AnalystCall[]
  events: CorporateEvent[]
  news: NewsItem[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
// Dependencies: React Query, queries key ['stock', ticker]
// staleTime: 5 * 60 * 1000
// All sub-data loaded in parallel with Promise.all
```

### `useScreener()`
```typescript
interface UseScreenerReturn {
  filters: ScreenerFilter[]
  addFilter: (filter: Omit<ScreenerFilter, 'id'>) => void
  removeFilter: (id: string) => void
  updateFilter: (id: string, updates: Partial<ScreenerFilter>) => void
  clearFilters: () => void
  results: ScreenerResult[]
  resultCount: number
  isRunning: boolean
  runScreener: () => Promise<void>
  saveScreener: (name: string) => Promise<void>
  loadScreener: (query: ScreenerQuery) => void
}
// Dependencies: Zustand screenerStore, fetch to /api/stock/screener
// Auto-run: debounced 800ms after filter changes
```

### `usePortfolio(portfolioId: string)`
```typescript
interface UsePortfolioReturn {
  portfolio: Portfolio | null
  isLoading: boolean
  addTransaction: (tx: Omit<Transaction, 'id' | 'portfolioId'>) => Promise<void>
  removeTransaction: (txId: string) => Promise<void>
  navHistory: NAVPoint[]
  isCalculatingNAV: boolean
  refetch: () => void
}
// Dependencies: React Query, Prisma via /api/portfolio/[id]
// NAV recalculated server-side on each transaction change
```

### `useAuth()`
```typescript
interface UseAuthReturn {
  user: FirebaseUser | null
  dbUser: User | null           // Prisma user record
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
// Dependencies: Firebase Auth onAuthStateChanged
// On login: upsert user in Prisma via /api/auth/sync
```

### `useSubscription()`
```typescript
interface UseSubscriptionReturn {
  plan: 'FREE' | 'BASIC' | 'PRO' | 'INSTITUTIONAL'
  canUseFeature: (feature: GatedFeature) => boolean
  showUpgradeModal: (feature: GatedFeature) => void
}
type GatedFeature =
  | 'screener_advanced'    // >3 filters
  | 'ai_swot'              // SWOT generation
  | 'forecaster'           // Consensus estimates
  | 'export_data'          // CSV/Excel export
  | 'unlimited_alerts'     // >5 alerts
  | 'portfolio_unlimited'  // >10 stocks
// Dependencies: useAuth() → dbUser.plan
```

### `useMarketStatus()`
```typescript
interface UseMarketStatusReturn {
  isOpen: boolean
  nextOpen: Date | null   // Next market open time
  nextClose: Date | null  // Next market close time
  session: 'pre' | 'open' | 'post' | 'closed'
}
// NSE/BSE hours: Mon-Fri, 09:15–15:30 IST
// Pre-market: 09:00–09:15
// No computation from server — pure client-side IST time calculation
```

---

## SECTION 8 — API ROUTES SPECIFICATION

### Next.js API Routes

#### `GET /api/stock/[ticker]`
```typescript
// Query params: sections=price,info,financials,history,dvm,news (comma-separated)
// Default: sections=price,info
// Response: Partial<{ price, info, financials, history, dvmScore, news, events, analystCalls }>
// Cache: price=15s, info=5min, financials=1hr, history=5min
// Auth: public (no auth required for basic data)
// Error codes: 404 if ticker not found, 502 if Python service down
```

#### `GET /api/stock/search`
```typescript
// Query params: q=string (min 2 chars), limit=10
// Response: { results: { ticker, name, exchange, sector }[] }
// Cache: 24hr (ticker list is static)
// Auth: public
```

#### `POST /api/stock/screener`
```typescript
// Body: ScreenerQuery
// Response: { results: ScreenerResult[], total: number, executionMs: number }
// Auth: required (free users: max 3 filters)
// Rate limit: 10 req/min per user
// Calls: Python service /screener
```

#### `GET /api/portfolio`
```typescript
// Response: Portfolio[] (all portfolios for auth user)
// Auth: required
```

#### `POST /api/portfolio`
```typescript
// Body: { name: string }
// Response: Portfolio
// Auth: required
// Limit: Free=1, Basic=3, Pro=unlimited
```

#### `GET /api/portfolio/[id]`
```typescript
// Response: Portfolio (with holdings computed live)
// Auth: required, must own portfolio
```

#### `POST /api/portfolio/[id]/transaction`
```typescript
// Body: Omit<Transaction, 'id' | 'portfolioId'>
// Response: Transaction
// Auth: required, must own portfolio
```

#### `POST /api/ai/swot`
```typescript
// Body: { ticker: string, financials: FinancialStatement[], info: StockInfo }
// Response: SWOTAnalysis
// Auth: required, PRO plan only
// Rate limit: 5 req/hr per user (Claude API cost control)
// Calls: Claude claude-sonnet-4-6 with structured prompt
```

#### `POST /api/ai/marketmind`
```typescript
// Body: { messages: { role: 'user'|'assistant', content: string }[], context?: string }
// Response: ReadableStream (SSE streaming)
// Auth: required, PRO plan only
// Rate limit: 20 messages/day per user
```

### Python Service Routes (`python-service/`)

#### `GET /prices/{ticker}`
```python
# ticker: "RELIANCE.NS" or "RELIANCE.BO"
# Response: StockPrice (see types)
# Source: yfinance Ticker().fast_info
# Cache: Redis 15s TTL
```

#### `GET /history/{ticker}`
```python
# Query: period=1d|5d|1mo|3mo|6mo|1y|2y|5y, interval=1m|5m|15m|1h|1d
# Response: OHLCV[]
# Source: yfinance Ticker().history()
# Cache: Redis — 5min TTL for intraday, 1hr for daily+
```

#### `GET /fundamentals/{ticker}`
```python
# Response: { info: StockInfo, financials: FinancialStatement[] }
# Source: yfinance info + financials + balance_sheet + cashflow
#         FinEdge API for Indian-specific ratios
# Cache: Redis 1hr TTL
```

#### `POST /screener`
```python
# Body: ScreenerQuery (same shape as TypeScript type)
# Response: ScreenerResult[]
# Logic: fetch all NSE stocks from nselib, apply filters in pandas
# Cache: Redis 5min TTL keyed by query hash
```

#### `GET /news/{ticker}`
```python
# Response: NewsItem[]
# Source: yfinance .news + Finnhub /company-news + NSE RSS
# Cache: Redis 10min TTL
```

#### `POST /ai/swot`
```python
# Body: { ticker, financials, info }
# Response: SWOTAnalysis
# Prompt: structured Claude call (see Section 9)
# Cache: Redis 6hr TTL (expensive call)
```

---

## SECTION 9 — AI PROMPT TEMPLATES

These are the exact prompts to send to Claude. Do not modify them — they are tuned for structured output.

### SWOT Generation Prompt
```
System: You are a financial analyst for Indian equity markets. Generate a SWOT analysis in strict JSON format. No prose outside JSON.

User: Generate SWOT for {ticker} ({name}), {sector} sector.

Financial data:
- Revenue growth (1Y): {revenue_growth}%
- Net profit margin: {net_margin}%
- ROE: {roe}%
- Debt-to-equity: {debt_equity}
- Promoter holding: {promoter_holding}%
- P/E ratio: {pe}

Return ONLY this JSON structure, no markdown:
{
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string"],
  "opportunities": ["string", "string"],
  "threats": ["string", "string"]
}

Rules:
- Max 3 items per quadrant, min 1
- Each item max 15 words
- Be specific to this company's actual numbers
- Do not use generic statements like "strong brand"
```

### MarketMind System Prompt
```
You are MarketMind, an AI analyst for StockLens, a platform for Indian equity investors.
You have access to NSE/BSE market data.
Keep responses concise — under 150 words unless a detailed analysis is explicitly requested.
Always cite the data source (e.g., "Based on Q3FY25 results...").
Never give direct buy/sell recommendations. Use "appears undervalued" not "buy this stock."
Format numbers in Indian format: ₹1,23,456 not ₹123,456.
If you don't know something, say so. Don't hallucinate stock data.
```

### Earnings Summary Prompt
```
System: Summarize this earnings call transcript for a retail investor. Return JSON only.

User: Transcript: {transcript_text}

Return:
{
  "headline": "One sentence summary (max 20 words)",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "guidance": "Management guidance in one sentence or null",
  "sentiment": "positive" | "neutral" | "negative",
  "quotableQuote": "Most significant quote from management (max 25 words) or null"
}
```

---

## SECTION 10 — DVM SCORING ALGORITHM

Exact implementation specification for `src/lib/scoring/dvm.ts`

```typescript
// Input weights (must sum to 100 within each axis)
const DURABILITY_WEIGHTS = {
  roe: 25,              // Return on Equity > 15% is good
  debtToEquity: 25,     // < 0.5 is good, > 2 is bad
  revenueGrowth3y: 25,  // 3-year CAGR > 10% is good
  promoterHolding: 25,  // > 50% is good
}

const VALUATION_WEIGHTS = {
  peVsSector: 40,       // P/E vs sector median (lower is better)
  pbRatio: 30,          // P/B < 3 is reasonable
  evEbitda: 30,         // < 12 is good
}

const MOMENTUM_WEIGHTS = {
  rsi14: 30,            // 40-60 is neutral/good, >70 overbought
  priceVs52wHigh: 35,   // >80% of 52w high = strong momentum
  volumeRatio: 35,      // Current vol / 20-day avg > 1.5 = bullish
}

// Scoring function: map raw value to 0-100 score
// Each metric has a min (score=0) and max (score=100) anchor

// DURABILITY axis:
//   roe:              0%=0, 5%=30, 15%=70, 25%+=100
//   debtToEquity:     3+=0, 2=20, 1=50, 0.5=80, 0=100
//   revenueGrowth3y:  -10%=0, 0%=30, 10%=60, 20%+=100
//   promoterHolding:  <30%=0, 40%=40, 50%=70, 65%+=100

// VALUATION axis (pe_vs_sector = stock_pe / sector_median_pe):
//   peVsSector ratio: >2=0, 1.5=20, 1=50, 0.7=80, <0.5=100
//   pbRatio:          >5=0, 3=30, 2=60, 1=80, <0.5=100
//   evEbitda:         >20=0, 15=20, 10=60, 7=80, <5=100

// MOMENTUM axis:
//   rsi14:            <30=40(oversold), 30-40=60, 40-60=80, 60-70=70, >70=30(overbought)
//   priceVs52wHigh:   <50%=0, 60%=30, 70%=50, 80%=70, 90%+=100
//   volumeRatio:      <0.5=0, 1=50, 1.5=70, 2+=100

// Composite = (Durability * 0.35) + (Valuation * 0.35) + (Momentum * 0.30)
// Label:  >=80=strong-buy, 60-79=buy, 40-59=hold, <40=avoid

// NULL HANDLING: if a metric is null, redistribute its weight equally among available metrics
```

---

## SECTION 11 — SCREENER ENGINE

Exact implementation for `src/lib/screener/engine.ts`

```typescript
// The screener engine receives ScreenerResult[] from the Python service
// and applies client-side filtering for instant re-filtering without API calls

// Filter evaluation per operator:
// gt:      result[param] > filter.value
// gte:     result[param] >= filter.value
// lt:      result[param] < filter.value
// lte:     result[param] <= filter.value
// eq:      result[param] === filter.value (for strings: sector)
// neq:     result[param] !== filter.value
// between: result[param] >= filter.value && result[param] <= filter.value2

// Logic operator:
// AND: every filter must pass
// OR:  at least one filter must pass

// NULL handling: if result[param] is null, the filter evaluates to FALSE
// This is intentional — unknown data should not pass a filter

// Sort: standard Array.sort with null values pushed to the end
```

---

## SECTION 12 — COMPONENT IMPLEMENTATION RULES

Rules for every React component. Agents must follow these without exception.

### Rule 1: No data fetching in components
```typescript
// ❌ WRONG
const StockHeader = ({ ticker }) => {
  const [data, setData] = useState(null)
  useEffect(() => { fetch(`/api/stock/${ticker}`).then(...) }, [])
  ...
}

// ✅ CORRECT
const StockHeader = ({ ticker }) => {
  const { price, info } = useStockData(ticker)   // hook handles fetching
  ...
}
```

### Rule 2: Always handle loading and error states
```typescript
// Every component that consumes async data must render:
if (isLoading) return <Skeleton ... />
if (error) return <ErrorState message={error.message} />
// Then render actual content
```

### Rule 3: Subscription gating pattern
```typescript
// For PRO-only features:
const { canUseFeature, showUpgradeModal } = useSubscription()

const handleAction = () => {
  if (!canUseFeature('ai_swot')) {
    showUpgradeModal('ai_swot')
    return
  }
  // proceed
}
```

### Rule 4: Color tokens only — never hardcode colors
```typescript
// ❌ WRONG
<span style={{ color: '#3FB950' }}>+2.5%</span>

// ✅ CORRECT
<span className="text-gain">+2.5%</span>
// .text-gain → var(--color-green) in globals.css
```

### Rule 5: Format all financial numbers through formatters
```typescript
import { formatCurrency, formatPct, formatLargeNumber } from '@/lib/utils/formatters'

formatCurrency(1234567)      // "₹12.35L"
formatCurrency(12345678)     // "₹1.23Cr"
formatPct(2.567)             // "+2.57%"
formatPct(-1.23)             // "-1.23%"
formatLargeNumber(12345678)  // "1.23Cr"
```

---

## SECTION 13 — PHASE EXECUTION PLAN

Each task has: ID, description, files to create/modify, acceptance criteria, and test requirement.

---

### PHASE 1 — MVP (Weeks 1–8)

#### P1-T01: Project Scaffold
- **Files:** All config files (package.json, tsconfig, tailwind, jest, next.config, .env.example, prisma/schema.prisma)
- **Accept:** `pnpm dev` starts without error, `pnpm test` runs empty suite, `prisma migrate dev` creates all tables
- **Test:** None (scaffold only)

#### P1-T02: Type Definitions
- **Files:** All files in `src/types/`
- **Accept:** `tsc --noEmit` passes with zero errors
- **Test:** None (types only, no runtime behavior)

#### P1-T03: Python Service Scaffold
- **Files:** `python-service/main.py`, `requirements.txt`, `models/schemas.py`
- **Accept:** `uvicorn main:app` starts, GET `/health` returns `{"status":"ok"}`
- **Test:** `pytest python-service/tests/test_prices.py` (write first)

#### P1-T04: yfinance Service
- **Files:** `python-service/services/yfinance_service.py`, `python-service/routers/prices.py`
- **TDD:** Write `test_prices.py` first with mock yfinance data
- **Accept:** GET `/prices/RELIANCE.NS` returns valid StockPrice JSON
- **Test:** Mock yfinance — never call real API in tests

#### P1-T05: Fundamentals Service
- **Files:** `python-service/services/yfinance_service.py` (extend), `python-service/routers/fundamentals.py`
- **TDD:** Write `test_fundamentals.py` first
- **Accept:** GET `/fundamentals/RELIANCE.NS` returns StockInfo + FinancialStatement[]

#### P1-T06: History Service
- **Files:** `python-service/routers/prices.py` (extend with `/history/{ticker}`)
- **Accept:** GET `/history/RELIANCE.NS?period=1y&interval=1d` returns OHLCV[]

#### P1-T07: DVM Scoring Logic
- **Files:** `src/lib/scoring/dvm.ts`
- **TDD:** Write `tests/unit/lib/dvm.test.ts` FIRST (min 8 test cases per Section 6.4 template)
- **Accept:** All 8 tests pass, coverage 100% on dvm.ts

#### P1-T08: Formatters & Constants
- **Files:** `src/lib/utils/formatters.ts`, `src/lib/utils/constants.ts`
- **TDD:** Write formatter tests first
- **Accept:** formatCurrency(1234567) === "₹12.35L", formatPct(-2.5) === "-2.50%"

#### P1-T09: Firebase Auth Setup
- **Files:** `src/lib/auth/firebase.ts`, `src/hooks/useAuth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- **Accept:** Sign in with Google works in browser, user record created in Prisma

#### P1-T10: Next.js API — Stock Data
- **Files:** `src/app/api/stock/[ticker]/route.ts`, `src/app/api/stock/search/route.ts`
- **TDD:** Write integration tests first (mock Python service)
- **Accept:** GET /api/stock/RELIANCE.NS returns price + info, GET /api/stock/search?q=rel returns results

#### P1-T11: useStockData Hook
- **Files:** `src/hooks/useStockData.ts`, `src/hooks/useStockPrice.ts`, `src/hooks/useMarketStatus.ts`
- **TDD:** Write hook tests first (mock fetch)
- **Accept:** Hook loads data, shows loading state, handles error, polls correctly

#### P1-T12: UI Primitives
- **Files:** All files in `src/components/ui/`
- **Accept:** Each component renders correctly, Button variants work, Skeleton animates

#### P1-T13: App Layout
- **Files:** `src/components/layout/Sidebar.tsx`, `src/components/layout/TopBar.tsx`, `src/components/layout/BottomNav.tsx`, `src/components/layout/Providers.tsx`, `src/app/layout.tsx`
- **Accept:** Desktop shows sidebar, mobile shows bottom nav, search bar is functional

#### P1-T14: Chart Components
- **Files:** `src/components/charts/CandlestickChart.tsx`, `src/components/charts/FinancialLineChart.tsx`, `src/components/charts/RadarChart.tsx`
- **Accept:** CandlestickChart renders with mock OHLCV data, RadarChart renders DVM axes

#### P1-T15: Stock Page — Core
- **Files:** `src/app/stock/[ticker]/page.tsx`, `src/app/stock/[ticker]/loading.tsx`, `src/components/stock/StockHeader.tsx`, `src/components/stock/TechnicalChart.tsx`, `src/components/stock/FinancialsTable.tsx`
- **Accept:** /stock/RELIANCE shows live price, interactive candlestick chart, financials tabs

#### P1-T16: DVM Score Card
- **Files:** `src/components/stock/DVMScoreCard.tsx`
- **Accept:** Shows composite score, radar chart with D/V/M axes, correct color badge

#### P1-T17: Market Dashboard
- **Files:** `src/app/page.tsx`, `src/components/dashboard/IndexSnapshot.tsx`, `src/components/dashboard/TopMoversTable.tsx`
- **Accept:** Home shows Nifty/Sensex/BankNifty cards with live data, top gainers/losers table

#### P1-T18: Watchlist (Basic)
- **Files:** `src/hooks/useWatchlist.ts`, `src/app/api/watchlist/route.ts`, `src/app/watchlist/page.tsx`
- **TDD:** Hook tests first
- **Accept:** Add/remove stocks, persist to DB, show live prices in watchlist table

#### P1-T19: Auth Pages
- **Files:** `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- **Accept:** Google OAuth login works, email/password login works, redirects to dashboard

#### P1-T20: E2E — Stock Page
- **Files:** `tests/e2e/stock-page.spec.ts`
- **Accept:** Playwright test: navigate to /stock/RELIANCE, assert price visible, chart renders, tabs switch

---

### PHASE 2 — Core Platform (Weeks 9–18)

#### P2-T01: Screener Engine (lib)
- **Files:** `src/lib/screener/engine.ts`
- **TDD:** `tests/unit/lib/screener-engine.test.ts` first — test all operators, AND/OR logic, null handling
- **Accept:** filterResults(mockData, filters) returns correct subset for all operators

#### P2-T02: Screener Python Service
- **Files:** `python-service/services/nselib_service.py`, `python-service/routers/screener.py`
- **TDD:** `test_screener.py` first (mock nselib)
- **Accept:** POST /screener returns filtered ScreenerResult[] from 2000+ NSE stocks

#### P2-T03: Screener API Route
- **Files:** `src/app/api/stock/screener/route.ts`
- **TDD:** Integration test first
- **Accept:** Free users blocked at >3 filters (403), Pro users unrestricted

#### P2-T04: useScreener Hook
- **Files:** `src/hooks/useScreener.ts`, `src/store/screenerStore.ts`
- **TDD:** Hook tests first
- **Accept:** Filters update store, debounced run, results populate

#### P2-T05: Screener UI
- **Files:** `src/app/screener/page.tsx`, `src/components/screener/ScreenerBuilder.tsx`, `src/components/screener/FilterBlock.tsx`, `src/components/screener/ScreenerResults.tsx`
- **Accept:** Add/remove filters, run screener, sortable results table, save screener

#### P2-T06: SWOT Engine
- **Files:** `python-service/services/claude_service.py`, `python-service/routers/ai.py`, `src/app/api/ai/swot/route.ts`, `src/components/stock/SWOTCard.tsx`
- **TDD:** Test Claude service with mocked Anthropic client
- **Accept:** SWOT card shows 4 quadrants, generates via Claude, cached 6hrs, gated to PRO

#### P2-T07: Portfolio — NAV & P&L Logic
- **Files:** `src/lib/portfolio/nav.ts`, `src/lib/portfolio/pnl.ts`
- **TDD:** Write extensive tests first — XIRR, unrealized P&L, multi-lot FIFO, date edge cases
- **Accept:** calculateNAV(transactions, priceHistory) matches expected values for known inputs

#### P2-T08: Portfolio API Routes
- **Files:** `src/app/api/portfolio/route.ts`, `src/app/api/portfolio/[id]/route.ts`
- **TDD:** Integration tests with test DB
- **Accept:** Full CRUD, holdings computed live, NAV calculated server-side

#### P2-T09: usePortfolio Hook
- **Files:** `src/hooks/usePortfolio.ts`
- **TDD:** Hook tests first
- **Accept:** Load portfolio, add/remove transactions, NAV chart data returns

#### P2-T10: Portfolio UI
- **Files:** `src/app/portfolio/page.tsx`, `src/components/portfolio/PortfolioSummary.tsx`, `src/components/portfolio/HoldingsTable.tsx`, `src/components/portfolio/AddTransactionForm.tsx`, `src/components/portfolio/PortfolioNAVChart.tsx`
- **Accept:** Holdings show live P&L, add transaction form validates, NAV chart renders

#### P2-T11: Alerts Engine (lib)
- **Files:** `src/lib/alerts/evaluator.ts`
- **TDD:** `tests/unit/lib/alert-evaluator.test.ts` first — test all 9 trigger types
- **Accept:** evaluateAlert(alert, priceData) returns true/false correctly for all trigger types

#### P2-T12: Alerts API + Hook
- **Files:** `src/app/api/alerts/route.ts`, `src/hooks/useAlerts.ts`
- **TDD:** Tests first
- **Accept:** CRUD alerts, evaluate triggers on each price poll, send via FCM/Resend

#### P2-T13: Alerts UI
- **Files:** `src/app/alerts/page.tsx`, `src/components/alerts/AlertForm.tsx`, `src/components/alerts/AlertsList.tsx`
- **Accept:** Create alert from any stock page, manage active alerts, alert history

#### P2-T14: News Service + UI
- **Files:** `python-service/services/rss_service.py`, `python-service/routers/news.py`, `src/components/stock/NewsCard.tsx`, `src/components/dashboard/NewsfeedWidget.tsx`
- **Accept:** News from NSE RSS + Finnhub, filtered by ticker, categorized

#### P2-T15: IPO Page
- **Files:** `src/app/ipo/page.tsx`
- **Accept:** Upcoming IPO calendar with dates, lot size, GMP from yfinance + NSE RSS

#### P2-T16: Sector Heatmap
- **Files:** `src/components/charts/SectorHeatmap.tsx`, `src/components/dashboard/SectorHeatmapWidget.tsx`
- **Accept:** ECharts heatmap renders NSE sectors color-coded by day performance

#### P2-T17: Payments — Razorpay
- **Files:** `src/app/api/payments/route.ts`, `src/components/ui/UpgradeModal.tsx`
- **Accept:** Razorpay checkout opens, webhook updates user plan in Prisma, useSubscription reflects new plan

#### P2-T18: E2E — Portfolio + Screener
- **Files:** `tests/e2e/portfolio.spec.ts`, `tests/e2e/screener.spec.ts`
- **Accept:** Playwright: add transaction → holding appears → P&L correct, run screener → results filtered

---

### PHASE 3 — Power Features (Weeks 19–26)

#### P3-T01: MarketMind AI Chat
- **Files:** `src/app/api/ai/marketmind/route.ts`, `src/components/ai/MarketMindChat.tsx`
- **Accept:** Streaming SSE response, chat history in component state, PRO gate

#### P3-T02: Corporate Events & Analyst Calls
- **Files:** `src/components/stock/CorporateEventsList.tsx`, `src/components/stock/AnalystCallsTable.tsx`, `src/components/stock/ForecasterTable.tsx`
- **Accept:** Events timeline renders, analyst calls from Finnhub, sorted by date

#### P3-T03: Peers Comparison
- **Files:** `src/components/stock/PeersTable.tsx`
- **Accept:** Side-by-side table of 5 peers, key metrics compared, color-coded vs current stock

#### P3-T04: Superstar Investors Page
- **Files:** `src/app/superstar/page.tsx`
- **Accept:** List of known superstar investors, holdings from NSE quarterly disclosures (yfinance institutional holders)

#### P3-T05: Mobile Responsive Audit
- **Files:** All component files (responsive fixes)
- **Accept:** All pages render correctly at 375px width, bottom nav works, charts resize

#### P3-T06: Performance Audit
- **Files:** next.config.ts, all page.tsx files
- **Accept:** Lighthouse score >85 on stock page, all images optimized, no layout shift

---

## SECTION 14 — CODE REVIEW CHECKLIST

Before every PR/commit, verify all items:

### Correctness
- [ ] All new/modified functions have unit tests
- [ ] Tests actually test behavior, not implementation
- [ ] Null/undefined edge cases handled
- [ ] TypeScript — zero `any` types used
- [ ] No `console.log` left in code

### Data Integrity
- [ ] Financial numbers formatted via `formatters.ts`
- [ ] All dates in ISO 8601 format
- [ ] No hardcoded ticker symbols in logic (only in tests)
- [ ] API responses validated against TypeScript types at runtime (Zod)

### Security
- [ ] No API keys in client-side code
- [ ] All `/api/` routes that write data check auth
- [ ] Plan gating enforced server-side (not just client-side)
- [ ] No raw SQL — Prisma ORM only

### Performance
- [ ] No `useEffect` with missing dependencies
- [ ] React Query used for all server state (not useState + useEffect)
- [ ] Images use Next.js `<Image>` component
- [ ] No unnecessary re-renders (memo/useCallback where needed)

### UX
- [ ] Loading skeleton shown while data fetches
- [ ] Error state shown on failure with retry option
- [ ] Empty state shown when no data (not blank screen)
- [ ] All interactive elements keyboard-accessible

---

## SECTION 15 — OBSIDIAN GRAPH LINKS (Module Dependency Map)

Copy this into `docs/obsidian/00-index.md` as wikilinks for graph view:

```markdown
## Data Flow
[[yfinance-service]] → [[prices-router]] → [[stock-api-route]] → [[useStockData]] → [[StockHeader]] [[TechnicalChart]] [[FinancialsTable]]
[[nselib-service]] → [[screener-router]] → [[screener-api-route]] → [[useScreener]] → [[ScreenerBuilder]] [[ScreenerResults]]
[[claude-service]] → [[ai-router]] → [[swot-api-route]] → [[useStockData]] → [[SWOTCard]]
[[finnhub-service]] → [[news-router]] → [[stock-api-route]] → [[useStockData]] → [[NewsCard]]
[[rss-service]] → [[news-router]]

## Scoring
[[dvm-lib]] ← consumed by → [[DVMScoreCard]] [[HoldingsTable]] [[ScreenerResults]]
[[screener-engine]] ← consumed by → [[useScreener]]
[[nav-lib]] [[pnl-lib]] ← consumed by → [[usePortfolio]] → [[PortfolioSummary]] [[HoldingsTable]]
[[alert-evaluator]] ← consumed by → [[useAlerts]]

## Auth & Payments
[[firebase-lib]] → [[useAuth]] → [[Providers]] → all protected routes
[[useSubscription]] → [[useAuth]] → gating in [[useScreener]] [[SWOTCard]] [[MarketMindChat]]
[[razorpay-route]] → [[UpgradeModal]] → [[useSubscription]]

## Types (consumed by all)
[[stock-types]] [[portfolio-types]] [[screener-types]] [[alert-types]] [[user-types]]
```

---

## SECTION 16 — KNOWN CONSTRAINTS & GUARD RAILS

These are non-negotiable. If an agent encounters a situation that seems to require violating these, stop and ask.

1. **yfinance is for prototyping only** — if data is missing/stale, add a comment `// TODO: replace with FinEdge/Finnhub` not a workaround
2. **Never call external APIs directly from Next.js components** — always go through `/api/` routes or Python service
3. **All Claude API calls must have `max_tokens: 500`** for SWOT and `max_tokens: 1000` for MarketMind — cost control
4. **Screener filters beyond 3 for free users return 403** — enforced in API route, not just frontend
5. **SEBI disclaimer must appear on every stock page** — component: `<SEBIDisclaimer />` in StockHeader
6. **Redis TTL values are fixed** — prices=15s, info=5min, financials=60min, screener=5min, ai=360min. Do not change without explicit instruction
7. **Python service is internal only** — never expose `PYTHON_SERVICE_URL` to the client
8. **Prisma migrations are auto-generated** — never hand-edit files in `prisma/migrations/`

---

*Implementation Plan v1.0 | Covers: File Tree, Types, DB Schema, Env Vars, Plugins, TDD, Hooks, API Routes, AI Prompts, DVM Algorithm, Screener Engine, Component Rules, Phase Tasks, Code Review, Obsidian Graph*

---

# ADDENDUM — VERIFICATION GAPS FILLED (v1.1)

> The following sections were added after a verification pass. They close gaps that would otherwise cause coding agents to improvise, hallucinate APIs, or block. Sections 17–28.

---

## SECTION 17 — EXACT DEPENDENCY VERSIONS

Pin these exact versions. Do not run `npm install <pkg>@latest` — use these to avoid breaking-change drift.

### `package.json` dependencies
```json
{
  "dependencies": {
    "next": "14.2.18",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "typescript": "5.6.3",
    "@prisma/client": "5.22.0",
    "@tanstack/react-query": "5.59.0",
    "@tanstack/react-table": "8.20.5",
    "zustand": "4.5.5",
    "zod": "3.23.8",
    "firebase": "10.14.1",
    "firebase-admin": "12.7.0",
    "@anthropic-ai/sdk": "0.32.1",
    "lightweight-charts": "4.2.1",
    "echarts": "5.5.1",
    "echarts-for-react": "3.0.2",
    "recharts": "2.13.0",
    "lucide-react": "0.454.0",
    "razorpay": "2.9.5",
    "resend": "4.0.0",
    "date-fns": "4.1.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.4"
  },
  "devDependencies": {
    "prisma": "5.22.0",
    "tailwindcss": "3.4.14",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.47",
    "jest": "29.7.0",
    "@testing-library/react": "16.0.1",
    "@testing-library/jest-dom": "6.6.2",
    "@testing-library/user-event": "14.5.2",
    "jest-environment-jsdom": "29.7.0",
    "@playwright/test": "1.48.2",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.18",
    "prettier": "3.3.3",
    "@types/node": "20.17.0",
    "@types/react": "18.3.12"
  }
}
```

### `python-service/requirements.txt`
```
fastapi==0.115.4
uvicorn[standard]==0.32.0
yfinance==0.2.49
nselib==1.3
finnhub-python==2.4.21
anthropic==0.39.0
redis==5.2.0
pydantic==2.9.2
httpx==0.27.2
pytest==8.3.3
pytest-asyncio==0.24.0
python-dateutil==2.9.0
feedparser==6.0.11
pandas==2.2.3
```

> Note: If any pinned version is unavailable at install time, install the nearest available patch within the same minor version and record it in `docs/obsidian/decisions/ADR-004-version-drift.md`. Do NOT jump a major version.

---

## SECTION 18 — PACKAGE.JSON SCRIPTS

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "py:dev": "cd python-service && uvicorn main:app --reload --port 8000",
    "py:test": "cd python-service && pytest",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## SECTION 19 — LOCAL DEV ENVIRONMENT (docker-compose)

Add `docker-compose.yml` at root for Postgres + Redis. This is the ONLY infra needed locally.

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: stocklens
      POSTGRES_PASSWORD: stocklens
      POSTGRES_DB: stocklens
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

**Startup order (document in README):**
```
1. docker compose up -d        # Postgres + Redis
2. pnpm db:migrate             # Create tables
3. pnpm py:dev                 # Python service on :8000
4. pnpm dev                    # Next.js on :3000
```

---

## SECTION 20 — TICKER RESOLUTION & SEED DATA

**Problem this solves:** Agents will not know how to map a user search ("reliance") to a ticker ("RELIANCE.NS"). This must be deterministic, not guessed.

### Seed data file: `python-service/data/nse_tickers.json`
```json
[
  { "ticker": "RELIANCE", "name": "Reliance Industries Ltd", "exchange": "NSE", "sector": "Energy", "isin": "INE002A01018" },
  { "ticker": "TCS", "name": "Tata Consultancy Services Ltd", "exchange": "NSE", "sector": "IT", "isin": "INE467B01029" }
]
```
- This file is generated once by running `python-service/scripts/fetch_ticker_list.py` (uses nselib `nse_eq_symbols()`)
- It is loaded into memory on Python service startup and into `StockCache` table
- Search endpoint matches against `name` (fuzzy) and `ticker` (prefix)

### Ticker format rules (CANONICAL — never deviate)
```
Internal storage:  bare symbol, no suffix      → "RELIANCE"
yfinance calls:    append .NS (NSE) or .BO (BSE) → "RELIANCE.NS"
URL routes:        bare symbol                   → /stock/RELIANCE
Display:           bare symbol + exchange badge  → "RELIANCE  NSE"
```
A helper `toYFinanceTicker(symbol, exchange)` in `src/lib/utils/formatters.ts` is the ONLY place suffixes are added.

---

## SECTION 21 — ERROR HANDLING & FALLBACK MATRIX

When a data source fails, agents must follow this exact fallback chain — never invent data.

| Data Needed | Primary | Fallback 1 | Fallback 2 | If all fail |
|---|---|---|---|---|
| Live price | yfinance | nselib | (none) | Show "—" + "Data unavailable" |
| Historical OHLCV | yfinance | (none) | (none) | Show empty chart + message |
| Fundamentals | FinEdge | yfinance | Finnhub | Show "—" per missing field |
| Company news | Finnhub | NSE RSS | yfinance.news | Show "No recent news" |
| Analyst calls | Finnhub | (none) | (none) | Hide section entirely |
| DVM score | computed locally | (none) | (none) | Show "Insufficient data" |

### Standard error response shape (ALL API routes)
```typescript
// src/types/api.ts
export interface ApiError {
  error: true
  code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'RATE_LIMITED'
       | 'UPSTREAM_FAILURE' | 'VALIDATION_ERROR' | 'INTERNAL'
  message: string          // User-safe message
  details?: unknown        // Dev-only, stripped in production
}

export type ApiResponse<T> = T | ApiError
```

### Rule: Never let a missing data point crash a page
```typescript
// Every numeric field that comes from external API is `number | null`
// Components render formatCurrency(null) === "—" (formatter handles null)
// NEVER throw on missing data — degrade gracefully
```

---

## SECTION 22 — CACHING & RATE LIMIT IMPLEMENTATION

### Redis key naming convention (CANONICAL)
```
price:{ticker}                    TTL 15s
info:{ticker}                     TTL 300s
financials:{ticker}               TTL 3600s
history:{ticker}:{period}:{interval}  TTL 300s (intraday) / 3600s (daily+)
screener:{queryHash}              TTL 300s
news:{ticker}                     TTL 600s
ai:swot:{ticker}                  TTL 21600s (6hr)
ratelimit:{userId}:{endpoint}     TTL 60s (sliding window)
```

### Rate limiter pattern (use in every protected/expensive route)
```typescript
// src/lib/utils/rateLimit.ts
// Returns true if allowed, false if limit exceeded
async function checkRateLimit(
  userId: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean>
// Implementation: Redis INCR with EXPIRE; first request sets TTL
```

### Rate limits per endpoint (enforce server-side)
```
/api/stock/screener      10 req/min  per user
/api/ai/swot              5 req/hr   per user
/api/ai/marketmind       20 req/day  per user
/api/stock/[ticker]      60 req/min  per user
```

---

## SECTION 23 — AUTH FLOW DETAIL (Firebase ↔ Prisma)

**Problem this solves:** Agents commonly get confused about where the "user" lives — Firebase or the DB. This is the canonical flow.

```
1. Client signs in via Firebase (Google/email) → gets Firebase ID token
2. Client sends ID token in Authorization: Bearer <token> on every API call
3. Server middleware (src/lib/auth/verifyToken.ts) verifies token via firebase-admin
4. Server extracts firebaseUid → looks up / upserts Prisma User
5. On FIRST login: POST /api/auth/sync creates the Prisma User row
6. dbUser.plan is the source of truth for subscription gating
```

### `src/lib/auth/verifyToken.ts`
```typescript
// Verifies Firebase ID token from request header
// Returns { firebaseUid, email } or throws ApiError(UNAUTHORIZED)
async function verifyToken(req: Request): Promise<{ firebaseUid: string, email: string }>
```

### Protected route pattern (use in EVERY write route)
```typescript
export async function POST(req: Request) {
  const { firebaseUid } = await verifyToken(req)   // throws 401 if invalid
  const user = await prisma.user.findUnique({ where: { firebaseUid } })
  if (!user) return apiError('UNAUTHORIZED', 'User not found')
  // ... proceed with user.id
}
```

---

## SECTION 24 — DESIGN TOKENS (globals.css — exact values)

**Problem this solves:** Component Rule 4 says "use color tokens" but never defined them in code. Here they are. Agents copy this verbatim into `src/app/globals.css`.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Dark mode (default) */
  --color-bg-base: #0D1117;
  --color-bg-surface: #161B22;
  --color-bg-elevated: #21262D;
  --color-border: #30363D;
  --color-text-primary: #E6EDF3;
  --color-text-secondary: #8B949E;
  --color-text-muted: #484F58;
  --color-accent-blue: #2F81F7;
  --color-green: #3FB950;
  --color-red: #F85149;
  --color-amber: #D29922;
  --color-purple: #8B5CF6;
  --color-teal: #39D353;
}

[data-theme="light"] {
  --color-bg-base: #FFFFFF;
  --color-bg-surface: #F6F8FA;
  --color-bg-elevated: #EAEEF2;
  --color-border: #D0D7DE;
  --color-text-primary: #1F2328;
  --color-text-secondary: #656D76;
  --color-text-muted: #8C959F;
  /* semantic colors (green/red/amber/blue/purple) stay identical */
  --color-accent-blue: #2F81F7;
  --color-green: #1A7F37;
  --color-red: #CF222E;
  --color-amber: #9A6700;
  --color-purple: #8250DF;
  --color-teal: #1A7F37;
}

body {
  background: var(--color-bg-base);
  color: var(--color-text-primary);
}
```

### `tailwind.config.ts` — map tokens to utility classes
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-bg-base)',
        surface: 'var(--color-bg-surface)',
        elevated: 'var(--color-bg-elevated)',
        border: 'var(--color-border)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent-blue)',
        gain: 'var(--color-green)',
        loss: 'var(--color-red)',
        warn: 'var(--color-amber)',
        ai: 'var(--color-purple)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## SECTION 25 — FORMATTERS EXACT BEHAVIOR (test-ready spec)

**Problem this solves:** Section 12 Rule 5 references formatters but the Indian number formatting (Lakh/Crore) is non-obvious. This is the exact spec to test against.

```typescript
// src/lib/utils/formatters.ts

formatCurrency(value: number | null): string
// null        → "—"
// 0           → "₹0"
// 1234        → "₹1,234"
// 123456      → "₹1.23L"           (1 lakh = 100,000)
// 12345678    → "₹1.23Cr"          (1 crore = 10,000,000)
// 123456789012 → "₹12,345.68Cr"

formatPct(value: number | null): string
// null   → "—"
// 2.567  → "+2.57%"
// -1.234 → "-1.23%"
// 0      → "0.00%"

formatLargeNumber(value: number | null): string   // no ₹ symbol
// 12345678 → "1.23Cr"
// 123456   → "1.23L"
// 1234     → "1,234"

formatDate(iso: string): string
// "2026-06-18" → "18 Jun 2026"

toYFinanceTicker(symbol: string, exchange: 'NSE' | 'BSE'): string
// ("RELIANCE", "NSE") → "RELIANCE.NS"
// ("RELIANCE", "BSE") → "RELIANCE.BO"
```

Indian numbering uses 2-digit grouping after the first 3 (e.g., 1,23,45,678). The currency abbreviations (L/Cr) are the primary display; full grouped format is only for the Cr+ range.

---

## SECTION 26 — DEFINITION OF DONE (per task)

A task is ONLY complete when ALL of these are true. Agents must self-verify before marking done.

```
[ ] Code compiles: pnpm typecheck → 0 errors
[ ] Tests written FIRST and now pass: pnpm test --testPathPattern=<module>
[ ] Coverage on new lib/ or hooks/ file ≥ 80%
[ ] No `any` types introduced
[ ] No hardcoded colors (token classes only)
[ ] No console.log statements
[ ] Loading + error + empty states handled (for UI tasks)
[ ] Acceptance criteria in the task block verified manually
[ ] Obsidian note updated: docs/obsidian/progress/phase-N.md task checked off
[ ] Commit made with conventional message
```

---

## SECTION 27 — GIT WORKFLOW & HOOKS

### Branch naming
```
feat/p1-t07-dvm-scoring
fix/p2-t10-holdings-pnl
test/p1-t04-yfinance-service
```

### Husky pre-commit hook (`.husky/pre-commit`)
```bash
#!/bin/sh
pnpm typecheck && pnpm lint && pnpm test --bail --findRelatedTests
```

### Husky pre-push hook (`.husky/pre-push`)
```bash
#!/bin/sh
pnpm test:coverage
```

Install: `pnpm add -D husky lint-staged` then `npx husky init`

### `lint-staged` config (in package.json)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.py": ["ruff check --fix"]
  }
}
```

---

## SECTION 28 — AGENT ANTI-HALLUCINATION RULES

Hard rules specifically to prevent lower models from inventing things. If a rule below conflicts with the agent's instinct, the rule wins.

1. **Never invent an API endpoint.** Only the endpoints in Sections 8 and 22 exist. If you need data not covered, STOP and add a note to `docs/obsidian/decisions/`, do not fabricate a route.

2. **Never invent an npm package.** Only packages in Section 17 are approved. If you think you need another, STOP and flag it — do not `import` something not listed.

3. **Never invent a yfinance/nselib method.** Approved methods only:
   - yfinance: `Ticker().fast_info`, `.history()`, `.info`, `.financials`, `.balance_sheet`, `.cashflow`, `.news`, `.institutional_holders`
   - nselib: `capital_market.nse_eq_symbols()`, `capital_market.price_volume_data()`, `capital_market.fno_bhav_copy()`
   If a method isn't listed, search the official docs — do not guess a method name.

4. **Never fabricate financial data in tests.** Use the fixed mock fixtures in `tests/fixtures/` (create `reliance.mock.json` once, reuse everywhere).

5. **Never change a TTL, weight, rate limit, or token cap** defined in this document. These are tuned values.

6. **Never assume a field exists on an external API response.** yfinance returns inconsistent data — always null-check and use the Section 21 fallback matrix.

7. **When uncertain about a type,** import it from `src/types/` — never define a local `interface` that duplicates an existing canonical type.

8. **If a task seems to need a file not in the File Tree (Section 1),** STOP. Either you misunderstood the task or the tree needs updating — ask, don't create.

### Test Fixtures (create once, in P1-T02)
```
tests/fixtures/
├── reliance.mock.json       # Full StockInfo + financials for RELIANCE
├── ohlcv-1y.mock.json       # 252 trading days of OHLCV
├── screener-results.mock.json  # 50 ScreenerResult rows
└── portfolio.mock.json      # Sample portfolio with 5 holdings
```

---

*Implementation Plan v1.1 | Verified & gap-filled. Added Sections 17–28: dependency versions, scripts, docker-compose, ticker resolution, error/fallback matrix, caching/rate-limit impl, auth flow, design tokens CSS, formatter specs, definition of done, git hooks, anti-hallucination rules.*
