import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PACKAGES, PackageType } from '@/lib/stripe';
import { getMarketAnalysis, MarketNotFoundError, getAvailableMarkets } from '@/lib/market-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageType = 'single', cities: citiesInput, city, state } = body;

    if (!PACKAGES[packageType as PackageType]) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const pkg = PACKAGES[packageType as PackageType];

    // Build city list
    let cityList: Array<{ city: string; state: string }>;

    if (packageType === 'pro') {
      cityList = getAvailableMarkets();
    } else if (Array.isArray(citiesInput) && citiesInput.length > 0) {
      cityList = citiesInput.map((c: { city: string; state?: string }) => ({
        city: String(c.city).trim(),
        state: String(c.state || '').trim(),
      }));
    } else if (city) {
      // Legacy single-city format from hero search form
      cityList = [{ city: String(city).trim(), state: String(state || '').trim() }];
    } else {
      return NextResponse.json({ error: 'No cities provided' }, { status: 400 });
    }

    if (packageType !== 'pro' && cityList.length !== pkg.cityCount) {
      return NextResponse.json(
        { error: `${pkg.label} requires exactly ${pkg.cityCount} ${pkg.cityCount === 1 ? 'city' : 'cities'}` },
        { status: 400 }
      );
    }

    // Validate all cities exist before creating session
    for (const { city: c, state: s } of cityList) {
      try {
        await getMarketAnalysis(c, s || undefined);
      } catch (error) {
        if (error instanceof MarketNotFoundError) {
          return NextResponse.json(
            {
              error: 'market_not_found',
              message: `We don't have data for ${c}${s ? `, ${s}` : ''} yet.`,
              city: c,
              state: s,
              availableMarkets: getAvailableMarkets(),
              waitlistUrl: '/api/waitlist',
            },
            { status: 404 }
          );
        }
        throw error;
      }
    }

    const stripe = getStripe();

    const locationDisplay =
      cityList.length === 1
        ? `${cityList[0].city}${cityList[0].state ? `, ${cityList[0].state}` : ''}`
        : `${cityList.length} Markets`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_creation: 'always',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: pkg.price,
            product_data: {
              name: `${pkg.label} — ${locationDisplay}`,
              description:
                cityList.length === 1
                  ? 'Comprehensive STR market analysis for short-term rental arbitrage'
                  : `STR analysis for: ${cityList.map((c) => `${c.city}, ${c.state}`).join(' · ')}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        packageType,
        // Store as compact tuple array to stay well under Stripe's 500-char metadata limit
        cities: JSON.stringify(cityList.map((c) => [c.city, c.state])),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
