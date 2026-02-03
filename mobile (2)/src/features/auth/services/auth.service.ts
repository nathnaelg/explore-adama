import { apiClient } from "@/src/core/api/client";
import { secureStorage } from "@/src/core/storage/secure-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, LoginDto, RegisterDto, ResetPasswordDto } from "../types";

// Storage Keys (In sync with src/core/api/client.ts and BootScreen.tsx)
const USER_KEY = '@auth_user';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/login", data);
    await secureStorage.setToken(res.data.accessToken);
    if (res.data.refreshToken) {
      await secureStorage.setRefreshToken(res.data.refreshToken);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return res.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/register", data);
    await secureStorage.setToken(res.data.accessToken);
    if (res.data.refreshToken) {
      await secureStorage.setRefreshToken(res.data.refreshToken);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return res.data;
  },

  initializeAuth: async () => {
    const token = await secureStorage.getToken();
    const user = await AsyncStorage.getItem(USER_KEY);
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {
      console.warn('Logout request failed:', e);
    } finally {
      await secureStorage.clearAuth();
      await AsyncStorage.removeItem(USER_KEY);
    }
  },



  isAuthenticated: async (): Promise<boolean> => {
    const token = await secureStorage.getToken();
    return !!token;
  },

  revokeAllSessions: async () => {
    await apiClient.post("/auth/revoke-all");
    await secureStorage.clearAuth();
    await AsyncStorage.removeItem(USER_KEY);
  },

  forgotPassword: async (data: { email: string }): Promise<void> => {
    await apiClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await apiClient.post("/auth/reset-password", data);
  },
};
