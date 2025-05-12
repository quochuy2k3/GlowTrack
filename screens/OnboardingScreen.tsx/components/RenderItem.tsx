import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { OnboardingData } from '../data/data';
import { useTranslation } from 'react-i18next';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
type Props = {
  index: number;
  x: SharedValue<number>;
  item: OnboardingData;
};

const RenderItem = ({ index, x, item }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { t } = useTranslation();
  const lottieAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [200, 0, -200],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [1, 4, 4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale: scale }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: item.backgroundColor,
            },
            circleAnimation,
          ]}
        />
      </View>
      <Animated.View style={lottieAnimationStyle}>
        <LottieView
          source={item.animation}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
          }}
          autoPlay
          loop
        />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={[styles.itemText, { color: item.textColor }]}>{t(item.text as any)}</Text>
        <Text style={[styles.subText, { color: item.textColor }]}>{t(item.subtext as any)}</Text>
      </View>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: variables.scale(150),
  },
  itemText: {
    textAlign: 'center',
    fontSize: variables.scale(60),
    fontFamily: commonColor.fontFamilyIcielPantonBold,
    marginBottom: variables.scale(10),
    marginHorizontal: variables.scale(40),
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {
    paddingHorizontal: variables.scale(40),
  },
  subText: {
    textAlign: 'center',
    fontFamily: commonColor.fontFamilyLight,
    fontSize: variables.scale(34),
  },
});
