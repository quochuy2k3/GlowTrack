import TabBottom from '@/assets/svgs/tabBottom';
import { useAuth } from '@/contexts/auth';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { CalendarClock, HeartHandshake, House, User } from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// SVG background for the tab bar
const TabBarBackground = () => {
  return (
    <View style={styles.svgBackgroundContainer}>
      <TabBottom
        style={styles.svgBackgroundContainer}
        borderColor={commonColor.ColorGray69}
        borderWidth={0.5}
        width="100%"
        height="100"
        color="#fff"
      />
    </View>
  );
};

export default function Layout() {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <View style={{ flex: 1 }}>
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
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="routine"
          options={{
            title: t('routine'),
            tabBarIcon: ({ color }) => <CalendarClock color={color as any} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: t('library.title'),
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => {
              return (
                <View style={styles.centerButtonContainer}>
                  <View style={styles.centerButton}>
                    <LottieView
                      source={require('@/assets/json/scanIcon.json')}
                      autoPlay
                      speed={1.3}
                      loop
                      style={styles.animation}
                    />
                  </View>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="couple"
          options={{
            title: t('couple'),
            tabBarIcon: ({ color }) => <HeartHandshake color={color as any} />,
            headerShown: false,
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
    transform: [{ translateX: -36 }],
    zIndex: 10,
  },
  centerButton: {
    width: variables.scale(140),
    height: variables.scale(140),
    borderRadius: variables.scale(70),
    padding: variables.scale(14),
    backgroundColor: '#FEF6EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A0E7E5',
  },
  centerButtonText: {
    color: '#fff',
    fontSize: 30,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
