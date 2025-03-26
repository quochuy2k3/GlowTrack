import { ScrollView, Spinner, Text, YStack } from 'tamagui';
import CourseCard from '@/components/CourseCard';
import { useServices } from '@/services';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import Widget from './components/Widget';
import { useAuth } from '@/contexts/auth';
import AuthCheck from '@/components/AuthCheck';

export default function HomeScreen() {
  const services = useServices();
  const { t } = useTranslation();
  const auth = useAuth();

  const { data: currentCourse, isLoading: isLoadingCurrentCourse } = useQuery({
    queryFn: services.UserCourseService.getCurrentLearnCourse,
    queryKey: ['currentCourse'],
    enabled: auth.isAuthenticated,
  });

  const homeWidgetCodes = ['recentlyViewed', 'courses', 'topWeekly'];
  const { data: widgets, isLoading: isLoadingWidgets } = useQuery({
    queryKey: ['widgets', ...homeWidgetCodes],
    queryFn: () => services.WidgetService.findHome(homeWidgetCodes),
    enabled: auth.isAuthenticated,
  });

  if (isLoadingCurrentCourse || isLoadingWidgets || auth.isLoading) {
    return (
      <YStack justify="center" items="center">
        <Spinner />
      </YStack>
    );
  }

  return (
    <ScrollView>
      {currentCourse && (
        <AuthCheck>
          <YStack gap="$3" p="$3">
            <Text fontSize="$5" fontWeight="bold">
              {t('home.continueLearning')}
            </Text>
            <CourseCard variant="progress" course={currentCourse} />
          </YStack>
        </AuthCheck>
      )}

      <AuthCheck>
        <YStack gap="$4" mt="$4">
          {widgets?.map((widget, idx) => <Widget key={idx} widget={widget} />)}
        </YStack>
      </AuthCheck>
    </ScrollView>
  );
}
