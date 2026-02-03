// /home/natye/smart-tourism/src/core/api/client.ts
import { env } from "@/src/config/env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { secureStorage } from "../storage/secure-storage";

if (!env.API_URL) {
  throw new Error("API_URL is missing. Check EXPO_PUBLIC_API_URL");
}

// Storage Keys
const USER_KEY = '@auth_user';

// Logout Callback Handle
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Refresh Lock variables
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Create axios instance
export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding token for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/');

    if (!isAuthEndpoint) {
      try {
        const token = await secureStorage.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
          console.log(`[Auth] Attached token: ${token.substring(0, 15)}...`);
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log('[API Headers]', JSON.stringify(config.headers, null, 2));

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors (401/403)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    if (response.data) {
      // Log logic to avoid spamming huge payloads, but show structure
      const isArray = Array.isArray(response.data);
      const hasDataProp = response.data && typeof response.data === 'object' && 'data' in response.data;
      console.log(`[API payload info] IsArray: ${isArray}, HasDataProp: ${hasDataProp}, Keys: ${Object.keys(response.data)}`);
      // console.log('[API Data]', JSON.stringify(response.data, null, 2)); // Uncomment for full details
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Enhanced logging for 403 errors
    if (status === 403) {
      console.error('=== 403 FORBIDDEN ERROR ===');
      console.error('URL:', url);
      console.error('Method:', error.config?.method?.toUpperCase());
      console.error('Headers:', JSON.stringify(error.config?.headers, null, 2));
      console.error('Response:', JSON.stringify(error.response?.data, null, 2));
      console.error('========================');
    } else {
      console.warn(`[API Response Error] ${status} ${url}`, error.response?.data);
    }

    const originalRequest = error.config || {};

    // Treat 403 the same as 401 for expired/invalid token flows
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // Don't retry auth endpoints (login, register, etc) on 401
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          // If already refreshing, wait for the promise and then retry
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          const refreshToken = await secureStorage.getRefreshToken();
          if (!refreshToken) {
            console.warn('[Auth] No refresh token found, aborting refresh');
            throw new Error('No refresh token');
          }

          const response = await axios.post(`${env.API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          if (!accessToken) throw new Error('No access token in response');

          await secureStorage.setToken(accessToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return accessToken;
        } finally {
          isRefreshing = false;
          refreshPromise = null; // Clear promise so next retry starts fresh if needed
        }
      })();

      try {
        const accessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Only log as error if it's not a missing token (which is expected on expiry)
        if (refreshError.message === 'No refresh token' || refreshError.message === 'No access token') {
          console.warn('[Auth] Session expired (no refresh token), logging out.');
        } else {
          console.error('Token refresh failed:', refreshError);
        }

        // Clean up and logout
        await secureStorage.clearAuth();
        await AsyncStorage.removeItem(USER_KEY);
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);