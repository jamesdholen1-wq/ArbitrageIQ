import Stripe from 'stripe';

export type PackageType = 'single' | 'analyst' | 'investor' | 'pro';

export const PACKAGES = {
  single:   { label: 'Single Report',  price: 1900, cityCount: 1,  savings: 0 },
  analyst:  { label: 'Analyst Pack',   price: 4700, cityCount: 3,  savings: 1000 },
  investor: { label: 'Investor Pack',  price: 6700, cityCount: 5,  savings: 2800 },
  pro:      { label: 'Pro Bundle',     price: 9700, cityCount: 15, savings: 18800 },
} as const;

export const REPORT_PRICE = PACKAGES.single.price;

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    });
  }
  return stripeInstance;
}
