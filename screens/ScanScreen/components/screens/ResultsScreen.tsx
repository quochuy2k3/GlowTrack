import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import variables from '@/theme/commonColor';
import { Header } from '../common/Header';
import { ResultsPanel } from '../results/ResultsPanel';
import { ClassSummary, AnalysisResponse, ScanState } from '../../hooks/useScanLogic';

interface ResultsScreenProps {
  processedImageBase64: string | null;
  facing: any;
  classSummary: Record<string, ClassSummary>;
  notice: string;
  isLoadingRecommendations: boolean;
  analysisResult: AnalysisResponse | null;
  onBackPress: () => void;
  onOpenChat: () => void;
  fetchGeminiRecommendations: (result: any) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  processedImageBase64,
  facing,
  classSummary,
  notice,
  isLoadingRecommendations,
  analysisResult,
  onBackPress,
  onOpenChat,
  fetchGeminiRecommendations,
}) => {
  return (
    <View style={styles.resultsContainer}>
      <Header onBackPress={onBackPress} />

      {processedImageBase64 && (
        <View style={styles.resultsImageContainer}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${processedImageBase64}`,
            }}
            style={[
              styles.resultsImage,
              facing === 'front' && {
                transform: [{ scaleY: 1 }, { scaleX: -1 }, { rotate: '90deg' }],
              },
            ]}
            resizeMode="contain"
          />
        </View>
      )}

      <ResultsPanel
        classSummary={classSummary}
        notice={notice}
        isLoadingRecommendations={isLoadingRecommendations}
        analysisResult={analysisResult}
        onOpenChat={onOpenChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
  },
  resultsImageContainer: {
    flex: 1,
    marginTop: variables.scale(300),
    alignItems: 'center',
  },
  resultsImage: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
});
