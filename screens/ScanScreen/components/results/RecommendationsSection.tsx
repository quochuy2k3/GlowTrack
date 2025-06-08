import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import variables from '@/theme/commonColor';
import { AnalysisResponse } from '../../hooks/useScanLogic';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface RecommendationsSectionProps {
  isLoading: boolean;
  analysisResult: AnalysisResponse | null;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  isLoading,
  analysisResult,
}) => {
  if (isLoading) {
    return (
      <View style={styles.recommendationsContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerPlaceholder
            key={index}
            style={styles.shimmerPlaceholder}
            LinearGradient={LinearGradient}
            shimmerColors={['#333', '#444', '#333']}
          />
        ))}
      </View>
    );
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <View style={styles.recommendationsContainer}>
      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Tổng quan:</Text>
        <Text style={styles.assessmentText}>{analysisResult.result.tong_quan}</Text>
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Mức độ:</Text>
        <Text style={styles.assessmentText}>{analysisResult.result.danh_gia_muc_do}</Text>
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Chăm sóc cơ bản:</Text>
        {analysisResult.result.cham_soc_co_ban.map((rec, index) => (
          <Text key={index} style={styles.recommendationText}>
            • {rec}
          </Text>
        ))}
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Khuyến cáo y tế:</Text>
        <Text style={styles.recommendationText}>• {analysisResult.result.khuyen_cao_y_te}</Text>
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Lưu ý quan trọng:</Text>
        {analysisResult.result.luu_y_quan_trong.map((note, index) => (
          <Text key={index} style={styles.recommendationText}>
            • {note}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommendationsContainer: {
    marginTop: variables.scale(10),
    paddingHorizontal: variables.scale(5),
  },
  shimmerPlaceholder: {
    height: variables.scale(60),
    borderRadius: variables.scale(8),
    marginBottom: variables.scale(10),
  },
  assessmentSection: {
    marginBottom: variables.scale(15),
    paddingHorizontal: variables.scale(10),
  },
  assessmentTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: variables.scale(8),
  },
  assessmentText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: variables.scale(5),
  },
  recommendationText: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: variables.scale(8),
    paddingLeft: variables.scale(10),
    lineHeight: 24,
  },
});
