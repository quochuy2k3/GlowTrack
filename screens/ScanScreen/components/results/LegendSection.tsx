import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import variables from '@/theme/commonColor';
import { ClassSummary } from '../../hooks/useScanLogic';

interface LegendSectionProps {
  classSummary: Record<string, ClassSummary>;
}

export const LegendSection: React.FC<LegendSectionProps> = ({ classSummary }) => {
  if (Object.keys(classSummary).length === 0) {
    return null;
  }

  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Detected Skin Conditions</Text>
      {Object.entries(classSummary).map(([condition, info], index) => (
        <View key={index} style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: info.color }]} />
          <Text style={styles.legendText}>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{info.count}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    marginBottom: variables.scale(15),
    paddingHorizontal: variables.scale(10),
  },
  legendTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: variables.scale(10),
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(8),
    paddingVertical: variables.scale(5),
  },
  legendColor: {
    width: variables.scale(16),
    height: variables.scale(16),
    borderRadius: variables.scale(8),
    marginRight: variables.scale(12),
  },
  legendText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    textTransform: 'capitalize',
  },
  countBadge: {
    backgroundColor: '#333',
    borderRadius: variables.scale(12),
    paddingHorizontal: variables.scale(8),
    paddingVertical: variables.scale(4),
    minWidth: variables.scale(24),
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
