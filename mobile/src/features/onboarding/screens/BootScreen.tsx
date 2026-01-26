import { LoadingScreen } from "@/src/components/feedback/LoadingScreen";
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

      // Always show onboarding when app opens
      console.log("[BootScreen] Navigating to onboarding");
      router.replace("/onboarding");
    } catch (error) {
      console.error("[BootScreen] Error checking initial route:", error);
      // Default to onboarding on error
      console.log("[BootScreen] Error occurred - navigating to onboarding");
      router.replace("/onboarding");
    }
  };

  // Show loading screen while checking
  return <LoadingScreen />;
}
