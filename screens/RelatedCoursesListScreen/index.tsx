import CourseCard from '@/components/CourseCard';
import Empty from '@/components/Empty';
import { useServices } from '@/services';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useQuery } from 'react-query';
import { Stack } from 'tamagui';
import { getToken } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { HomeWidgetDataDTO } from '@/models';

export default function RelatedCoursesListScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const services = useServices();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['relatedCourses', courseId],
    queryFn: () => services.WidgetService.getRelatedCourse(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    navigation.setOptions({
      title: t('related_courses'),
    });
  }, [navigation, t]);

  const _onPress = (course: HomeWidgetDataDTO) => () => {
    router.replace({
      pathname: '/courses/detail/[id]',
      params: { id: course.id, title: course.title },
    });
  };

  return (
    <FlatList
      data={courses}
      renderItem={({ item }) => (
        <CourseCard variant="list-item" course={item} onPress={_onPress(item)} />
      )}
      ListEmptyComponent={() => !isLoading && <Empty />}
      ItemSeparatorComponent={() => <Stack pt="$3" />}
      keyExtractor={item => item.id}
      style={{
        padding: getToken('$3', 'space'),
      }}
    />
  );
}
