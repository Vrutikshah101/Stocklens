# StockLens AI Development Harness

This harness is for building StockLens safely with AI agents. It is not a production MarketMind runtime and must not expose model keys to the browser.

## Operating Model

| Agent | Role | Allowed Work | Not Allowed |
| --- | --- | --- | --- |
| Orchestrator | Breaks down work, owns final architecture and merge readiness | Task briefs, implementation decisions, final review | Delegating final financial/security decisions |
| Nex Secondary Agent | Uses OpenRouter `nex-agi/nex-n2-pro:free` for cheap drafts | Alternate approaches, tests, docs, refactor suggestions | Direct code merge, secrets, auth, deployment decisions |
| Reviewer Agent | Uses Code Review Graph MCP and static checks | Blast radius, affected flows, risk review | Ignoring failed local checks |
| UI QA Agent | Uses Browser/Playwright on key routes and breakpoints | Responsive smoke tests and visual readability checks | Approving layout without browser evidence |
| Security Agent | Checks secrets, client/server boundaries, financial disclaimers | Env review, key scanning, no-advice guardrails | Shipping API keys or model calls client-side |

## Feature Workflow

1. Create a short task brief with `pnpm harness:brief -- "feature name"`.
2. Ask Nex for one draft and one alternative with `pnpm harness:nex -- "task brief or question"`.
3. Review the Nex output manually; use it as supporting input only.
4. Implement with the primary coding agent.
5. Run review and quality gates with `pnpm quality`.
6. Use browser QA for these routes before handoff: `/`, `/stock/RELIANCE`, `/login`, `/register`, `/screener`, `/portfolio`.
7. Check responsive widths: `390`, `768`, and `1440` pixels.
8. Deploy only after build, tests, typecheck, lint, and secret scan pass.

## MCP Usage

- Start code reviews with Code Review Graph minimal context when the MCP is available.
- Use impact radius or change detection before approving complex diffs.
- Use Browser/Playwright for visible UI flows and responsive checks.
- Use Figma MCP only when a real Figma source file or URL exists.
- Use web verification only for current model, API, pricing, or deployment facts.

## OpenRouter Configuration

Copy `.env.example` to `.env.local` and fill only local secrets:

```bash
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AI_SECONDARY_MODEL=nex-agi/nex-n2-pro:free
OPENROUTER_APP_NAME=StockLens
OPENROUTER_APP_URL=http://localhost:3000
```

The secondary model is intentionally not a default app dependency. If user-facing AI is added later, add a server-only API route with rate limiting, disclaimers, and fallback behavior.

## Hooks

Install local Git hooks with:

```bash
pnpm harness:install-hooks
```

The generated hooks run:

- Pre-commit: secret scan, lint, and typecheck.
- Pre-push: tests and production build.

## Acceptance Checklist

- No OpenRouter key appears in tracked files.
- Nex output is reviewed before implementation.
- `pnpm quality` passes locally.
- Core routes are readable at mobile, tablet, and desktop widths.
- Vercel receives only server-side AI environment variables.
