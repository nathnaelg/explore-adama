
import { coreClient } from '../api/clients/core.client';
import { Event } from '../../types';

export const eventsApi = {
  getAll: (params?: any) => coreClient.get<{ data: Event[] }>('/events', { params }),
  
  getById: (id: string) => coreClient.get<Event>(`/events/${id}`),
  
  create: (data: any) => coreClient.post<{ id: string }>('/events', data),
  
  update: (id: string, data: any) => coreClient.put<Event>(`/events/${id}`, data),
  
  delete: (id: string) => coreClient.delete(`/events/${id}`),
  
  uploadImage: (id: string, formData: FormData) => 
    coreClient.post<{ data: any[] }>(`/events/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};
