
import { coreClient } from '../api/clients/core.client';
import { BlogPost } from '../../types';

export const blogApi = {
  getAll: (params?: any) => coreClient.get<{ items: BlogPost[] }>('/blog', { params }),
  
  getById: (id: string) => coreClient.get<BlogPost>(`/blog/${id}`),
  
  create: (data: any) => coreClient.post('/blog', data),
  
  update: (id: string, data: any) => coreClient.patch<BlogPost>(`/blog/${id}`, data),
  
  delete: (id: string) => coreClient.delete(`/blog/${id}`),
  
  moderate: (id: string, action: string, reason: string) => 
    coreClient.post(`/blog/${id}/moderate`, { action, reason }),
    
  uploadMedia: (id: string, formData: FormData) => 
    coreClient.post(`/blog/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  deleteComment: (id: string) => coreClient.delete(`/blog/comments/${id}`)
};
