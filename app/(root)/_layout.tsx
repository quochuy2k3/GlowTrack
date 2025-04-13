import { Redirect, Slot, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';

export default function Layout() {
  const { t } = useTranslation();
  const auth = useAuth();
  return !auth.isAuthenticated ? (
    <Redirect href="/(signin)" />
  ) : (
    <Stack>
      <Stack.Screen
        name="(home-tabs)"
        options={{
          headerShown: false,
          title: t('home.title'),
        }}
      />
    </Stack>
  );
}
