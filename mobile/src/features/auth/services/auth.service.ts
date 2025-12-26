import { apiClient } from "@/src/core/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, LoginDto, RegisterDto, ResetPasswordDto, SocialLoginDto } from "../types";

// Storage Keys (In sync with src/core/api/client.ts and BootScreen.tsx)
const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const USER_KEY = '@auth_user';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/login", data);
    await AsyncStorage.setItem(TOKEN_KEY, res.data.accessToken);
    if (res.data.refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return res.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/register", data);
    await AsyncStorage.setItem(TOKEN_KEY, res.data.accessToken);
    if (res.data.refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return res.data;
  },

  initializeAuth: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
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
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    }
  },

  socialLogin: async (data: SocialLoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/social", data);
    await AsyncStorage.setItem(TOKEN_KEY, res.data.accessToken);
    if (res.data.refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return res.data;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  revokeAllSessions: async () => {
    await apiClient.post("/auth/revoke-all");
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  },

  forgotPassword: async (data: { email: string }): Promise<void> => {
    await apiClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await apiClient.post("/auth/reset-password", data);
  },
};
