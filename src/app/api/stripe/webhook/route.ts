import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import type { PackageType } from '@/lib/stripe';
import { generateReportPDF, getReportFilename } from '@/lib/pdf-generator';
import { sendReportEmail } from '@/lib/email';
import type { ReportAttachment } from '@/lib/email';
import { getMarketAnalysis, MarketNotFoundError } from '@/lib/market-data';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripe();

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCheckoutCompleted(session);
    } catch (error) {
      console.error('Error handling checkout.session.completed:', error);
      // Return 200 to prevent Stripe retries — log for manual investigation
      return NextResponse.json({ received: true, error: 'Processing failed' });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const packageType = (session.metadata?.packageType as PackageType) || 'single';

  // Parse cities from metadata — stored as compact tuple array [[city, state], ...]
  // Falls back to legacy {city, state} keys for pre-package sessions
  let cityList: Array<{ city: string; state: string }>;
  const citiesJson = session.metadata?.cities;

  if (citiesJson) {
    const parsed = JSON.parse(citiesJson) as Array<[string, string]>;
    cityList = parsed.map(([city, state]) => ({ city, state }));
  } else {
    const city = session.metadata?.city;
    const state = session.metadata?.state || '';
    if (!city) throw new Error('No city data in session metadata');
    cityList = [{ city, state }];
  }

  const customerEmail = session.customer_details?.email;
  if (!customerEmail) throw new Error('Customer email not found in session');

  console.log(`Processing ${packageType} — ${cityList.length} market(s) — Customer: ${customerEmail}`);

  // Generate PDF for each market
  const reports: ReportAttachment[] = [];

  for (const { city, state } of cityList) {
    let reportData;
    try {
      reportData = await getMarketAnalysis(city, state || undefined);
    } catch (error) {
      if (error instanceof MarketNotFoundError) {
        console.error(`Market not found after payment: ${city}, ${state}`);
        throw new Error(`Market data unavailable for ${city}, ${state}`);
      }
      throw error;
    }

    const pdfBuffer = await generateReportPDF(reportData);
    const filename = getReportFilename(city, state || 'US');
    reports.push({ city, state, pdfBuffer, filename });
  }

  // Send one email with all PDFs attached
  const emailResult = await sendReportEmail({ to: customerEmail, packageType, reports });

  if (!emailResult.success) {
    throw new Error(`Failed to send email: ${emailResult.error}`);
  }

  console.log(`${reports.length} report(s) sent successfully to ${customerEmail}`);
}
