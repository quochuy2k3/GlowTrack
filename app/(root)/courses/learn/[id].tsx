import LearnCourseScreen from '@/screens/LearnCourseScreen';
import { useLocalSearchParams } from 'expo-router';

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <LearnCourseScreen id={id} />;
}
