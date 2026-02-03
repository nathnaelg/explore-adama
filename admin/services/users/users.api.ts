
import { coreClient } from '../api/clients/core.client';
import { User } from '../../types';

export const usersApi = {
  getAll: (params?: any) => coreClient.get<{ data: User[] }>('/users', { params }),
  
  getById: (id: string) => coreClient.get<User>(`/users/${id}`),
  
  create: (data: any) => coreClient.post<User>('/auth/register', data),
  
  update: (id: string, data: any) => coreClient.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => coreClient.delete(`/users/${id}`),
  
  updateProfile: (data: any) => coreClient.put<{ profile: any }>('/users/profile', data),
  
  uploadAvatar: (formData: FormData) => 
    coreClient.post<{ message: string; profile: any }>('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  changePassword: (data: any) => coreClient.put('/users/change-password', data)
};
