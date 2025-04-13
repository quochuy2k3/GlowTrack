import AddCoursesScreen from '@/screens/AddCoursesScreen';
import { useLocalSearchParams } from 'expo-router';

export default function () {
  const { moduleId, dataObj } = useLocalSearchParams<{
    moduleId: string;
    dataObj: string;
  }>();

  return <AddCoursesScreen moduleId={moduleId} dataObj={dataObj} />;
}
