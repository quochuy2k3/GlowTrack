import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { LucideBotMessageSquare, SwitchCamera } from 'lucide-react-native';
import { Button } from 'tamagui';
import { useRouter } from 'expo-router';
import variables from '@/theme/commonColor';
import { Header } from '../common/Header';

interface CameraScreenProps {
  camRef: React.RefObject<CameraView | null>;
  facing: any;
  onTakePicture: () => void;
  onToggleFacing: () => void;
  onOpenChat: () => void;
  permission: any;
  requestPermission: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  camRef,
  facing,
  onTakePicture,
  onToggleFacing,
  onOpenChat,
  permission,
  requestPermission,
}) => {
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} facing={facing} ref={camRef}>
        <Header
          onBackPress={() => router.navigate('/(root)/(home-tabs)')}
          showDocumentButton
          onDocumentPress={() => router.navigate('/(root)/(home-tabs)')}
        />
      </CameraView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.AIButton} onPress={onOpenChat}>
          <LucideBotMessageSquare size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.takePhotoButton} onPress={onTakePicture}>
          <View style={styles.takePhotoButtonContent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipCameraButton} onPress={onToggleFacing}>
          <SwitchCamera size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: variables.scale(38),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: variables.scale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: variables.scale(100),
    marginTop: variables.scale(60),
  },
  takePhotoButton: {
    width: variables.scale(130),
    height: variables.scale(130),
    position: 'relative',
    backgroundColor: 'black',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoButtonContent: {
    width: variables.scale(100),
    height: variables.scale(100),
    backgroundColor: 'white',
    borderRadius: 100,
  },
  AIButton: {
    padding: variables.scale(14),
  },
  flipCameraButton: {
    padding: variables.scale(14),
  },
});
