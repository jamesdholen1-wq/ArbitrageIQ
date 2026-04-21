export type Recommendation = 'go' | 'caution' | 'avoid';

export type PropertyType = '1BR' | '2BR' | '3BR' | 'Studio';

export interface SeasonalityData {
  highMonths: string[];
  lowMonths: string[];
  peakMonth: string;
  slowestMonth: string;
}

export interface MarketAnalysis {
  city: string;
  state: string;
  generatedAt: string;

  // Key metrics
  averageNightlyRate: number;
  monthlyRevenuePotential: number;
  occupancyRate: number; // as percentage (0-100)

  // Analysis
  seasonality: SeasonalityData;
  recommendedPropertyType: PropertyType;
  recommendation: Recommendation;

  // Additional context
  marketNotes: string[];
  competitionLevel: 'low' | 'medium' | 'high';
  regulatoryRisk: 'low' | 'medium' | 'high';
}

export interface ReportMetadata {
  id: string;
  city: string;
  email: string;
  stripePaymentId: string;
  createdAt: string;
  downloadedAt?: string;
}

// Placeholder data for development
export const PLACEHOLDER_REPORT: MarketAnalysis = {
  city: 'Austin',
  state: 'TX',
  generatedAt: new Date().toISOString(),

  averageNightlyRate: 187,
  monthlyRevenuePotential: 4215,
  occupancyRate: 72,

  seasonality: {
    highMonths: ['March', 'April', 'October', 'November'],
    lowMonths: ['January', 'August'],
    peakMonth: 'March',
    slowestMonth: 'January',
  },

  recommendedPropertyType: '2BR',
  recommendation: 'go',

  marketNotes: [
    'Strong year-round demand driven by tech conferences and SXSW',
    'Downtown and East Austin neighborhoods show highest ADR',
    'New STR regulations enacted in 2024 - verify permit requirements',
    'Airport proximity increases booking conversion rates',
  ],

  competitionLevel: 'medium',
  regulatoryRisk: 'medium',
};
