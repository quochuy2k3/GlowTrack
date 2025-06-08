import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useServices } from '@/services';

export enum ScanState {
  CAMERA = 'camera',
  PREVIEW = 'preview',
  PROCESSING = 'processing',
  RESULTS = 'results',
}

export interface ClassSummary {
  count: number;
  color: string;
}

export interface ApiResponse {
  class_summary?: Record<string, ClassSummary> | null;
  image?: string | null;
}

export interface Assessment {
  date: string;
  time: string;
  acne_count: number;
  acne_types: string[];
  skin_condition: string;
  safety_rating: string;
  basic_care_recommendations: string[];
  medical_recommendations: string[];
  disclaimer: string;
}

export interface SkinAnalysisResult {
  assessment: Assessment;
  cham_soc_co_ban: string[];
  chi_tiet_mun: { [key: string]: string };
  danh_gia_muc_do: string;
  khuyen_cao_y_te: string;
  luu_y_quan_trong: string[];
  tong_quan: string;
}

export interface AnalysisResponse {
  result: SkinAnalysisResult;
  notice: string;
}

export const useScanLogic = () => {
  const service = useServices();
  const router = useRouter();

  // State management
  const [scanState, setScanState] = useState<ScanState>(ScanState.CAMERA);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPhotoBase64, setCapturedPhotoBase64] = useState<string | null>(null);
  const [processedImageBase64, setProcessedImageBase64] = useState<string | null>(null);
  const [classSummary, setClassSummary] = useState<Record<string, ClassSummary>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const resetScan = () => {
    setCapturedPhoto(null);
    setCapturedPhotoBase64(null);
    setProcessedImageBase64(null);
    setClassSummary({});
    setAnalysisResult(null);
    setNotice('');
    setError(null);
    setScanState(ScanState.CAMERA);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCapturedPhotoBase64(null);
    setProcessedImageBase64(null);
    setClassSummary({});
    setError(null);
    setScanState(ScanState.CAMERA);
  };

  const openChatInterface = () => {
    router.push('/(root)/(modals)/chat');
  };

  const closeChatInterface = () => {
    router.dismiss();
  };

  const fetchGeminiRecommendations = async (result: ApiResponse) => {
    setIsLoadingRecommendations(true);

    try {
      if (!result.image) {
        throw new Error('No image data available for analysis');
      }

      const response = await service.ScanService.analyze(result.image, result.class_summary);
      const analysisResponse = response as unknown as AnalysisResponse;

      setAnalysisResult(analysisResponse);
      setNotice(analysisResponse.notice);
      setIsLoadingRecommendations(false);

      return analysisResponse;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setIsLoadingRecommendations(false);
      return null;
    }
  };

  return {
    // State
    scanState,
    setScanState,
    capturedPhoto,
    setCapturedPhoto,
    capturedPhotoBase64,
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

    // Actions
    resetScan,
    retakePhoto,
    openChatInterface,
    closeChatInterface,
    fetchGeminiRecommendations,

    // Service
    service,
  };
};
