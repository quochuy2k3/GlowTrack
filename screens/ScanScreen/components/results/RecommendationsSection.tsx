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

  if (!analysisResult?.result) {
    return null;
  }

  const result = analysisResult.result;

  return (
    <View style={styles.recommendationsContainer}>
      {/* Overall Assessment */}
      {result.danh_gia_tong_quan && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Đánh giá tổng quan:</Text>
          <Text style={styles.assessmentText}>Loại da: {result.danh_gia_tong_quan.loai_da}</Text>
          <Text style={styles.assessmentText}>
            Tình trạng: {result.danh_gia_tong_quan.tinh_trang_chung}
          </Text>
          <Text style={styles.assessmentText}>
            Mức độ nghiêm trọng: {result.danh_gia_tong_quan.muc_do_nghiem_trong}
          </Text>

          {result.danh_gia_tong_quan.diem_manh?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Điểm mạnh:</Text>
              {result.danh_gia_tong_quan.diem_manh.map((point, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {point}
                </Text>
              ))}
            </>
          )}

          {result.danh_gia_tong_quan.diem_yeu?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Điểm yếu:</Text>
              {result.danh_gia_tong_quan.diem_yeu.map((point, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {point}
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {/* Problem Details */}
      {result.chi_tiet_van_de?.mun_trung_ca && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Chi tiết vấn đề mụn:</Text>
          <Text style={styles.assessmentText}>
            {result.chi_tiet_van_de.mun_trung_ca.phan_tich_cu_the}
          </Text>
          <Text style={styles.assessmentText}>
            Độ nghiêm trọng: {result.chi_tiet_van_de.mun_trung_ca.do_nghiem_trong}
          </Text>
          <Text style={styles.assessmentText}>
            Xu hướng phát triển: {result.chi_tiet_van_de.mun_trung_ca.xu_huong_phat_trien}
          </Text>
        </View>
      )}

      {/* Basic Care Routine */}
      {result.routine_cham_soc_cu_the && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Routine chăm sóc:</Text>

          {result.routine_cham_soc_cu_the.buoi_sang?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Buổi sáng:</Text>
              {result.routine_cham_soc_cu_the.buoi_sang.map((step, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {step}
                </Text>
              ))}
            </>
          )}

          {result.routine_cham_soc_cu_the.buoi_toi?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Buổi tối:</Text>
              {result.routine_cham_soc_cu_the.buoi_toi.map((step, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {step}
                </Text>
              ))}
            </>
          )}

          {result.routine_cham_soc_cu_the.cham_soc_dac_biet?.luu_y_quan_trong?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Lưu ý quan trọng:</Text>
              {result.routine_cham_soc_cu_the.cham_soc_dac_biet.luu_y_quan_trong.map(
                (note, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {note}
                  </Text>
                )
              )}
            </>
          )}
        </View>
      )}

      {/* Expected Results */}
      {result.ket_qua_mong_doi && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Kết quả mong đợi:</Text>
          {result.ket_qua_mong_doi.sau_2_tuan && (
            <Text style={styles.assessmentText}>
              Sau 2 tuần: {result.ket_qua_mong_doi.sau_2_tuan}
            </Text>
          )}
          {result.ket_qua_mong_doi.sau_1_thang && (
            <Text style={styles.assessmentText}>
              Sau 1 tháng: {result.ket_qua_mong_doi.sau_1_thang}
            </Text>
          )}
          {result.ket_qua_mong_doi.sau_3_thang && (
            <Text style={styles.assessmentText}>
              Sau 3 tháng: {result.ket_qua_mong_doi.sau_3_thang}
            </Text>
          )}
        </View>
      )}

      {/* Warnings and Recommendations */}
      {result.canh_bao_va_khuyen_cao && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Cảnh báo và khuyến cáo:</Text>
          <Text style={styles.assessmentText}>
            Cần gặp bác sĩ: {result.canh_bao_va_khuyen_cao.can_gap_bac_si}
          </Text>
          <Text style={styles.assessmentText}>
            Mức độ khẩn cấp: {result.canh_bao_va_khuyen_cao.muc_do_khan_cap}
          </Text>

          {result.canh_bao_va_khuyen_cao.dau_hieu_theo_doi?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Dấu hiệu cần theo dõi:</Text>
              {result.canh_bao_va_khuyen_cao.dau_hieu_theo_doi.map((sign, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {sign}
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {/* Reliability Info */}
      {result.do_tin_cay_danh_gia && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Độ tin cậy đánh giá:</Text>
          <Text style={styles.assessmentText}>
            Phần trăm: {result.do_tin_cay_danh_gia.phan_tram}
          </Text>

          {result.do_tin_cay_danh_gia.han_che?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Hạn chế:</Text>
              {result.do_tin_cay_danh_gia.han_che.map((limit, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {limit}
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {/* Fallback for old data structure */}
      {result.tong_quan && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Tổng quan:</Text>
          <Text style={styles.assessmentText}>{result.tong_quan}</Text>
        </View>
      )}

      {result.danh_gia_muc_do && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Mức độ:</Text>
          <Text style={styles.assessmentText}>{result.danh_gia_muc_do}</Text>
        </View>
      )}

      {result.cham_soc_co_ban && Array.isArray(result.cham_soc_co_ban) && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Chăm sóc cơ bản:</Text>
          {result.cham_soc_co_ban.map((rec, index) => (
            <Text key={index} style={styles.recommendationText}>
              • {rec}
            </Text>
          ))}
        </View>
      )}

      {result.khuyen_cao_y_te && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Khuyến cáo y tế:</Text>
          <Text style={styles.recommendationText}>• {result.khuyen_cao_y_te}</Text>
        </View>
      )}

      {result.luu_y_quan_trong && Array.isArray(result.luu_y_quan_trong) && (
        <View style={styles.assessmentSection}>
          <Text style={styles.assessmentTitle}>Lưu ý quan trọng:</Text>
          {result.luu_y_quan_trong.map((note, index) => (
            <Text key={index} style={styles.recommendationText}>
              • {note}
            </Text>
          ))}
        </View>
      )}
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
  subTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: variables.scale(8),
    marginBottom: variables.scale(4),
  },
  assessmentText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: variables.scale(5),
  },
  recommendationText: {
    color: '#4CAF50',
    fontSize: 14,
    marginBottom: variables.scale(6),
    paddingLeft: variables.scale(10),
    lineHeight: 20,
  },
});
