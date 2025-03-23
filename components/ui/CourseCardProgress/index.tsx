import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import variables from "@/theme/commonColor";
import { t } from "i18next";
import { CurrentCourse } from "@/models/currentCourse";
interface CourseCardProgressProps {
  title: string;
  image?: string | null;
  duration?: string;
  status?: "IN PROGRESS" | "READY";
  badge?: "BEST SELLER" | "NEW";
  source?: "course" | "program";
  course: CurrentCourse;
  onClickDetail?: (id: number) => void;
  amountLearnersContent?: number;
  totalContent?: number;
}

export const CourseCardProgress: React.FC<CourseCardProgressProps> = ({
  title,
  image,
  duration,
  status,
  badge,
  source = "course",
  course,
  onClickDetail,
  amountLearnersContent,
  totalContent,
}) => {
  const imageSource: ImageSourcePropType = image
    ? { uri: image }
    : require("../../../assets/images/test.png");

  const onPress = () => {
    if (onClickDetail && course?.id) {
      onClickDetail(course.id);
    }
  };

  const progress =
    amountLearnersContent && totalContent
      ? (amountLearnersContent / totalContent) * 100
      : 0;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
        {status && (
          <View
            style={[
              styles.statusBadge,
              status === "IN PROGRESS" ? styles.inProgress : styles.ready,
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
        {badge && (
          <View
            style={[
              styles.badge,
              badge === "BEST SELLER" ? styles.bestSeller : styles.new,
            ]}
          >
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.containerType}>
          <Text style={[styles.source, { marginRight: variables.scale(16) }]}>
            {source === "course" ? t("home.course") : t("home.program")}
          </Text>
          <View style={styles.divide} />
          <Text style={styles.source}>{"AI Deeplearning"}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
        {progress !== undefined && (
          <View style={styles.containerOverall}>
            <Text style={styles.textOverall}>{t("home.overallProgress")}</Text>
            <Text style={styles.textProgress}>{Math.round(progress)}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: variables.scale(32),
    shadowColor: "#000",
    shadowOffset: { width: variables.scale(0), height: variables.scale(8) },
    shadowOpacity: 0.25,
    padding: variables.scale(30),
    paddingBottom: variables.scale(10),
    shadowRadius: variables.scale(12),
    elevation: variables.scale(12),
  },
  imageContainer: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: variables.scale(8) },
    shadowOpacity: 0.2,
    shadowRadius: variables.scale(12),
    elevation: variables.scale(10),
  },
  image: {
    width: "100%",
    height: variables.scale(350),
    borderTopLeftRadius: variables.scale(24),
    borderTopRightRadius: variables.scale(24),
    borderBottomRightRadius: variables.scale(24),
    borderBottomLeftRadius: variables.scale(24),
    resizeMode: "cover",
  },
  content: {
    padding: variables.scale(24),
    paddingLeft: 0,
    paddingBottom: variables.scale(10),
  },
  source: {
    fontSize: variables.scale(24),
    color: "#666",
    marginBottom: variables.scale(8),
  },
  textOverall: {
    fontSize: variables.scale(24),
    color: "#8C8C8C",
    fontWeight: "300",
    marginBottom: variables.scale(8),
  },
  textProgress: {
    fontSize: variables.scale(24),
    color: "black",
    marginBottom: variables.scale(8),
  },
  title: {
    fontSize: variables.scale(32),
    fontWeight: "600",
    color: variables.colorPrimary,
    marginBottom: variables.scale(16),
    marginTop: variables.scale(16),
  },
  durationBadge: {
    position: "absolute",
    bottom: variables.scale(16),
    right: variables.scale(16),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(8),
  },
  durationText: {
    color: "white",
    fontSize: variables.scale(24),
  },
  statusBadge: {
    position: "absolute",
    top: variables.scale(16),
    left: variables.scale(16),
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(8),
  },
  inProgress: {
    backgroundColor: "#00BFA5",
  },
  ready: {
    backgroundColor: "#651FFF",
  },
  statusText: {
    color: "white",
    fontSize: variables.scale(24),
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: variables.scale(16),
    left: variables.scale(16),
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(8),
  },
  bestSeller: {
    backgroundColor: "#FFB300",
  },
  new: {
    backgroundColor: "#00BFA5",
  },
  badgeText: {
    color: "white",
    fontSize: variables.scale(24),
    fontWeight: "500",
  },
  progressContainer: {
    height: variables.scale(16),
    backgroundColor: "#E0E0E0",
    borderRadius: variables.scale(10),
    marginTop: variables.scale(16),
  },
  progressBar: {
    height: "100%",
    backgroundColor: variables.colorPrimary,
    borderRadius: variables.scale(10),
  },
  containerOverall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: variables.scale(15),
  },
  containerType: {
    flexDirection: "row",
    alignItems: "center",
  },
  divide: {
    height: variables.scale(35),
    width: variables.scale(1),
    backgroundColor: "#8C8C8C",
    marginRight: variables.scale(16),
  },
});
