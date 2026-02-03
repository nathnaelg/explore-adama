
import { InternalAxiosRequestConfig } from 'axios';
import { AuthService } from '../../auth/auth.service';

export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = AuthService.getToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};
