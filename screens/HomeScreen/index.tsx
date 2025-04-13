import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { YStack, XStack, Spinner, Avatar } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';

import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import WeekCalendar from './components/WeekCalendar';
import GridFolder from './components/GridFolder';
import RoutineWidget from './components/RoutineWidget.tsx/RoutineWidget';
import { useNotification } from '@/contexts/NoticationContext';
const height = Dimensions.get('window').height;

export default function HomeScreen() {
  const services = useServices();
  const { t } = useTranslation();
  const auth = useAuth();
  const time = new Date().getHours();

  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryFn: services.UserProfileService.getProfile,
    queryKey: ['userProfile'],
    enabled: auth.isAuthenticated,
  });

  // const { data: widgets, isLoading: isLoadingWidgets } = useQuery({
  //   queryKey: ['widgets', ...homeWidgetCodes],
  //   queryFn: () => services.WidgetService.findHome(homeWidgetCodes),
  //   enabled: auth.isAuthenticated,
  // });

  // Animation for glowing text
  const opacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const headerFadeOut = headerTranslateY.interpolate({
    inputRange: [-85, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => loopAnimation());
    };

    loopAnimation();
  }, [opacity]);

  // Animation for header slide up
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  const slideUpHeader = () => {
    Animated.timing(headerTranslateY, {
      toValue: isHeaderHidden ? 0 : variables.scale(-450), // slide up or down
      duration: 340,
      useNativeDriver: true,
    }).start(() => setIsHeaderHidden(!isHeaderHidden));
  };

  if (isLoadingUserProfile || auth.isLoading) {
    return (
      <YStack justify="center" items="center">
        <Spinner />
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Animated.View
        style={{
          height: height + variables.scale(200),
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Animated.View style={{ opacity: headerFadeOut, marginBottom: variables.scale(20) }}>
              <XStack px="$4" py="$1">
                <Avatar size="$7" borderRadius="$7">
                  <Avatar.Image
                    accessibilityLabel="avatar"
                    src={
                      userProfile?.avatar ||
                      'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80'
                    }
                  />
                </Avatar>

                <YStack pl="$4" style={styles.headerText}>
                  <Text style={styles.helloText}>
                    {time < 12
                      ? t('goodMorning')
                      : time < 18
                        ? t('goodAfternoon')
                        : time < 22
                          ? t('goodEvening')
                          : t('sweetDream')}
                    {', '}
                  </Text>
                  <Text style={styles.userNameText}>{userProfile?.fullname}</Text>
                </YStack>

                <View style={styles.headerRight}>
                  <TouchableOpacity onPress={() => {}}>
                    <Bell size={24} />
                  </TouchableOpacity>
                </View>
              </XStack>
              <WeekCalendar />
            </Animated.View>

            <TouchableOpacity onPress={slideUpHeader}>
              <Animated.Text style={[styles.logoText, { opacity }]}>GLOW TRACK</Animated.Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'column',
            backgroundColor: commonColor.ColorWhite,
            paddingBottom: isHeaderHidden ? variables.scale(120) : variables.scale(550),
          }}
        >
          <GridFolder />
          <RoutineWidget />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: variables.ColorWhite,
  },
  headerContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: variables.scale(42),
    borderBottomRightRadius: variables.scale(42),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: variables.scale(10),
  },
  logoText: {
    fontFamily: commonColor.fontFamilyWinkySans,
    backgroundColor: 'grey',
    fontSize: variables.scale(30),
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    width: variables.scale(270),
    alignSelf: 'center',
    borderTopLeftRadius: variables.scale(30),
    borderTopRightRadius: variables.scale(30),
    paddingVertical: variables.scale(2),
  },
  helloText: {
    fontFamily: commonColor.fontFamilyRobotoRegular,
    fontSize: variables.scale(32),
    marginBottom: variables.scale(10),
  },
  userNameText: {
    fontSize: variables.scale(36),
    fontFamily: commonColor.fontFamilyRobotoMedium,
  },
  headerText: {
    paddingHorizontal: variables.scale(10),
  },
  headerRight: {
    flex: 1,
    marginTop: variables.scale(5),
    marginRight: variables.scale(10),
    alignItems: 'flex-end',
  },
});
