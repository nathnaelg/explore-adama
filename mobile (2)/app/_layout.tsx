import { queryClient } from "@/src/core/api/queryClient";
import {
    AuthProvider,
    useAuth,
} from "@/src/features/auth/contexts/AuthContext";
import "@/src/i18n/config";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import {
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    getPushToken,
    registerPushTokenWithBackend,
    setupNotificationHandler,
} from "@/src/services/push.service";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Set up notification handler
// Set up notification handler safely
setupNotificationHandler();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isReady } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Load any fonts here if needed, or other assets
  const [fontsLoaded] = useFonts({
    // SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isReady && isMounted) {
      SplashScreen.hideAsync();
    }
  }, [isReady, isMounted]);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Register for push notifications if user is logged in
      const setupPush = async () => {
        const token = await getPushToken();
        if (token) {
          await registerPushTokenWithBackend(token);
        }
      };
      setupPush();
    }
  }, [user]);

  useEffect(() => {
    // Listener for notifications received when app is in foreground
    const subscription = addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
      // You could update local state or query cache here if needed
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // Listener for when user interacts with a notification
    const responseSubscription = addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification interaction:", response);
        // Navigate to notifications screen or relevant screen
        // router.push('/notifications');
      },
    );

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(public)/splash" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(modals)/filter-sort"
        options={{ presentation: "modal" }}
      />

      <Stack.Screen name="permissions/location" />
      <Stack.Screen name="permissions/notifications" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <InitialLayout />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
