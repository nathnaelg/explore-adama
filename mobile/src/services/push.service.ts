import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isAndroidExpoGo = isExpoGo && Platform.OS === 'android';

// Helper to safely get Notifications module
const getNotifications = () => {
  if (isAndroidExpoGo) return null;
  return require('expo-notifications');
};

export async function checkNotificationPermission() {
  if (isAndroidExpoGo) {
    console.warn('[PushService] Notifications not supported in Expo Go on Android.');
    return false;
  }

  const Notifications = getNotifications();
  if (!Notifications) return false;

  try {
    const settings = await Notifications.getPermissionsAsync();
    return settings.status === 'granted';
  } catch (e) {
    console.warn('[PushService] Failed to check permissions:', e);
    return false;
  }
}

export async function requestNotificationPermission() {
  if (isAndroidExpoGo) {
    console.warn('[PushService] Cannot request notifications in Expo Go on Android.');
    return false;
  }

  const Notifications = getNotifications();
  if (!Notifications) return false;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.warn('[PushService] Failed to request permissions:', e);
    return false;
  }
}

export async function getPushToken() {
  if (isAndroidExpoGo) {
    return 'expo-go-android-dummy-token';
  }

  const Notifications = getNotifications();
  if (!Notifications) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (e) {
    console.warn('[PushService] Failed to get push token:', e);
    return null;
  }
}
