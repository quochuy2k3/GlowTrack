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
  // Legacy fields for backward compatibility
  assessment?: Assessment;
  cham_soc_co_ban?: string[];
  chi_tiet_mun?: { [key: string]: string };
  danh_gia_muc_do?: string;
  khuyen_cao_y_te?: string;
  luu_y_quan_trong?: string[];
  tong_quan?: string;

  // New comprehensive analysis structure
  danh_gia_tong_quan?: {
    loai_da?: string;
    tinh_trang_chung?: string;
    diem_manh?: string[];
    diem_yeu?: string[];
    muc_do_nghiem_trong?: string;
  };

  phan_tich_theo_vung?: {
    vung_T?: string;
    vung_U?: string;
    vung_mat?: string;
    vung_moi?: string;
    vung_co?: string;
  };

  chi_tiet_van_de?: {
    mun_trung_ca?: {
      phan_tich_cu_the?: string;
      nguyen_nhan_chinh?: string[];
      do_nghiem_trong?: string;
      xu_huong_phat_trien?: string;
    };
    van_de_khac?: {
      lao_hoa?: string;
      sac_to?: string;
      do_am_dau?: string;
      lo_chan_long?: string;
    };
  };

  routine_cham_soc_cu_the?: {
    buoi_sang?: string[];
    buoi_toi?: string[];
    cham_soc_dac_biet?: {
      '2-3_lan_tuan'?: string[];
      hang_thang?: string[];
      luu_y_quan_trong?: string[];
    };
  };

  ket_qua_mong_doi?: {
    sau_2_tuan?: string;
    sau_1_thang?: string;
    sau_3_thang?: string;
    chi_phi_uoc_tinh?: string;
  };

  canh_bao_va_khuyen_cao?: {
    can_gap_bac_si?: string;
    muc_do_khan_cap?: string;
    co_the_tu_cham_soc?: string;
    dau_hieu_theo_doi?: string[];
  };

  do_tin_cay_danh_gia?: {
    phan_tram?: string;
    han_che?: string[];
    de_xuat_bo_sung?: string[];
  };
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
