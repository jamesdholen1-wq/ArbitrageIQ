'use client';

import { useState } from 'react';

interface Market {
  city: string;
  state: string;
  adr: number;
  monthlyRev: number;
  occupancy: number;
  verdict: 'go' | 'caution';
}

const featuredMarkets: Market[] = [
  { city: 'Dallas', state: 'TX', adr: 178, monthlyRev: 3632, occupancy: 68, verdict: 'go' },
  { city: 'Phoenix', state: 'AZ', adr: 189, monthlyRev: 4253, occupancy: 75, verdict: 'go' },
  { city: 'Houston', state: 'TX', adr: 156, monthlyRev: 3276, occupancy: 70, verdict: 'go' },
  { city: 'Charlotte', state: 'NC', adr: 168, monthlyRev: 3528, occupancy: 70, verdict: 'go' },
  { city: 'Philadelphia', state: 'PA', adr: 175, monthlyRev: 3675, occupancy: 70, verdict: 'go' },
  { city: 'San Antonio', state: 'TX', adr: 145, monthlyRev: 2900, occupancy: 67, verdict: 'go' },
  { city: 'Jacksonville', state: 'FL', adr: 165, monthlyRev: 3465, occupancy: 70, verdict: 'go' },
  { city: 'Fort Worth', state: 'TX', adr: 158, monthlyRev: 3160, occupancy: 67, verdict: 'go' },
  { city: 'Columbus', state: 'OH', adr: 142, monthlyRev: 2840, occupancy: 67, verdict: 'go' },
  { city: 'Austin', state: 'TX', adr: 195, monthlyRev: 4290, occupancy: 73, verdict: 'caution' },
  { city: 'San Diego', state: 'CA', adr: 231, monthlyRev: 5130, occupancy: 74, verdict: 'caution' },
  { city: 'Chicago', state: 'IL', adr: 198, monthlyRev: 4158, occupancy: 70, verdict: 'caution' },
  { city: 'New York', state: 'NY', adr: 289, monthlyRev: 6515, occupancy: 75, verdict: 'caution' },
  { city: 'Los Angeles', state: 'CA', adr: 245, monthlyRev: 5512, occupancy: 75, verdict: 'caution' },
  { city: 'San Jose', state: 'CA', adr: 215, monthlyRev: 4515, occupancy: 70, verdict: 'caution' },
];

interface FeaturedMarketsSectionProps {
  onSelectMarket?: (city: string, state: string) => void;
}

export function FeaturedMarketsSection({ onSelectMarket }: FeaturedMarketsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'go' | 'caution'>('all');

  const filteredMarkets = featuredMarkets.filter((m) => {
    if (filter === 'all') return true;
    return m.verdict === filter;
  });

  const goCount = featuredMarkets.filter((m) => m.verdict === 'go').length;
  const cautionCount = featuredMarkets.filter((m) => m.verdict === 'caution').length;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            15 Top US Markets Analyzed
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            We&apos;ve done the research. See which markets are primed for STR arbitrage
            and which ones require extra due diligence.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            All Markets ({featuredMarkets.length})
          </button>
          <button
            onClick={() => setFilter('go')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'go'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
            }`}
          >
            GO Markets ({goCount})
          </button>
          <button
            onClick={() => setFilter('caution')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'caution'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50'
            }`}
          >
            CAUTION Markets ({cautionCount})
          </button>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.map((market) => (
            <button
              key={`${market.city}-${market.state}`}
              onClick={() => onSelectMarket?.(market.city, market.state)}
              className="group bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {market.city}, {market.state}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      market.verdict === 'go'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                    }`}
                  >
                    {market.verdict === 'go' ? 'GO' : 'CAUTION'}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">${market.adr}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">ADR</div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{market.occupancy}%</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Occ.</div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${(market.monthlyRev / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">/mo</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Click any market to get the full report with detailed insights, seasonality data, and actionable recommendations.
        </p>
      </div>
    </section>
  );
}
