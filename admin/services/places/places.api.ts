
import { coreClient } from '../api/clients/core.client';
import { Place } from '../../types';

export const placesApi = {
  getAll: (params?: any) => coreClient.get<{ data: Place[] }>('/places', { params }),
  
  getById: (id: string) => coreClient.get<Place>(`/places/${id}`),
  
  create: (data: any) => coreClient.post<{ id: string }>('/places', data),
  
  update: (id: string, data: any) => coreClient.put<Place>(`/places/${id}`, data),
  
  delete: (id: string) => coreClient.delete(`/places/${id}`),
  
  uploadImage: (id: string, formData: FormData) => 
    coreClient.post<{ url: string }>(`/places/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};
