import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideX, LucideBot, LucideSparkles } from 'lucide-react-native';
import { colors, spacing } from '../constants';
import { ChatHeaderProps } from '../types';

const ChatHeader = memo<ChatHeaderProps>(({ onClose }) => (
  <LinearGradient colors={[colors.surface, '#FAFBFC']} style={styles.header}>
    {onClose && (
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <LucideX size={24} color={colors.text.primary} />
      </TouchableOpacity>
    )}
    <View style={styles.headerContent}>
      <View style={styles.headerIconContainer}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.headerIcon}>
          <LucideBot size={20} color={colors.text.inverse} />
        </LinearGradient>
      </View>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>GlowTrack AI</Text>
        <View style={styles.statusContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Trực tuyến</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity style={styles.headerActionButton}>
      <LucideSparkles size={20} color={colors.primary} />
    </TouchableOpacity>
  </LinearGradient>
));

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: colors.shadow,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: spacing.md,
  },
  headerIconContainer: {
    marginRight: spacing.md,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500' as const,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headerActionButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
};

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
