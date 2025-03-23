import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Meta } from "@/models/meta";
import { CourseCard } from "@/components/ui/CourseCard";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { Spinner } from "tamagui";
import variables from "@/theme/commonColor";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router, useNavigation } from "expo-router";
import { useService } from "@/services";
import { Course } from "@/models";
import useFetchUserPlans from "@/hooks/useFetchUserPlans";
import { UserPlan } from "@/services/userPlans/models/userPlan.model";

const ListCourses = () => {
  // state & props
  const service = useService();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [listCourse, setListCourse] = useState<Course[]>([]);
  const { codeName, isHome } = useLocalSearchParams();
  const [meta, setMeta] = useState<Meta>();
  const { data: userPlans } = useFetchUserPlans();
  // life cycle
  useEffect(() => {
    navigation.setOptions({
      title: codeName ? t(codeName as any) : "Courses",
    });
  }, []);

  useEffect(() => {
    if (codeName && isHome === "true") {
      handleGetCourseWidget(1, codeName as string);
    } else {
      handleGetCourseMyLearning();
    }
  }, [codeName, isHome]);

  // handle
  const handleGetCourseWidget = async (
    page = 1,
    codeName: string,
    append = false
  ) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      const response =
        isHome === "true"
          ? await service.widgets.listWidgetsHomeByCode(codeName as string)
          : await service.widgets.listWidgetsHomeByCode(codeName as string);
      if (response?.items) {
        if (append) {
          setListCourse((prevCourses) => [...prevCourses, ...response?.items]);
        } else {
          setListCourse(response?.items);
        }
        setMeta(response?.meta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleGetCourseMyLearning = async () => {
    const courses = userPlans?.modules?.find(
      (module: UserPlan) => module?.name?.trim() === codeName?.trim()
    );
    if (courses) {
      setListCourse(courses?.dataObj);
    }
  };

  const handleLoadMore = () => {
    if (
      !isLoadingMore &&
      meta?.current_page &&
      meta?.total_pages &&
      meta.current_page < meta.total_pages
    ) {
      handleGetCourseWidget(meta.current_page + 1, codeName as string, true);
    }
  };

  const onClickDetail = (courseId: string): void => {
    router.push({
      pathname: "/courses/detail/[id]",
      params: { id: courseId },
    });
  };
  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.item}>
      <CourseCard
        isShowCompleted={false}
        isSmall={true}
        courseId={item?.id}
        onClickDetail={onClickDetail}
        key={index}
        coverImageUrl={item?.coverImageUrl}
        title={item?.title}
        image={item?.coverImageUrl}
        duration={item?.duration}
        status={item?.status}
        source={item?.source}
      />
    </View>
  );

  // render
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={listCourse}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item?.id;
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <Spinner /> : null}
        style={styles.content}
      />
      {isLoading && <Spinner />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: variables.scale(10),
  },
  content: {
    flex: 1,
    padding: variables.scale(10),
  },
  item: {
    marginBottom: 10,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height * 0.5,
    marginTop: variables.scale(100),
  },
  text: {
    fontSize: variables.scale(24),
    color: "#BFBFBF",
    marginTop: variables.scale(20),
  },
});

export default ListCourses;
