import { NextRequest, NextResponse } from 'next/server';
import { generateReportPDF, getReportFilename } from '@/lib/pdf-generator';
import { PLACEHOLDER_REPORT } from '@/types/report';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');

    // For now, use placeholder data with the requested city
    const reportData = {
      ...PLACEHOLDER_REPORT,
      city: city || PLACEHOLDER_REPORT.city,
      generatedAt: new Date().toISOString(),
    };

    const pdfBuffer = await generateReportPDF(reportData);
    const filename = getReportFilename(reportData.city, reportData.state);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, state } = body;

    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
    }

    // For now, use placeholder data with the requested city/state
    const reportData = {
      ...PLACEHOLDER_REPORT,
      city: city.trim(),
      state: state?.trim() || PLACEHOLDER_REPORT.state,
      generatedAt: new Date().toISOString(),
    };

    const pdfBuffer = await generateReportPDF(reportData);
    const filename = getReportFilename(reportData.city, reportData.state);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}
