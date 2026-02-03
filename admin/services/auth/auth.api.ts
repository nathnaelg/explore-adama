import { coreClient } from '../api/clients/core.client';
import { User } from '../../types';

export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    coreClient.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', credentials),
  
  refresh: (refreshToken: string) => 
    coreClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),
  
  logout: () => 
    coreClient.post('/auth/logout'),
  
  revokeSessions: () => 
    coreClient.post('/auth/revoke-sessions'),

  requestPasswordReset: (email: string) =>
    coreClient.post('/auth/forgot-password', { email }),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    coreClient.post('/auth/reset-password', data)
};