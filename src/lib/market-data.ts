import type { MarketAnalysis, Recommendation } from '@/types/report';
import marketsData from '@/data/markets.json';

export class MarketNotFoundError extends Error {
  constructor(public city: string, public state?: string) {
    super(`Market not found: ${city}${state ? `, ${state}` : ''}`);
    this.name = 'MarketNotFoundError';
  }
}

interface StoredMarket {
  city: string;
  state: string;
  averageNightlyRate: number;
  monthlyRevenuePotential: number;
  occupancyRate: number;
  seasonality: {
    highMonths: string[];
    lowMonths: string[];
    peakMonth: string;
    slowestMonth: string;
  };
  recommendedPropertyType: '1BR' | '2BR' | '3BR' | 'Studio';
  recommendation: Recommendation;
  marketNotes: string[];
  competitionLevel: 'low' | 'medium' | 'high';
  regulatoryRisk: 'low' | 'medium' | 'high';
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

export async function getMarketAnalysis(
  city: string,
  state?: string
): Promise<MarketAnalysis> {
  const normalizedCity = normalizeString(city);
  const normalizedState = state ? normalizeString(state) : undefined;

  // Find matching market
  const market = (marketsData.markets as StoredMarket[]).find((m) => {
    const cityMatch = normalizeString(m.city) === normalizedCity;
    if (!cityMatch) return false;

    // If state provided, it must also match
    if (normalizedState) {
      return normalizeString(m.state) === normalizedState;
    }

    return true;
  });

  if (!market) {
    throw new MarketNotFoundError(city, state);
  }

  // Return the market data with generated timestamp
  return {
    city: market.city,
    state: market.state,
    averageNightlyRate: market.averageNightlyRate,
    monthlyRevenuePotential: market.monthlyRevenuePotential,
    occupancyRate: market.occupancyRate,
    seasonality: market.seasonality,
    recommendedPropertyType: market.recommendedPropertyType,
    recommendation: market.recommendation,
    marketNotes: market.marketNotes,
    competitionLevel: market.competitionLevel,
    regulatoryRisk: market.regulatoryRisk,
    generatedAt: new Date().toISOString(),
  };
}

export function getAvailableMarkets(): Array<{ city: string; state: string }> {
  return (marketsData.markets as StoredMarket[]).map((m) => ({
    city: m.city,
    state: m.state,
  }));
}

export function calculateRecommendation(
  occupancyRate: number,
  avgNightlyRate: number,
  marketSize: number
): Recommendation {
  // Scoring logic for market recommendation
  const score = (occupancyRate * 0.4) + (avgNightlyRate / 10 * 0.3) + (marketSize * 0.3);

  if (score >= 70) return 'go';
  if (score >= 40) return 'caution';
  return 'avoid';
}
