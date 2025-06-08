import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideX } from 'lucide-react-native';
import { colors, spacing } from '../constants';

interface QuickResponseBarProps {
  responses: string[];
  onResponseSelect: (response: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

const QuickResponseBar = memo<QuickResponseBarProps>(
  ({ responses, onResponseSelect, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gợi ý câu hỏi:</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <LucideX size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {responses.map((response, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onResponseSelect(response)}
              activeOpacity={0.8}
              style={styles.responseButton}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.responseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.responseText}>{response}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: spacing.md,
    marginVertical: spacing.sm,
  },
  scrollContent: {
    paddingRight: spacing.lg,
  },
  responseButton: {
    marginRight: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  responseGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  responseText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '500',
  },
});

QuickResponseBar.displayName = 'QuickResponseBar';

export default QuickResponseBar;
