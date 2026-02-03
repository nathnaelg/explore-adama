import { coreClient } from '../api/clients/core.client';
import { Ticket } from '../../types';

export interface TicketValidateResponse {
  message: string;
  ticketId?: string;
  eventId?: string;
  userId?: string;
  status?: string;
}

export const ticketsApi = {
  getAll: (params?: any) => coreClient.get<{ data: any[] }>('/tickets', { params }),

  getById: (id: string) => coreClient.get<any>(`/tickets/${id}`),
  
  validate: (qrToken: string) => 
    coreClient.post<TicketValidateResponse>('/tickets/validate', { qrToken })
};