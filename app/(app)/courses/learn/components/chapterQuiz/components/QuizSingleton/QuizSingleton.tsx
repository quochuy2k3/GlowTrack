import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import variables from "@/theme/commonColor";
import { Spinner } from "tamagui";
import { t } from "i18next";
// import LMS_API from '../../../api/myElearning/api';
const QuizSingleton = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const [loading, setLoading] = useState(true);
  const { contentObj } = contentDetail;
  const [selectedAnswer, setSelectedAnswer] = useState(
    contentDetail?.userAnswers?.answers?.answer
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    contentDetail?.userAnswers?.correctAnswers?.answer || null
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSelect = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };
  useEffect(() => {
    if (contentDetail?.userAnswers?.answers?.answer) {
      setSelectedAnswer(contentDetail?.userAnswers?.answers?.answer || null);
      setIsSubmitted(true);
      setIsAnswered(true);
      setIsCanNextQuestion(true);
    }
    setLoading(false);
  }, [contentDetail]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    try {
      // const response = await LMS_API.submitQuestion(
      //   courseId,
      //   contentDetail?.content,
      //   selectedAnswer,
      //   contentObj?.type
      // );
      const response = {};
      if (response) {
        // utils.back();
        setCorrectAnswer(response?.userAnswers?.correctAnswers?.answer);
        setIsSubmitted(true);
        setIsAnswered(true);
        setIsCanNextQuestion(true);
        onLoadData && onLoadData();
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };
  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsAnswered(false);
    setIsCanNextQuestion(false);
  };

  const getOptionStyle = (option) => {
    if (!isSubmitted) {
      return option === selectedAnswer ? styles.selectedOption : styles.option;
    }
    if (option === correctAnswer && selectedAnswer !== correctAnswer) {
      return styles.correctOptionButton;
    }
    if (option === correctAnswer) {
      return styles.correctOption;
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return styles.incorrectOption;
    }

    return styles.option;
  };

  const getOptionTextStyle = (option) => {
    if (!isSubmitted) {
      return option === selectedAnswer
        ? styles.selectedOptionText
        : styles.optionText;
    }

    // Nếu là câu trả lời đúng và người dùng chọn sai thì hiển thị nền trắng và border màu primaryColor
    if (option === correctAnswer && selectedAnswer !== correctAnswer) {
      return styles.correctOptionWithWhiteBackground;
    }
    // Kiểm tra nếu câu trả lời đúng
    if (option === correctAnswer) {
      return styles.whiteText;
    }

    // Kiểm tra nếu người dùng chọn câu trả lời sai
    if (option === selectedAnswer && option !== correctAnswer) {
      return styles.incorrectText;
    }

    // Nếu là câu trả lời sai và được chọn nhưng không phải đúng, thì màu đỏ
    if (option === selectedAnswer && option !== correctAnswer) {
      return styles.incorrectText;
    }

    return styles.optionText;
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.question}>{contentObj?.question}</Text>
      {contentObj?.thumbUrl && (
        <Image
          source={{
            uri: `${contentObj?.thumbUrl}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.selectText}>{t("select_the_correct_answer")}</Text>

      {contentObj?.content?.options?.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionStyle(option?.id)}
          onPress={() => handleSelect(option?.id)}
          disabled={isSubmitted}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={
                isSubmitted
                  ? option?.id === correctAnswer
                    ? selectedAnswer !== correctAnswer
                      ? require("@/assets/images/IconTrueGreen.png")
                      : require("@/assets/images/IconTrue.png")
                    : selectedAnswer === option?.id
                    ? require("@/assets/images/IncorrectIcon.png")
                    : require("@/assets/images/RadioIcon.png")
                  : selectedAnswer === option?.id
                  ? require("@/assets/images/RadioIconChecked.png")
                  : require("@/assets/images/RadioIcon.png")
              }
              style={styles.radioIcon}
            />
            <Text
              style={[
                getOptionTextStyle(option?.id),
                {
                  paddingLeft: variables.scale(20),
                  flexShrink: 1,
                  flexWrap: "wrap",
                },
              ]}
            >
              {option?.content}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {!isSubmitted && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedAnswer
              ? styles.submitButtonActive
              : styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedAnswer}
        >
          <Text
            style={[
              styles.submitButtonText,
              selectedAnswer && styles.submitButtonTextActive,
            ]}
          >
            {t("submit")}
          </Text>
        </TouchableOpacity>
      )}

      {isSubmitted && (
        <View style={styles.feedbackContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={
                selectedAnswer === correctAnswer
                  ? require("@/assets/images/Check.png")
                  : require("@/assets/images/cancel.png")
              }
            />
            <Text
              style={[
                styles.feedbackText,
                selectedAnswer === correctAnswer
                  ? styles.correctText
                  : styles.incorrectText,
              ]}
            >
              {selectedAnswer === correctAnswer
                ? `${t("correct_answer")}`
                : `${t("your_answer_was_incorrect")}`}
            </Text>
          </View>
          {contentObj?.feedback && (
            <View
              style={{
                marginTop: variables.scale(40),
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text>Feedback</Text>
              <Text
                style={[
                  styles.feedbackSubText,
                  selectedAnswer === correctAnswer
                    ? styles.correctSubText
                    : styles.incorrectSubText,
                ]}
              >
                Object-oriented programming languages
              </Text>
            </View>
          )}
        </View>
      )}
      {isAnswered && (
        <>
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedAnswer
                ? styles.submitButtonActive
                : styles.submitButtonDisabled,
            ]}
            onPress={handleTryAgain}
            disabled={!selectedAnswer}
          >
            <Text
              style={[
                styles.submitButtonText,
                selectedAnswer && styles.submitButtonTextActive,
              ]}
            >
              {t("retry")}
            </Text>
          </TouchableOpacity>
        </>
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
    fontSize: variables.scale(30),
    fontWeight: "500",
    marginBottom: variables.scale(32),
  },
  image: {
    width: "100%",
    height: variables.scale(400),
    borderRadius: variables.scale(20),
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
    borderRadius: variables.scale(20),
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
    borderRadius: variables.scale(20),
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
    borderRadius: variables.scale(20),
    marginBottom: variables.scale(24),
    backgroundColor: variables.colorPrimary,
  },
  incorrectOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(20),
    marginBottom: variables.scale(24),
    borderWidth: 0.5,
    borderColor: "#FF0E39",
    backgroundColor: "#FFE7EB",
  },
  optionText: {
    fontSize: variables.scale(30),
    color: "#000",
    fontWeight: "300",
  },
  selectedOptionText: {
    fontSize: variables.scale(30),
    color: "black",
    fontWeight: "300",
  },
  whiteText: {
    fontSize: variables.scale(30),
    color: "#fff",
  },
  radioIcon: {},
  submitButton: {
    padding: variables.scale(24),
    borderRadius: variables.scale(32),
    alignItems: "center",
    marginTop: variables.scale(16),
    borderWidth: 1,
  },
  submitButtonActive: {
    backgroundColor: variables.colorPrimary,
    borderColor: variables.colorPrimary,
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E5E5",
    borderColor: "#BFBFBF",
  },

  submitButtonText: {
    fontSize: variables.scale(32),
    fontWeight: "500",
    color: "#BFBFBF",
  },

  submitButtonTextActive: {
    color: "#FFFFFF",
  },

  correctText: {
    color: "#1ECC78",
    fontWeight: "400",
  },
  incorrectText: {
    fontSize: variables.scale(30),
    color: "red",
    fontWeight: "400",
  },
  correctSubText: {
    color: "green",
  },
  incorrectSubText: {
    color: "red",
  },

  feedbackContainer: {
    marginTop: variables.scale(32),
  },
  feedbackText: {
    fontSize: variables.scale(28),
    marginBottom: variables.scale(8),
    fontWeight: "bold",
    paddingLeft: variables.scale(16),
  },
  feedbackSubText: {
    marginTop: variables.scale(20),
    fontSize: variables.scale(30),
  },
  correctOptionWithWhiteBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: variables.scale(20),
    color: variables.colorPrimary,
    fontSize: variables.scale(30),
  },
  correctOptionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: variables.scale(24),
    borderRadius: variables.scale(20),
    marginBottom: variables.scale(24),
    borderWidth: 0.5,
    borderColor: variables.colorPrimary,
    backgroundColor: "#E8FAF1",
  },
});

export default QuizSingleton;
