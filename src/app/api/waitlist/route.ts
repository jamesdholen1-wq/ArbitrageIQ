import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface WaitlistEntry {
  email: string;
  city: string;
  state?: string;
  createdAt: string;
}

interface WaitlistData {
  entries: WaitlistEntry[];
}

const WAITLIST_FILE = path.join(process.cwd(), 'src', 'data', 'waitlist.json');

async function readWaitlist(): Promise<WaitlistData> {
  try {
    const data = await fs.readFile(WAITLIST_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist or is invalid, return empty
    return { entries: [] };
  }
}

async function writeWaitlist(data: WaitlistData): Promise<void> {
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, city, state } = body;

    // Validate required fields
    if (!email || !city) {
      return NextResponse.json(
        { error: 'Email and city are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Read existing waitlist
    const waitlist = await readWaitlist();

    // Check if already on waitlist for this market
    const exists = waitlist.entries.some(
      (entry) =>
        entry.email.toLowerCase() === email.toLowerCase() &&
        entry.city.toLowerCase() === city.toLowerCase() &&
        (entry.state?.toLowerCase() || '') === (state?.toLowerCase() || '')
    );

    if (exists) {
      return NextResponse.json(
        { message: 'Already on waitlist for this market', alreadyExists: true },
        { status: 200 }
      );
    }

    // Add new entry
    const newEntry: WaitlistEntry = {
      email: email.trim(),
      city: city.trim(),
      state: state?.trim(),
      createdAt: new Date().toISOString(),
    };

    waitlist.entries.push(newEntry);
    await writeWaitlist(waitlist);

    return NextResponse.json(
      {
        message: 'Successfully added to waitlist',
        market: `${city}${state ? `, ${state}` : ''}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const waitlist = await readWaitlist();

    // Group by market for summary
    const marketCounts: Record<string, number> = {};
    for (const entry of waitlist.entries) {
      const key = `${entry.city}${entry.state ? `, ${entry.state}` : ''}`;
      marketCounts[key] = (marketCounts[key] || 0) + 1;
    }

    return NextResponse.json({
      totalEntries: waitlist.entries.length,
      marketCounts,
    });
  } catch (error) {
    console.error('Waitlist read error:', error);
    return NextResponse.json(
      { error: 'Failed to read waitlist' },
      { status: 500 }
    );
  }
}
