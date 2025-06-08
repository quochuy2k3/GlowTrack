import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideArrowLeft, LucideBookType } from 'lucide-react-native';
import variables from '@/theme/commonColor';

interface HeaderProps {
  onBackPress: () => void;
  showDocumentButton?: boolean;
  onDocumentPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBackPress,
  showDocumentButton = false,
  onDocumentPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <LucideArrowLeft size={24} color="white" />
        </TouchableOpacity>

        {showDocumentButton && onDocumentPress && (
          <TouchableOpacity style={styles.documentButton} onPress={onDocumentPress}>
            <LucideBookType size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: variables.scale(25),
  },
  documentButton: {
    padding: variables.scale(20),
  },
});
