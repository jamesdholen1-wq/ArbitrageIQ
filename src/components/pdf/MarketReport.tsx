import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { MarketAnalysis, Recommendation } from '@/types/report';

// Color palette
const colors = {
  primary: '#059669',
  go: '#059669',
  caution: '#d97706',
  avoid: '#dc2626',
  text: '#18181b',
  textMuted: '#71717a',
  textLight: '#a1a1aa',
  background: '#ffffff',
  backgroundMuted: '#f4f4f5',
  border: '#e4e4e7',
};

// Styles - optimized for single page
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    backgroundColor: colors.background,
  },
  // Header
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  reportTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Metrics row
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '31%',
    backgroundColor: colors.backgroundMuted,
    padding: 12,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricUnit: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  // Seasonality
  seasonalityContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  seasonalityColumn: {
    flex: 1,
  },
  seasonalityLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  monthTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  monthTag: {
    backgroundColor: colors.backgroundMuted,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  monthTagHigh: {
    backgroundColor: '#d1fae5',
  },
  monthTagLow: {
    backgroundColor: '#fef3c7',
  },
  monthText: {
    fontSize: 9,
    color: colors.text,
  },
  peakText: {
    fontSize: 10,
    color: colors.text,
    marginTop: 6,
  },
  peakHighlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Property recommendation
  propertyBox: {
    backgroundColor: colors.backgroundMuted,
    padding: 14,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 14,
  },
  propertyDetails: {
    flex: 1,
  },
  propertyLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  propertyText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },
  // Risk indicators
  riskRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginRight: 4,
  },
  riskBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  riskLow: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  riskMedium: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  riskHigh: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  // Verdict
  verdictContainer: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  verdictGo: {
    backgroundColor: '#d1fae5',
    borderWidth: 2,
    borderColor: colors.go,
  },
  verdictCaution: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: colors.caution,
  },
  verdictAvoid: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: colors.avoid,
  },
  verdictBadge: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  verdictGoText: {
    color: colors.go,
  },
  verdictCautionText: {
    color: colors.caution,
  },
  verdictAvoidText: {
    color: colors.avoid,
  },
  verdictSubtext: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // Notes
  notesList: {
    marginTop: 10,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  noteBullet: {
    width: 12,
    fontSize: 9,
    color: colors.primary,
  },
  noteText: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  footerBrand: {
    fontSize: 8,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 3,
  },
});

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString()}`;
};

// Helper function to format percentage
const formatPercentage = (value: number): string => {
  return `${value}%`;
};

// Helper function to format date
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to get verdict styles
const getVerdictStyles = (recommendation: Recommendation) => {
  switch (recommendation) {
    case 'go':
      return {
        container: styles.verdictGo,
        text: styles.verdictGoText,
        label: 'GO',
        subtext: 'This market shows strong potential for STR arbitrage investment.',
      };
    case 'caution':
      return {
        container: styles.verdictCaution,
        text: styles.verdictCautionText,
        label: 'PROCEED WITH CAUTION',
        subtext: 'This market has potential but requires careful due diligence.',
      };
    case 'avoid':
      return {
        container: styles.verdictAvoid,
        text: styles.verdictAvoidText,
        label: 'AVOID',
        subtext: 'Current market conditions do not favor STR arbitrage investment.',
      };
  }
};

// Helper function to get risk badge styles
const getRiskStyles = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low':
      return styles.riskLow;
    case 'medium':
      return styles.riskMedium;
    case 'high':
      return styles.riskHigh;
  }
};

interface MarketReportProps {
  data: MarketAnalysis;
}

export function MarketReport({ data }: MarketReportProps) {
  const verdict = getVerdictStyles(data.recommendation);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header} wrap={false}>
          <Text style={styles.brandName}>ArbitrageIQ</Text>
          <Text style={styles.reportTitle}>
            STR Market Analysis: {data.city}, {data.state}
          </Text>
          <Text style={styles.reportMeta}>
            Generated on {formatDate(data.generatedAt)}
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Avg Nightly Rate</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(data.averageNightlyRate)}
              </Text>
              <Text style={styles.metricUnit}>per night</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Monthly Revenue</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(data.monthlyRevenuePotential)}
              </Text>
              <Text style={styles.metricUnit}>potential</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Occupancy Rate</Text>
              <Text style={styles.metricValue}>
                {formatPercentage(data.occupancyRate)}
              </Text>
              <Text style={styles.metricUnit}>average</Text>
            </View>
          </View>
        </View>

        {/* Seasonality */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Seasonality Overview</Text>
          <View style={styles.seasonalityContainer}>
            <View style={styles.seasonalityColumn}>
              <Text style={styles.seasonalityLabel}>Peak Demand Months</Text>
              <View style={styles.monthTagsRow}>
                {data.seasonality.highMonths.map((month, index) => (
                  <View key={index} style={[styles.monthTag, styles.monthTagHigh]}>
                    <Text style={styles.monthText}>{month}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.seasonalityColumn}>
              <Text style={styles.seasonalityLabel}>Lower Demand Months</Text>
              <View style={styles.monthTagsRow}>
                {data.seasonality.lowMonths.map((month, index) => (
                  <View key={index} style={[styles.monthTag, styles.monthTagLow]}>
                    <Text style={styles.monthText}>{month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.peakText}>
            Peak month: <Text style={styles.peakHighlight}>{data.seasonality.peakMonth}</Text>
            {' | '}
            Slowest month: {data.seasonality.slowestMonth}
          </Text>
        </View>

        {/* Property Recommendation */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Property Recommendation</Text>
          <View style={styles.propertyBox}>
            <Text style={styles.propertyType}>{data.recommendedPropertyType}</Text>
            <View style={styles.propertyDetails}>
              <Text style={styles.propertyLabel}>Recommended Property Type</Text>
              <Text style={styles.propertyText}>
                Based on market demand and competition analysis,
                a {data.recommendedPropertyType} offers the best revenue potential in {data.city}.
              </Text>
            </View>
          </View>
          <View style={styles.riskRow}>
            <View style={styles.riskItem}>
              <Text style={styles.riskLabel}>Competition:</Text>
              <Text style={[styles.riskBadge, getRiskStyles(data.competitionLevel)]}>
                {data.competitionLevel}
              </Text>
            </View>
            <View style={styles.riskItem}>
              <Text style={styles.riskLabel}>Regulatory Risk:</Text>
              <Text style={[styles.riskBadge, getRiskStyles(data.regulatoryRisk)]}>
                {data.regulatoryRisk}
              </Text>
            </View>
          </View>
        </View>

        {/* Market Verdict */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Market Verdict</Text>
          <View style={[styles.verdictContainer, verdict.container]}>
            <Text style={[styles.verdictBadge, verdict.text]}>{verdict.label}</Text>
            <Text style={styles.verdictSubtext}>{verdict.subtext}</Text>
          </View>
          <View style={styles.notesList}>
            {data.marketNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer - flows with content */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This report is for informational purposes only and does not constitute financial
            or investment advice. Market conditions may change. Always conduct your own due
            diligence before making investment decisions.
          </Text>
          <Text style={styles.footerBrand}>
            ArbitrageIQ - Data-Driven STR Market Analysis
          </Text>
        </View>
      </Page>
    </Document>
  );
}
