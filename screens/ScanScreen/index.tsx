import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { CameraScreen, PreviewScreen, ProcessingScreen, ResultsScreen } from './components';
import { useScanLogic, useCameraCapture, useImageProcessing, ScanState } from './hooks';

export default function ScanScreen() {
  const {
    scanState,
    setScanState,
    capturedPhoto,
    setCapturedPhoto,
    setCapturedPhotoBase64,
    processedImageBase64,
    setProcessedImageBase64,
    classSummary,
    setClassSummary,
    analysisResult,
    notice,
    error,
    setError,
    isLoadingRecommendations,
    retakePhoto,
    openChatInterface,
    closeChatInterface,
    fetchGeminiRecommendations,
    service,
  } = useScanLogic();

  const { facing, permission, requestPermission, camRef, toggleCameraFacing, takePicture } =
    useCameraCapture();

  const { processingProgress, processPhoto } = useImageProcessing({
    service,
    onSuccess: result => {
      setClassSummary(result.class_summary || {});
      setProcessedImageBase64(result.image || null);
      setScanState(ScanState.RESULTS);
      fetchGeminiRecommendations(result);
    },
    onError: errorMessage => {
      setError(errorMessage);
      setScanState(ScanState.PREVIEW);
    },
  });

  const handleTakePicture = async () => {
    const photoData = await takePicture();
    if (photoData) {
      setCapturedPhoto(photoData.uri);
      setCapturedPhotoBase64(photoData.base64 || null);
      setScanState(ScanState.PREVIEW);
    }
  };

  const handleProcessPhoto = () => {
    if (capturedPhoto) {
      setScanState(ScanState.PROCESSING);
      processPhoto(capturedPhoto);
    }
  };

  const renderContent = () => {
    switch (scanState) {
      case ScanState.CAMERA:
        return (
          <CameraScreen
            camRef={camRef}
            facing={facing}
            onTakePicture={handleTakePicture}
            onToggleFacing={toggleCameraFacing}
            onOpenChat={openChatInterface}
            permission={permission}
            requestPermission={requestPermission}
          />
        );

      case ScanState.PREVIEW:
        if (!capturedPhoto) return null;
        return (
          <PreviewScreen
            capturedPhoto={capturedPhoto}
            error={error}
            onRetake={retakePhoto}
            onProcess={handleProcessPhoto}
          />
        );

      case ScanState.PROCESSING:
        return (
          <ProcessingScreen
            processingProgress={processingProgress}
            onCancel={() => setScanState(ScanState.PREVIEW)}
          />
        );

      case ScanState.RESULTS:
        return (
          <ResultsScreen
            processedImageBase64={processedImageBase64}
            facing={facing}
            classSummary={classSummary}
            notice={notice}
            isLoadingRecommendations={isLoadingRecommendations}
            analysisResult={analysisResult}
            onBackPress={() => setScanState(ScanState.CAMERA)}
            onOpenChat={openChatInterface}
            fetchGeminiRecommendations={fetchGeminiRecommendations}
          />
        );

      default:
        return null;
    }
  };

  return <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});
