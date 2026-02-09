import { apiClient } from '@/src/core/api/client';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isAndroidExpoGo = isExpoGo && Platform.OS === 'android';

// Helper to safely get Notifications module
const getNotifications = () => {
  if (isAndroidExpoGo) {
    console.warn('[PushService] Notifications are not supported in Expo Go on Android SDK 53+.');
    return null;
  }
  try {
    return require('expo-notifications');
  } catch (error) {
    console.warn('[PushService] Failed to load expo-notifications:', error);
    return null;
  }
};

export async function checkNotificationPermission() {
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
  const Notifications = getNotifications();
  if (!Notifications) return false;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
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
  const Notifications = getNotifications();
  if (!Notifications) return null;

  try {
    // Check permissions first
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      console.log('[PushService] Permissions not granted, skipping token fetch');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
    console.log('[PushService] Fetching Expo push token for project:', projectId);

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (e: any) {
    console.warn('[PushService] Failed to get push token:', e);
    return null;
  }
}

export async function registerPushTokenWithBackend(token: string) {
  try {
    await apiClient.put('/notifications/push-token', { pushToken: token });
    console.log('[PushService] Push token registered with backend');
    return true;
  } catch (error) {
    console.warn('[PushService] Failed to register push token with backend:', error);
    return false;
  }
}

// Send a test notification to the device notification bar
export async function sendTestNotification() {
  const Notifications = getNotifications();
  if (!Notifications) {
    console.warn('[PushService] Notifications not available');
    return false;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      console.warn('[PushService] Permissions not granted, cannot send notification');
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Event Near You! 🎉",
        body: "Discover 'Ethiopian Coffee Ceremony' happening this weekend in Adama",
        data: {
          type: 'EVENT',
          eventId: 'test-event-123',
          screen: '/events'
        },
        sound: true,
        badge: 1,
      },
      trigger: null,
    });

    console.log('[PushService] Test notification sent successfully');
    return true;
  } catch (error) {
    console.warn('[PushService] Failed to send test notification:', error);
    return false;
  }
}

export function setupNotificationHandler() {
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

export function addNotificationReceivedListener(callback: (notification: any) => void) {
  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(callback: (response: any) => void) {
  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  return Notifications.addNotificationResponseReceivedListener(callback);
}
