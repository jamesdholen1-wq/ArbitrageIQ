# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ArbitrageIQ is a live, revenue-generating web application for Short-Term Rental (STR) market analysis. Users search a city or select a package, pay via Stripe, and receive PDF market analysis report(s) delivered instantly by email. Launched April 20, 2026.

**Live URLs:**
- Production: https://arbitrage-iq.com
- Vercel fallback: https://arbitrage-iq-flax.vercel.app
- GitHub: https://github.com/jamesdholen1-wq/ArbitrageIQ

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe Checkout (live mode)
- **Email Delivery**: Resend (sends all PDFs as attachments in one email)
- **PDF Generation**: @react-pdf/renderer
- **Hosting**: Vercel
- **DNS / CDN**: Cloudflare
- **Domain**: arbitrage-iq.com

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
│   │   ├── report/generate/route.ts   # Dev/debug only — serves PLACEHOLDER_REPORT, NOT real data
│   │   └── waitlist/route.ts          # Waitlist for unsupported markets (file-backed); GET has no auth
│   ├── checkout/success/page.tsx      # Post-payment confirmation — static, ignores session_id query param
│   └── page.tsx                       # Landing page ('use client' — useState/useRef for market selection + scroll)
├── components/
│   ├── landing/
│   │   ├── CitySearchForm.tsx         # Hero search with autocomplete dropdown of all 15 markets
│   │   ├── PackageCityPicker.tsx      # Multi-city selector for Analyst/Investor/Pro packages
│   │   ├── PricingSection.tsx         # 4-tier pricing grid ('use client'); manages which card is expanded
│   │   ├── FeaturedMarketsSection.tsx # Market grid with filter tabs; hardcoded market list
│   │   └── ...                        # HowItWorksSection, FeaturesSection, MarketRequestForm, Footer
│   ├── pdf/MarketReport.tsx           # @react-pdf/renderer PDF component — incompatible with React DOM
│   └── ui/                            # Button, Input primitives (support className, disabled, isLoading)
├── lib/
│   ├── stripe.ts                      # Stripe singleton + PackageType + PACKAGES constant (all 4 tiers)
│   ├── market-data.ts                 # Reads src/data/markets.json; throws MarketNotFoundError
│   ├── pdf-generator.ts               # Renders MarketReport to ArrayBuffer
│   └── email.ts                       # Resend singleton; sendReportEmail accepts reports[] array
├── data/
│   ├── markets.json                   # Static market data — add new cities here (no code changes needed)
│   └── waitlist.json                  # File-backed waitlist (created at runtime)
└── types/report.ts                    # MarketAnalysis, Recommendation types
```

## Page Order (conversion-optimized)

Hero → Stats Bar → **Pricing** → Featured Markets → Features → How It Works → Market Request → Footer

Pricing is intentionally placed high — users see the offer before scrolling into social proof.

## Pricing & Packages

Defined in `src/lib/stripe.ts` as `PACKAGES`. All prices in cents:

| PackageType | Label          | Price | Cities | Savings |
|-------------|----------------|-------|--------|---------|
| `single`    | Single Report  | $19   | 1      | —       |
| `analyst`   | Analyst Pack   | $47   | 3      | $10     |
| `investor`  | Investor Pack  | $67   | 5      | $28     |
| `pro`       | Pro Bundle     | $97   | 15     | $188    |

## Core Flows

1. **Single purchase (hero)**: City input with autocomplete → `POST /api/stripe/checkout` (`{city, state}`) → Stripe → webhook → 1 PDF emailed
2. **Package purchase**: Select package → `PackageCityPicker` → `POST /api/stripe/checkout` (`{packageType, cities[]}`) → Stripe → webhook → N PDFs in one email
3. **Pro Bundle**: Click CTA → auto-selects all 15 markets → one email with 15 PDFs
4. **Unsupported market**: `MarketNotFoundError` → show waitlist form → `POST /api/waitlist`

## Checkout API

Accepts two formats:
- **Legacy** (hero form): `{ city, state }` — treated as `packageType: 'single'`
- **Package**: `{ packageType, cities: [{city, state}] }`

Cities stored in Stripe metadata as compact tuple JSON: `[["Dallas","TX"],["Phoenix","AZ"],...]` — stays under 500-char limit.

## Webhook

Parses cities from metadata → generates PDF per city sequentially → sends **one email** with all PDFs attached. Returns HTTP 200 even on errors (logged for manual investigation). Has legacy fallback for pre-package sessions.

## Market Data

Markets live in `src/data/markets.json`. `getMarketAnalysis()` does case-insensitive city+state matching. To add a market: add entry to JSON + add to `FeaturedMarketsSection.tsx` + add to `PackageCityPicker.tsx` (three places — known duplication, future refactor candidate).

Dead code: `calculateRecommendation()` in `market-data.ts` — never called, recommendation comes from static JSON.

## Environment Variables

All set in Vercel dashboard (production). Local dev uses `.env.local` (gitignored):

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...           # From Stripe dashboard → Webhooks
NEXT_PUBLIC_BASE_URL=https://arbitrage-iq.com
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=ArbitrageIQ <reports@arbitrage-iq.com>
```

## Production Services

| Service | Purpose | Account |
|---------|---------|---------|
| Stripe | Payments (live mode) | dashboard.stripe.com |
| Resend | Transactional email | resend.com |
| Vercel | Hosting + deployments | vercel.com |
| Cloudflare | DNS + CDN | cloudflare.com |
| GitHub | Source control | github.com/jamesdholen1-wq/ArbitrageIQ |

## Known Gaps (non-blocking, future work)

- `checkout/success/page.tsx` is static — doesn't show purchased market names
- `GET /api/waitlist` has no auth — returns demand data publicly
- `report/generate` debug endpoint is publicly accessible (placeholder data only)
- Market list is hardcoded in 3 places — extract to shared constant when adding markets
- Hero stats bar hardcodes "15 Markets" and "$19" — update manually when these change

## Scheduled Agents

See `AGENTS.md` for the full agent system. Weekly Market Research agent (trigger: `trig_011pnGtjNkxGgppvATt7yJAi`) runs every Sunday 12am ET → writes `agents/outputs/market-research/report.md` → developer reviews and updates `src/data/markets.json`.

## Key Conventions

- Server Components by default; `'use client'` only when needed (`page.tsx`, `PricingSection.tsx`, `PackageCityPicker.tsx`, `CitySearchForm.tsx`)
- PDF components (`components/pdf/`) use `@react-pdf/renderer` — never import in client components
- Stripe and Resend clients are singletons initialized lazily
- Webhook always returns HTTP 200 to prevent Stripe retries
- Waitlist is file-backed — fine for Vercel single-region, not for multi-region
- `PackageCityPicker` manages its own checkout fetch + redirect
- `autoComplete="off"` on city input — custom dropdown handles suggestions
