import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import variables from "@/theme/commonColor";
import { t } from "i18next";

const QuizPdf = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const { contentObj } = contentDetail;
  const { sourceUrl, thumbUrl } = contentObj;
  const source = sourceUrl || thumbUrl;

  const [modalVisible, setModalVisible] = useState(false);

  const onFinish = async () => {
    try {
      const response = {}; // Mock response, replace with API call if needed
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

  const onOpenPDF = () => {
    setModalVisible(true);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>{contentObj?.title}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Image source={require("@/assets/images/information-circle.png")} />
          </View>
          <Text style={styles.infoText}>
            {t("review_file_to_mark_this_lesson")}
          </Text>
        </View>

        <View style={styles.pdfContainer}>
          <View style={styles.pdfPreview}>
            <Image
              source={require("@/assets/images/pdf.png")}
              style={styles.pdfIcon}
              resizeMode="contain"
            />
            <Text style={styles.pdfName}>{contentObj?.title}</Text>
          </View>

          <TouchableOpacity onPress={onOpenPDF} style={styles.openPdfButton}>
            <Text style={styles.openPdfButtonText}>{t("open_pdf")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={onCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity onPress={onCloseModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <WebView source={{ uri: source }} style={styles.pdf} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: variables.scale(32),
    fontWeight: "600",
    marginBottom: variables.scale(32),
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: variables.scale(64),
  },
  infoText: {
    fontSize: variables.scale(28),
    color: "#666",
    marginLeft: variables.scale(10),
  },
  pdfContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D6D8E0",
    borderRadius: variables.scale(16),
    paddingHorizontal: variables.scale(100),
    alignItems: "center",
    backgroundColor: "#FBFBFC",
    marginBottom: variables.scale(16),
    justifyContent: "space-between",
  },
  pdfPreview: {
    alignItems: "center",
    marginBottom: variables.scale(32),
    paddingVertical: variables.scale(100),
  },
  pdfIcon: {
    width: variables.scale(120),
    height: variables.scale(120),
    marginBottom: variables.scale(16),
  },
  pdfName: {
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default QuizPdf;
