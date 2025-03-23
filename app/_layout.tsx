import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";

import { useColorScheme } from "@/hooks/useColorScheme";

import { tamaguiConfig } from "../tamagui.config";
import { SessionProvider } from "@/contexts/session";
import ServicesProvider from "@/services";
import { QueryClient, QueryClientProvider } from "react-query";
import '@/i18n';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
          <SessionProvider>
            <ServicesProvider>
              <Slot />
              <StatusBar style="auto" />
            </ServicesProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );

  function _getReactNavigationTheme(): typeof DefaultTheme {
    const scheme = colorScheme === "dark" ? "dark" : "light";
    const theme = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: tamaguiConfig.themes[scheme].accent1.val,
      },
    };
  }
}
