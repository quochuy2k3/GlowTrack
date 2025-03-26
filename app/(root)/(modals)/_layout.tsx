import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: t('SignIn'),
        }}
      />
    </Stack>
  );
}
