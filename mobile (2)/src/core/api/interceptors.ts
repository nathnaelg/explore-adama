import { apiClient } from "./client";
import { tokenStore } from "@/src/core/auth/token.store";

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStore.access();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  async error => {
    if (error.response?.status === 401) {
      await tokenStore.clear();
    }
    return Promise.reject(error);
  }
);
