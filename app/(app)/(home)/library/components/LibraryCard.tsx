import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import variables from "@/theme/commonColor";
import { Bar } from "react-native-progress";
import { t } from "i18next";
import utils from "@/utils";
import { Course } from "@/models";
import { router } from "expo-router";

interface LibraryCardProps {
  course: Course;
  isSmall: boolean;
  isShowStatus: boolean;
}

export default function LibraryCard({
  course,
  isSmall,
  isShowStatus,
}: LibraryCardProps) {
  const onClickDetail = (courseId: string): void => {
    router.push({
      pathname: "/courses/detail/[id]",
      params: { id: courseId },
    });
  };
  const progress = Math.max(
    0,
    Math.min(
      100,
      (course?.totalLearnedContents / course?.totalContents) * 100 || 0
    )
  );

  return (
    <TouchableOpacity
      onPress={() => onClickDetail(course?.id)}
      style={styles.card}
    >
      <View
        style={isSmall ? styles.imageContainerSmall : styles.imageContainer}
      >
        {course?.coverImageUrl !== null ? (
          <Image
            style={styles.image}
            source={{
              uri: course?.coverImageUrl,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={[
              isSmall ? styles.imageSmall : styles.image,
              course?.status === "completed" && styles.imageCompleted,
            ]}
            source={require("@/assets/images/tanca_elearning_logo.e92fad6a61c7388e4df6.jpg")}
            resizeMode="cover"
          />
        )}

        {isShowStatus && course?.status ? (
          <View
            style={[
              styles.statusBadge,
              course?.status === "inProgress"
                ? styles.inProgress
                : course?.status === "completed"
                ? styles.completed
                : styles.ready,
            ]}
          >
            <Text
              style={[
                isSmall ? styles.statusTextSmall : styles.statusText,
                course?.status === "completed" && styles.activeText,
              ]}
            >
              {t(`home.${course?.status}`, { defaultValue: "" })}
            </Text>
          </View>
        ) : null}
        {isShowStatus && course?.status === "completed" ? (
          <View style={styles.completedOverlay}>
            <Image
              source={require("@/assets/images/IconCheckedCompleted.png")}
            />
          </View>
        ) : null}
        {course?.duration ? (
          <View
            style={isSmall ? styles.durationBadgeSmall : styles.durationBadge}
          >
            <Text
              style={isSmall ? styles.durationTextSmall : styles.durationText}
            >
              {utils.formatTime(course?.duration)}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={isSmall ? styles.contentSmall : styles.content}>
        <Text style={styles.source}>
          {t(`home.${course?.course?.source}`, { defaultValue: "" })}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: variables.scale(5),
          }}
        >
          {progress > 0 && (
            <>
              <Bar
                progress={progress / 100}
                borderWidth={0}
                width={null}
                height={variables.scale(8)}
                color={variables.colorPrimary}
                unfilledColor="#e6e6e6"
                borderRadius={variables.scale(4)}
                style={{ flex: 1 }}
              />
              <Text style={styles.timeLeft}>{Math.round(progress)}%</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: variables.scale(24),
    marginBottom: variables.scale(32),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: variables.scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
  },
  imageContainer: {
    width: "45%",
    height: variables.scale(170),
    marginRight: variables.scale(16),
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: variables.scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(12),
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
    ...Platform.select({
      android: {
        elevation: 0.75,
        borderRadius: variables.scale(14),
        backgroundColor: "#fff",
      },
    }),
  },
  imageSmall: {
    width: "100%",
    height: "100%",
    borderRadius: variables.scale(10),
    resizeMode: "cover",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: variables.scale(10),
    resizeMode: "cover",
  },
  durationBadge: {
    position: "absolute",
    bottom: variables.scale(8),
    right: variables.scale(8),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(10),
    paddingVertical: variables.scale(4),
    borderRadius: variables.scale(8),
  },
  durationBadgeSmall: {
    position: "absolute",
    bottom: variables.scale(5),
    right: variables.scale(5),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(10),
    paddingVertical: variables.scale(4),
    borderRadius: variables.scale(8),
  },
  durationText: {
    color: "white",
    fontSize: variables.scale(24),
  },
  durationTextSmall: {
    color: "white",
    fontSize: variables.scale(20),
  },
  content: {
    flex: 1,
    width: "50%",
    paddingLeft: variables.scale(10),
  },
  source: {
    fontSize: variables.scale(22),
    color: "#666",
  },
  title: {
    fontSize: variables.scale(24),
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#333",
    marginTop: variables.scale(5),
    width: "80%",
    lineHeight: variables.scale(35),
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: variables.scale(16),
    width: "100%",
  },
  progressBar: {
    height: variables.scale(8),
    borderRadius: variables.scale(4),
    flex: 1,
    marginRight: variables.scale(8),
  },
  timeLeft: {
    fontSize: variables.scale(22),
    color: "black",
    textAlign: "left",
    width: "50%",
    fontWeight: "400",
    marginLeft: variables.scale(10),
  },
  imageCompleted: {
    opacity: 0.5,
  },
  completedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: variables.scale(10),
  },
  statusBadge: {
    position: "absolute",
    top: variables.scale(10),
    left: variables.scale(10),
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(14),
  },
  inProgress: {
    backgroundColor: "#39FD9E",
  },
  ready: {
    backgroundColor: "#dadada",
  },
  completed: {
    backgroundColor: "#D1E3FF",
  },
  statusText: {
    color: "black",
    fontSize: variables.scale(24),
    fontWeight: "600",
  },
  statusTextSmall: {
    color: "black",
    fontSize: variables.scale(20),
    fontWeight: "600",
  },
  activeText: {
    color: "#1975FF",
  },
  contentSmall: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: variables.scale(0),
  },
});
