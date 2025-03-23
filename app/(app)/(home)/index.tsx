import { useRouter } from "expo-router";
import { Spinner } from "tamagui";
import useFetchWidgetLMS from "@/hooks/useFetchWidgetLMS";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import variables from "@/theme/commonColor";
import { CourseCardProgress } from "@/components/ui/CourseCardProgress";
import { CourseCard } from "@/components/ui/CourseCard";
import { useState } from "react";
import SetCareerGoal from "@/components/ui/setCareerGoal";
import { useService } from "@/services";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
export default function HomeScreen() {
  //state & props
  const service = useService();
  const router = useRouter();
  const [CareerGoal, setCareerGoal] = useState<boolean>(true);
  const { t } = useTranslation();
  const { data: widgets, isLoading } = useFetchWidgetLMS();

  const onClickDetail = (courseId: string): void => {
    router.push({
      pathname: "/courses/detail/[id]",
      params: { id: courseId },
    });
  };
  // hooks
  const { data: currentCourse, isLoading: isLoadingCurrentCourse } = useQuery({
    queryFn: () => service.userCourses.currentCourse(),
    queryKey: ["currentCourse"],
  });

  // render
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <ScrollView
      style={{
        ...styles.container,
        paddingHorizontal: CareerGoal ? variables.scale(20) : 0,
      }}
    >
      {CareerGoal ? (
        <View>
          <Text style={styles.header}>{t("home.continueLearning")}</Text>
          {isLoadingCurrentCourse ? (
            <Spinner />
          ) : currentCourse ? (
            <CourseCardProgress
              onClickDetail={onClickDetail}
              course={currentCourse}
              title={currentCourse?.title}
              image={currentCourse?.coverImageUrl}
              source={currentCourse?.source}
              amountLearnersContent={+currentCourse?.amountLearnedContent}
              totalContent={+currentCourse?.totalContent}
            />
          ) : (
            <View>
              <Text>{t("home.noCourse")}</Text>
            </View>
          )}
          <View style={styles.goalTracker}>
            <Text style={styles.goalTitle}>{t("home.goalTitle")}</Text>
            <Text style={styles.goalText}>{t("home.goalDescription")}</Text>
            <TouchableOpacity
              onPress={() => setCareerGoal(false)}
              style={styles.goalButton}
            >
              <Text style={styles.goalButtonText}>
                {t("home.setYourCareerGoal")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingBottom: variables.scale(100) }}>
            {widgets?.map((widget, idx) => {
              return (
                <View key={idx}>
                  <View style={styles.wrapperSection}>
                    <Text style={styles.sectionHeader}>{t(widget?.code)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: "/list-courses",
                          params: {
                            codeName: widget?.code as string,
                            isHome: "true",
                          },
                        });
                      }}
                    >
                      {widget?.dataObj?.length > 0 && (
                        <Text style={styles.showAll}>{t("showAll")}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                  >
                    {widget?.dataObj?.length > 0 &&
                      widget?.dataObj?.map((course) => {
                        return (
                          <View
                            key={course?.id}
                            style={{ marginRight: variables.scale(40) }}
                          >
                            <CourseCard
                              isShowCompleted={false}
                              isSmall={false}
                              courseId={course?.id}
                              onClickDetail={onClickDetail}
                              coverImageUrl={course?.coverImageUrl}
                              title={course?.title}
                              image={course?.coverImageUrl}
                              duration={course?.duration}
                              status={course?.status}
                              source={course?.source}
                            />
                          </View>
                        );
                      })}
                  </ScrollView>
                  {widget?.dataObj?.length === 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: variables.scale(20),
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/Empty.png")}
                      />
                      <Text style={styles.text}>{t("home.noData")}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <SetCareerGoal setCareerGoal={setCareerGoal} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
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
  header: {
    fontSize: variables.scale(30),
    fontWeight: "bold",
    marginBottom: variables.scale(32),
    color: variables.colorSecondary,
    marginTop: variables.scale(20),
  },
  goalTracker: {
    backgroundColor: "white",
    padding: variables.scale(32),
    marginVertical: variables.scale(32),
    // Bóng đổ cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: variables.scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: variables.scale(6),

    // Bóng đổ cho Android
    elevation: variables.scale(10),
  },
  goalTitle: {
    fontSize: variables.scale(30),
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    marginBottom: variables.scale(16),
    color: "#333",
  },
  goalText: {
    fontSize: variables.scale(28),
    color: "#666",
    lineHeight: variables.scale(40),
    marginBottom: variables.scale(32),
  },
  goalButton: {
    borderColor: variables.colorPrimary,
    borderWidth: variables.scale(1),
    paddingVertical: variables.scale(16), // Giảm padding dọc
    paddingHorizontal: variables.scale(32), // Giảm padding ngang
    borderRadius: variables.scale(24), // Giảm độ bo góc
    alignSelf: "flex-start",
  },
  goalButtonText: {
    color: variables.colorPrimary,
    fontSize: variables.scale(24), // Giảm kích thước chữ
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: variables.scale(30),
    fontWeight: "bold",
    marginBottom: variables.scale(32),
    color: variables.colorSecondary,
    marginTop: variables.scale(30),
  },
  horizontalScroll: {
    marginLeft: -variables.scale(32),
    paddingLeft: variables.scale(32),
  },
  text: {
    fontSize: variables.scale(24),
    color: "#BFBFBF",
    marginTop: variables.scale(10),
    fontWeight: "300",
  },
  wrapperSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showAll: {
    fontSize: variables.scale(24),
    color: variables.colorPrimary,
  },
});
