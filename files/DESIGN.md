# StockLens — Design Document
> A comprehensive stock market analytics platform for Indian equity investors

---

## 1. Product Overview

**StockLens** is a data-driven stock market analytics platform targeting retail investors, research analysts, and portfolio advisors in the Indian equity market (NSE/BSE). It delivers deep fundamental and technical analysis, AI-powered screening, portfolio management, and real-time alerts — in one unified experience.

### Vision
Democratize institutional-grade stock research for every Indian investor.

### Target Users
| Segment | Profile | Primary Need |
|---|---|---|
| Retail Investors | Self-directed, new to intermediate | Stock discovery, simplified scores, watchlists |
| Research Analysts | Financial professionals | Screeners, bulk data exports, broker call aggregation |
| Portfolio Advisors | HNI/advisory firms | Portfolio NAV, multi-client reporting, risk tools |

---

## 2. Core Feature Modules

### 2.1 Stock Discovery & Screener

**Purpose:** Help users find stocks matching specific criteria from 1,500+ parameters.

**Key Features:**
- Advanced multi-parameter screener (fundamental + technical)
- Expert strategy templates (e.g., "Graham Value Picks", "Momentum Leaders", "Red Flag Stocks")
- Real-time screener results with sorting and pagination
- Save, name, and share custom screener queries
- One-click alert creation from any screener result

**Data Parameters (examples):**
- P/E, P/B, EV/EBITDA, Debt-to-Equity
- Revenue growth (1Y, 3Y, 5Y CAGR)
- RSI, MACD, Bollinger Bands
- Promoter holding, FII/DII activity
- Insider trades, bulk/block deals

---

### 2.2 Stock Analysis Page

Each stock gets a dedicated analysis page with the following sections:

#### 2.2.1 DVM Score (Distinctive Scoring System)
A composite score (0–100) across three axes:
- **D** — Durability (business quality, moat)
- **V** — Valuation (fair value vs. current price)
- **M** — Momentum (price trend, volume signals)

Displayed as a traffic-light badge and a spider/radar chart.

#### 2.2.2 SWOT Engine
Automated SWOT across:
- **Strengths:** Consistent revenue growth, low debt, strong promoter holding
- **Weaknesses:** Declining margins, high receivables cycle
- **Opportunities:** Sector tailwinds, new product launches
- **Threats:** Regulatory risk, auditor qualifications, broker downgrades

#### 2.2.3 Financials
- Income Statement, Balance Sheet, Cash Flow (annual + quarterly)
- Key ratios trend charts (5-year history)
- Customizable metric tables (up to 600 parameters for paid users)
- YoY and QoQ variance highlighting

#### 2.2.4 Technical Analysis
- Candlestick chart with SMA, EMA, VWAP overlays
- Volume & delivery percentage analysis
- Support/resistance levels auto-plotted
- Trend lines (user-drawable)

#### 2.2.5 Analyst Recommendations
- Aggregated Buy / Hold / Sell calls from 40+ brokerages
- Consensus price target with upside/downside %
- Timeline of rating changes and upgrades/downgrades
- Source: ICICI Direct, Motilal Oswal, HDFC Securities, Emkay, etc.

#### 2.2.6 Forecaster (Consensus Estimates)
- Forward EPS, Revenue, Net Profit estimates
- Dividend, CapEx, Depreciation projections
- Analyst estimate revision trends
- Earnings surprise history

#### 2.2.7 Corporate Events & News
- Result dates, board meetings, dividend records
- Regulatory filings (NSE/BSE announcements)
- Conference call AI summaries (AI-generated from transcripts)
- Real-time news feed filtered to this stock

---

### 2.3 Portfolio Manager

**Purpose:** Track, analyze, and optimize personal investment portfolios.

**Key Features:**

| Feature | Description |
|---|---|
| Portfolio NAV | Point-to-point return tracking (lot-level transactions) |
| Decision Analyzer | Buy/Hold/Sell suggestions based on DVM changes |
| Valuation Tracker | Monitors if holdings are over/undervalued over time |
| Earnings Tracker | Flags upcoming results for portfolio stocks |
| P&L Report | Realized and unrealized gains with XIRR |
| Multi-Portfolio | Separate portfolios for different strategies |

**Portfolio Import Methods:**
- Manual entry (stock + date + price + quantity)
- CSV/Excel upload
- Broker API integration (Zerodha, Groww, Angel, ICICI, HDFC) — *Phase 2*

