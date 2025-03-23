import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import moment from "moment";
import variables from "@/theme/commonColor";
import { t } from "i18next";
import { Text } from "tamagui";
import useFetchWidgetLMS from "@/hooks/useFetchWidgetLMS";
import Course from "@/components/ui/LearningCourse/Course";
import utils from "@/utils";
const Overview = ({ courseDetail }: any) => {
  const { data: widgets } = useFetchWidgetLMS();
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.section}>{t("course_detail")}</Text>
          <View style={styles.sectionSecond}>
            {courseDetail?.duration !== undefined && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.textSectionSecond}>
                  {utils.formatTime(courseDetail?.duration)}
                </Text>
                <Text style={styles.dot}>•</Text>
              </View>
            )}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.textSectionSecond}>Beginner</Text>
              <Text style={styles.dot}>•</Text>
            </View> */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.textSectionSecond}>{t("released")}: </Text>
              <Text style={styles.textSectionSecond}>
                {moment(courseDetail?.createdAt).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.description}>
              {courseDetail?.description || ""}
            </Text>
          </View>
        </View>
        {courseDetail?.targetLearnersObj?.length > 0 && (
          <View style={styles.learning}>
            <Text style={styles.section}>{t("learning_objectives")}</Text>
            <View style={{ marginVertical: variables.scale(10) }}>
              {courseDetail?.targetLearnersObj?.map((item: any, index: any) => {
                return (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItemText}>{item?.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        {courseDetail?.skillsObj?.length > 0 && (
          <View>
            <Text style={styles.section}>{t("skills_covered")}</Text>
            <View style={styles.skillsContainer}>
              {courseDetail?.skillsObj?.map((skill: any, idx: any) => {
                return (
                  <TouchableOpacity key={idx} style={styles.button}>
                    <Text style={styles.textButton}>{skill?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {widgets[0]?.dataObj?.length > 0 && (
          <View>
            <Text style={styles.section}>{t("related_courses")}</Text>
            <FlatList
              data={widgets[0]?.dataObj}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Course
                  isLastItem={index === widgets[0]?.dataObj?.length - 1}
                  course={item}
                  isCheckbox={false}
                  onCheckboxChange={() => {}}
                  disabled={false}
                />
              )}
              contentContainerStyle={styles.containerFlatlist}
            />
          </View>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: variables.scale(20),
    paddingTop: variables.scale(20),
    backgroundColor: "white",
  },
  section: {
    fontWeight: "bold",
    fontSize: variables.scale(30),
  },
  sectionSecond: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: variables.scale(16),
  },
  textSectionSecond: {
    fontSize: variables.scale(24),
    color: "#8C8C8C",
  },
  dot: {
    fontSize: variables.scale(20),
    color: "#8C8C8C",
    marginHorizontal: variables.scale(10),
  },
  description: {
    fontSize: variables.scale(24),
    color: "#000000",
    textAlign: "justify",
  },
  learning: {
    marginVertical: variables.scale(38),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: variables.scale(5),
  },
  bullet: {
    fontSize: variables.scale(24),
    marginRight: variables.scale(10),
  },
  listItemText: {
    fontSize: variables.scale(24),
    color: "#000000",
  },
  containerFlatlist: {
    marginTop: variables.scale(30),
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: variables.scale(20),
  },
  button: {
    borderRadius: variables.scale(50),
    backgroundColor: "white",
    paddingVertical: variables.scale(16),
    paddingHorizontal: variables.scale(32),
    borderRadius: variables.scale(40),
    marginRight: variables.scale(16),
    marginBottom: variables.scale(16),
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  textButton: {
    color: "black",
    fontSize: variables.scale(24),
  },
});
export default Overview;
