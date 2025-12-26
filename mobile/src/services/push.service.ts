import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function checkNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();
  return settings.status === 'granted';
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getPushToken() {
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}
