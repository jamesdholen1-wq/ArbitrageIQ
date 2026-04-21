'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AvailableMarket {
  city: string;
  state: string;
}

interface MarketNotFoundResponse {
  error: 'market_not_found';
  message: string;
  city: string;
  state: string;
  availableMarkets: AvailableMarket[];
}

interface CitySearchFormProps {
  initialValue?: string;
}

// Parse "City, ST" or "City, State" format
function parseCityState(input: string): { city: string; state: string } {
  const trimmed = input.trim();
  const commaIndex = trimmed.lastIndexOf(',');

  if (commaIndex === -1) {
    return { city: trimmed, state: '' };
  }

  const city = trimmed.slice(0, commaIndex).trim();
  const state = trimmed.slice(commaIndex + 1).trim();

  return { city, state };
}

export function CitySearchForm({ initialValue }: CitySearchFormProps) {
  const [location, setLocation] = useState(initialValue || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketNotFound, setMarketNotFound] = useState<MarketNotFoundResponse | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Update location when initialValue changes (e.g., from featured markets click)
  useEffect(() => {
    if (initialValue) {
      setLocation(initialValue);
      setMarketNotFound(null);
      setWaitlistSuccess(false);
    }
  }, [initialValue]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMarketNotFound(null);

    const { city, state } = parseCityState(location);

    if (!city) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, state }),
      });

      const data = await response.json();

      if (response.status === 404 && data.error === 'market_not_found') {
        setMarketNotFound(data);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!marketNotFound || !email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          city: marketNotFound.city,
          state: marketNotFound.state,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data.alreadyExists) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setWaitlistSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMarketNotFound(null);
    setWaitlistSuccess(false);
    setEmail('');
    setError(null);
  };

  // Waitlist success state
  if (waitlistSuccess) {
    return (
      <div className="w-full max-w-lg text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            We&apos;ll notify you when we add {marketNotFound?.city}, {marketNotFound?.state} to our coverage.
          </p>
          <Button onClick={resetForm} variant="secondary" size="sm">
            Search another market
          </Button>
        </div>
      </div>
    );
  }

  // Market not found - show waitlist form
  if (marketNotFound) {
    return (
      <div className="w-full max-w-lg">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Market Coming Soon
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            {marketNotFound.message} Join the waitlist to be notified when it&apos;s available.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-label="Email for waitlist"
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Join Waitlist
            </Button>
          </form>

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        {marketNotFound.availableMarkets.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              Or try one of our available markets:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {marketNotFound.availableMarkets.map((market) => (
                <button
                  key={`${market.city}-${market.state}`}
                  onClick={() => {
                    setLocation(`${market.city}, ${market.state}`);
                    setMarketNotFound(null);
                  }}
                  className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {market.city}, {market.state}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            onClick={resetForm}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← Back to search
          </button>
        </div>
      </div>
    );
  }

  // Default search form
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter a city (e.g., Dallas, TX)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
            aria-label="City and state"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Get My Report - $19
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
