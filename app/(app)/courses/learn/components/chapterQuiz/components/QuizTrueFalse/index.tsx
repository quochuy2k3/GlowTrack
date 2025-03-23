import React, { useContext, useState } from "react";
import { Image, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import variables from "@/theme/commonColor";
import commonColor from "@/theme/commonColor";
import IconTrue from "@/assets/svgs/trueIcon";
import IconTrueGreen from "@/assets/svgs/trueIconGreen";
import IconFalse from "@/assets/svgs/falseIcon";
import IconTrueText from "@/assets/svgs/trueTextIcon";
import IconFalseText from "@/assets/svgs/falseTextIcon";
// import LMS_API from '../../../api/myElearning/api';
import { t } from "i18next";

const QuizTrueFalse = ({
  contentDetail,
  courseId,
  setIsCanNextQuestion,
  onLoadData,
}: any) => {
  const { userAnswers } = contentDetail;
  const [answerChecked, setAnswerChecked] = useState(
    userAnswers?.answers?.answer
  );

  const [selected, setSelected] = useState(false);

  const [isCorrectChecked, setIsCorrectChecked] = useState(() => {
    if (userAnswers?.answers) {
      setIsCanNextQuestion(true);
      return (
        userAnswers?.answers?.answer === userAnswers?.correctAnswers?.answer
      );
    }
    return null;
  });

  const onFinish = async () => {
    try {
      //   const response = await LMS_API.submitQuestion(
      //     courseId,
      //     contentDetail?.content,
      //     answerChecked,
      //     contentDetail?.contentObj?.type,
      //   );
      const response = {};
      if (response && response.userAnswers) {
        const isCorrect =
          response.userAnswers?.answers?.answer ===
          response.userAnswers?.correctAnswers?.answer;
        setIsCorrectChecked(isCorrect);
        setIsCanNextQuestion(true);
        onLoadData && onLoadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetAnswer = () => {
    setAnswerChecked(null);
    setIsCorrectChecked(null);
    setSelected(false);
    setIsCanNextQuestion(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {contentDetail?.contentObj?.question}
      </Text>
      {contentDetail?.contentObj?.thumbUrl && (
        <Image
          style={styles.image}
          source={{
            uri: `${contentDetail?.contentObj?.thumbUrl}`,
          }}
        />
      )}
      <Text style={styles.supcriptionText}>
        {t("select_the_correct_answer")}
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          disabled={isCorrectChecked !== null}
          style={[
            styles.answerItem,
            answerChecked === true && isCorrectChecked === true
              ? styles.answerCorrect
              : answerChecked === true && isCorrectChecked === false
              ? styles.answerIncorrect
              : answerChecked === false && isCorrectChecked === false
              ? styles.answerChecked
              : answerChecked === true
              ? styles.answerChecked
              : {},
          ]}
          onPress={() => {
            setAnswerChecked(true);
            setSelected(true);
          }}
        >
          {isCorrectChecked === true && answerChecked === true ? (
            <IconTrue width={17} height={17} />
          ) : isCorrectChecked === false && answerChecked === true ? (
            <IconFalse width={17} height={17} />
          ) : isCorrectChecked === false && answerChecked !== true ? (
            <IconTrueGreen width={17} height={17} />
          ) : null}
          <Text
            style={[
              styles.answerText,
              answerChecked === true && isCorrectChecked === true
                ? styles.answerCorrectText
                : answerChecked === true && isCorrectChecked === false
                ? styles.answerIncorrectText
                : answerChecked === false && isCorrectChecked === false
                ? styles.answerTextChecked
                : {},
            ]}
          >
            {t("true")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isCorrectChecked !== null}
          style={[
            styles.answerItem,
            answerChecked === false && isCorrectChecked === true
              ? styles.answerCorrect
              : answerChecked === false && isCorrectChecked === false
              ? styles.answerIncorrect
              : answerChecked === true && isCorrectChecked === false
              ? styles.answerChecked
              : answerChecked === false
              ? styles.answerChecked
              : {},
          ]}
          onPress={() => {
            setAnswerChecked(false);
            setSelected(true);
          }}
        >
          {isCorrectChecked === true && answerChecked === false ? (
            <IconTrue width={17} height={17} />
          ) : isCorrectChecked === false && answerChecked === false ? (
            <IconFalse width={17} height={17} />
          ) : isCorrectChecked === false && answerChecked !== false ? (
            <IconTrueGreen width={17} height={17} />
          ) : null}
          <Text
            style={[
              styles.answerText,
              answerChecked === false && isCorrectChecked === true
                ? styles.answerCorrectText
                : answerChecked === false && isCorrectChecked === false
                ? styles.answerIncorrectText
                : answerChecked === true && isCorrectChecked === false
                ? styles.answerTextChecked
                : {},
            ]}
          >
            {t("false")}
          </Text>
        </TouchableOpacity>
      </View>
      {isCorrectChecked !== null ? (
        <View style={styles.resultContainer}>
          <View style={styles.resultTextContainer}>
            {isCorrectChecked ? (
              <IconTrueText width={17} height={17} />
            ) : (
              <IconFalseText width={17} height={17} color="red" />
            )}
            <Text
              style={[
                styles.resultText,
                isCorrectChecked ? { color: "#1ECC78" } : { color: "#FF0E39" },
              ]}
            >
              {isCorrectChecked
                ? `${t("correct_answer")}`
                : `${t("your_answer_was_incorrect")}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetAnswer}>
            <Text style={styles.resetButtonText}>{t("retry")}</Text>
          </TouchableOpacity>
          {Object.entries(contentDetail?.contentObj?.content).length > 0 && (
            <View>
              <Text style={styles.feedbackTitleText}>{t("feedback")}</Text>
              <Text style={styles.feedbackText}>
                {contentDetail?.contentObj?.feedback}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          {
            display: isCorrectChecked !== null ? "none" : "flex",
          },
          styles.submitButton,
          selected === false
            ? styles.submitButtonInactive
            : styles.submitButtonActive,
        ]}
        onPress={answerChecked !== null ? onFinish : null}
      >
        <Text
          style={[
            styles.submitButtonText,
            selected === false
              ? styles.submitButtonTextInactive
              : styles.submitButtonTextActive,
          ]}
        >
          {t("submit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionText: {
    fontSize: variables.scale(32),
    fontWeight: "600",
    fontFamily: commonColor.fontFamily,
  },
  image: {
    marginTop: variables.scale(16),
    borderRadius: variables.scale(20),
    height: variables.scale(400),
  },
  supcriptionText: {
    marginTop: variables.scale(32),
    fontSize: variables.scale(32),
    fontWeight: "600",
    fontFamily: commonColor.fontFamily,
    color: "#8C8C8C",
  },
  answerContainer: {
    flexDirection: "column",
    marginTop: variables.scale(14),
  },
  answerItem: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: variables.scale(20),
    marginTop: variables.scale(46),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: variables.scale(20),
    flexDirection: "row",
  },
  answerChecked: {
    borderColor: "#1ECC78",
    borderWidth: 1,
    borderRadius: variables.scale(20),
    marginTop: variables.scale(46),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: variables.scale(20),
    backgroundColor: "#E8FAF1",
  },
  answerTextChecked: {
    color: "#1ECC78",
  },
  answerCorrect: {
    borderColor: "#1ECC78",
    backgroundColor: "#1ECC78",
    borderWidth: 1,
  },
  answerCorrectText: {
    color: "#FFFFFF",
  },
  answerIncorrectText: {
    color: "#FF0E39",
  },
  answerIncorrect: {
    borderColor: "#FF0E39",
    borderWidth: 1,
    backgroundColor: "#FFE7EB",
  },
  answerText: {
    fontSize: variables.scale(39),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    marginLeft: variables.scale(10),
    color: "#000",
  },
  submitButton: {
    marginTop: variables.scale(100),
    backgroundColor: "#F5F5F5",
    borderRadius: variables.scale(30),
    paddingVertical: variables.scale(24),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFBFBF",
  },
  submitButtonText: {
    fontSize: variables.scale(32),
    fontWeight: "600",
    fontFamily: commonColor.fontFamily,
    color: "#BFBFBF",
  },
  submitButtonActive: {
    backgroundColor: "#1ECC78",
    borderColor: "#1ECC78",
    borderWidth: 1,
  },
  submitButtonTextActive: {
    color: "#FFFFFF",
    fontSize: variables.scale(32),
    fontWeight: "600",
  },
  resultContainer: {
    marginTop: variables.scale(40),
  },
  resultTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultText: {
    fontSize: variables.scale(32),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    marginLeft: variables.scale(20),
  },
  feedbackTitleText: {
    fontSize: variables.scale(32),
    fontWeight: "600",
    fontFamily: commonColor.fontFamily,
    color: "#000000",
    marginTop: variables.scale(60),
  },
  feedbackText: {
    fontSize: variables.scale(32),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    color: "#000000",
    marginTop: variables.scale(16),
  },
  resetButton: {
    marginTop: variables.scale(20),
    paddingVertical: variables.scale(24),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFBFBF",
    borderRadius: variables.scale(30),
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: variables.scale(32),
    fontWeight: "600",
  },
  next_question: {
    borderRadius: variables.scale(30),
    marginTop: variables.scale(46),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: variables.scale(24),
    flexDirection: "row",
    backgroundColor: variables.colorPrimary,
  },
  text_next_question: {
    color: "#ffffff",
    fontSize: variables.scale(32),
    fontWeight: "600",
  },
  submitButtonInactive: {
    backgroundColor: "#F5F5F5",
    borderColor: "#D9D9D9",
    borderWidth: 1,
  },
  submitButtonTextInactive: {
    color: "#BFBFBF",
    fontSize: variables.scale(32),
    fontWeight: "600",
  },
});

export default QuizTrueFalse;
