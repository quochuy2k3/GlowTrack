import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
  const lightHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const mediumHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavyHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const successHaptic = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const errorHaptic = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const selectionHaptic = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  return {
    lightHaptic,
    mediumHaptic,
    heavyHaptic,
    successHaptic,
    errorHaptic,
    selectionHaptic,
  };
};
