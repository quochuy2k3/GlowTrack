import React, { memo, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideRefreshCw } from 'lucide-react-native';
import { colors, spacing } from '../constants';

interface FloatingActionButtonProps {
  onRefresh: () => void;
  isVisible: boolean;
}

const FloatingActionButton = memo<FloatingActionButtonProps>(({ onRefresh, isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isVisible ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [isVisible, scaleAnim]);

  const handleRefresh = () => {
    // Rotate animation for refresh
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    onRefresh();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.actionButton} onPress={handleRefresh} activeOpacity={0.8}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.buttonGradient}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <LucideRefreshCw size={20} color={colors.text.inverse} />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 85,
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: spacing.md,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

FloatingActionButton.displayName = 'FloatingActionButton';

export default FloatingActionButton;
