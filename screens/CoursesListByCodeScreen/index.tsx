import CoursesListByCode from '@/components/CourseListByCode';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CoursesListByCodeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { code } = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    navigation.setOptions({
      title: code ? t(code as any) : t('courses'),
    });
  }, [code, navigation, t]);

  return <CoursesListByCode code={code} />;
}
