# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ArbitrageIQ is a web application for Short-Term Rental (STR) market analysis. Users search a city or select a package, pay via Stripe, and receive PDF market analysis report(s) delivered by email. Four pricing tiers exist: Single ($19), Analyst Pack ($47/3 cities), Investor Pack ($67/5 cities), Pro Bundle ($97/all 15 cities).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe Checkout
- **Email Delivery**: Resend (sends all PDFs as attachments in one email)
- **PDF Generation**: @react-pdf/renderer
- **Deployment**: Vercel

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # Run TypeScript compiler check
```

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── stripe/checkout/route.ts   # Creates Stripe session; accepts {packageType, cities[]} or legacy {city, state}
│   │   ├── stripe/webhook/route.ts    # checkout.session.completed → generate N PDFs → one email with all attached
│   │   ├── report/generate/route.ts   # Dev/debug only — serves PLACEHOLDER_REPORT, NOT real data; not part of production flow
│   │   └── waitlist/route.ts          # Waitlist for unsupported markets (file-backed); GET has no auth
│   ├── checkout/success/page.tsx      # Post-payment confirmation — static, ignores session_id query param
│   └── page.tsx                       # Landing page ('use client' — useState/useRef for market selection + scroll)
├── components/
│   ├── landing/
│   │   ├── CitySearchForm.tsx         # Hero search form — single-city flow only; sends legacy {city, state} to checkout API
│   │   ├── PackageCityPicker.tsx      # Multi-city selector for Analyst/Investor/Pro packages; handles its own checkout call
│   │   ├── PricingSection.tsx         # 4-tier pricing grid ('use client'); manages which card is expanded
│   │   ├── FeaturedMarketsSection.tsx # Market grid with filter tabs; has hardcoded market list (duplicates PackageCityPicker)
│   │   └── ...                        # HowItWorksSection, FeaturesSection, MarketRequestForm, Footer
│   ├── pdf/MarketReport.tsx           # @react-pdf/renderer PDF component — incompatible with React DOM
│   └── ui/                            # Button, Input primitives (both support className, disabled, isLoading)
├── lib/
│   ├── stripe.ts                      # Stripe singleton + PackageType + PACKAGES constant (all 4 tiers)
│   ├── market-data.ts                 # Reads src/data/markets.json; throws MarketNotFoundError
│   ├── pdf-generator.ts               # Renders MarketReport to ArrayBuffer
│   └── email.ts                       # Resend singleton; sendReportEmail accepts reports[] array, sends all as attachments
├── data/
│   ├── markets.json                   # Static market data — add new cities here (no code changes needed)
│   └── waitlist.json                  # File-backed waitlist (created at runtime)
└── types/report.ts                    # MarketAnalysis, Recommendation types; ReportMetadata + PLACEHOLDER_REPORT are dead code (debug endpoint only)
```

## Pricing & Packages

Defined in `src/lib/stripe.ts` as `PACKAGES`. All prices in cents:

| PackageType | Label          | Price  | Cities | Savings vs single |
|-------------|----------------|--------|--------|-------------------|
| `single`    | Single Report  | $19    | 1      | —                 |
| `analyst`   | Analyst Pack   | $47    | 3      | Save $10          |
| `investor`  | Investor Pack  | $67    | 5      | Save $28          |
| `pro`       | Pro Bundle     | $97    | 15     | Save $188         |

`REPORT_PRICE` is kept as an alias for `PACKAGES.single.price` for reference.

## Core Flows

1. **Single purchase (hero)**: City input → `POST /api/stripe/checkout` (`{city, state}` legacy format) → Stripe → webhook → 1 PDF emailed
2. **Package purchase (pricing section)**: Select package → `PackageCityPicker` → `POST /api/stripe/checkout` (`{packageType, cities[]}`) → Stripe → webhook → N PDFs in one email
3. **Pro Bundle**: Click CTA → auto-selects all 15 markets → checkout → all 15 PDFs in one email
4. **Unsupported market**: `MarketNotFoundError` → checkout returns available markets + waitlist URL → `POST /api/waitlist`

## Checkout API (`POST /api/stripe/checkout`)

Accepts two formats:
- **Legacy** (from hero `CitySearchForm`): `{ city, state }` — treated as `packageType: 'single'`
- **Package** (from `PackageCityPicker`): `{ packageType, cities: [{city, state}] }`

`pro` packageType auto-fetches all markets from `getAvailableMarkets()` — no `cities` array needed.

Stripe metadata stores cities as a compact tuple array to stay under the 500-char limit:
`cities: '[["Dallas","TX"],["Phoenix","AZ"],...]'`

## Webhook (`POST /api/stripe/webhook`)

Parses `packageType` and `cities` from session metadata, generates a PDF per city sequentially, then sends **one email** with all PDFs attached via Resend. Returns HTTP 200 even on processing errors (logged for manual investigation).

Legacy fallback: if `cities` key is missing in metadata (old sessions), falls back to `city`/`state` keys.

## Market Data

Markets live in `src/data/markets.json`. `getMarketAnalysis()` does case-insensitive city+state matching. To add a market: add entry to JSON — no code changes needed.

**Hardcoded market list exists in two places** (known duplication):
- `FeaturedMarketsSection.tsx` — display grid with ADR/occupancy/revenue stats
- `PackageCityPicker.tsx` — city selector for package purchases

If you add a market to `markets.json`, also add it to both component files above. A future improvement would be to extract a shared client-safe constant.

Dead code: `calculateRecommendation()` in `market-data.ts` is exported but never called — recommendation comes from static JSON.

## Environment Variables

Required in `.env.local` (local) and Vercel dashboard (production):
```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000   # → https://yourdomain.com in prod
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=ArbitrageIQ <reports@yourdomain.com>
```

## Known Cosmetic Gaps (not bugs)

- Hero section button still says "Get My Report - $19" — fine for single-report flow, but doesn't reflect bundle pricing
- Stats bar on `page.tsx` hardcodes "15 Markets Covered" and "$19 One-Time Price" — update when market count grows or pricing changes
- `checkout/success/page.tsx` is fully static — it doesn't display the purchased market name(s) or order details
- `GET /api/waitlist` has no authentication — returns market demand signal publicly
- `report/generate` debug endpoint is publicly accessible — not a security risk (placeholder data only) but could be removed before launch

## Key Conventions

- Use Server Components by default; `'use client'` only when needed (`page.tsx`, `PricingSection.tsx`, `PackageCityPicker.tsx` are known exceptions)
- PDF components (`components/pdf/`) use `@react-pdf/renderer` — incompatible with React DOM; never import in client components
- Stripe and Resend clients are singletons initialized lazily (throw if env vars missing)
- Webhook returns HTTP 200 even on errors to prevent Stripe retries
- Waitlist is file-backed (`src/data/waitlist.json`) — not suitable for multi-instance deployments (Vercel serverless is fine; multiple regions would be a problem)
- `PackageCityPicker` manages its own checkout fetch + redirect — `PricingSection` only manages which card is open/closed

## Scheduled Agents

See `AGENTS.md` for the full agent system. Weekly Market Research agent runs every Sunday 12am ET and writes `agents/outputs/market-research/report.md`. Use that report to manually update `src/data/markets.json`.
