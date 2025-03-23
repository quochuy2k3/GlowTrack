import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  Linking,
} from 'react-native';
import variables from "@/theme/commonColor";
// import LMS_API from "../../../api/myElearning/api";
import { t } from "i18next";

const QuizSheet = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const { contentObj } = contentDetail;
  const { sourceUrl, thumbUrl } = contentObj;
  const { height } = Dimensions.get("window");

  const onFinish = async () => {
    try {
      //   const response = await LMS_API.submitQuestion(
      //     courseId,
      //     contentDetail?.content,
      //   );
      const response = {};
      if (response) {
        onLoadData && onLoadData();
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    onFinish();
    setIsCanNextQuestion(true);
  }, []);

  const onOpenSheet = async () => {
    try {
      if (sourceUrl) {
        await Linking.openURL(sourceUrl);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>{contentObj?.title}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Image
              source={require("@/assets/images/information-circle.png")}
            />
          </View>
          <Text style={styles.infoText}>
            {t("review_file_to_mark_this_lesson")}
          </Text>
        </View>

        <View style={styles.sheetContainer}>
          <View style={styles.sheetPreview}>
            <Image
              source={require("@/assets/images/xls.png")}
              style={styles.sheetIcon}
              resizeMode="contain"
            />
            <Text style={styles.sheetName}>{contentObj?.title}</Text>
          </View>

          <TouchableOpacity onPress={onOpenSheet} style={styles.openPdfButton}>
            <Text style={styles.openPdfButtonText}>{t("download")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    marginBottom: variables.scale(32),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(64),
  },
  infoText: {
    fontSize: variables.scale(28),
    color: '#666',
    marginLeft: variables.scale(10),
  },
  sheetContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D6D8E0',
    borderRadius: variables.scale(16),
    paddingHorizontal: variables.scale(100),
    alignItems: 'center',
    backgroundColor: '#FBFBFC',
    marginBottom: variables.scale(16),
    justifyContent: 'space-between',
  },
  sheetPreview: {
    alignItems: 'center',
    marginBottom: variables.scale(32),
    paddingVertical: variables.scale(100),
  },
  sheetIcon: {
    width: variables.scale(120),
    height: variables.scale(120),
    marginBottom: variables.scale(16),
  },
  sheetName: {
    fontSize: variables.scale(32),
    color: "#333",
    textAlign: "center",
  },
  openPdfButton: {
    backgroundColor: variables.colorPrimary,
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    borderRadius: variables.scale(30),
    marginTop: variables.scale(16),
    marginBottom: variables.scale(50),
  },
  openPdfButtonText: {
    color: "#FFFFFF",
    fontSize: variables.scale(32),
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: variables.scale(20),
    backgroundColor: variables.colorPrimary,
    margin: variables.scale(32),
    borderRadius: variables.scale(16),
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: variables.scale(32),
  },
});

export default QuizSheet;
