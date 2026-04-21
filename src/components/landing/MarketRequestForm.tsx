'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function MarketRequestForm() {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !city) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Parse city, state if provided
      const parts = city.split(',').map((s) => s.trim());
      const cityName = parts[0];
      const state = parts[1] || '';

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          city: cityName,
          state,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data.alreadyExists) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccess(true);
      setEmail('');
      setCity('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-emerald-50 dark:bg-emerald-900/20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            We&apos;ll email you as soon as we add your requested market to our coverage.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Request another market
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don&apos;t See Your Market?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            We&apos;re constantly expanding our coverage. Request a market and be the
            first to know when it&apos;s available.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="City, State (e.g., Miami, FL)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoading}
                aria-label="City and state"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                aria-label="Email"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Notify Me When Available
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          No spam. We&apos;ll only email you when your market is ready.
        </p>
      </div>
    </section>
  );
}
