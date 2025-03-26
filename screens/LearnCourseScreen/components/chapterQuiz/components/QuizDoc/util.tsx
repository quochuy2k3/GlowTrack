import * as FileSystem from 'expo-file-system';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

/// Grant permission in Android
export const getDownloadPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Permission Error:', err);
    return false;
  }
};

export const downloadFile = async url => {
  try {
    // Define file name and local path
    const fileName = url.split('/').pop();
    const fileUri = FileSystem.documentDirectory + fileName;

    // Start downloading
    const { uri } = await FileSystem.downloadAsync(url, fileUri);

    // Notify user after download
    Alert.alert('Download Complete', `File saved to ${uri}`);
    return uri;
  } catch (error) {
    console.error('Download Error:', error);
    Alert.alert('Error', 'Failed to download file.');
    return null;
  }
};
