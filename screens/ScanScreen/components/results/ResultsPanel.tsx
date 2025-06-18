import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  PanResponder,
  PanResponderInstance,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button, XStack } from 'tamagui';
import { LucideBotMessageSquare, LucideHome } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import variables from '@/theme/commonColor';
import { ClassSummary, AnalysisResponse } from '../../hooks/useScanLogic';
import { LegendSection } from './LegendSection';
import { RecommendationsSection } from './RecommendationsSection';

interface ResultsPanelProps {
  classSummary: Record<string, ClassSummary>;
  notice: string;
  isLoadingRecommendations: boolean;
  analysisResult: AnalysisResponse | null;
  onOpenChat: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  classSummary,
  notice,
  isLoadingRecommendations,
  analysisResult,
  onOpenChat,
}) => {
  const router = useRouter();
  const [panY] = useState(new Animated.Value(0));
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(null);

  const closedPanelHeight = 100;

  useEffect(() => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 || (gestureState.dy < 0 && !isPanelOpen)) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          setIsPanelOpen(false);
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy < -50 && !isPanelOpen) {
          setIsPanelOpen(true);
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    });

    setPanResponder(panResponder);
  }, [isPanelOpen, panY]);

  return (
    <Animated.View
      style={[
        styles.resultsContent,
        {
          height: isPanelOpen ? '70%' : closedPanelHeight,
          transform: [{ translateY: panY }],
        },
      ]}
    >
      <View style={styles.insideContainer}>
        <View style={styles.panelHeader} {...(panResponder?.panHandlers || {})}>
          <View style={[styles.dragHandle, !isPanelOpen && styles.dragHandlePullUp]} />
          <Text style={styles.panelIndicatorText}>
            {isPanelOpen ? 'Swipe down to minimize' : 'Pull up for details'}
          </Text>
        </View>

        {isPanelOpen && (
          <View style={styles.mainScrollContainer}>
            <ScrollView
              style={styles.scrollableContent}
              showsVerticalScrollIndicator={true}
              indicatorStyle="white"
              bounces={true}
              contentContainerStyle={styles.scrollContentContainer}
              nestedScrollEnabled={true}
            >
              <View style={styles.resultContentContainer}>
                <Text style={styles.resultsTitle}>Analysis Results</Text>

                {Object.keys(classSummary).length >= 0 ? (
                  <View style={styles.resultsList}>
                    <LegendSection classSummary={classSummary} />

                    <View style={styles.divider} />

                    {notice && (
                      <View style={styles.noticeContainer}>
                        <Text style={styles.noticeText}>{notice}</Text>
                      </View>
                    )}

                    <Text style={styles.recommendationsTitle}>Đánh giá và khuyến nghị:</Text>

                    <ScrollView
                      style={styles.recommendationsScrollView}
                      showsVerticalScrollIndicator={true}
                      indicatorStyle="white"
                      nestedScrollEnabled={true}
                    >
                      <RecommendationsSection
                        isLoading={isLoadingRecommendations}
                        analysisResult={analysisResult}
                      />
                    </ScrollView>
                  </View>
                ) : (
                  <Text style={styles.noResultsText}>No skin conditions detected.</Text>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={[styles.buttonFooter, !isPanelOpen && styles.buttonFooterClosed]}>
          <XStack gap={20} mx={10} justify="space-between">
            <Button
              flex={1}
              onPress={onOpenChat}
              icon={<LucideBotMessageSquare size={24} color="white" />}
            >
              Chat With AI
            </Button>
            <Button
              flex={1}
              onPress={() => router.navigate('/(root)/(home-tabs)')}
              icon={<LucideHome size={24} color="white" />}
            >
              Home
            </Button>
          </XStack>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  resultsContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    borderTopLeftRadius: variables.scale(30),
    borderTopRightRadius: variables.scale(30),
    padding: variables.scale(20),
    paddingBottom: variables.scale(100),
  },
  insideContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  panelHeader: {
    paddingVertical: variables.scale(10),
    paddingHorizontal: variables.scale(20),
    alignItems: 'center',
    minHeight: variables.scale(50),
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#999',
    borderRadius: 3,
    marginVertical: 10,
    alignSelf: 'center',
  },
  dragHandlePullUp: {
    backgroundColor: '#4CAF50',
    height: 6,
    width: 50,
  },
  panelIndicatorText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: variables.scale(10),
  },
  mainScrollContainer: {
    flex: 1,
    minHeight: 0,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: variables.scale(20),
    minHeight: '100%',
  },
  resultContentContainer: {
    flex: 1,
    minHeight: 'auto',
  },
  resultsTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: variables.scale(15),
    textAlign: 'center',
  },
  resultsList: {
    paddingHorizontal: variables.scale(10),
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: variables.scale(15),
    marginHorizontal: variables.scale(10),
  },
  noticeContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: variables.scale(8),
    padding: variables.scale(15),
    marginHorizontal: variables.scale(10),
    marginBottom: variables.scale(15),
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  noticeText: {
    color: '#4CAF50',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  recommendationsTitle: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: variables.scale(10),
    marginBottom: variables.scale(10),
  },
  recommendationsScrollView: {
    maxHeight: variables.scale(400),
    marginTop: variables.scale(10),
  },
  noResultsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: variables.scale(20),
  },
  buttonFooter: {
    position: 'absolute',
    bottom: variables.scale(20),
    left: 0,
    right: 0,
    paddingHorizontal: variables.scale(10),
    backgroundColor: 'transparent',
  },
  buttonFooterClosed: {
    bottom: variables.scale(-120),
  },
});
