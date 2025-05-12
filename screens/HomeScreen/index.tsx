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
  StatusBar,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { YStack, XStack, Spinner, Avatar } from 'tamagui';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/services';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import WeekCalendar from './components/WeekCalendar';
import GridFolder from './components/GridFolder';
import RoutineWidget from './components/RoutineWidget.tsx/RoutineWidget';
import { useAuth } from '@/contexts/auth';
const height = Dimensions.get('window').height;

export default function HomeScreen() {
  const services = useServices();
  const { t, i18n } = useTranslation();
  const auth = useAuth;
  const time = new Date().getHours();
  const [refreshing, setRefreshing] = useState(false);
  // Create ref to store WeekCalendar's refetch function
  const weekCalendarRefetch = useRef<(() => void) | undefined>(undefined);
  const routineRefetch = useRef<(() => void) | undefined>(undefined);
  const {
    data: userProfile,
    isLoading: isLoadingUserProfile,
    refetch,
  } = useQuery({
    queryFn: services.UserProfileService.getProfile,
    queryKey: ['userProfile'],
    enabled: auth.isAuthenticated,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const showLanguageModal = () => {
    setLangModalVisible(true);
  };

  // Thêm hàm chọn ngôn ngữ
  const selectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    setLangModalVisible(false);
  };

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
      toValue: isHeaderHidden ? 0 : variables.scale(-450),
      duration: 340,
      useNativeDriver: true,
    }).start(() => setIsHeaderHidden(!isHeaderHidden));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    if (weekCalendarRefetch.current) {
      weekCalendarRefetch.current();
    }
    if (routineRefetch.current) {
      routineRefetch.current();
    }
    setRefreshing(false);
  };

  const routineRefetchRef = useRef<() => void>(() => {
    if (routineRefetch.current) {
      routineRefetch.current();
    }
  });

  if (isLoadingUserProfile || auth.isLoading) {
    return (
      <YStack justify="center" items="center">
        <Spinner />
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <Modal
        animationType="none"
        transparent={true}
        visible={langModalVisible}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.langOption} onPress={() => selectLanguage('en')}>
              <Image source={require('@/assets/images/us.png')} style={styles.flagImage} />
              <Text style={styles.langOptionText}>{t('english')}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.langOption} onPress={() => selectLanguage('vi')}>
              <Image source={require('@/assets/images/vietnam.png')} style={styles.flagImage} />
              <Text style={styles.langOptionText}>{t('vietnamese')}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>
          <View style={[styles.modalContent, { marginTop: variables.scale(10) }]}>
            <TouchableOpacity
              style={[styles.langOption, styles.cancelButton]}
              onPress={() => setLangModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  <Avatar.Image accessibilityLabel="avatar" src={userProfile?.avatar} />
                  <Avatar.Fallback
                    backgroundColor={'rgba(176, 176, 180, 0.79)'}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: 'white', fontSize: 30 }}>
                      {userProfile?.fullname?.charAt(0).toUpperCase()}
                    </Text>
                  </Avatar.Fallback>
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
                  <TouchableOpacity onPress={showLanguageModal} style={styles.langButton}>
                    <Image
                      source={
                        currentLang === 'en'
                          ? require('@/assets/images/us.png')
                          : require('@/assets/images/vietnam.png')
                      }
                      style={styles.langImage}
                    />
                  </TouchableOpacity>
                </View>
              </XStack>
              <WeekCalendar onRefresh={weekCalendarRefetch} />
            </Animated.View>

            <TouchableOpacity onPress={slideUpHeader}>
              <Animated.Text style={[styles.logoText, { opacity }]}>GLOW TRACK</Animated.Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['black']}
              tintColor={'black'}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'column',
            backgroundColor: commonColor.ColorWhite,
            paddingBottom: isHeaderHidden ? variables.scale(120) : variables.scale(550),
          }}
        >
          <GridFolder streak={userProfile?.streak || 0} />
          <RoutineWidget onRefresh={routineRefetchRef} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: variables.scale(10),
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
  langButton: {
    paddingHorizontal: variables.scale(15),
    paddingVertical: variables.scale(8),
  },
  langText: {
    fontFamily: commonColor.fontFamilyRobotoMedium,
    fontSize: variables.scale(16),
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: variables.scale(20),
    overflow: 'hidden',
  },
  langOption: {
    paddingVertical: variables.scale(24),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  langOptionText: {
    fontSize: variables.scale(30),
    color: '#007AFF',
    fontFamily: commonColor.fontFamily,
    marginLeft: variables.scale(15),
  },
  flagImage: {
    width: variables.scale(40),
    height: variables.scale(40),
    borderRadius: variables.scale(20),
  },
  cancelButton: {
    backgroundColor: '#F9F9F9',
  },
  cancelText: {
    fontSize: variables.scale(30),
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: commonColor.fontFamilyRobotoMedium,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  langImage: {
    width: variables.scale(40),
    height: variables.scale(40),
    borderRadius: variables.scale(20),
  },
});
