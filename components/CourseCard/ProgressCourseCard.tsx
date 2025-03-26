import { useTranslation } from 'react-i18next';
import { Image, Progress, Text, XStack, YStack } from 'tamagui';
import { ProgressCourseCardProps } from './types';
import { StyledCard } from './styled';
import { ThumbnailImage } from './ThumbnalImage';

export default function ProgressCourseCard({ course, onPress }: ProgressCourseCardProps) {
  const { t } = useTranslation();
  return (
    <StyledCard onPress={onPress}>
      <ThumbnailImage height="$15" url={course.coverImageUrl} />
      <YStack gap="$3">
        <XStack gap="$2">
          <Text fontSize="$3" color="$color04">
            {t(course.source === 'program' ? 'home.program' : 'home.course')}
          </Text>
        </XStack>
        <Text fontSize="$6" fontWeight="bold" numberOfLines={1} color="$accent1">
          {course.title}
        </Text>
        <Progress value={course.progress}>
          <Progress.Indicator bg="$accent1" />
        </Progress>
        <XStack justify="space-between">
          <Text fontSize="$2" color="$color04">
            {t('home.overallProgress')}
          </Text>
          <Text fontSize="$2">{course.progress}%</Text>
        </XStack>
      </YStack>
    </StyledCard>
  );
}
