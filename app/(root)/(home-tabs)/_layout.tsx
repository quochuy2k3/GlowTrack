import { Tabs } from 'expo-router';
import { t } from 'i18next';
import { BookMarked, House, List, Map, User } from '@tamagui/lucide-icons';
import { useAuth } from '@/contexts/auth';
import TabBottom from '@/assets/svgs/tabBottom';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// SVG background for the tab bar
const TabBarBackground = () => {
  return (
    <View style={styles.svgBackgroundContainer}>
      <TabBottom style={styles.svgBackgroundContainer} width="100%" height="100" color="#fff" />
    </View>
  );
};

export default function Layout() {
  const auth = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* SVG background for the tab bar */}
      <TabBarBackground />

      <Tabs
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            zIndex: 10,
            paddingTop: Platform.OS === 'android' ? 4 : 0,
            height: Platform.OS === 'android' ? 67 : 80,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('home.title'),
            tabBarIcon: ({ color }) => <House color={color as any} />,
          }}
        />
        <Tabs.Screen
          name="my-learning"
          options={{
            href: auth.isAuthenticated ? undefined : null,
            title: t('myLearning.title'),
            tabBarIcon: ({ color }) => <Map color={color as any} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: t('library.title'),
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => {
              return (
                <View style={styles.centerButtonContainer}>
                  <View style={styles.centerButton}>
                    <BookMarked size={30} color={color as any} />
                  </View>
                </View>
              );
            },
            tabBarButton: props => <TouchableOpacity {...props} activeOpacity={1} />,
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            href: auth.isAuthenticated ? undefined : null,
            title: t('category.title'),
            tabBarIcon: ({ color }) => <List color={color as any} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: t('account.title'),
            tabBarIcon: ({ color }) => <User color={color as any} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  svgBackgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -35 }],
    zIndex: 10,
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgb(198, 195, 195)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  centerButtonText: {
    color: '#fff',
    fontSize: 30,
  },
});
