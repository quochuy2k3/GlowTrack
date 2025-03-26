import CourseDetailScreen from '@/screens/CourseDetailScreen';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
export default function () {
  const navigation = useNavigation();
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [navigation, title]);

  return <CourseDetailScreen id={id} />;
}
