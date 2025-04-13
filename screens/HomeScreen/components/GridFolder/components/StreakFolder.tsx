import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack, useTheme } from 'tamagui';
import { Navigation } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

export const StreakFolder = React.memo(({ item, drag, isActive }: any) => {
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);
  return (
    <TouchableOpacity
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: variables.scale(12),
        elevation: 4,
        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.07)',
        borderRadius: variables.scale(28),
      }}
      onLongPress={drag}
    >
      <LinearGradient
        colors={
          isActive
            ? [commonColor.ColorBackgroundGray97, commonColor.ColorBackgroundGray97]
            : ['rgb(255, 229, 246)', 'rgb(252, 142, 146)']
        }
        style={styles.folderContainer}
      >
        <View style={styles.header}>
          <Text style={styles.titleText}>Streaks</Text>
        </View>

        <XStack flex={1} alignItems="center" mt={'$-4'}>
          <Animated.View style={[styles.streakIcon, { transform: [{ scale: pulseAnim }] }]}>
            <MaterialCommunityIcons name="fire" size={70} color="#FF6B6B" />
          </Animated.View>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text style={styles.streakCount}>21</Text>
            <Text style={styles.streakText}>Ngày</Text>
          </YStack>
        </XStack>
      </LinearGradient>
    </TouchableOpacity>
  );
});

StreakFolder.displayName = 'StreakFolder';

const styles = StyleSheet.create({
  folderContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: variables.scale(24),
    width: width / 2 - variables.scale(30),
    height: variables.scale(360),
    borderRadius: variables.scale(28),
  },
  titleText: {
    fontSize: variables.scale(32),
    fontFamily: commonColor.fontFamilyRobotoMedium,
    marginBottom: variables.scale(4),
  },
  locationText: {
    fontSize: variables.scale(26),
    fontFamily: commonColor.fontFamilyLight,
    marginBottom: variables.scale(20),
  },
  temperatureText: {
    fontSize: variables.scale(50),
    fontFamily: commonColor.fontFamilyMedium,
  },
  conditionText: {
    fontSize: variables.scale(32),
    fontFamily: commonColor.fontFamilySemiBold,
  },
  streakIcon: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgb(103, 53, 54)',
  },
  streakText: {
    fontSize: variables.scale(36),
    color: 'rgb(103, 53, 54)',
    fontFamily: commonColor.fontFamilyBold,
  },
});
