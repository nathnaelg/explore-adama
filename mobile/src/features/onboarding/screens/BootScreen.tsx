import { LoadingScreen } from '@/src/components/feedback/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function BootScreen() {
    useEffect(() => {
        checkInitialRoute();
    }, []);

    const checkInitialRoute = async () => {
        try {
            // Check if user has seen onboarding
            const hasSeenOnboarding = await AsyncStorage.getItem('@adama_onboarding_seen');

            if (!hasSeenOnboarding) {
                // First time user - show onboarding
                router.replace('/onboarding');
            } else {
                // Check if user is logged in
                const token = await AsyncStorage.getItem('@auth_token');
                const guestFlag = await AsyncStorage.getItem('@auth_is_guest');

                if (token || guestFlag === 'true') {
                    // User is logged in or guest - go to tabs
                    router.replace('/(tabs)');
                } else {
                    // User needs to login
                    router.replace('/(auth)/login');
                }
            }
        } catch (error) {
            console.error('Error checking initial route:', error);
            // Default to login on error
            router.replace('/(auth)/login');
        }
    };

    // Show loading screen while checking
    return <LoadingScreen />;
}
