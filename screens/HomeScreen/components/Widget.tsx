import { useRouter } from 'expo-router';
import { Image, ScrollView, XStack, Text, YStack, Stack } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import variables from '@/theme/commonColor';
import CourseCard from '@/components/CourseCard';
import { useTranslation } from 'react-i18next';
import { HomeWidgetDTO } from '@/models/widget';
import Empty from '@/components/Empty';

interface WidgetProps {
  widget: HomeWidgetDTO;
}

export default function Widget({ widget }: WidgetProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const onClickShowAll = () => {
    router.push({
      pathname: '/courses/by-code/[code]',
      params: {
        code: widget?.code as string,
      },
    });
  };

  return (
    <YStack py="$3">
      <XStack justify="space-between" items="center" px="$3">
        <Text fontSize="$5" fontWeight="bold">
          {t(widget.code as any)}
        </Text>
        {widget?.dataObj && widget.dataObj.length > 0 && (
          <TouchableOpacity onPress={onClickShowAll}>
            <Text fontSize="$2" color="$accent1">
              {t('showAll')}
            </Text>
          </TouchableOpacity>
        )}
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$3" p="$3">
          {widget?.dataObj &&
            widget.dataObj.length > 0 &&
            widget.dataObj.map(course => {
              return (
                <CourseCard
                  variant="home-widget"
                  key={course.id}
                  course={course}
                  width={variables.scale(400)}
                />
              );
            })}
        </XStack>
      </ScrollView>
      {widget?.dataObj?.length === 0 && <Empty />}
    </YStack>
  );
}
