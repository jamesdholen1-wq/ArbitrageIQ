'use client';

import { useState } from 'react';
import { CitySearchForm } from './CitySearchForm';
import { PackageCityPicker } from './PackageCityPicker';
import type { PackageType } from '@/lib/stripe';

type ActiveCard = PackageType | null;

const FEATURES = [
  'Average nightly rate benchmarks',
  'Monthly revenue projections',
  'Occupancy rate data',
  'Peak & slow season breakdown',
  'Recommended property type',
  'Competition level assessment',
  'Regulatory risk warnings',
  'Go / Caution / Avoid verdict',
  '5+ actionable market insights',
  'Instant PDF delivery',
];

function CheckIcon({ light = false }: { light?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 ${light ? 'text-emerald-400' : 'text-emerald-500'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PricingSection() {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);

  const open = (card: PackageType) => setActiveCard(card);
  const close = () => setActiveCard(null);

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            One-time purchase. No subscriptions. The same intel that costs $500+/month from AirDNA — starting at $19.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

          {/* ── Single Report ── */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Starter</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Single Report</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">$19</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm self-end mb-1">/ report</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6">One market, full analysis</p>

            <ul className="space-y-2 mb-6 flex-1">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{f}</span>
                </li>
              ))}
            </ul>

            {activeCard === 'single' ? (
              <div>
                <CitySearchForm />
                <button onClick={close} className="mt-3 w-full text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-1">
                  ← Choose a different plan
                </button>
              </div>
            ) : (
              <button
                onClick={() => open('single')}
                className="w-full py-3 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-sm"
              >
                Get My Report — $19
              </button>
            )}
          </div>

          {/* ── Analyst Pack — Most Popular ── */}
          <div className="relative bg-white dark:bg-zinc-800 rounded-2xl border-2 border-emerald-500 p-6 flex flex-col shadow-xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                Most Popular
              </span>
            </div>

            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">3 Markets</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Analyst Pack</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">$47</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm self-end mb-1">/ 3 reports</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
              $15.67 per report — Save $10
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{f}</span>
                </li>
              ))}
            </ul>

            {activeCard === 'analyst' ? (
              <PackageCityPicker packageType="analyst" maxCities={3} onCancel={close} />
            ) : (
              <button
                onClick={() => open('analyst')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors text-sm shadow-md shadow-emerald-200 dark:shadow-none"
              >
                Get Analyst Pack — $47
              </button>
            )}
          </div>

          {/* ── Investor Pack ── */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">5 Markets</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Investor Pack</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">$67</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm self-end mb-1">/ 5 reports</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
              $13.40 per report — Save $28
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{f}</span>
                </li>
              ))}
            </ul>

            {activeCard === 'investor' ? (
              <PackageCityPicker packageType="investor" maxCities={5} onCancel={close} />
            ) : (
              <button
                onClick={() => open('investor')}
                className="w-full py-3 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-sm"
              >
                Get Investor Pack — $67
              </button>
            )}
          </div>

          {/* ── Pro Bundle — Best Value ── */}
          <div className="relative bg-zinc-900 dark:bg-black rounded-2xl border border-zinc-700 p-6 flex flex-col">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                Best Value
              </span>
            </div>

            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">All 15 Markets</p>
            <h3 className="text-xl font-bold text-white">Pro Bundle</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white">$97</span>
              <span className="text-zinc-400 text-sm self-end mb-1">/ 15 reports</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-400 mb-6">
              $6.47 per report — Save $188
            </p>

            <ul className="space-y-2 mb-3 flex-1">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon light />
                  <span className="text-sm text-zinc-400">{f}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 mt-1">
                <CheckIcon light />
                <span className="text-sm text-zinc-200 font-semibold">Every market. All at once.</span>
              </li>
            </ul>

            {activeCard === 'pro' ? (
              <PackageCityPicker packageType="pro" maxCities={15} onCancel={close} />
            ) : (
              <button
                onClick={() => open('pro')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors text-sm mt-3"
              >
                Get All 15 Markets — $97
              </button>
            )}
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure checkout via Stripe
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant PDF delivery
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            One email — all PDFs attached
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            One-time purchase, yours forever
          </div>
        </div>
      </div>
    </section>
  );
}
