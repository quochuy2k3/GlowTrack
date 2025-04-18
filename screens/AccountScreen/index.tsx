import { useRouter } from 'expo-router';
import { Button, Text, View } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';

export default function AccountScreen() {
  const auth = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View flex={1} justify="center" items="center">
      <Button onPress={() => auth.signOut()} theme="accent" variant="outlined">
        <Text color="$accent1">{t('SignOut')}</Text>
      </Button>
    </View>
  );
}
