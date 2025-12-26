import { queryClient } from '@/src/core/api/queryClient';
import { AuthProvider, useAuth } from '@/src/features/auth/contexts/AuthContext';
import { ThemeProvider } from '@/src/providers/ThemeProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(public)/splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/filter-sort" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="(modals)/guest-prompt"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
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