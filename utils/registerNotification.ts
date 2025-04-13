import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

export async function registerForPushNotificationsAsync() {
  try {
    // Đối với Android: Tạo channel thông báo
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Kiểm tra nếu đang trên thiết bị thực (Device.isDevice)
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Nếu chưa được cấp quyền, yêu cầu người dùng cấp quyền
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Kiểm tra nếu quyền không được cấp
      if (finalStatus !== 'granted') {
        Alert.alert('Error', 'Permission not granted to get push token for push notification!');
        throw new Error('Permission not granted to get push token for push notification!');
      }

      // Lấy Project ID từ cấu hình
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found');
      }

      // Lấy push token
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      return pushTokenString;
    } else {
      // Nếu không phải thiết bị thực (chỉ có thể nhận thông báo trên thiết bị thực)
      throw new Error('Must use physical device for push notifications');
    }
  } catch (error: any) {
    console.error('Error while registering for push notifications:', error);
    Alert.alert('Error', error.message || 'An unknown error occurred');
    throw new Error(error.message || 'An unknown error occurred');
  }
}
