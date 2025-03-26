import { useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useState } from 'react';
import { useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import CoursesListByCode from '@/components/CourseListByCode';
import { useAuth } from '@/contexts/auth';

export default function LibraryScreen() {
  const auth = useAuth();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const { t } = useTranslation();
  const [routes] = useState([
    { key: 'requireLearning', title: t('library.require_learning') },
    { key: 'inProgress', title: t('library.in_progress') },
    { key: 'savedLearning', title: t('library.saved_courses') },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: theme.accent1.get() }}
      style={{ backgroundColor: theme.color1.get() }}
      activeColor={theme.accent1.get()}
      inactiveColor={theme.color04.get()}
    />
  );

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        return <CoursesListByCode code={route.key} showProgress />;
      }}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
