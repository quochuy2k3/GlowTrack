import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import variables from '@/theme/commonColor';

interface ActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  text: string;
  style?: any;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onPress, icon, text, style }) => {
  return (
    <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress}>
      {icon}
      <Text style={styles.actionButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    padding: variables.scale(15),
  },
  actionButtonText: {
    color: 'white',
    marginTop: variables.scale(8),
    fontSize: 16,
  },
});
