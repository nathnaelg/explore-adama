import { LoadingScreen } from "@/src/components/feedback/LoadingScreen";
import { secureStorage } from "@/src/core/storage/secure-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function BootScreen() {
  useEffect(() => {
    // Add a small delay to ensure AsyncStorage is ready
    const timer = setTimeout(() => {
      checkInitialRoute();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkInitialRoute = async () => {
    try {
      console.log("[BootScreen] Starting initial route check...");

      const hasSeenOnboarding = await AsyncStorage.getItem('@adama_onboarding_seen');

      if (hasSeenOnboarding === 'true') {
        // User has already seen onboarding, check for auth token
        const token = await secureStorage.getToken();

        if (token) {
          console.log("[BootScreen] User logged in - Navigating to tabs");
          router.replace("/(tabs)");
        } else {
          console.log("[BootScreen] User not logged in - Navigating to login");
          router.replace("/(auth)/login");
        }
      } else {
        // First time user
        console.log("[BootScreen] First time user - Navigating to onboarding");
        router.replace("/onboarding");
      }

    } catch (error) {
      console.error("[BootScreen] Error checking initial route:", error);
      // Default to onboarding on error for safety
      router.replace("/onboarding");
    }
  };

  // Show loading screen while checking
  return <LoadingScreen />;
}
