import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, StatusBar, useWindowDimensions } from 'react-native';
import { View, Text } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const subtitleOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Hide status bar
    StatusBar.setHidden(true);

    startAnimationSequence();
    const timer = setTimeout(() => {
      onFinish?.();
    }, 4000);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  const startAnimationSequence = () => {
    backgroundOpacity.value = withTiming(1, { duration: 800 });

    logoOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(
      300,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
      })
    );

    setTimeout(() => {
      animationRef.current?.play();
    }, 800);

    titleOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    titleScale.value = withDelay(
      1200,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
      })
    );

    subtitleOpacity.value = withDelay(1600, withTiming(1, { duration: 600 }));
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container} flex={1}>
      <Animated.View style={[styles.backgroundContainer, animatedBackgroundStyle]}>
        <LinearGradient
          colors={['#FEF6EB', '#FFF8F0', '#FEF6EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />
      </Animated.View>

      <Animated.View
        style={[styles.floatingElement, styles.floatingElement1]}
        entering={FadeIn.duration(1500).delay(500)}
      >
        <LinearGradient
          colors={['rgba(255, 154, 139, 0.3)', 'rgba(255, 208, 123, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <Animated.View
        style={[styles.floatingElement, styles.floatingElement2]}
        entering={FadeIn.duration(1500).delay(800)}
      >
        <LinearGradient
          colors={['rgba(160, 231, 229, 0.2)', 'rgba(180, 248, 200, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <Animated.View
        style={[styles.floatingElement, styles.floatingElement3]}
        entering={FadeIn.duration(1500).delay(1100)}
      >
        <LinearGradient
          colors={['rgba(255, 208, 123, 0.25)', 'rgba(255, 154, 139, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <View style={styles.contentContainer}>
        <View style={{ position: 'absolute', top: 140, left: 10, right: 0, bottom: 0 }}>
          <Animated.View style={[styles.lottieContainer, animatedLogoStyle]}>
            <LottieView
              ref={animationRef}
              source={require('@/assets/images/iconNoBg.json')}
              style={styles.lottieAnimation}
              loop={true}
              autoPlay={false}
              speed={0.8}
              onAnimationFinish={() => setAnimationFinished(true)}
            />
          </Animated.View>
        </View>
        <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
          <Text style={styles.appTitle}>GlowTrack</Text>
        </Animated.View>

        <Animated.View style={[styles.subtitleContainer, animatedSubtitleStyle]}>
          <Text style={styles.subtitle}>Track your glow journey</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6EB',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.6,
  },
  floatingElement1: {
    width: 120,
    height: 120,
    top: height * 0.15,
    left: width * 0.08,
  },
  floatingElement2: {
    width: 80,
    height: 80,
    top: height * 0.25,
    right: width * 0.12,
  },
  floatingElement3: {
    width: 100,
    height: 100,
    bottom: height * 0.2,
    left: width * 0.15,
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: variables.scale(20),
    zIndex: 10,
  },
  lottieContainer: {
    width: variables.scale(700),
    height: variables.scale(700),
    marginBottom: variables.scale(10),
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginBottom: variables.scale(20),
  },
  appTitle: {
    fontSize: variables.scale(70),
    fontFamily: commonColor.fontFamilyWinkySans,
    color: '#FF9A8B',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitleContainer: {
    marginBottom: variables.scale(60),
  },
  subtitle: {
    fontSize: variables.scale(36),
    color: '#A0E7E5',
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: variables.scale(80),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingBar: {
    width: variables.scale(300),
    height: 4,
    backgroundColor: 'rgba(255, 154, 139, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF9A8B',
    borderRadius: 2,
  },
});
