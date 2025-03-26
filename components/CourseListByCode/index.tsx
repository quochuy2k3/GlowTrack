import CourseCard from '@/components/CourseCard';
import { useServices } from '@/services';
import { FlatList } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { getToken, Spinner, Stack } from 'tamagui';

interface CoursesListByCodeProps {
  code: string;
  showProgress?: boolean;
}

export default function CoursesListByCode({
  code: codeName,
  showProgress = false,
}: CoursesListByCodeProps) {
  const services = useServices();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['courses', codeName],
    queryFn: ({ pageParam = 1 }) =>
      services.WidgetService.getDataByCode(codeName, { page: pageParam }),
    getNextPageParam: lastPage => {
      return lastPage.meta.nextPage;
    },
  });

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.items)}
      renderItem={({ item }) => (
        <CourseCard variant="list-item" course={item} showProgress={showProgress} />
      )}
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
