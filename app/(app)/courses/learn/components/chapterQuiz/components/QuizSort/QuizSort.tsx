import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import variables from "@/theme/commonColor";
import { t } from "i18next";
// import LMS_API from '../../../api/myElearning/api';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const QuizSort = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const { contentObj } = contentDetail;
  const userAnswer = contentDetail?.userAnswers?.answers?.answer;
  const correctAnswer = contentDetail?.userAnswers?.correctAnswers?.answer;

  const initialData = contentObj?.content?.options?.map((option, index) => ({
    index: `${index + 1}`,
    text: option.content,
    id: option?.id,
  }));

  const [data, setData] = useState(
    userAnswer
      ? userAnswer.map((ans, i) => ({
          ...initialData.find((opt) => opt.id === ans),
          index: `${i + 1}`,
        }))
      : initialData
  );

  const [isSorted, setIsSorted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!userAnswer);
  const [points, setPoints] = useState(contentDetail?.userAnswers?.points || 0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (userAnswer && correctAnswer) {
      const isCorrect =
        JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
      if (isCorrect) {
        setPoints(10);
      } else {
        setPoints(0);
        setShowOptions(true);
      }
      setIsSubmitted(true);
      setIsCanNextQuestion(true);
    }
  }, [userAnswer, correctAnswer]);

  const renderItem = ({ item, drag, isActive }) => {
    const correctIndex = correctAnswer?.indexOf(item.id);
    const userIndex = data.findIndex((dataItem) => dataItem.id === item.id);
    const isCorrect = correctIndex === userIndex;

    return (
      <TouchableOpacity
        style={[styles.dragItem]}
        onLongPress={!isSubmitted ? drag : null}
      >
        <Text style={[styles.itemNumber]}>{item.index}.</Text>
        {!isSubmitted && (
          <Image
            style={{ marginLeft: variables.scale(30) }}
            source={require("@/assets/images/Grip-dots-vertical.png")}
          />
        )}
        <View
          style={[
            styles.itemImage,
            isActive && {
              backgroundColor: "#D3D3D3",
              paddingHorizontal: variables.scale(10),
              borderRadius: variables.scale(16),
            },
            !isSubmitted
              ? {
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                }
              : {
                  borderColor: isCorrect ? variables.colorPrimary : "#F44336",
                  backgroundColor: isCorrect
                    ? variables.colorPrimary
                    : "#FFEBEE",
                  borderWidth: 1,
                  marginLeft: variables.scale(30),
                },
          ]}
        >
          {isSubmitted && isCorrect && (
            <Image
              style={{ marginRight: variables.scale(10) }}
              source={require("@/assets/images/IconTrue.png")}
            />
          )}
          {isSubmitted && !isCorrect && (
            <Image
              style={{ marginRight: variables.scale(10) }}
              source={require("@/assets/images/IncorrectIcon.png")}
            />
          )}
          <Text
            style={[
              styles.itemText,
              isSubmitted && {
                color: isCorrect ? "white" : "#F44336",
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDragEnd = ({ data }) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      index: `${index + 1}`,
    }));
    setData(updatedData);
    setIsSorted(true);
  };

  const handleSubmit = async () => {
    try {
      //   const response = await LMS_API.submitQuestion(
      //     courseId,
      //     contentDetail?.content,
      //     data.map((item) => item.id),
      //     contentObj?.type,
      //   );
      const response = {};
      if (response) {
        setIsSubmitted(true);
        setIsCanNextQuestion(true);
        setPoints(response?.userAnswers?.point || 0);
        if (response?.userAnswers?.point === 0) {
          setShowOptions(true);
        }
        onLoadData && onLoadData();
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleRetry = () => {
    setData(initialData);
    setIsSorted(false);
    setIsSubmitted(false);
    setPoints(0);
    setShowOptions(false);
    setIsCanNextQuestion(false);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.question}>{contentObj?.question}</Text>
        {contentObj?.thumbUrl && (
          <Image
            source={{ uri: contentObj?.thumbUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.instruction}>
          {t("arrange_the_correct_answer")}
        </Text>

        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          activationDistance={0}
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isSubmitted && points > 0 && (
            <Image source={require("@/assets/images/Check.png")} />
          )}
          {isSubmitted && points <= 0 && (
            <Image source={require("@/assets/images/cancel.png")} />
          )}

          {isSubmitted && (
            <Text
              style={[
                styles.answer,
                {
                  color: points > 0 ? variables.colorPrimary : "#FF3E61",
                  fontSize: variables.scale(32),
                  paddingVertical: variables.scale(20),
                  marginLeft: variables.scale(10),
                },
              ]}
            >
              {points > 0
                ? t("correct_answer")
                : t("your_answer_was_incorrect")}
            </Text>
          )}
        </View>

        {showOptions && (
          <View>
            {correctAnswer?.map((correctAnsId, i) => {
              const correctOption = initialData.find(
                (option) => option.id === correctAnsId
              );
              return (
                <TouchableOpacity
                  key={correctOption.id}
                  style={[styles.dragItem]}
                >
                  <Text style={[styles.itemNumber]}>{i + 1}.</Text>
                  <View
                    style={[
                      styles.itemImage,
                      {
                        borderColor: variables.colorPrimary,
                        backgroundColor: "#E8FAF1",
                        borderWidth: 1,
                      },
                      isSubmitted && {
                        borderWidth: 1,
                        marginLeft: variables.scale(30),
                      },
                    ]}
                  >
                    <Image
                      style={{ marginRight: variables.scale(10) }}
                      source={require("@/assets/images/IconTrueGreen.png")}
                    />
                    <Text
                      style={{
                        color: variables.colorPrimary,
                        fontSize: variables.scale(32),
                      }}
                    >
                      {correctOption.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!isSubmitted ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSorted
                ? styles.submitButtonEnabled
                : styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isSorted}
          >
            <Text
              style={
                isSorted
                  ? {
                      color: "white",
                      fontSize: variables.scale(32),
                      fontWeight: "500",
                    }
                  : {
                      color: "#BFBFBF",
                      fontSize: variables.scale(32),
                      fontWeight: "500",
                    }
              }
            >
              {t("submit")}
            </Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              style={[styles.submitButton, styles.submitButtonEnabled]}
              onPress={handleRetry}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: variables.scale(32),
                  fontWeight: "500",
                }}
              >
                {t("retry")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  question: {
    fontSize: variables.scale(36),
    fontWeight: "600",
    marginBottom: variables.scale(32),
    color: "#000",
  },
  image: {
    width: "100%",
    height: 292,
    borderRadius: variables.scale(16),
    marginBottom: variables.scale(32),
  },
  instruction: {
    fontSize: variables.scale(32),
    color: "#6D6D6D",
    marginBottom: variables.scale(32),
  },
  dragItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: variables.scale(5),
    backgroundColor: "white",
    marginBottom: variables.scale(16),
  },
  itemNumber: {
    fontSize: variables.scale(32),
    width: variables.scale(50), // Cố định chiều rộng
    textAlign: "center", // Căn giữa nội dung số
    color: "#000",
  },

  itemText: {
    fontSize: variables.scale(32),
    color: "#000",
  },
  submitButton: {
    marginTop: variables.scale(48),
    paddingVertical: variables.scale(24),
    borderRadius: variables.scale(30),
    alignItems: "center",
    flex: 1,
  },
  submitButtonEnabled: {
    flex: 1,
    alignItems: "center",
    backgroundColor: variables.colorPrimary,
  },
  submitButtonDisabled: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  itemImage: {
    flexDirection: "row",
    flex: 1,
    borderRadius: variables.scale(16),
    alignItems: "center",
    paddingVertical: variables.scale(18),
    paddingLeft: variables.scale(10),
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  answer: {
    fontWeight: "500",
    fontSize: variables.scale(36),
  },
});

export default QuizSort;
