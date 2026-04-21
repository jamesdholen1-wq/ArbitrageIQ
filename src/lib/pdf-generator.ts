import { renderToBuffer } from '@react-pdf/renderer';
import { MarketReport } from '@/components/pdf/MarketReport';
import { MarketAnalysis } from '@/types/report';

/**
 * Generates a PDF as ArrayBuffer from market analysis data
 */
export async function generateReportPDF(data: MarketAnalysis): Promise<ArrayBuffer> {
  const buffer = await renderToBuffer(MarketReport({ data }));
  // Ensure we have a proper ArrayBuffer (not SharedArrayBuffer)
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(new Uint8Array(buffer));
  return arrayBuffer;
}

/**
 * Generates a filename for the report PDF
 */
export function getReportFilename(city: string, state: string): string {
  const sanitizedCity = city.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const sanitizedState = state.toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `arbitrageiq-${sanitizedCity}-${sanitizedState}-${date}.pdf`;
}
