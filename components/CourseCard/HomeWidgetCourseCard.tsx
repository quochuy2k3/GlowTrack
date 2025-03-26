import { useTranslation } from 'react-i18next';
import { Card, Image, Stack, Text, YStack } from 'tamagui';
import { HomeWidgetCourseCardProps } from './types';
import { StyledCard } from './styled';
import { ThumbnailImage } from './ThumbnalImage';
import StatusBadge from './StatusBadge';
export default function HomeWidgetCourseCard({
  course,
  width,
  onPress,
}: HomeWidgetCourseCardProps) {
  const { t } = useTranslation();
  return (
    <StyledCard
      width={width}
      onPress={onPress}
      pressStyle={{
        scale: 0.98,
      }}
    >
      <Stack position="relative">
        <ThumbnailImage height="$11" url={course.coverImageUrl} />
        {!!course.status && <StatusBadge status={course.status} />}
      </Stack>
      <Text fontSize="$2" color="$color04">
        {t(course.source === 'course' ? 'course_card.course' : 'course_card.program')}
      </Text>
      <Text fontSize="$4" fontWeight="bold" numberOfLines={1}>
        {course.title}
      </Text>
    </StyledCard>
  );
}
