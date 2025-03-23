import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Platform,
} from "react-native";
import variables from "@/theme/commonColor";
import utils from "@/utils";
import { t } from "i18next";
import { router } from "expo-router";

interface Course {
  id: string;
  coverImageUrl?: string;
  duration?: number;
  source?: string;
  title?: string;
}

interface CardRequireLearningProps {
  course: Course;
  isSmall?: boolean;
}

export default function CardRequireLearning({
  course,
  isSmall,
}: CardRequireLearningProps) {
  const imageSource: ImageSourcePropType = course?.coverImageUrl
    ? { uri: course.coverImageUrl }
    : require("@/assets/course_default.png");

  const onClickDetail = (courseId: string): void => {
    router.push({
      pathname: "/courses/detail/[id]",
      params: { id: courseId },
    });
  };
  return (
    <TouchableOpacity
      onPress={() => onClickDetail(course?.id)}
      style={styles.card}
    >
      <View
        style={isSmall ? styles.imageContainerSmall : styles.imageContainer}
      >
        <Image
          source={imageSource}
          style={isSmall ? styles.imageSmall : styles.image}
        />
        {course?.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {utils.formatTime(course.duration)}
            </Text>
          </View>
        )}
      </View>
      <View style={isSmall ? styles.contentSmall : styles.content}>
        <Text style={styles.source}>{t(`${course?.type}`)}</Text>
        <Text
          style={isSmall ? styles.titleSmall : styles.title}
          numberOfLines={2}
        >
          {course?.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: variables.scale(24),
    marginBottom: variables.scale(32),
    width: "100%",
  },
  imageContainer: {
    width: "45%",
    height: variables.scale(170),
    marginRight: variables.scale(16),
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: variables.scale(0), height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    ...Platform.select({
      android: {
        elevation: 0.75,
        borderRadius: variables.scale(14),
        backgroundColor: "#fff",
      },
    }),
  },
  imageContainerSmall: {
    width: variables.scale(200),
    height: variables.scale(110),
    marginRight: variables.scale(16),
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0.1,
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: variables.scale(16),
    resizeMode: "cover",
  },
  imageSmall: {
    width: "100%",
    height: "100%",
    borderRadius: variables.scale(10),
    resizeMode: "cover",
  },
  durationBadge: {
    position: "absolute",
    bottom: variables.scale(10),
    right: variables.scale(10),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(10),
    paddingVertical: variables.scale(4),
    borderRadius: variables.scale(8),
  },
  durationText: {
    color: "white",
    fontSize: variables.scale(24),
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: variables.scale(10),
  },
  contentSmall: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: variables.scale(0),
  },
  source: {
    fontSize: variables.scale(22),
    color: "#666",
  },
  title: {
    fontSize: variables.scale(30),
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#333",
    lineHeight: variables.scale(40),
    marginTop: variables.scale(15),
  },
  titleSmall: {
    fontSize: variables.scale(24),
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#333",
    lineHeight: variables.scale(40),
    marginTop: variables.scale(5),
    width: "80%",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: variables.scale(16),
    width: "100%", // Đảm bảo container tiến trình chiếm toàn bộ chiều rộng.
  },
  progressBar: {
    height: variables.scale(8),
    borderRadius: variables.scale(4),
    flex: 1, // Đảm bảo thanh tiến trình chiếm toàn bộ chiều rộng.
    marginRight: variables.scale(8),
  },
  timeLeft: {
    fontSize: variables.scale(24),
    color: "black",
    textAlign: "left",
    width: "50%", // Chiều rộng của thời gian còn lại.
    fontWeight: "400",
  },
  imageWrapper: {
    ...Platform.select({
      android: {
        elevation: 0.75,
        shadowRadius: 8,
        borderRadius: variables.scale(10),
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderRadius: variables.scale(10),
      },
    }),
  },
});
