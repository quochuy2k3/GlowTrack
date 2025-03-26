import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="(home-tabs)"
        options={{
          headerShown: false,
          title: t('home.title'),
        }}
      />
      <Stack.Screen
        name="(modals)"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
