import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { LucideRotateCcw, LucideCheck } from 'lucide-react-native';
import variables from '@/theme/commonColor';
import { Header } from '../common/Header';
import { ActionButton } from '../common/ActionButton';

interface PreviewScreenProps {
  capturedPhoto: string;
  error: string | null;
  onRetake: () => void;
  onProcess: () => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  capturedPhoto,
  error,
  onRetake,
  onProcess,
}) => {
  return (
    <View style={styles.previewContainer}>
      <Header onBackPress={onRetake} />

      <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.previewButtonsContainer}>
        <ActionButton
          onPress={onRetake}
          icon={<LucideRotateCcw size={24} color="white" />}
          text="Retake"
        />

        <ActionButton
          onPress={onProcess}
          icon={<LucideCheck size={24} color="white" />}
          text="Process"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(40),
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
    textAlign: 'center',
    padding: variables.scale(10),
  },
});
