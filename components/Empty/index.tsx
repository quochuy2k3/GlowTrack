import { Stack, Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Inbox } from '@tamagui/lucide-icons';

export default function Empty() {
  const { t } = useTranslation();

  return (
    <Stack flex={1} justify="center" items="center" py="$4">
      <Inbox size="$6" color="$color4" strokeWidth={1} />
      <Text color="$color4">{t('home.noData')}</Text>
    </Stack>
  );
}
