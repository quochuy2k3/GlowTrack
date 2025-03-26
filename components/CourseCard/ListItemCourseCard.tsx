import { useTranslation } from 'react-i18next';
import { Card, Image, Progress, Stack, Text, XStack, YStack } from 'tamagui';
import { ListItemCourseCardProps } from './types';
import { StyledCard } from './styled';
import { ThumbnailImage } from './ThumbnalImage';
import StatusBadge from './StatusBadge';

export default function HomeWidgetCourseCard({
  course,
  width,
  onPress,
  showProgress,
}: ListItemCourseCardProps) {
  const { t } = useTranslation();

  return (
    <StyledCard onPress={onPress}>
      <XStack gap="$2">
        <Stack position="relative" flex={1}>
          <ThumbnailImage height="$8" url={course.coverImageUrl} />
          {!!course.status && <StatusBadge status={course.status} size="small" />}
        </Stack>
        <YStack flex={2} gap="$5">
          <YStack gap="$2">
            <Text fontSize="$3" color="$color04" numberOfLines={1}>
              {t(course.source === 'course' ? 'course_card.course' : 'course_card.program')}
            </Text>
            <Text fontSize="$5" fontWeight="bold" numberOfLines={1}>
              {course.title}
            </Text>
          </YStack>
          {!!showProgress && typeof course.progress === 'number' && (
            <XStack items="center" gap="$2">
              <YStack>
                <Progress value={course.progress} size="$3" width="50%">
                  <Progress.Indicator bg="$accent1" />
                </Progress>
              </YStack>
              <Text fontSize="$2">{course.progress}%</Text>
            </XStack>
          )}
        </YStack>
      </XStack>
    </StyledCard>
  );
}
