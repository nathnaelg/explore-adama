
import axios from 'axios';
import { API_CONFIG } from '../api.config';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { createErrorInterceptor } from '../interceptors/error.interceptor';

export const coreClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: API_CONFIG.TIMEOUT,
});

// Apply Interceptors
coreClient.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
coreClient.interceptors.response.use(
  (response) => response,
  createErrorInterceptor(coreClient)
);

// Helper to unwrap response data matches the old api.get behavior
export const apiRequest = async <T>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: any, config = {}) => {
    const response = await coreClient.request<T>({
        method,
        url,
        data,
        ...config
    });
    return response.data;
};
