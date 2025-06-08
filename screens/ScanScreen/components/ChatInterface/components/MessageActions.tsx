import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LucideCopy, LucideCheck, LucideBookmark } from 'lucide-react-native';
import { colors, spacing } from '../constants';

interface MessageActionsProps {
  messageId: string;
  isSelected: boolean;
  onCopy: () => void;
  onSelect: () => void;
  onBookmark?: () => void;
  animatedValue: Animated.Value;
}

const MessageActions = memo<MessageActionsProps>(
  ({ messageId, isSelected, onCopy, onSelect, onBookmark, animatedValue }) => {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: animatedValue,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, isSelected && styles.selectedButton]}
          onPress={onSelect}
          activeOpacity={0.7}
        >
          <LucideCheck size={16} color={isSelected ? colors.text.inverse : colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCopy} activeOpacity={0.7}>
          <LucideCopy size={16} color={colors.primary} />
        </TouchableOpacity>

        {onBookmark && (
          <TouchableOpacity style={styles.actionButton} onPress={onBookmark} activeOpacity={0.7}>
            <LucideBookmark size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: spacing.xs,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: 16,
    marginHorizontal: spacing.xs,
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
});

MessageActions.displayName = 'MessageActions';

export default MessageActions;
