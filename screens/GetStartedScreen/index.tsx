import { StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { View, Text, Button } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import { LucideArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as React from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  Layout,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function GetStartedScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const backgroundPosition = useSharedValue(-300);

  // Start animations
  React.useEffect(() => {
    // Subtle floating animation for logo
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // -1 = infinite repeat
      true // reverse
    );

    // Animate background
    backgroundPosition.value = withTiming(-280, { duration: 1500 });

    // Animate title
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
  }, []);

  // Define animated styles
  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: backgroundPosition.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: withTiming(0, { duration: 800 }) }, { scale: titleOpacity.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.vectorBgContainer, animatedBackgroundStyle]}>
        <Image width={90} source={require('@/assets/images/Vectorbg3.png')} />
      </Animated.View>

      <View style={styles.headerContainer}>
        <Animated.View entering={FadeIn.duration(300).delay(200)} layout={Layout.springify()}>
          <Button chromeless size="$4" circular onPress={() => router.back()}>
            <LucideArrowLeft width={24} height={24} color="#FF9A8B" />
          </Button>
        </Animated.View>

        <View style={styles.titleContainer}>
          <Animated.View style={animatedTitleStyle}>
            <Text style={styles.title}>Welcome</Text>
          </Animated.View>
        </View>
      </View>

      <View style={styles.screenContainer}>
        <Animated.View
          style={[styles.logoContainer, animatedLogoStyle]}
          entering={ZoomIn.duration(600).delay(300)}
          layout={Layout.springify()}
        >
          <Image source={require('@/assets/images/logoNoBg.png')} style={styles.logo} />
        </Animated.View>

        <View style={styles.footerContainer}>
          <Animated.View entering={SlideInUp.duration(400).delay(600)} layout={Layout.springify()}>
            <View style={styles.buttonWrapperStyle}>
              <LinearGradient
                colors={['#FF9A8B', '#FFD07B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              />
              <Button
                chromeless
                style={styles.buttonOverlayStyle}
                pressStyle={{ opacity: 0.9 }}
                onPress={() => router.push('/(signin)/(modals)/sign-in')}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </Button>
            </View>
          </Animated.View>

          <Animated.View entering={SlideInUp.duration(400).delay(800)} layout={Layout.springify()}>
            <View style={styles.buttonWrapperStyle}>
              <LinearGradient
                colors={['#A0E7E5', '#B4F8C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              />
              <Button
                chromeless
                style={styles.buttonOverlayStyle}
                pressStyle={{ opacity: 0.9 }}
                onPress={() => router.push('/(signin)/sign-up')}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </Button>
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={styles.copyrightContainer}
          entering={FadeIn.duration(300).delay(1000)}
          layout={Layout.springify()}
        >
          <Text style={styles.copyright}>© 2025, All rights reserved</Text>
        </Animated.View>
      </View>

      {/* Floating animated elements */}
      <Animated.View
        style={[styles.floatingElement, { top: height * 0.2, left: width * 0.1 }]}
        entering={FadeIn.duration(1000).delay(500)}
        layout={Layout.springify()}
      >
        <LinearGradient
          colors={['rgba(255, 154, 139, 0.4)', 'rgba(255, 208, 123, 0.2)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <Animated.View
        style={[styles.floatingElement, { bottom: height * 0.3, right: width * 0.15 }]}
        entering={FadeIn.duration(1000).delay(700)}
        layout={Layout.springify()}
      >
        <LinearGradient
          colors={['rgba(160, 231, 229, 0.3)', 'rgba(180, 248, 200, 0.2)']}
          style={styles.floatingGradient}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6EB',
  },
  vectorBgContainer: {
    position: 'absolute',
    top: variables.scale(-300),
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: variables.scale(500),
    height: variables.scale(500),
  },
  titleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: commonColor.fontFamilyWinkySans,
    color: '#A0E7E5',
    fontSize: variables.scale(70),
  },
  screenContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: variables.scale(40),
  },
  buttonWrapperStyle: {
    width: 140,
    height: 50,
    marginHorizontal: variables.scale(10),
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonOverlayStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  copyrightContainer: {
    marginTop: variables.scale(100),
  },
  copyright: {
    fontSize: 12,
    color: '#888',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(20),
    marginTop: variables.scale(10),
  },
  floatingElement: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    opacity: 0.6,
  },
  floatingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});
