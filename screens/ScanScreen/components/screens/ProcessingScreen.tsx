import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import variables from '@/theme/commonColor';

interface ProcessingScreenProps {
  processingProgress: number;
  onCancel: () => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  processingProgress,
  onCancel,
}) => {
  return (
    <View style={styles.processingContainer}>
      <Text style={styles.processingTitle}>Processing Image</Text>
      <ActivityIndicator size="large" color="white" style={styles.processingSpinner} />

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${processingProgress * 100}%` }]} />
      </View>

      <Text style={styles.processingText}>Analyzing skin conditions...</Text>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: variables.scale(20),
  },
  processingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: variables.scale(30),
  },
  processingSpinner: {
    marginVertical: variables.scale(20),
  },
  progressBarContainer: {
    width: '80%',
    height: variables.scale(10),
    backgroundColor: '#333',
    borderRadius: variables.scale(10),
    marginVertical: variables.scale(20),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: variables.scale(10),
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: variables.scale(40),
    padding: variables.scale(15),
    borderRadius: variables.scale(8),
    borderWidth: 1,
    borderColor: 'white',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
