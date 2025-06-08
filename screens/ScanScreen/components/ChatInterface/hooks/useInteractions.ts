import { useCallback, useState } from 'react';
import { Clipboard } from 'react-native';
import { useHaptics } from './useHaptics';

interface UseInteractionsProps {
  onRefresh?: () => void;
}

export const useInteractions = ({ onRefresh }: UseInteractionsProps = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const { successHaptic, lightHaptic, mediumHaptic } = useHaptics();

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    lightHaptic();

    try {
      await onRefresh();
      successHaptic();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing, lightHaptic, successHaptic]);

  const copyMessage = useCallback(
    async (text: string) => {
      try {
        await Clipboard.setString(text);
        successHaptic();
        return true;
      } catch (error) {
        console.error('Failed to copy message:', error);
        return false;
      }
    },
    [successHaptic]
  );

  const toggleMessageSelection = useCallback(
    (messageId: string) => {
      mediumHaptic();
      setSelectedMessages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(messageId)) {
          newSet.delete(messageId);
        } else {
          newSet.add(messageId);
        }
        return newSet;
      });
    },
    [mediumHaptic]
  );

  const clearSelection = useCallback(() => {
    setSelectedMessages(new Set());
  }, []);

  const isMessageSelected = useCallback(
    (messageId: string) => {
      return selectedMessages.has(messageId);
    },
    [selectedMessages]
  );

  return {
    isRefreshing,
    selectedMessages,
    handleRefresh,
    copyMessage,
    toggleMessageSelection,
    clearSelection,
    isMessageSelected,
  };
};
