import CourseThumbnail from '@/components/CourseThumbnail';
import StarRating from '@/components/StarRating';
import dayjs from '@/libs/dayjs';
import { useServices } from '@/services';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Button, ScrollView, Text, View, XStack } from 'tamagui';
import { Spinner, YStack } from 'tamagui';
import { TagView } from './components/styled';
import CourseCard from '@/components/CourseCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CirclePlay } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const maxRelatedCourses = 4;

type CourseDetailScreenProps = {
  id: string;
};

export default function CourseDetailScreen({ id }: CourseDetailScreenProps) {
  const { t } = useTranslation();
  const services = useServices();
  const router = useRouter();

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ['userCourses', 'detail', id],
    queryFn: () => services.UserCourseService.getCourse(id),
  });

  const { data: relatedCourses, isLoading: isRelatedCoursesLoading } = useQuery({
    queryKey: ['userCourses', 'related', id],
    queryFn: () => services.WidgetService.getRelatedCourse(id),
  });

  const _onStartLearning = () => {
    router.push({
      pathname: '/courses/learn/[id]',
      params: { id },
    });
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View flex={1} position="relative">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView flex={1} bg="$white" stickyHeaderIndices={[1]}>
          <CourseThumbnail url={courseDetail?.coverImageUrl} height="$15" />
          <View
            bg="$white"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            elevationAndroid={5}
          >
            <YStack gap="$2" p="$3">
              <Text fontSize="$5" fontWeight="bold">
                {courseDetail?.title}
              </Text>
              <StarRating
                rating={courseDetail?.avgRating}
                totalRatings={courseDetail?.totalRatings}
              />
            </YStack>
          </View>

          <YStack gap="$3" p="$3">
            <Text fontWeight="bold">{t('course_detail')}</Text>

            <Text color="$color04">
              {dayjs.duration(courseDetail?.duration ?? 0, 'seconds').humanize()}{' '}
              <Text color="$color04">•</Text>{' '}
              <Text color="$color04">
                {t('released')}: {dayjs(courseDetail?.createdAt).format('L')}
              </Text>
            </Text>

            <Text>{courseDetail?.description}</Text>

            {courseDetail?.targetLearnersObj && courseDetail?.targetLearnersObj?.length > 0 && (
              <>
                <Text fontWeight="bold">{t('learning_objectives')}</Text>
                <XStack>
                  {courseDetail?.targetLearnersObj?.map((item: any) => (
                    <TagView key={item?.id}>
                      <Text>{item?.name}</Text>
                    </TagView>
                  ))}
                </XStack>
              </>
            )}

            {courseDetail?.skillsObj && courseDetail?.skillsObj?.length > 0 && (
              <>
                <Text fontWeight="bold">{t('skills_covered')}</Text>
                <XStack flexWrap="wrap" gap="$2">
                  {courseDetail?.skillsObj?.map((item: any) => (
                    <TagView key={item?.id}>
                      <Text>{item?.name}</Text>
                    </TagView>
                  ))}
                </XStack>
              </>
            )}

            {!isRelatedCoursesLoading && relatedCourses && relatedCourses?.length > 0 && (
              <>
                <XStack justify="space-between" items="center">
                  <Text fontWeight="bold">{t('related_courses')}</Text>
                  <TouchableOpacity>
                    <Text color="$accent1">{t('showAll')}</Text>
                  </TouchableOpacity>
                </XStack>
                {relatedCourses.slice(0, maxRelatedCourses).map((item: any) => (
                  <CourseCard variant="related-list-item" key={item?.id} course={item} />
                ))}
              </>
            )}
          </YStack>
          <View pb="$11" />
        </ScrollView>
      </SafeAreaView>
      <View position="absolute" b={0} l={0} r={0} bg="$white" px="$3" pt="$3">
        <SafeAreaView edges={['bottom']}>
          <Button onPress={_onStartLearning} theme="accent">
            <CirclePlay />
            <Text>
              {(() => {
                if (courseDetail?.status === 'inProgress') {
                  return t('resume_course');
                }

                if (courseDetail?.status === 'completed') {
                  return t('resume_course');
                }

                return t('discovery');
              })()}
            </Text>
          </Button>
        </SafeAreaView>
      </View>
    </View>
  );
}
