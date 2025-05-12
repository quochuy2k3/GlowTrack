import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import variables from '@/theme/commonColor';
import { useState, useEffect, useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import {
  LucideArrowLeft,
  LucideCalendar,
  LucideClock,
  LucideZoomIn,
  LucideSearchX,
} from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Button, XStack } from 'tamagui';
import { services, useServices } from '@/services';
import commonColor from '@/theme/commonColor';
import { useTranslation } from 'react-i18next';
import ImageView from 'react-native-image-viewing';
import { useQuery, QueryFunction } from 'react-query';
import { useAuth } from '@/contexts/auth';
import { Check } from 'lucide-react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

interface TrackerData {
  _id: string;
  user_id: string;
  routine_of_day: {
    day_of_week: string;
    sessions: {
      time: string;
      status: string;
      steps: {
        step_order: number;
        step_name: string;
      }[];
    }[];
  };
  img_url: string;
  class_summary: {
    [key: string]: {
      count: number;
      color: string;
    };
  };
  date: string;
}

export default function DetailTrackerScreen() {
  const { trackerId } = useLocalSearchParams();
  const service = useServices();
  const router = useRouter();
  const { t } = useTranslation();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [animatedSessions, setAnimatedSessions] = useState<{ [key: number]: Animated.Value }>({});
  const [expandedSessions, setExpandedSessions] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const [rotatedImageUri, setRotatedImageUri] = useState<string | null>(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const fetchTrackerData: QueryFunction<TrackerData> = async () => {
    try {
      console.log('Fetching tracker data for ID:', trackerId);
      const response = await services.TrackerService.getTrackerById(trackerId as string);
      console.log('API Response:', JSON.stringify(response));

      // Transform the API response to match the TrackerData type
      if (response && typeof response === 'object') {
        // Use type assertion to tell TypeScript this matches our expected type
        return response as unknown as TrackerData;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching tracker data:', error);
      throw error;
    }
  };

  const {
    data: trackerData,
    isLoading,
    isError,
    refetch: refetchData,
  } = useQuery<TrackerData>(['DetailTracker', trackerId], fetchTrackerData, {
    enabled: auth.isAuthenticated && !!trackerId,
    onSuccess: data => {
      console.log('Successfully loaded tracker data:', data?._id);
      setLoading(false);
    },
    onError: error => {
      console.error('Failed to load tracker data:', error);
      setLoading(false);
    },
    retry: 2, // Retry failed requests twice
  });

  useEffect(() => {
    // Add debug logging
    console.log(
      'TrackerData updated:',
      trackerData ? 'exists' : 'null',
      trackerData ? `ID: ${trackerData._id}` : ''
    );

    const initializeData = async () => {
      try {
        if (trackerData && trackerData.routine_of_day.sessions) {
          // Initialize animation values for each session
          const animState: { [key: number]: Animated.Value } = {};
          const expandedState: { [key: number]: boolean } = {};

          trackerData.routine_of_day.sessions.forEach((_, idx: number) => {
            animState[idx] = new Animated.Value(1);
            expandedState[idx] = true;
          });

          setAnimatedSessions(animState);
          setExpandedSessions(expandedState);

          // Animate sessions opening with a slight delay for each
          trackerData.routine_of_day.sessions.forEach((_, idx: number) => {
            const tempAnimValue = new Animated.Value(0);
            Animated.timing(tempAnimValue, {
              toValue: 1,
              duration: 300,
              delay: idx * 100, // Stagger the animations
              easing: Easing.out(Easing.ease),
              useNativeDriver: false,
            }).start(() => {
              if (animatedSessions[idx]) {
                animatedSessions[idx].setValue(1);
              }
            });
          });
        }
      } catch (error) {
        console.error('Error initializing tracker data:', error);
      }
    };

    if (trackerData) {
      initializeData();
    }
  }, [trackerData]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const toggleSession = useCallback(
    (index: number) => {
      const animatedValue = animatedSessions[index];
      if (!animatedValue) return;

      // Đơn giản hóa kiểm tra expanded state
      const isExpanded = expandedSessions[index] || false;

      // Cập nhật state
      setExpandedSessions(prev => ({
        ...prev,
        [index]: !isExpanded,
      }));

      Animated.timing(animatedValue, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    },
    [animatedSessions, expandedSessions]
  );

  const getStatusBadgeColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      default:
        return '#CEB8E4';
    }
  }, []);

  const getSessionBackgroundColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return '#E8F5E9';
      case 'pending':
        return '#FFF8E1';
      default:
        return '#F3E8FB';
    }
  }, []);

  const renderSessions = useCallback(() => {
    if (!trackerData || !trackerData.routine_of_day.sessions) return null;

    return trackerData.routine_of_day.sessions.map((session, index: number) => {
      const animValue = animatedSessions[index];

      return (
        <View
          key={`${session.time}-${index}`}
          style={{
            backgroundColor: getSessionBackgroundColor(session.status),
            borderRadius: variables.scale(20),
            marginBottom: variables.scale(20),
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            style={[styles.session, { backgroundColor: getSessionBackgroundColor(session.status) }]}
            onPress={() => toggleSession(index)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LucideClock size={20} color={getStatusBadgeColor(session.status)} />
              <Text style={styles.sessionTime}>{session.time}</Text>
              {session.status.toLowerCase() === 'done' && <Check size={20} color="#4CAF50" />}
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(session.status) }]}
            >
              <Text style={styles.statusText}>{session.status.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.expandedSession,
              {
                height: animValue?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, session.steps.length > 0 ? 50 * session.steps.length : 50],
                }),
                opacity: animValue?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                overflow: 'hidden',
              },
            ]}
          >
            {session.steps.length > 0 ? (
              <View style={styles.stepsContainer}>
                {session.steps.map((step, idx: number) => (
                  <View
                    key={`${step.step_order}-${idx}`}
                    style={[
                      styles.step,
                      { backgroundColor: 'rgba(255, 255, 255, 0.35)', borderRadius: 12 },
                    ]}
                  >
                    <View>
                      <View
                        style={[
                          styles.stepCircle,
                          { backgroundColor: getStatusBadgeColor(session.status) },
                        ]}
                      >
                        <Text style={styles.stepNumber}>{step.step_order}</Text>
                      </View>
                      {idx < session.steps.length - 1 && <View style={styles.verticalLine} />}
                    </View>
                    <Text style={styles.stepName}>{step.step_name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noStepsContainer}>
                <Text style={styles.noStepsText}>
                  {t('NoStepsScheduled', 'Không có bước nào được lên lịch')}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      );
    });
  }, [
    trackerData,
    animatedSessions,
    getSessionBackgroundColor,
    getStatusBadgeColor,
    toggleSession,
    t,
  ]);

  const renderResults = useCallback(() => {
    if (!trackerData || !trackerData.class_summary) return null;

    return Object.entries(trackerData.class_summary).map(([key, value], index) => (
      <Animated.View
        key={index}
        style={[
          styles.resultItem,
          {
            borderColor: value.color,
            transform: [{ scale: new Animated.Value(1) }],
          },
        ]}
      >
        <View style={[styles.colorIndicator, { backgroundColor: value.color }]} />
        <Text style={styles.resultName}>{key}</Text>
        <Text style={styles.resultCount}>{value.count}</Text>
      </Animated.View>
    ));
  }, [trackerData]);

  const handleRotate = useCallback(async () => {
    if (!trackerData?.img_url || isRotating) return;

    setIsRotating(true);

    try {
      // Calculate new rotation (90 degrees clockwise)
      const newRotation = (rotationDegree + 90) % 360;
      setRotationDegree(newRotation);

      // Use source based on whether this is the first rotation
      const sourceUri = rotatedImageUri || trackerData.img_url;

      // Optimize the manipulation process
      const result = await ImageManipulator.manipulateAsync(sourceUri, [{ rotate: 90 }], {
        compress: 0.7, // Lower quality for better performance
        format: ImageManipulator.SaveFormat.JPEG, // JPEG is smaller than PNG for photos
        base64: false, // Don't need base64 which would use more memory
      });

      setRotatedImageUri(result.uri);
    } catch (err) {
      console.error('Rotate error', err);
    } finally {
      setIsRotating(false);
    }
  }, [trackerData, rotatedImageUri, rotationDegree, isRotating]);

  const renderImageViewFooter = useCallback(() => {
    if (!trackerData || !trackerData.class_summary) return null;

    return (
      <View style={styles.imagePreviewFooter}>
        <TouchableOpacity onPress={handleRotate} disabled={isRotating} style={styles.rotateButton}>
          <Text style={styles.rotateButtonText}>
            {isRotating ? t('Rotating', 'Đang xoay...') : t('RotateImage', 'Xoay ảnh')}
          </Text>
        </TouchableOpacity>
        <View style={styles.legendContainer}>
          {Object.entries(trackerData.class_summary).map(([key, value], index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColorBox, { backgroundColor: value.color }]} />
              <Text style={styles.legendText}>{key}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }, [trackerData, handleRotate, isRotating, t]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <LucideArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('DetailTracker', 'Chi tiết hành trình')}</Text>
        <TouchableOpacity style={styles.calendarButton} onPress={() => router.back()}>
          <LucideCalendar size={28} color="black" />
        </TouchableOpacity>
      </View>

      {loading || isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={commonColor.fontFamilyBold} />
          <Text style={styles.loadingText}>{t('LoadingData', 'Đang tải dữ liệu...')}</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('ErrorLoadingData', 'Lỗi tải dữ liệu')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetchData()}>
            <Text style={styles.retryText}>{t('Retry', 'Thử lại')}</Text>
          </TouchableOpacity>
        </View>
      ) : !trackerData ? (
        <View style={styles.emptyStateContainer}>
          <LucideSearchX size={100} color={commonColor.fontFamilyBold} strokeWidth={1.5} />
          <Text style={styles.emptyStateTitle}>
            {t('NoTrackerFound', 'Không tìm thấy hành trình')}
          </Text>
          <Text style={styles.emptyStateDescription}>
            {t(
              'NoTrackerDescription',
              'Rất tiếc, chúng tôi không thể tìm thấy hành trình bạn yêu cầu.'
            )}
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.back()}>
            <Text style={styles.emptyStateButtonText}>
              {t('BackToOverview', 'Quay lại tổng quan')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(trackerData.date)}</Text>
              <Text style={styles.dayText}>{trackerData.routine_of_day.day_of_week}</Text>
            </View>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => setImagePreviewVisible(true)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: trackerData.img_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.previewIconContainer}>
                <LucideZoomIn size={28} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.resultContainer}>
              <Text style={styles.sectionTitle}>
                {t('SkinCheckResults', 'Kết quả kiểm tra da')}
              </Text>
              <View style={styles.resultGrid}>{renderResults()}</View>
            </View>

            <View style={styles.routineContainer}>
              <Text style={styles.sectionTitle}>{t('DailyRoutine', 'Quy trình hàng ngày')}</Text>
              {renderSessions()}
            </View>
          </ScrollView>

          {trackerData && (
            <ImageView
              images={[{ uri: rotatedImageUri ?? trackerData.img_url }]}
              imageIndex={0}
              visible={imagePreviewVisible}
              onRequestClose={() => {
                setImagePreviewVisible(false);
                setRotatedImageUri(null); // reset khi đóng
                setRotationDegree(0); // reset rotation angle
              }}
              swipeToCloseEnabled={true}
              doubleTapToZoomEnabled={true}
              backgroundColor="rgba(0,0,0,0.9)"
              FooterComponent={renderImageViewFooter}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: variables.scale(0.5),
    borderBottomColor: 'rgba(0, 0, 0, 0.36)',
    paddingVertical: variables.scale(14),
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: variables.scale(36),
    color: 'black',
    fontWeight: 'bold',
    marginLeft: variables.scale(10),
    fontFamily: commonColor.fontFamilyBold,
    flex: 1,
  },
  backButton: {
    padding: variables.scale(16),
  },
  calendarButton: {
    padding: variables.scale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: variables.scale(16),
    fontSize: variables.scale(18),
    color: commonColor.fontFamilyBold,
    fontFamily: commonColor.fontFamilyMedium,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: variables.scale(20),
  },
  scrollContent: {
    paddingBottom: variables.scale(40),
  },
  dateContainer: {
    marginBottom: variables.scale(16),
    alignItems: 'center',
    backgroundColor: 'rgba(240,240,240,0.5)',
    padding: variables.scale(16),
    borderRadius: variables.scale(16),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dateText: {
    fontSize: variables.scale(24),
    fontFamily: commonColor.fontFamilyBold,
    color: '#000',
  },
  dayText: {
    fontSize: variables.scale(18),
    color: '#666',
    marginTop: variables.scale(4),
    fontFamily: commonColor.fontFamilyMedium,
  },
  imageContainer: {
    width: '100%',
    height: variables.scale(400),
    borderRadius: variables.scale(20),
    overflow: 'hidden',
    marginBottom: variables.scale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  previewIconContainer: {
    position: 'absolute',
    bottom: variables.scale(12),
    right: variables.scale(12),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: variables.scale(30),
    padding: variables.scale(10),
  },
  resultContainer: {
    marginBottom: variables.scale(24),
    backgroundColor: '#FFFFFF',
    padding: variables.scale(16),
    borderRadius: variables.scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: variables.scale(24),
    fontFamily: commonColor.fontFamilyBold,
    marginBottom: variables.scale(16),
    color: '#000',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: variables.scale(12),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: variables.scale(14),
    padding: variables.scale(16),
    borderWidth: 1,
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  colorIndicator: {
    width: variables.scale(20),
    height: variables.scale(20),
    borderRadius: variables.scale(10),
    marginRight: variables.scale(10),
  },
  resultName: {
    fontSize: variables.scale(18),
    fontFamily: commonColor.fontFamilyMedium,
    color: '#000',
    textTransform: 'capitalize',
    flex: 1,
  },
  resultCount: {
    fontSize: variables.scale(20),
    fontFamily: commonColor.fontFamilyBold,
    color: '#000',
  },
  routineContainer: {
    marginBottom: variables.scale(24),
    backgroundColor: '#FFFFFF',
    padding: variables.scale(16),
    borderRadius: variables.scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  session: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sessionTime: {
    fontSize: variables.scale(24),
    fontFamily: commonColor.fontFamilyMedium,
    color: '#000',
    marginLeft: variables.scale(8),
  },
  statusBadge: {
    paddingHorizontal: variables.scale(12),
    paddingVertical: variables.scale(6),
    borderRadius: variables.scale(20),
  },
  statusText: {
    fontSize: variables.scale(18),
    fontFamily: commonColor.fontFamilyMedium,
    color: 'white',
    textTransform: 'capitalize',
  },
  expandedSession: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(16),
  },
  stepsContainer: {
    flex: 1,
    marginRight: variables.scale(10),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: variables.scale(20),
    position: 'relative',
    paddingLeft: variables.scale(10),
    paddingVertical: variables.scale(12),
    paddingRight: variables.scale(12),
  },
  stepCircle: {
    width: variables.scale(36),
    height: variables.scale(36),
    borderRadius: variables.scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    top: variables.scale(36),
    left: variables.scale(18),
    width: variables.scale(2),
    height: variables.scale(46),
    backgroundColor: '#957DAD',
    zIndex: 0,
  },
  stepNumber: {
    color: 'white',
    fontFamily: commonColor.fontFamilyBold,
    fontSize: variables.scale(20),
  },
  stepName: {
    fontSize: variables.scale(20),
    color: 'black',
    paddingTop: variables.scale(5),
    paddingLeft: variables.scale(12),
    fontFamily: commonColor.fontFamilyMedium,
    flexShrink: 1,
  },
  noStepsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: variables.scale(16),
  },
  noStepsText: {
    fontSize: variables.scale(16),
    fontFamily: commonColor.fontFamilyMedium,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  markAsDoneContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    height: '90%',
    justifyContent: 'center',
    paddingHorizontal: variables.scale(16),
    borderRadius: variables.scale(16),
    marginLeft: variables.scale(8),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: variables.scale(16),
  },
  errorText: {
    fontSize: variables.scale(18),
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: variables.scale(16),
  },
  retryButton: {
    backgroundColor: commonColor.fontFamilyBold,
    paddingHorizontal: variables.scale(24),
    paddingVertical: variables.scale(12),
    borderRadius: variables.scale(8),
  },
  retryText: {
    color: 'white',
    fontSize: variables.scale(16),
    fontFamily: commonColor.fontFamilyMedium,
  },
  imagePreviewFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: variables.scale(20),
    paddingBottom: variables.scale(60),
    paddingHorizontal: variables.scale(16),
  },
  rotateButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: variables.scale(8),
    paddingHorizontal: variables.scale(16),
    borderRadius: variables.scale(8),
    marginBottom: variables.scale(12),
    alignSelf: 'center',
  },
  rotateButtonText: {
    color: 'white',
    fontSize: variables.scale(16),
    textAlign: 'center',
    fontFamily: commonColor.fontFamilyMedium,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: variables.scale(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: variables.scale(6),
  },
  legendColorBox: {
    width: variables.scale(24),
    height: variables.scale(24),
    borderRadius: variables.scale(4),
    marginRight: variables.scale(6),
  },
  legendText: {
    color: 'white',
    fontSize: variables.scale(28),
    fontFamily: commonColor.fontFamilyMedium,
    textTransform: 'capitalize',
  },
  emptyStateContainer: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: -10,
  },
  emptyStateTitle: {
    fontSize: variables.scale(30),
    fontFamily: commonColor.fontFamilyBold,
    color: '#000',
    marginTop: variables.scale(24),
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: variables.scale(24),
    fontFamily: commonColor.fontFamilyMedium,
    color: '#666',
    marginTop: variables.scale(12),
    textAlign: 'center',
    maxWidth: '80%',
  },
  emptyStateButton: {
    backgroundColor: commonColor.fontFamilyBold,
    paddingHorizontal: variables.scale(24),
    paddingVertical: variables.scale(12),
    borderRadius: variables.scale(8),
    marginTop: variables.scale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: variables.scale(16),
    fontFamily: commonColor.fontFamilyMedium,
  },
});
