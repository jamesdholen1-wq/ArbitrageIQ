'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { PackageType } from '@/lib/stripe';

interface Market {
  city: string;
  state: string;
  adr: number;
  monthlyRev: number;
  verdict: 'go' | 'caution';
}

const ALL_MARKETS: Market[] = [
  { city: 'Dallas',       state: 'TX', adr: 178, monthlyRev: 3632, verdict: 'go' },
  { city: 'Phoenix',      state: 'AZ', adr: 189, monthlyRev: 4253, verdict: 'go' },
  { city: 'Houston',      state: 'TX', adr: 156, monthlyRev: 3276, verdict: 'go' },
  { city: 'Charlotte',    state: 'NC', adr: 168, monthlyRev: 3528, verdict: 'go' },
  { city: 'Philadelphia', state: 'PA', adr: 175, monthlyRev: 3675, verdict: 'go' },
  { city: 'San Antonio',  state: 'TX', adr: 145, monthlyRev: 2900, verdict: 'go' },
  { city: 'Jacksonville', state: 'FL', adr: 165, monthlyRev: 3465, verdict: 'go' },
  { city: 'Fort Worth',   state: 'TX', adr: 158, monthlyRev: 3160, verdict: 'go' },
  { city: 'Columbus',     state: 'OH', adr: 142, monthlyRev: 2840, verdict: 'go' },
  { city: 'Austin',       state: 'TX', adr: 195, monthlyRev: 4290, verdict: 'caution' },
  { city: 'San Diego',    state: 'CA', adr: 231, monthlyRev: 5130, verdict: 'caution' },
  { city: 'Chicago',      state: 'IL', adr: 198, monthlyRev: 4158, verdict: 'caution' },
  { city: 'New York',     state: 'NY', adr: 289, monthlyRev: 6515, verdict: 'caution' },
  { city: 'Los Angeles',  state: 'CA', adr: 245, monthlyRev: 5512, verdict: 'caution' },
  { city: 'San Jose',     state: 'CA', adr: 215, monthlyRev: 4515, verdict: 'caution' },
];

interface PackageCityPickerProps {
  packageType: Exclude<PackageType, 'single'>;
  maxCities: number;
  onCancel: () => void;
}

export function PackageCityPicker({ packageType, maxCities, onCancel }: PackageCityPickerProps) {
  const isPro = packageType === 'pro';
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (market: Market) => {
    const key = `${market.city}|${market.state}`;
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else if (next.size < maxCities) {
      next.add(key);
    }
    setSelected(next);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    const cities = isPro
      ? ALL_MARKETS.map((m) => ({ city: m.city, state: m.state }))
      : ALL_MARKETS.filter((m) => selected.has(`${m.city}|${m.state}`)).map((m) => ({
          city: m.city,
          state: m.state,
        }));

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType, cities }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const selectionCount = selected.size;
  const remaining = maxCities - selectionCount;
  const isReady = isPro || selectionCount === maxCities;

  if (isPro) {
    return (
      <div className="mt-4 space-y-3">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg px-4 py-3 text-center">
          <p className="text-emerald-400 text-sm font-semibold">All 15 markets included automatically</p>
          <p className="text-zinc-400 text-xs mt-1">Dallas · Phoenix · Houston · Austin · NY · LA + 9 more</p>
        </div>
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <Button onClick={handleCheckout} variant="primary" size="lg" isLoading={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-400">
          Proceed to Checkout — $97
        </Button>
        <button onClick={onCancel} className="w-full text-xs text-zinc-500 hover:text-zinc-400 transition-colors py-1">
          ← Choose a different plan
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {selectionCount === 0
            ? `Choose any ${maxCities} markets`
            : selectionCount < maxCities
            ? `${remaining} more market${remaining !== 1 ? 's' : ''} to go`
            : 'Ready — proceed to checkout'}
        </p>
        {selectionCount > 0 && selectionCount < maxCities && (
          <div className="mt-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(selectionCount / maxCities) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
        {ALL_MARKETS.map((market) => {
          const key = `${market.city}|${market.state}`;
          const isSelected = selected.has(key);
          const isDisabled = !isSelected && selectionCount >= maxCities;

          return (
            <button
              key={key}
              onClick={() => toggle(market)}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-500'
                  : isDisabled
                  ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 opacity-40 cursor-not-allowed'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                  {market.city}, {market.state}
                </span>
                <span
                  className={`flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${
                    market.verdict === 'go'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                  }`}
                >
                  {market.verdict.toUpperCase()}
                </span>
              </div>
              <span className="flex-shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-2">
                ${(market.monthlyRev / 1000).toFixed(1)}k/mo
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

      <Button
        onClick={handleCheckout}
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={!isReady}
        className="w-full"
      >
        {isReady ? 'Proceed to Checkout' : `Select ${remaining} More Market${remaining !== 1 ? 's' : ''}`}
      </Button>

      <button onClick={onCancel} className="w-full text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-1">
        ← Choose a different plan
      </button>
    </div>
  );
}
