import React, { memo, useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { colors, spacing } from '../constants';

interface TypingIndicatorProps {
  showText?: boolean;
  customText?: string;
}

const TypingIndicator = memo<TypingIndicatorProps>(
  ({ showText = false, customText = 'AI đang soạn tin...' }) => {
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const createDotAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      Animated.parallel([
        createDotAnimation(dot1Anim, 0),
        createDotAnimation(dot2Anim, 200),
        createDotAnimation(dot3Anim, 400),
      ]).start();

      if (showText) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(textAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [dot1Anim, dot2Anim, dot3Anim]);

    const renderDot = (anim: Animated.Value, index: number) => (
      <Animated.View
        key={index}
        style={[
          styles.typingDot,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    );

    return (
      <View style={styles.container}>
        {showText && (
          <Animated.Text style={[styles.typingText, { opacity: textAnim }]}>
            {customText}
          </Animated.Text>
        )}
        <View style={styles.typingDotsContainer}>
          {renderDot(dot1Anim, 0)}
          {renderDot(dot2Anim, 1)}
          {renderDot(dot3Anim, 2)}
        </View>
      </View>
    );
  }
);

const styles = {
  container: {
    alignItems: 'center' as const,
  },
  typingText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontStyle: 'italic' as const,
  },
  typingDotsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
  },
};

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;
