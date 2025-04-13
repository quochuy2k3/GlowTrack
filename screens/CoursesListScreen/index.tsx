import CourseCard from '@/components/CourseCard';
import { useServices } from '@/services';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { Spinner, Stack } from 'tamagui';
import { getToken } from 'tamagui';
import Empty from '@/components/Empty';

export default function CoursesListScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { screenTitle, ...searchParams } = useLocalSearchParams<{
    screenTitle?: string;
    title?: string;
    courseCategories?: string;
    skills?: string;
  }>();
  const services = useServices();

  useEffect(() => {
    navigation.setOptions({
      title: screenTitle ? t(screenTitle as any) : t('courses'),
    });
  }, [screenTitle, navigation, t]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['courses', new URLSearchParams(searchParams).toString()],
    queryFn: ({ pageParam = 1 }) =>
      services.WidgetService.findCourses({
        ...searchParams,
        page: pageParam,
      }),
    getNextPageParam: lastPage => {
      return lastPage.meta.nextPage;
    },
  });

  const courses = data?.pages.flatMap(page => page.items) || [];

  return (
    <FlatList
      data={courses}
      renderItem={({ item }) => (
        <CourseCard variant="list-item" course={item} showProgress={true} />
      )}
      ListEmptyComponent={() => !isFetching && <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage || isFetching ? (
          <Stack justify="center" items="center" p="$4">
            <Spinner color="$accent1" />
          </Stack>
        ) : null
      }
      ItemSeparatorComponent={() => <Stack pt="$3" />}
      keyExtractor={item => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      style={{
        padding: getToken('$3', 'space'),
      }}
    />
  );
}
