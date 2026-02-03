import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Helper to check if we can use SecureStore
const isSecureStoreAvailable = Platform.OS !== 'web';

export const secureStorage = {
    getToken: async (): Promise<string | null> => {
        try {
            if (isSecureStoreAvailable) {
                return await SecureStore.getItemAsync(TOKEN_KEY);
            }
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.warn('Error getting token:', error);
            return null;
        }
    },

    setToken: async (token: string): Promise<void> => {
        try {
            if (isSecureStoreAvailable) {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            } else {
                await AsyncStorage.setItem(TOKEN_KEY, token);
            }
        } catch (error) {
            console.warn('Error setting token:', error);
        }
    },

    removeToken: async (): Promise<void> => {
        try {
            if (isSecureStoreAvailable) {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            } else {
                await AsyncStorage.removeItem(TOKEN_KEY);
            }
        } catch (error) {
            console.warn('Error removing token:', error);
        }
    },

    getRefreshToken: async (): Promise<string | null> => {
        try {
            if (isSecureStoreAvailable) {
                return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            }
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.warn('Error getting refresh token:', error);
            return null;
        }
    },

    setRefreshToken: async (token: string): Promise<void> => {
        try {
            if (isSecureStoreAvailable) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
            } else {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
            }
        } catch (error) {
            console.warn('Error setting refresh token:', error);
        }
    },

    removeRefreshToken: async (): Promise<void> => {
        try {
            if (isSecureStoreAvailable) {
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            } else {
                await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
            }
        } catch (error) {
            console.warn('Error removing refresh token:', error);
        }
    },

    // Clear all auth tokens
    clearAuth: async (): Promise<void> => {
        await Promise.all([
            secureStorage.removeToken(),
            secureStorage.removeRefreshToken()
        ]);
    }
};