---

### 2.4 Watchlists

- Create multiple named watchlists
- Track price, DVM score, analyst rating, % change per stock
- One-click alert setup from watchlist row
- Watchlist performance chart (aggregated returns)
- Share watchlists publicly or with specific users

---

### 2.5 Alerts Engine

Alert triggers (70+ criteria):
- Price thresholds (absolute and % change)
- DVM score change
- New analyst rating / price target update
- Corporate action (dividend, split, bonus, rights)
- Earnings result published
- Insider trade filed
- Volume spike (2x, 3x, 5x average)
- FII/DII net buy/sell threshold

**Delivery channels:** Push notification, Email, SMS (optional)

---

### 2.6 Superstar Investor Tracker

- Track portfolios of prominent investors disclosed in SEBI/exchange filings
- India: Rakesh Jhunjhunwala estate, Radhakishan Damani, Vijay Kedia, Dolly Khanna, etc.
- Global: Warren Buffett (Berkshire), Ken Griffin (Citadel), Bill Ackman, etc.
- Get alerts when superstar investors add/exit positions
- See overlap between your portfolio and a superstar's holdings

---

### 2.7 IPO Center

- Upcoming IPO calendar (dates, lot size, price band, GMP)
- IPO subscription status (live during offer period)
- Historical IPO performance (listing day gains, 1Y returns)
- IPO analysis cards with DVM-style scoring

---

### 2.8 F&O (Futures & Options)

- Options chain with OI, IV, PCR per strike
- Options screener (unusual OI buildup, IV rank, etc.)
- F&O ban list
- Max Pain, OI change charts
- Strategy payoff visualizer (straddle, strangle, etc.) — *Phase 2*

---

### 2.9 MarketMind AI

An AI assistant embedded throughout the platform:
- Natural language stock queries ("Show me profitable small-caps with low debt")
- Earnings call Q&A ("What did the CFO say about margins?")
- Portfolio risk summary in plain language
- AI-generated research notes (experimental)

---

### 2.10 Newsfeed & Market Dashboard

