import { useTranslation } from 'react-i18next';
import { Progress, Stack, Text, XStack, YStack } from 'tamagui';
import { RelatedListItemCourseCardProps } from './types';
import { StyledCard } from './styled';
import { ThumbnailImage } from './ThumbnalImage';
import StatusBadge from './StatusBadge';

export default function RelatedListItemCourseCard({
  course,
  onPress,
  showProgress,
}: RelatedListItemCourseCardProps) {
  const { t } = useTranslation();

  return (
    <StyledCard
      onPress={onPress}
      shadowOffset={{ width: 0, height: 0 }}
      elevation={0}
      p={0}
      bg="$colorTransparent"
    >
      <XStack gap="$2">
        <Stack position="relative" flex={1}>
          <ThumbnailImage height="$8" url={course.coverImageUrl} />
          {!!course.status && <StatusBadge status={course.status} />}
        </Stack>
        <YStack flex={2} gap="$5">
          <YStack gap="$2">
            <Text fontSize="$3" color="$color04" numberOfLines={1}>
              {t(course.source === 'course' ? 'home.course' : 'home.program')}
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
