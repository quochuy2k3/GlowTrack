import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'tamagui';
import Course from '@/components/ui/LearningCourse/Course';
import variables from '@/theme/commonColor';
import { useServices } from '@/services';
import { useInfiniteQuery } from 'react-query';
import { Course as CourseType } from '@/models';
import CustomSpinner from '@/components/ui/Spinner/Spinner';

interface AddCoursesScreenProps {
  moduleId: string;
  dataObj: string;
}

const AddCoursesScreen: React.FC<AddCoursesScreenProps> = ({ moduleId, dataObj }) => {
  // state & props
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const service = useServices();
  const [isLoadingAddCourse, setIsLoadingAddCourse] = useState<boolean>(false);

  // lifecycle
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('addCourse'),
      headerRight: () => (
        <TouchableOpacity onPress={() => handleAddCourse(moduleId as string)}>
          <Text style={styles.headerButtonText}>{t('add')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, moduleId, selectedCourses]);

  // query
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lmsCourses'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await service.courses.listLmsCourses(pageParam);
      return response;
    },
    getNextPageParam: lastPage => {
      if (lastPage.meta.current_page < lastPage.meta.total_pages) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
  });

  //handle
  const courses = data?.pages.flatMap(page => page.items) || [];
  const handleAddCourse = async (idModule: string) => {
    try {
      setIsLoadingAddCourse(true);
      if (selectedCourses.length > 0) {
        const resData = await service.userPlans.addCoursesLearning(selectedCourses, idModule);
        if (resData && Object.keys(resData).length === 0 && resData.constructor === Object) {
          router.back();
        }
      } else {
        Alert.alert(
          t('notification'),
          t('please_choose_courses'),
          [{ text: t('ok'), onPress: () => {} }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingAddCourse(false);
    }
  };

  const handleCheckboxChange = (courseId: string, isChecked: boolean) => {
    setSelectedCourses(prevCourses => {
      const newCourses = isChecked
        ? [...prevCourses, courseId]
        : prevCourses.filter(id => id !== courseId);
      return newCourses;
    });
  };

  const loadMoreCourses = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  // render
  const renderItem = ({ item, index }: { item: CourseType; index: number }) => {
    const isDisabled = JSON.parse(dataObj as string).some(
      (course: CourseType) => course.id === item.id
    );

    const isSelected = selectedCourses.includes(item.id);

    return (
      <Course
        isLastItem={index === (courses?.length ?? 0) - 1}
        course={item}
        onCheckboxChange={handleCheckboxChange}
        isCheckbox={true}
        disabled={isDisabled}
      />
    );
  };

  const ListEndLoader = () => {
    if (isFetchingNextPage) {
      return <Spinner />;
    }
    return null;
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoadingAddCourse && <CustomSpinner />}
      <FlatList
        data={courses}
        keyExtractor={item => item?.id?.toString() ?? ''}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        onEndReached={loadMoreCourses}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListEndLoader}
        extraData={selectedCourses}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerButtonText: {
    color: variables.colorPrimary,
    fontSize: variables.scale(28),
  },
});

export default AddCoursesScreen;
