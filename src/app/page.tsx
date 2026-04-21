'use client';

import { useState, useRef } from 'react';
import { CitySearchForm } from '@/components/landing/CitySearchForm';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FeaturedMarketsSection } from '@/components/landing/FeaturedMarketsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { MarketRequestForm } from '@/components/landing/MarketRequestForm';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState<{ city: string; state: string } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSelectMarket = (city: string, state: string) => {
    setSelectedMarket({ city, state });
    // Scroll to search form
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-20" />
        <div className="relative flex-1 flex flex-col items-center justify-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full px-4 py-2 shadow-sm border border-zinc-200 dark:border-zinc-700 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                15 Top US Markets Now Available
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Stop Guessing.
              <span className="block text-emerald-600 dark:text-emerald-400 mt-2">
                Start Investing with Data.
              </span>
            </h1>

            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Get institutional-grade STR market analysis in minutes.
              Know exactly which cities are profitable for rental arbitrage
              <span className="font-semibold text-zinc-900 dark:text-zinc-200"> before </span>
              you sign a lease.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Revenue projections</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Seasonality analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Regulatory insights</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Go/No-Go verdict</span>
              </div>
            </div>

            <div ref={searchRef} className="mt-10 flex justify-center">
              <CitySearchForm initialValue={selectedMarket ? `${selectedMarket.city}, ${selectedMarket.state}` : undefined} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure payment via Stripe
              </div>
              <div className="hidden sm:block w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                PDF delivered to your inbox instantly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Bar */}
      <section className="bg-zinc-900 dark:bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">15</div>
              <div className="text-sm text-zinc-400">Markets Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">$19</div>
              <div className="text-sm text-zinc-400">One-Time Price</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">5+</div>
              <div className="text-sm text-zinc-400">Insights Per Report</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">Instant</div>
              <div className="text-sm text-zinc-400">PDF Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section — high on page for conversion */}
      <PricingSection />

      {/* Featured Markets Section */}
      <FeaturedMarketsSection onSelectMarket={handleSelectMarket} />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Market Request Form */}
      <MarketRequestForm />

      {/* Footer */}
      <Footer />
    </div>
  );
}
