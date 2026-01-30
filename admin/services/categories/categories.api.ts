
import { coreClient } from '../api/clients/core.client';
import { Category } from '../../types';

export const categoriesApi = {
  getAll: () => coreClient.get<{ data: Category[] } | Category[]>('/categories'),
  
  create: (data: any) => coreClient.post<Category>('/categories', data),
  
  update: (id: string, data: any) => coreClient.put<Category>(`/categories/${id}`, data),
  
  delete: (id: string) => coreClient.delete(`/categories/${id}`)
};
