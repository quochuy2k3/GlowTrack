import { YStack, Text } from 'tamagui';
import { CourseStatus } from '@/models/base';
import { useTranslation } from 'react-i18next';

export default function StatusBadge({
  status,
  size = 'normal',
}: {
  status: CourseStatus;
  size?: 'normal' | 'small';
}) {
  const { t } = useTranslation();

  return (
    <YStack
      position="absolute"
      t={size === 'small' ? '$1' : '$2'}
      l={size === 'small' ? '$1' : '$2'}
      bg={status === 'inProgress' ? '#33a7ec' : status === 'completed' ? '#cccccc' : '$accent1'}
      p={size === 'small' ? '$1.5' : '$2'}
      rounded="$3"
    >
      <Text fontSize={size === 'small' ? '$1' : '$2'} color="$color1">
        {status === 'inProgress'
          ? t('course_card.inProgress')
          : status === 'completed'
            ? t('course_card.completed')
            : t('course_card.ready')}
      </Text>
    </YStack>
  );
}
