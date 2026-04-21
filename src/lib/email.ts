import { Resend } from 'resend';
import type { PackageType } from './stripe';
import { PACKAGES } from './stripe';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export interface ReportAttachment {
  city: string;
  state: string;
  pdfBuffer: ArrayBuffer;
  filename: string;
}

interface SendReportEmailParams {
  to: string;
  packageType: PackageType;
  reports: ReportAttachment[];
}

export async function sendReportEmail({
  to,
  packageType,
  reports,
}: SendReportEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();
    const pkg = PACKAGES[packageType];
    const isSingle = reports.length === 1;

    const subject = isSingle
      ? `Your STR Market Analysis Report — ${reports[0].city}, ${reports[0].state}`
      : `Your ArbitrageIQ ${pkg.label} — ${reports.length} Reports Inside`;

    const marketListHtml = reports
      .map(
        (r) =>
          `<li style="color:#3f3f46;font-size:14px;line-height:1.8;">${r.city}, ${r.state}</li>`
      )
      .join('');

    const attachments = reports.map((r) => ({
      filename: r.filename,
      content: Buffer.from(r.pdfBuffer).toString('base64'),
    }));

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ArbitrageIQ <reports@arbitrageiq.com>',
      to: [to],
      subject,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h1 style="color:#059669;margin-bottom:24px;">
            Your ${isSingle ? 'Report is' : `${reports.length} Reports are`} Ready!
          </h1>

          <p style="color:#3f3f46;font-size:16px;line-height:1.6;">
            Thank you for your purchase! Your STR Market Analysis
            ${isSingle ? 'Report is' : 'Reports are'} attached to this email.
          </p>

          ${
            !isSingle
              ? `<div style="background-color:#f4f4f5;padding:16px 20px;border-radius:8px;margin:20px 0;">
                  <p style="color:#18181b;font-size:14px;font-weight:600;margin:0 0 8px;">Markets included:</p>
                  <ul style="margin:0;padding-left:20px;">${marketListHtml}</ul>
                 </div>`
              : ''
          }

          <div style="background-color:#f4f4f5;padding:20px;border-radius:8px;margin:24px 0;">
            <h2 style="color:#18181b;font-size:18px;margin-top:0;">Each report includes:</h2>
            <ul style="color:#3f3f46;font-size:14px;line-height:1.8;">
              <li>Average nightly rates and revenue potential</li>
              <li>Occupancy rate benchmarks</li>
              <li>Seasonality analysis (peak vs. slow months)</li>
              <li>Recommended property type</li>
              <li>Go / Caution / Avoid recommendation</li>
              <li>Market notes and insights</li>
            </ul>
          </div>

          <p style="color:#3f3f46;font-size:16px;line-height:1.6;">
            Questions about your ${isSingle ? 'report' : 'reports'}? Reply to this email.
          </p>

          <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0;" />
          <p style="color:#71717a;font-size:12px;">
            ArbitrageIQ - Data-Driven STR Market Analysis<br/>
            This report is for informational purposes only.
          </p>
        </div>
      `,
      attachments,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