**Market Dashboard:**
- Index snapshot (Nifty 50, Sensex, Bank Nifty, Nifty IT, Midcap, Smallcap)
- Global indices (Nasdaq, S&P 500, FTSE, Hang Seng, Nikkei)
- Sector heatmap (color-coded by day's performance)
- FII/DII activity summary
- Advance/Decline ratio

**Newsfeed:**
- Aggregated from NSE/BSE filings, Reuters, ET, Moneycontrol, etc.
- Filtered to user's portfolio + watchlist
- Tagged by category: Results, Corporate Action, Analyst, Regulatory

---

## 3. Information Architecture

```
StockLens
├── Home / Market Dashboard
│   ├── Index Snapshot
│   ├── Sector Heatmap
│   ├── Top Movers (Gainers / Losers / Volume)
│   └── Personalized Newsfeed
│
├── Stocks
│   ├── Search (global search bar)
│   ├── Stock Page
│   │   ├── Overview (DVM Score, Price, Analyst Rating)
│   │   ├── SWOT
│   │   ├── Financials
│   │   ├── Technical Chart
│   │   ├── Forecaster
│   │   ├── Peers Comparison
│   │   ├── Analyst Calls
│   │   ├── Corporate Events
│   │   └── News
│   └── Compare Stocks (side-by-side)
│
├── Screener
│   ├── New Screener (builder UI)
│   ├── My Screeners (saved)
│   ├── Expert Screeners (templates)
│   └── Results View
│
├── Portfolio
│   ├── Overview (NAV, P&L)
│   ├── Holdings Table
│   ├── Decision Analyzer
│   ├── Earnings Tracker
│   └── Reports
│
├── Watchlists
│   ├── My Watchlists
│   └── Shared Watchlists
│
├── Alerts
│   ├── Active Alerts
│   └── Alert History
│
├── IPO
│   ├── Upcoming
│   ├── Live
│   └── Past Performance
│
├── F&O
│   ├── Options Chain
│   ├── F&O Screener
│   └── OI Analysis
│
├── Superstar Investors
│
├── MarketMind AI
│
└── Account & Settings
    ├── Subscription Plan
    ├── Notification Preferences
    ├── Broker Connections
    └── Data Export
```

---

## 4. Design System

### 4.1 Design Philosophy

> **"Data-dense without being overwhelming."**

StockLens serves power users who need maximum information density, and newcomers who need progressive disclosure. The design must do both simultaneously. Precision and trust are the dominant values — every pixel earns its place by conveying information.

---

### 4.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-base` | `#0D1117` | Primary background (dark mode default) |
| `--color-bg-surface` | `#161B22` | Cards, panels, modals |
| `--color-bg-elevated` | `#21262D` | Hover states, secondary panels |
| `--color-border` | `#30363D` | Dividers, table borders |
| `--color-text-primary` | `#E6EDF3` | Primary text |
| `--color-text-secondary` | `#8B949E` | Labels, metadata, placeholders |
| `--color-text-muted` | `#484F58` | Disabled, tertiary text |
| `--color-accent-blue` | `#2F81F7` | Links, CTAs, active nav |
| `--color-green` | `#3FB950` | Gain, positive delta, buy signal |
| `--color-red` | `#F85149` | Loss, negative delta, sell signal |
| `--color-amber` | `#D29922` | Warning, hold signal, caution |
| `--color-purple` | `#8B5CF6` | AI features, MarketMind |
| `--color-teal` | `#39D353` | DVM high score range |

**Light Mode:** Inverted surface colors with `#FFFFFF` base, `#F6F8FA` surface, maintaining the same semantic color tokens for gains/losses/signals.

---

### 4.3 Typography

| Role | Typeface | Usage |
|---|---|---|
| Display | **Inter** 700–900 | Hero headlines, page titles |
| Body | **Inter** 400–500 | All prose, descriptions, labels |
| Data / Mono | **JetBrains Mono** | Stock prices, % changes, financial figures, screener values |
| Numeric Accent | **Inter Tabular** variant | Large score displays, index values |

**Type Scale (rem):**
```
xs:   0.75  / 12px — Table captions, tags
sm:   0.875 / 14px — Body copy, table data
base: 1.0   / 16px — Default UI text
lg:   1.125 / 18px — Section headers, card titles
xl:   1.25  / 20px — Page section titles
2xl:  1.5   / 24px — Module headings
3xl:  1.875 / 30px — Feature headlines
4xl:  2.25  / 36px — Stock price hero, DVM score
```

---

### 4.4 Component Library

#### Cards
- `StockCard` — compact summary (ticker, price, change %, DVM badge)
- `AnalystCard` — broker name, call type, target price, date
- `AlertCard` — trigger type, stock, timestamp, action CTA
- `IPOCard` — company name, dates, GMP, subscription status

#### Data Tables
- Sticky header with sort controls
- Color-coded cells (green/red for positive/negative values)
- Inline sparklines in trend columns
- Lazy-load pagination (infinite scroll or numbered)
- Column picker for customizable views

#### Charts
- Candlestick chart (TradingView Lightweight Charts or ECharts)
- Area/Line charts for portfolio NAV, financial trends
- Radar/Spider chart for DVM scoring breakdown
- Heatmap for sector performance
- Bar chart for FII/DII flows

#### Score Badges
```
DVM Score:
● 80–100  →  [●●●] Deep Green   "Strong Buy Zone"
● 60–79   →  [●●○] Light Green  "Buy Zone"
● 40–59   →  [●○○] Amber        "Hold / Caution"
● 0–39    →  [○○○] Red          "Weak / Avoid"
```

#### Screener Builder
- Drag-and-drop filter blocks
- Parameter autocomplete search
- Range sliders for numeric filters
- Dropdown for categorical filters
- Logic operators (AND / OR / NOT)
- Live result count preview as filters are applied

---

### 4.5 Layout & Grid

**Desktop (≥1280px):**
- 12-column grid, 24px gutters
- Left sidebar navigation (240px, collapsible to 60px icon rail)
- Main content area with optional right data panel (320px)

**Tablet (768–1279px):**
- Sidebar collapses to bottom tab bar
- 8-column grid
- Right panel becomes a full-width expandable drawer

**Mobile (<768px):**
- Bottom navigation (5 tabs: Home, Stocks, Screener, Portfolio, Alerts)
- Full-width cards
- Tabbed content inside stock pages (Overview / Financials / Technical / News)

---

### 4.6 Motion & Animation

| Interaction | Animation | Duration |
|---|---|---|
| Page transitions | Fade + slide up (12px) | 200ms ease-out |
| Chart data load | Bar/line grow from baseline | 400ms ease-in-out |
| Alert trigger pulse | Green ring pulse on badge | 1s, 2 iterations |
| Score badge | Count-up on first view | 600ms |
| Skeleton loaders | Shimmer left-to-right | 1.2s loop |
| Hover on table row | Background fade to elevated | 80ms |

Respect `prefers-reduced-motion`: all animations reduce to instant state changes.

---

## 5. Data Architecture (High-Level)

### 5.1 External API Stack (Finalized — Free / Low Cost)

All APIs below require **no broker account** and are either completely free or have a usable free tier to start with.

#### 📈 Live Prices & Historical Data

| API | Cost | What We Use It For | Notes |
|---|---|---|---|
| **yfinance** (Python library) | Free | Live prices, OHLCV history, basic fundamentals, options chain | Add `.NS` for NSE, `.BO` for BSE. Unofficial — fine for MVP |
| **nselib** (Python library) | Free | NSE live quotes, indices, gainers/losers, F&O data, 52-week highs | Wraps NSE public website |

```python
# yfinance usage
import yfinance as yf
stock = yf.Ticker("RELIANCE.NS")   # NSE stock
stock.history()        # OHLCV price history
stock.financials       # Income statement
stock.balance_sheet    # Balance sheet
stock.cashflow         # Cash flow statement
stock.info             # P/E, market cap, sector
stock.news             # Latest news
```

> ⚠️ **Scale note:** Once the product has 50–100 paying users, open a free **Fyers** or **Dhan** demat account (30 min online, no deposit required) to upgrade to their proper real-time broker API at no extra cost.

---

#### 📊 Fundamental Financial Data

| API | Cost | What We Use It For | Signup |
|---|---|---|---|
| **FinEdge API** | Free tier available | P&L, Balance Sheet, Cash Flow, Ratios — India-specific | Email signup at finedgeapi.com |
| **Finnhub** | Free (60 req/min) | Company fundamentals, earnings history, analyst ratings, news | Email signup at finnhub.io |
| **Financial Modeling Prep (FMP)** | Free (250 req/day) | Financial statements, key ratios, historical data (backup) | Email signup at financialmodelingprep.com |

```javascript
// Finnhub — stock quote
fetch('https://finnhub.io/api/v1/quote?symbol=RELIANCE.NS&token=YOUR_KEY')

// Finnhub — company financials
fetch('https://finnhub.io/api/v1/stock/financials-reported?symbol=RELIANCE.NS&token=YOUR_KEY')
```

---

#### 📰 News & Corporate Filings

| Source | Cost | What We Use It For |
|---|---|---|
| **NSE Announcements RSS** | Free, no signup | Corporate announcements, result dates, board meetings |
| **BSE Corporate Filings RSS** | Free, no signup | Official filings, regulatory disclosures |
| **Finnhub News API** | Free tier | Company-specific news aggregated from multiple sources |
| **Google News RSS** | Free, no signup | General financial news by company/ticker keyword |

```
NSE RSS: https://www.nseindia.com/companies-listing/corporate-filings-announcements
BSE RSS: https://www.bseindia.com/corporates/ann.html
```

---

#### 🤖 AI Features (MarketMind, SWOT, Summaries)

| API | Cost | What We Use It For |
|---|---|---|
| **Anthropic Claude API** | Free credits to start, then pay-per-token | Earnings call summaries, SWOT generation, MarketMind AI natural language queries, AI research notes |
| **Google Gemini API** | Free tier (generous) | PDF annual report parsing, document analysis backup |

---

#### 🔐 Authentication

| Service | Cost | What We Use It For |
|---|---|---|
| **Firebase Auth** | Free up to 10,000 users/mo | Email/password login, Google OAuth, Apple OAuth, phone OTP |

---

#### 💳 Payments & Subscriptions

| Service | Cost | What We Use It For |
|---|---|---|
| **Razorpay** | Free to integrate, 2% per transaction | UPI, cards, netbanking, recurring subscriptions — India-native |

---

#### 🔔 Notifications & Alerts

| Service | Cost | What We Use It For |
|---|---|---|
| **Firebase Cloud Messaging (FCM)** | Free | Push notifications — web, Android, iOS |
| **Resend** | Free up to 3,000 emails/mo | Transactional emails — alert triggers, reports, welcome |
| **MSG91** | ₹0.18–₹0.25/SMS | SMS alerts (optional, Phase 2) |

---

#### 📉 Charting (Frontend Libraries)

| Library | Cost | What We Use It For |
|---|---|---|
| **TradingView Lightweight Charts** | Free (open source) | Candlestick, area, bar price charts |
| **Apache ECharts** | Free (open source) | Financial trend charts, sector heatmap, radar/spider (DVM score), FII/DII bar charts |
| **Recharts** | Free (open source) | Simple portfolio NAV line charts, P&L summaries |

---

### 5.2 Complete API Stack Summary

```
Live Prices & History    →  yfinance (free, no account needed)
NSE Live Data            →  nselib Python library (free, no account needed)
Fundamentals (India)     →  FinEdge API (free tier, email signup only)
Fundamentals (global)    →  Finnhub (free tier, email signup only)
Fundamentals (backup)    →  Financial Modeling Prep (free tier, email signup only)
Corporate Filings/News   →  NSE/BSE RSS feeds (free, no signup)
AI Features              →  Claude API (free credits → pay-per-token)
Auth                     →  Firebase Auth (free up to 10K users)
Push Notifications       →  FCM (free)
Email Alerts             →  Resend (free up to 3K/mo)
Payments                 →  Razorpay (2% per transaction, no monthly fee)
Price Charts             →  TradingView Lightweight Charts (free, open source)
All Other Charts         →  Apache ECharts (free, open source)
```

### 5.3 Monthly Cost Estimate

| Stage | Monthly API Cost |
|---|---|
| **MVP (0–1K users)** | ₹0 — entirely on free tiers |
| **Early Growth (1K–10K users)** | ~₹1,500–3,000 (Claude API usage) |
| **Scale (10K+ users)** | ~₹5,000–10,000 (Claude API + upgrade FinEdge/Finnhub tiers) |

---

### 5.4 Data Sources (Internal Flow)

| Source | Data | Frequency |
|---|---|---|
| yfinance | Live price, OHLCV, basic fundamentals | ~15 min delayed (free tier) |
| nselib | NSE live quotes, indices, F&O | Near real-time |
| FinEdge API | P&L, Balance Sheet, Cash Flow (India) | Quarterly (post-results) |
| Finnhub | Earnings, analyst ratings, company news | Daily |
| NSE/BSE RSS | Corporate actions, announcements, results | Near real-time |
| Claude API | AI summaries, SWOT generation | On-demand (post-event) |

### 5.5 Core Data Models

```
Stock
├── id, ticker (NSE/BSE), isin
├── name, sector, industry, market_cap_segment
├── dvm_score { durability, valuation, momentum, composite }
├── swot { strengths[], weaknesses[], opportunities[], threats[] }
├── price_data { ohlcv[], last_price, change_pct }
├── financials { income_stmt[], balance_sheet[], cash_flow[] }
├── analyst_calls { broker, call_type, target_price, date }[]
├── forecasts { metric, year, estimate, num_analysts }[]
└── corporate_events { type, date, description }[]

Portfolio
├── id, user_id, name
├── transactions { stock_id, date, price, quantity, type }[]
├── holdings (computed) { stock_id, avg_cost, current_value, pnl }[]
└── nav_history { date, value }[]

Screener
├── id, user_id, name, is_public
├── filters { parameter_key, operator, value }[]
└── last_result_count, last_run_at
```

---

## 6. Subscription & Monetization

### 6.1 Plan Structure

| Feature | Free | Basic | Pro | Institutional |
|---|---|---|---|---|
| Screener params | 50 | 200 | 1,500+ | 1,500+ |
| Saved screeners | 2 | 10 | Unlimited | Unlimited |
| Alerts | 5 | 30 | Unlimited | Unlimited |
| Portfolio stocks | 10 | 50 | Unlimited | Unlimited |
| Analyst calls | Last 3 months | 1 year | All history | All history |
| Forecaster data | — | Basic | Full | Full |
| AI summaries | — | — | ✓ | ✓ |
| Data export | — | CSV | CSV + Excel | API access |
| Custom metrics | 30 | 100 | 600 | Custom |
| Price | Free | ₹499/mo | ₹999/mo | Custom |

### 6.2 Freemium Entry Points
- All stock pages accessible to free users with limited data depth
- Screener builder accessible; execution gated at >3 filters
- Portfolio management up to 10 stocks free
- Upsell modals appear contextually ("See 5Y data with Pro")

---

## 7. Technical Stack (Recommended)

### Frontend
- **Framework:** Next.js 14 (App Router) + TypeScript
- **State:** Zustand (local UI state) + React Query (server state)
- **Charts:** TradingView Lightweight Charts (candlestick) + Apache ECharts (all other charts)
- **Table:** TanStack Table v8
- **Styling:** Tailwind CSS + CSS custom properties for theming
- **Real-time:** WebSocket (live price feed via nselib)

### Backend
- **API:** Node.js (Fastify) or Go for high-throughput data endpoints
- **Data Layer:** Python microservice (FastAPI) — runs yfinance + nselib data fetching, Claude API calls
- **Database:** PostgreSQL (relational data) + TimescaleDB (time-series price data)
- **Cache:** Redis (price ticks, screener results, session)
- **Queue:** BullMQ (alert processing, async jobs)

### External Services (Finalized Free Stack)
- **Market Data:** yfinance + nselib (free, no broker account)
- **Fundamentals:** FinEdge API + Finnhub (free tiers)
- **Corporate Filings:** NSE/BSE RSS feeds (free)
- **AI:** Anthropic Claude API (pay-per-token)
- **Auth:** Firebase Auth (free up to 10K users)
- **Payments:** Razorpay (2% per transaction)
- **Push Notifications:** Firebase Cloud Messaging — FCM (free)
- **Email:** Resend (free up to 3,000/mo)

### Infrastructure
- **Cloud:** AWS or GCP (India region — ap-south-1)
- **CDN:** CloudFront / Cloud CDN for static assets and chart data
- **Search:** Elasticsearch (stock search, screener parameter search)
- **Auth:** Firebase Auth + JWT access tokens

---

## 8. Phase-wise Roadmap

### Phase 1 — MVP (Months 1–6)
- [ ] Stock search and basic stock page (price, financials, news)
- [ ] DVM scoring system (v1)
- [ ] Basic screener (50 parameters)
- [ ] Watchlist (single list, up to 20 stocks)
- [ ] Price alerts (threshold only)
- [ ] User auth + basic freemium plan

### Phase 2 — Core Platform (Months 7–12)
- [ ] Full screener (500+ parameters, save/share)
- [ ] SWOT engine
- [ ] Portfolio manager (manual entry, NAV tracking)
- [ ] Analyst call aggregation (10+ brokers)
- [ ] Forecaster (consensus estimates)
- [ ] IPO center
- [ ] Superstar investor tracker
- [ ] Push notifications + email alerts

### Phase 3 — Power Features (Months 13–18)
- [ ] F&O analytics and options screener
- [ ] MarketMind AI (natural language queries)
- [ ] AI-generated earnings call summaries
- [ ] Broker API integration (Zerodha Kite Connect, Angel Broking)
- [ ] Institutional plan + data export API
- [ ] Mobile apps (iOS + Android — React Native)

### Phase 4 — Ecosystem (Months 19–24)
- [ ] Social features (follow analysts, share ideas)
- [ ] Baskets / Thematic investing
- [ ] Global equities (US market data)
- [ ] Mutual fund analytics
- [ ] B2B white-label offering

---

## 9. Compliance & Legal Considerations

- **SEBI Disclaimer:** Platform provides data and analysis tools, not investment advice. Required on all stock pages and analytics.
- **Data Licensing:** NSE/BSE live data feed requires licensing agreement and exchange approval.
- **PDPA/IT Act:** User data handling must comply with India's data protection framework.
- **Research Analyst Registration:** If providing curated recommendations, SEBI Research Analyst (RA) registration may be required.
- **Disclaimer on Analyst Calls:** Aggregated broker data must be clearly attributed and marked as third-party opinions.

---

## 10. Success Metrics

| Metric | Description | Target (12 months) |
|---|---|---|
| MAU | Monthly active users | 100,000 |
| Conversion Rate | Free → Paid | 3–5% |
| Screener Runs/Day | Engagement signal | 50,000 |
| Alert Delivery SLA | 95th percentile latency | < 30 seconds |
| Data Freshness | Price data lag vs. exchange | < 500ms |
| NPS | Net Promoter Score | > 50 |
| Retention (D30) | Users returning after 30 days | > 40% |

---

*Document version: 1.2 | Last updated: June 2026 | Status: Verified — paired with IMPLEMENTATION_PLAN.md v1.1*
