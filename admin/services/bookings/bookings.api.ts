
import { coreClient } from '../api/clients/core.client';
import { Booking } from '../../types';

export const bookingsApi = {
  getAll: (params?: any) => coreClient.get<{ data: Booking[] }>('/bookings', { params }),
  
  getById: (id: string) => coreClient.get<Booking>(`/bookings/${id}`),
  
  cancel: (id: string) => coreClient.post(`/bookings/${id}/cancel`)
};
