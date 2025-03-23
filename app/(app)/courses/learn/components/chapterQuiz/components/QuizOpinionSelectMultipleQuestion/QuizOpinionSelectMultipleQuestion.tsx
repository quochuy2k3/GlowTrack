import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { t } from "i18next";
import WebView from "react-native-webview";
import RadioIcon from "@/assets/svgs/RadioIcon";
import variables from "@/theme/commonColor";
const QuizOpinionSelectMultipleQuestion = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const initialSelectedAnswers = new Set(
    contentDetail?.userAnswers?.answers.answer || []
  );

  const [selectedAnswers, setSelectedAnswers] = useState(
    initialSelectedAnswers
  );
  const [isSubmitted, setIsSubmitted] = useState(() => {
    setIsCanNextQuestion(contentDetail?.userAnswers ? true : false);
    return contentDetail?.userAnswers ? true : false;
  });

  const { contentObj } = contentDetail;
  const [answerExplain, setAnswerExplain] = useState("");
  const { content } = contentObj;
  const options = content.options;

  const handleSelect = (answer) => {
    if (!isSubmitted) {
      const newSelected = new Set(selectedAnswers);
      if (newSelected.has(answer)) {
        newSelected.delete(answer);
      } else {
        newSelected.add(answer);
      }
      setSelectedAnswers(newSelected);
    }
  };

  const handleSubmit = async () => {
    const selectedArray = [...selectedAnswers];
    // const response = await LMS_API.submitQuestion(
    //   courseId,
    //   contentDetail?.content,
    //   selectedArray,
    //   contentDetail?.contentObj?.type
    // );
    const response = {};

    if (response) {
      setAnswerExplain(decodeURIComponent(response?.contentObj?.answerExplain));
      onLoadData && onLoadData();
      setIsSubmitted(true);
      setIsCanNextQuestion(true);
    }
  };

  const getOptionStyle = (optionId) => {
    if (isSubmitted) {
      return selectedAnswers.has(optionId)
        ? styles.correctOption
        : styles.option;
    }
    return selectedAnswers.has(optionId)
      ? styles.selectedOption
      : styles.option;
  };

  const getOptionTextStyle = (optionId) => {
    if (isSubmitted) {
      return selectedAnswers.has(optionId)
        ? styles.whiteText
        : styles.optionText;
    }
    return selectedAnswers.has(optionId)
      ? styles.selectedOptionText
      : styles.optionText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.question}>{contentObj.question}</Text>

      {content.thumbUrl && (
        <Image
          source={{ uri: content.thumbUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.selectText}>{t("select_the_correct_answer")}</Text>

      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={getOptionStyle(option.id)}
          onPress={() => handleSelect(option.id)}
          disabled={isSubmitted}
        >
          <View style={styles.optionContent}>
            {isSubmitted ? (
              <View>
                {!selectedAnswers.has(option.id) ? (
                  <RadioIcon color={"black"} />
                ) : (
                  <Image
                    source={require("@/assets/images/IconTrue.png")}
                    style={styles.resultIcon}
                  />
                )}
              </View>
            ) : (
              <Image
                source={
                  selectedAnswers.has(option.id)
                    ? require("@/assets/images/CheckBoxIconActive.png")
                    : require("@/assets/images/CheckBoxIcon.png")
                }
              />
            )}

            <Text
              style={[
                getOptionTextStyle(option.id),
                { paddingLeft: variables.scale(10) },
              ]}
            >
              {option.content}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {!isSubmitted && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedAnswers.size === 0 && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={selectedAnswers.size === 0}
        >
          <Text
            style={[
              styles.submitButtonText,
              selectedAnswers.size === 0 && { color: "#BFBFBF" },
            ]}
          >
            {t("submit")}
          </Text>
        </TouchableOpacity>
      )}

      {isSubmitted && (
        <View style={styles.feedbackContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("@/assets/images/Check.png")}
              style={{ marginRight: variables.scale(10) }}
            />
            <Text
              style={(styles.feedbackText, { color: variables.colorPrimary })}
            >
              {t("correct_answer")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setSelectedAnswers(new Set());
              setIsSubmitted(false);
              setIsCanNextQuestion(false);
            }}
          >
            <Text style={styles.retryButtonText}>{t("retry")}</Text>
          </TouchableOpacity>
          {answerExplain !== "" && (
            <View style={{ marginVertical: variables.scale(20) }}>
              <Text style={{ marginBottom: variables.scale(20) }}>
                {t("feedback")}
              </Text>
              <WebView
                originWhitelist={["*"]}
                source={{ html: answerExplain }}
                style={{
                  height: answerExplain ? variables.scale(200) : 0,
                  width: "100%",
                }}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: Platform.OS === "ios" ? variables.scale(32) : variables.scale(0),
  },
  question: {
    fontSize: variables.scale(32),
    fontWeight: "500",
    marginBottom: variables.scale(32),
  },
  image: {
    width: "100%",
    height: variables.scale(400),
    borderRadius: variables.scale(16),
    marginBottom: variables.scale(48),
  },
  selectText: {
    fontSize: variables.scale(30),
    color: "#666",
    marginBottom: variables.scale(32),
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(16),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: variables.scale(24),
    backgroundColor: "#fff",
  },
  selectedOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(16),
    borderWidth: 1,
    borderColor: variables.colorPrimary,
    marginBottom: variables.scale(24),
    backgroundColor: "#E8FAF1",
  },
  correctOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(16),
    marginBottom: variables.scale(24),
    backgroundColor: variables.colorPrimary,
  },
  incorrectOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(16),
    marginBottom: variables.scale(24),
    backgroundColor: "#FFE7EB",
    borderColor: "red",
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: variables.scale(30),
    color: "#000",
  },
  selectedOptionText: {
    fontSize: variables.scale(30),
    color: "#4CAF50",
  },
  whiteText: {
    fontSize: variables.scale(30),
    color: "#fff",
  },
  incorrectOptionText: {
    fontSize: variables.scale(30),
    color: "red",
  },
  submitButton: {
    backgroundColor: variables.colorPrimary,
    padding: variables.scale(24),
    borderRadius: variables.scale(28),
    alignItems: "center",
    marginTop: variables.scale(16),
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E5E5",
    borderWidth: 1,
    borderColor: "#BFBFBF",
  },
  submitButtonText: {
    color: "white",
    fontSize: variables.scale(32),
    fontWeight: "500",
  },
  feedbackContainer: {
    marginTop: variables.scale(32),
  },
  feedbackText: {
    fontSize: variables.scale(30),
    color: "#666",
    marginBottom: variables.scale(8),
  },
  feedbackSubText: {
    fontSize: variables.scale(30),
    color: "#666",
  },
  retryButton: {
    backgroundColor: "#FF6347",
    padding: variables.scale(24),
    borderRadius: variables.scale(28),
    alignItems: "center",
    marginTop: variables.scale(16),
  },
  retryButtonText: {
    color: "white",
    fontSize: variables.scale(32),
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: variables.colorPrimary,
    borderColor: variables.colorPrimary,
    padding: variables.scale(24),
    borderRadius: variables.scale(32),
    alignItems: "center",
    marginTop: variables.scale(variables.scale(32)),
    borderWidth: 1,
  },
  retryButtonText: {
    fontSize: variables.scale(32),
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default QuizOpinionSelectMultipleQuestion;
