import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default function LibraryScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // To store captured photo URI
  const [isPhotoTaken, setIsPhotoTaken] = useState(false); // Track if photo has been taken

  const camRef = useRef<CameraView>(null); // Create a reference to the camera

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (camRef.current) {
      // Chụp ảnh với camera ref
      const data = await camRef.current.takePictureAsync({
        skipProcessing: false, // Để tránh việc tự động xử lý ảnh
        mirror: facing === 'front', // Disable mirror effect for the front camera
      });

      setCapturedPhoto(data.uri); // Store the photo URI as is
      setIsPhotoTaken(true); // Mark photo as taken
      console.log(data.uri); // You can handle the captured photo here (e.g., display it or save it)
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null); // Clear the captured photo
    setIsPhotoTaken(false); // Allow retaking the photo
  }

  return (
    <View style={styles.container}>
      {!isPhotoTaken ? (
        // Camera view and buttons when photo is not taken
        <CameraView style={styles.camera} facing={facing} ref={camRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={takePicture} // Call takePicture when pressing the button
            >
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        // Display captured photo and options when a photo is taken
        <View style={styles.capturedContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePhoto}>
              <Text style={styles.text}>Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log('Proceed with captured photo')} // Example action
            >
              <Text style={styles.text}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'center', // Center buttons horizontally
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20, // Add spacing between buttons
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  capturedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  capturedImage: {
    width: width,
    height: height,
    marginTop: 10,
    transform: [{ rotate: '0deg' }], // Ensure no rotation is applied to the preview
  },
});
