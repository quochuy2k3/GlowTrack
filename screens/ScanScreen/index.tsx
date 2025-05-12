import { useServices } from '@/services';
import variables from '@/theme/commonColor';
import { AxiosResponse } from 'axios';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  LucideArrowLeft,
  LucideBookType,
  LucideBotMessageSquare,
  LucideCheck,
  LucideHome,
  LucideRotateCcw,
  SwitchCamera,
  LucideX,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  PanResponderInstance,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { Button, XStack } from 'tamagui';
import ChatInterface from './components/ChatInterface';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

enum ScanState {
  CAMERA = 'camera',
  PREVIEW = 'preview',
  PROCESSING = 'processing',
  RESULTS = 'results',
  CHAT = 'chat',
}

interface ClassSummary {
  count: number;
  color: string;
}

interface ApiResponse {
  class_summary: Record<string, ClassSummary>;
  image: string; // base64 encoded image
}

export default function ScanScreen() {
  const service = useServices();
  const [resultsContentHeight, setResultsContentHeight] = useState(new Animated.Value(800));
  const [panY] = useState(new Animated.Value(0));
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPhotoBase64, setCapturedPhotoBase64] = useState<string | null>(null);
  const [scanState, setScanState] = useState<ScanState>(ScanState.CAMERA);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [processedImageBase64, setProcessedImageBase64] = useState<string | null>(null);
  const [classSummary, setClassSummary] = useState<Record<string, ClassSummary>>({});
  const [initialPanelHeight] = useState(Dimensions.get('window').height * 0.4);
  const [collapsedPanelHeight] = useState(Dimensions.get('window').height * 0.2);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([
    '• Visit a dermatologist for a full assessment',
    '• Maintain a gentle skincare routine',
    '• Avoid touching or squeezing detected spots',
  ]);

  const router = useRouter();
  const camRef = useRef<CameraView>(null);

  const openChatInterface = () => {
    setShowChatModal(true);
  };

  const closeChatInterface = () => {
    setShowChatModal(false);
  };

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
          Animated.spring(panY, {
            toValue: collapsedPanelHeight,
            useNativeDriver: false,
          }).start();
          setIsPanelOpen(false);
        } else if (gestureState.dy < -10 && !isPanelOpen) {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          setIsPanelOpen(true);
        } else {
          Animated.spring(panY, {
            toValue: isPanelOpen ? 0 : collapsedPanelHeight,
            useNativeDriver: false,
          }).start();
        }
      },
    });

    setPanResponder(panResponder);
  }, [isPanelOpen, initialPanelHeight, collapsedPanelHeight]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (camRef.current) {
      let options = {
        quality: 1, //Specifies the quality of the captured image. A value of 1 indicates maximum quality, whereas lower values reduce quality (and file size).
        base64: true, //Includes the image's Base64 representation in the returned object. This is useful for embedding the image directly in data URIs or for immediate upload to servers.
        exif: false, //Disables the inclusion of EXIF metadata in the image (e.g., location, device info). Setting this to true would include such metadata.
        mirror: facing === 'front',
      };
      const data = await camRef.current.takePictureAsync(options);

      if (data) {
        setCapturedPhoto(data.uri);
        setCapturedPhotoBase64(data.base64 || null);
        setScanState(ScanState.PREVIEW);
      }
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null);
    setCapturedPhotoBase64(null);
    setProcessedImageBase64(null);
    setClassSummary({});
    setError(null);
    setScanState(ScanState.CAMERA);
  }

  // Simulate calling Gemini API after successful scan
  const fetchGeminiRecommendations = async () => {
    setIsLoadingRecommendations(true);

    // Simulate API call with timeout
    return new Promise<string[]>(resolve => {
      setTimeout(() => {
        // Fake response from Gemini API
        const geminiRecommendations = [
          '• Visit a dermatologist for a full assessment',
          '• Maintain a gentle skincare routine',
          '• Avoid touching or squeezing detected spots',
        ];

        // Add condition-specific recommendations
        if (Object.keys(classSummary).some(condition => condition === 'purulent')) {
          geminiRecommendations.push(
            '• For purulent spots, consider using products with benzoyl peroxide'
          );
        }

        if (Object.keys(classSummary).some(condition => condition === 'papular')) {
          geminiRecommendations.push('• For papular spots, gentle exfoliation may help');
        }

        resolve(geminiRecommendations);
      }, 3000); // 3 second timeout
    });
  };

  async function processPhoto() {
    try {
      setScanState(ScanState.PROCESSING);
      setError(null);

      // Create form data for the API request
      if (!capturedPhoto) {
        throw new Error('No photo captured');
      }

      // Show progress indicator
      let progressTimer = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + 0.1;
        });
      }, 300);

      try {
        const filename = `photo_${new Date().getTime()}.jpg`;

        const fileUri =
          Platform.OS === 'ios' ? capturedPhoto.replace('file://', '') : capturedPhoto;

        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: filename,
          type: 'image/jpeg',
        } as any);

        // Get the response from the service
        const response = await service.ScanService.predict(formData);
        // Extract data from the axios response
        const result = response.data as unknown as ApiResponse;

        setClassSummary(result.class_summary || {});
        setProcessedImageBase64(result.image);

        setProcessingProgress(1);
        setTimeout(() => {
          setScanState(ScanState.RESULTS);
          // Start fetching Gemini recommendations when results are shown
          fetchGeminiRecommendations().then(geminiRecommendations => {
            setRecommendations(geminiRecommendations);
            setIsLoadingRecommendations(false);
          });
        }, 500);
      } catch (apiError) {
        setError('Failed to process the image. Please try again.');
        clearInterval(progressTimer);
        setScanState(ScanState.PREVIEW);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setScanState(ScanState.PREVIEW);
    }
  }

  function renderContent() {
    switch (scanState) {
      case ScanState.CAMERA:
        return (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} ref={camRef}>
              <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.navigate('/(root)/(home-tabs)')}
                  >
                    <LucideArrowLeft size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.documentButton}
                    onPress={() => router.navigate('/(root)/(home-tabs)')}
                  >
                    <LucideBookType size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.AIButton} onPress={openChatInterface}>
                <LucideBotMessageSquare size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.takePhotoButton} onPress={takePicture}>
                <View style={styles.takePhotoButtonContent}></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraFacing}>
                <SwitchCamera size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case ScanState.PREVIEW:
        return (
          <View style={styles.previewContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={retakePhoto}>
                  <LucideArrowLeft size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {capturedPhoto && <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.previewButtonsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
                <LucideRotateCcw size={24} color="white" />
                <Text style={styles.actionButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={processPhoto}>
                <LucideCheck size={24} color="white" />
                <Text style={styles.actionButtonText}>Process</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case ScanState.PROCESSING:
        return (
          <View style={styles.processingContainer}>
            <Text style={styles.processingTitle}>Processing Image</Text>
            <ActivityIndicator size="large" color="white" style={styles.processingSpinner} />
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${processingProgress * 100}%` }]} />
            </View>
            <Text style={styles.processingText}>Analyzing skin conditions...</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScanState(ScanState.PREVIEW)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );

      case ScanState.RESULTS:
        return (
          <View style={styles.resultsContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setScanState(ScanState.CAMERA)}
                >
                  <LucideArrowLeft size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Display the processed image with visualizations */}
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

            <Animated.View
              style={[
                styles.resultsContent,
                {
                  transform: [{ translateY: panY }],
                },
              ]}
              {...(panResponder?.panHandlers || {})}
            >
              <View style={styles.insideContainer}>
                <View style={[styles.dragHandle, !isPanelOpen && styles.dragHandlePullUp]} />

                {/* Panel indicator text */}
                <Text style={styles.panelIndicatorText}>
                  {isPanelOpen ? 'Swipe down to minimize' : 'Pull up for details'}
                </Text>
                {isPanelOpen && (
                  <View style={styles.resultContentContainer}>
                    <Text style={styles.resultsTitle}>Analysis Results</Text>
                    {Object.keys(classSummary).length >= 0 ? (
                      <View style={styles.resultsList}>
                        {/* Color legend */}
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

                        <View style={styles.divider} />

                        <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                        <View style={styles.recommendationsContainer}>
                          {isLoadingRecommendations ? (
                            // Show shimmer placeholders while loading
                            <>
                              <ShimmerPlaceholder
                                style={styles.shimmerPlaceholder}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#333', '#444', '#333']}
                              />
                              <ShimmerPlaceholder
                                style={styles.shimmerPlaceholder}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#333', '#444', '#333']}
                              />
                              <ShimmerPlaceholder
                                style={styles.shimmerPlaceholder}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#333', '#444', '#333']}
                              />
                              <ShimmerPlaceholder
                                style={styles.shimmerPlaceholder}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#333', '#444', '#333']}
                              />
                            </>
                          ) : (
                            // Show actual recommendations when loaded
                            recommendations.map((recommendation, index) => (
                              <Text key={index} style={styles.recommendationText}>
                                {recommendation}
                              </Text>
                            ))
                          )}
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.noResultsText}>No skin conditions detected.</Text>
                    )}
                  </View>
                )}
                <XStack gap={20} mx={10} justify="space-between">
                  <Button
                    flex={1}
                    onPress={openChatInterface}
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
            </Animated.View>
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showChatModal}
        onRequestClose={closeChatInterface}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ChatInterface onClose={closeChatInterface} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: variables.scale(38),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: variables.scale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: variables.scale(100),
    marginTop: variables.scale(60),
  },
  capturedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  capturedImage: {
    width: width,
    height: height,
    marginTop: 10,
    transform: [{ rotate: '0deg' }],
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: variables.scale(25),
  },
  takePhotoButton: {
    width: variables.scale(130),
    height: variables.scale(130),
    position: 'relative',
    backgroundColor: 'black',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoButtonContent: {
    width: variables.scale(100),
    height: variables.scale(100),
    backgroundColor: 'white',
    borderRadius: 100,
  },
  AIButton: {
    padding: variables.scale(14),
  },
  flipCameraButton: {
    padding: variables.scale(14),
  },
  documentButton: {
    padding: variables.scale(20),
  },

  // Preview screen styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(40),
  },
  actionButton: {
    alignItems: 'center',
    padding: variables.scale(15),
  },
  actionButtonText: {
    color: 'white',
    marginTop: variables.scale(8),
    fontSize: 16,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
    textAlign: 'center',
    padding: variables.scale(10),
  },

  // Processing screen styles
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: variables.scale(20),
  },
  processingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: variables.scale(30),
  },
  processingSpinner: {
    marginVertical: variables.scale(20),
  },
  progressBarContainer: {
    width: '80%',
    height: variables.scale(10),
    backgroundColor: '#333',
    borderRadius: variables.scale(10),
    marginVertical: variables.scale(20),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: variables.scale(10),
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: variables.scale(40),
    padding: variables.scale(15),
    borderRadius: variables.scale(8),
    borderWidth: 1,
    borderColor: 'white',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Results screen styles
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
  resultCategory: {
    color: '#999',
    fontSize: 16,
    marginTop: variables.scale(10),
    marginBottom: variables.scale(10),
  },
  resultValue: {
    color: 'white',
    fontSize: 18,
    marginBottom: variables.scale(5),
    flex: 1,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(8),
    paddingLeft: variables.scale(10),
  },
  conditionColor: {
    width: variables.scale(16),
    height: variables.scale(16),
    borderRadius: variables.scale(8),
    marginRight: variables.scale(10),
  },
  recommendationsTitle: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: variables.scale(10),
    marginBottom: variables.scale(10),
  },
  recommendationText: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: variables.scale(8),
    paddingLeft: variables.scale(10),
  },
  noResultsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: variables.scale(20),
  },
  resultContentContainer: {
    flex: 1,
    marginBottom: variables.scale(100),
  },
  doneButton: {
    justifyContent: 'flex-end',
    backgroundColor: '#4CAF50',
    padding: variables.scale(15),
    borderRadius: variables.scale(8),
    alignItems: 'center',
    marginVertical: variables.scale(10),
    marginHorizontal: variables.scale(20),
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  resultsContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    borderTopLeftRadius: variables.scale(30),
    borderTopRightRadius: variables.scale(30),
    padding: variables.scale(20),
    maxHeight: '65%',
    paddingBottom: variables.scale(50),
  },
  insideContainer: {
    flexDirection: 'column',
    minHeight: Dimensions.get('window').height * 0.3,
  },
  panelIndicatorText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: variables.scale(10),
  },
  legendContainer: {
    marginBottom: variables.scale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: variables.scale(10),
    padding: variables.scale(15),
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
    justifyContent: 'space-between',
  },
  legendColor: {
    width: variables.scale(16),
    height: variables.scale(16),
    borderRadius: variables.scale(8),
    marginRight: variables.scale(10),
  },
  legendText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: variables.scale(12),
    paddingHorizontal: variables.scale(8),
    paddingVertical: variables.scale(4),
    minWidth: variables.scale(24),
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: variables.scale(15),
  },
  recommendationsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: variables.scale(10),
    padding: variables.scale(15),
  },
  shimmerPlaceholder: {
    height: 30,
    width: '90%',
    borderRadius: 16,
    marginBottom: variables.scale(12),
  },
});
