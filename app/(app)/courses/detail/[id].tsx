import { useService } from "@/services";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useQuery } from "react-query";
import { H1, Paragraph, Spinner, Text, View, YStack } from "tamagui";
import { t } from "i18next";

import commonColor from "@/theme/commonColor";
import variables from "@/theme/commonColor";
import CourseInteraction from "./components/CourseInteraction";
import Overview from "./components/Overview";
import IconDiscovery from "@/assets/svgs/discoveryIcon";
export default function CoursesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<"/(app)/courses/detail/[id]">();
  const service = useService();
  const [loading, setLoading] = useState(false);

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["userCourses", "detail", id],
    queryFn: () => service.userCourses.getDetailCourse(id),
  });

  return (
    <YStack flex={1}>
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={styles.container}>
          <CourseInteraction courseDetail={courseDetail} loading={loading} />
          <FlatList
            data={[courseDetail]}
            renderItem={({ item }) =>
              loading ? <Spinner /> : <Overview courseDetail={item} />
            }
            contentContainerStyle={styles.wrapperContent}
          />
          <View style={styles.discoveryContainer}>
            <TouchableOpacity
              style={styles.discoveryButton}
              onPress={() =>
                router.push({
                  pathname: "../learn/[id]",
                  params: { id },
                })
              }
            >
              <IconDiscovery />
              <Text style={styles.discoveryText}>
                {courseDetail?.status === "completed"
                  ? t("resume_course")
                  : t("discovery")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </YStack>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    flexDirection: "column",
  },

  wrapperContent: {
    flexDirection: "column",
  },
  discoveryContainer: {
    borderTopWidth: 1,
    borderColor: "#D9D9D9",
    paddingHorizontal: variables.scale(40),
    paddingTop: variables.scale(20),
    paddingBottom: variables.scale(30),
  },
  discoveryButton: {
    backgroundColor: "#1ECC78",
    paddingVertical: variables.scale(20),
    borderRadius: variables.scale(30),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  discoveryText: {
    color: "white",
    fontWeight: "600",
    fontSize: variables.scale(36),
    lineHeight: variables.scale(48),
    fontFamily: commonColor.fontFamily,
    marginLeft: variables.scale(20),
  },
});
