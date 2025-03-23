import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import variables from "@/theme/commonColor";
import utils from "@/utils";
import { t } from "i18next";
interface CourseCardProps {
  isShowCompleted: boolean;
  isSmall: boolean;
  title: string;
  image?: string;
  duration?: number;
  status?: "inProgress" | "completed" | "ready";
  badge?: "BEST SELLER" | "NEW";
  source?: "course" | "program";
  progress?: number;
  coverImageUrl?: string | null;
  onClickDetail: (courseId: string) => void;
  courseId: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  image,
  duration,
  status,
  badge,
  source = "Course",
  progress,
  coverImageUrl,
  onClickDetail,
  courseId,
  isSmall,
  isShowCompleted,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onClickDetail(courseId)}
      style={isSmall ? styles?.cardSmall : styles.card}
      key={courseId}
    >
      <View style={styles.imageContainer}>
        {coverImageUrl !== null ? (
          <Image
            style={[
              isSmall ? styles?.imageSmall : styles.image,
              isShowCompleted &&
                status === "completed" &&
                styles.imageCompleted,
            ]}
            source={{
              uri: coverImageUrl,
            }}
          />
        ) : (
          <Image
            style={[
              isSmall ? styles?.imageSmall : styles.image,
              isShowCompleted &&
                status === "completed" &&
                styles.imageCompleted,
            ]}
            source={require("../../../assets/images/tanca_elearning_logo.e92fad6a61c7388e4df6.jpg")}
            resizeMode="cover"
          />
        )}

        {duration && duration > 0 ? (
          <View style={styles.durationBadge}>
            <Text
              style={isSmall ? styles.durationTextSmall : styles.durationText}
            >
              {utils.formatTime(duration)}
            </Text>
          </View>
        ) : null}

        {status ? (
          <View
            style={[
              styles.statusBadge,
              status === "inProgress"
                ? styles.inProgress
                : status === "completed"
                ? styles.completed
                : styles.ready,
            ]}
          >
            <Text
              style={[
                isSmall ? styles.statusTextSmall : styles.statusText,
                status === "completed" && styles.activeText,
              ]}
            >
              {status === "completed"
                ? `${t("home.completed")}`
                : status === "inProgress"
                ? `${t("home.inProgress")}`
                : `${t("home.ready")}`}
            </Text>
          </View>
        ) : null}

        {badge ? (
          <View
            style={[
              styles.badge,
              badge === "BEST SELLER" ? styles.bestSeller : styles.new,
            ]}
          >
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        {isShowCompleted && status === "completed" && (
          <View style={styles.completedOverlay}>
            <Image
              source={require("../../../assets/images/IconCheckedCompleted.png")}
            />
          </View>
        )}
      </View>

      <View style={isSmall ? styles.contentSmall : styles.content}>
        <Text style={styles.source}>
          {t(source === "program" ? "home.program" : "home.course")}
        </Text>
        <Text
          style={isSmall ? styles.titleSmall : styles.title}
          numberOfLines={2}
        >
          {title}
        </Text>
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: variables.scale(400),
    borderRadius: variables.scale(10),
    marginBottom: variables.scale(32),
    shadowColor: "#000",
    shadowOffset: { width: variables.scale(0), height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
  },
  cardSmall: {
    width: "100%",
    borderRadius: variables.scale(10),
    marginBottom: variables.scale(32),
    shadowColor: "#000",
    shadowOffset: { width: variables.scale(0), height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    flexDirection: "row",
    // backgroundColor: 'red',
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: variables.scale(400),
    height: variables.scale(230),
    borderRadius: variables.scale(10),
    resizeMode: "cover",
  },
  imageSmall: {
    width: variables.scale(200),
    height: variables.scale(110),
    borderRadius: variables.scale(10),
    resizeMode: "cover",
  },
  content: {
    padding: variables.scale(24),
    paddingLeft: 0,
  },
  contentSmall: {
    paddingLeft: variables.scale(15),
  },
  source: {
    fontSize: variables.scale(22),
    color: "#666",
    fontWeight: "300",
  },
  title: {
    fontSize: variables.scale(28),
    fontWeight: "bold",
    color: "#333",
    marginTop: variables.scale(10),
    marginBottom: variables.scale(16),
  },
  titleSmall: {
    fontSize: variables.scale(24),
    fontWeight: "bold",
    color: "#333",
    marginTop: variables.scale(5),
    marginBottom: variables.scale(16),
    lineHeight: variables.scale(35),
    paddingRight: variables.scale(300),
    // backgroundColor: 'blue',
  },
  durationBadgeSmall: {
    position: "absolute",
    bottom: variables.scale(5),
    right: variables.scale(5),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(8),
    paddingVertical: variables.scale(4),
    borderRadius: variables.scale(8),
    zIndex: 2,
  },
  durationBadge: {
    position: "absolute",
    bottom: variables.scale(10),
    right: variables.scale(10),
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(8),
    zIndex: 2,
  },
  durationText: {
    color: "white",
    fontWeight: "600",
    fontSize: variables.scale(22),
  },
  durationTextSmall: {
    color: "white",
    fontWeight: "600",
    fontSize: variables.scale(18),
  },
  statusBadgeSmall: {
    position: "absolute",
    top: variables.scale(5),
    left: variables.scale(5),
    paddingHorizontal: variables.scale(8),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(12),
  },
  statusBadge: {
    position: "absolute",
    top: variables.scale(10),
    left: variables.scale(10),
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(16),
  },
  inProgress: {
    backgroundColor: "#33a7ec",
  },
  ready: {
    backgroundColor: variables.colorPrimary,
  },
  completed: {
    backgroundColor: "#cccccc",
  },
  statusText: {
    color: "white",
    fontSize: variables.scale(24),
    fontWeight: "600",
  },
  statusTextSmall: {
    color: "white",
    fontSize: variables.scale(18),
    fontWeight: "600",
    lineHeight: variables.scale(20),
  },
  badge: {
    position: "absolute",
    top: variables.scale(10),
    left: variables.scale(10),
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
    height: variables.scale(8),
    backgroundColor: "#E0E0E0",
    borderRadius: variables.scale(4),
    marginTop: variables.scale(16),
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00BFA5",
    borderRadius: variables.scale(4),
  },
  activeText: {
    color: "white",
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
    backgroundColor: "#303E6580",
    borderRadius: variables.scale(10),
  },
  completedText: {
    color: "white",
    fontSize: variables.scale(30),
    fontWeight: "bold",
  },
  imageWrapper: {
    ...Platform.select({
      android: {
        elevation: 0.75,
        shadowRadius: 8,
        borderRadius: variables.scale(10),
        backgroundColor: "#fff",
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
