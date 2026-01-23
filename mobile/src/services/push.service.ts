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
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
    console.log('[PushService] Fetching Expo push token for project:', projectId);

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (e: any) {
    console.warn('[PushService] Failed to get push token:', e);
    console.log('[PushService] Environment Info:', {
      isExpoGo,
      platform: Platform.OS,
      executionEnvironment: Constants.executionEnvironment,
      projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId,
    });
    return null;
  }
}

export async function registerPushTokenWithBackend(token: string) {
  const { apiClient } = await import('@/src/core/api/client');
  try {
    await apiClient.put('/notifications/push-token', { pushToken: token });
    console.log('[PushService] Push token registered with backend');
    return true;
  } catch (error) {
    console.warn('[PushService] Failed to register push token with backend:', error);
    return false;
  }
}

// Global Notification Handler Wrapper
export function setupNotificationHandler() {
  if (isAndroidExpoGo) {
    console.warn('[PushService] setNotificationHandler skipped in Expo Go Android');
    return;
  }

  const Notifications = getNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Notification Listeners Wrappers
export function addNotificationReceivedListener(callback: (notification: any) => void) {
  if (isAndroidExpoGo) {
    return { remove: () => { } };
  }

  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(callback: (response: any) => void) {
  if (isAndroidExpoGo) {
    return { remove: () => { } };
  }

  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  return Notifications.addNotificationResponseReceivedListener(callback);
}
