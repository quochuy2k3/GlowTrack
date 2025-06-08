import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { ApiResponse } from './useScanLogic';

interface UseImageProcessingProps {
  service: any;
  onSuccess: (result: ApiResponse) => void;
  onError: (error: string) => void;
}

export const useImageProcessing = ({ service, onSuccess, onError }: UseImageProcessingProps) => {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPhoto = useCallback(
    async (capturedPhoto: string) => {
      try {
        setIsProcessing(true);
        setProcessingProgress(0);

        if (!capturedPhoto) {
          throw new Error('No photo captured');
        }

        // Show progress indicator
        const progressTimer = setInterval(() => {
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

          const response = await service.ScanService.predict(formData);
          const result = response as unknown as ApiResponse;

          setProcessingProgress(1);
          clearInterval(progressTimer);

          setTimeout(() => {
            setIsProcessing(false);
            onSuccess(result);
          }, 500);
        } catch (apiError) {
          clearInterval(progressTimer);
          setIsProcessing(false);
          onError('Failed to process the image. Please try again.');
        }
      } catch (error) {
        setIsProcessing(false);
        onError('An unexpected error occurred. Please try again.');
      }
    },
    [service, onSuccess, onError]
  );

  const resetProcessing = () => {
    setProcessingProgress(0);
    setIsProcessing(false);
  };

  return {
    processingProgress,
    isProcessing,
    processPhoto,
    resetProcessing,
  };
};
