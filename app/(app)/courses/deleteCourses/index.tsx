import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import Course from "@/components/ui/LearningCourse/Course";
import { useService } from "@/services";
import { Course as CourseType } from "@/models";
import CustomSpinner from "@/components/ui/Spinner/Spinner";
import utils from "@/utils";
const DeleteCoursesLearning = () => {
  const service = useService();
  const [lmsCourse, setLmsCourse] = useState<any[]>([]);
  const { moduleId, dataObj } = useLocalSearchParams();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const updateTopbar = () => {
    navigation.setOptions({
      headerTitle: t("deleteCourse"),
      headerRight: () => (
        <TouchableOpacity onPress={() => showConfirmDelete(moduleId as string)}>
          <Text style={{ color: "#007AFF", fontSize: 17 }}>{t("delete")}</Text>
        </TouchableOpacity>
      ),
    });
  };

  useEffect(() => {
    updateTopbar();
  }, [selectedCourses, moduleId, selectedCourses]);

  const handleDeleteCourse = async (idModule: string) => {
    try {
      setIsLoadingDelete(true);
      if (selectedCourses.length > 0) {
        const response = await service.userPlans.deleteCoursesLearning(
          selectedCourses,
          idModule
        );
        if (
          response &&
          Object.keys(response).length === 0 &&
          response.constructor === Object
        ) {
          router.back();
        }
      } else {
        Alert.alert(t("notification"), t("please_choose_courses"));
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    } finally {
      setIsLoadingDelete(false);
    }
  };
  const showConfirmDelete = (idModule: string) => {
    if (selectedCourses?.length > 0) {
      utils.showConfirmDelete(
        t("announcement"),
        t("confirm_delete_courses"),
        {
          text: t("agree").toUpperCase(),
          onPress: () => handleDeleteCourse(idModule),
        },
        { text: t("cancel").toUpperCase() }
      );
    } else {
      Alert.alert(t("notification"), t("please_choose_courses"));
    }
  };

  const handleCheckboxChange = (courseId: string, isChecked: boolean) => {
    setSelectedCourses((prevCourses) => {
      if (isChecked) {
        if (!prevCourses.includes(courseId)) {
          return [...prevCourses, courseId];
        }
      } else {
        return prevCourses.filter((id) => id !== courseId);
      }
    });
  };

  const renderItem = ({ item, index }: { item: CourseType; index: number }) => {
    return (
      <Course
        isLastItem={index === lmsCourse?.length - 1}
        course={item}
        onCheckboxChange={handleCheckboxChange}
        isCheckbox={true}
      />
    );
  };

  return (
    <View>
      {isLoadingDelete && <CustomSpinner />}
      <FlatList
        data={JSON.parse(dataObj)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default DeleteCoursesLearning;
