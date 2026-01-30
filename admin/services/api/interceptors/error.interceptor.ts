
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthService } from '../../auth/auth.service';
import { API_CONFIG } from '../api.config';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const createErrorInterceptor = (axiosInstance: AxiosInstance) => {
  return async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Prevent infinite loops on auth endpoints
    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = AuthService.getRefreshToken();

      if (!refreshToken) {
          AuthService.triggerAuthError();
          return Promise.reject(error);
      }

      try {
        // Create a standalone instance for refresh to avoid interceptor cycles
        const refreshResponse = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken
        });

        const { accessToken } = refreshResponse.data;
        
        AuthService.setToken(accessToken);
        
        // Update headers for the retry
        if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        
        processQueue(null, accessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        AuthService.triggerAuthError();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  };
};
