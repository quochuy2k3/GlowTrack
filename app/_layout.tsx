import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';

import { useColorScheme } from '@/hooks/useColorScheme';

import { tamaguiConfig } from '../tamagui.config';
import { AuthProvider } from '@/contexts/auth';
import ServicesProvider from '@/services';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppStateProvider } from '@/contexts/app-state';
import '@/i18n';
import { NotificationProvider } from '@/contexts/NoticationContext';
import * as Notifications from 'expo-notifications';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    agrifont: require('../assets/fonts/agrifont.ttf'),
    iCielPantonBold: require('../assets/fonts/iCielPanton-Bold.ttf'),
    iCielPantonSemiBold: require('../assets/fonts/iCielPanton-SemiBold.ttf'),
    MulishBold: require('../assets/fonts/Mulish-Bold.ttf'),
    MulishItalic: require('../assets/fonts/Mulish-Italic.ttf'),
    MulishLight: require('../assets/fonts/Mulish-Light.ttf'),
    MulishMedium: require('../assets/fonts/Mulish-Medium.ttf'),
    MulishRegular: require('../assets/fonts/Mulish-Regular.ttf'),
    MulishSemiBold: require('../assets/fonts/Mulish-SemiBold.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    WinkySans: require('../assets/fonts/WinkySans-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={_getReactNavigationTheme()}>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <AuthProvider>
              <NotificationProvider>
                <ServicesProvider>
                  <Slot />
                  <StatusBar style="auto" />
                </ServicesProvider>
              </NotificationProvider>
            </AuthProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );

  function _getReactNavigationTheme(): typeof DefaultTheme {
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';
    const theme = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: tamaguiConfig.themes[scheme].accent1.val,
        background: tamaguiConfig.themes[scheme].backgroundColor.val,
      },
    };
  }
}
