import { apiClient } from '@/src/core/api/client';
import {
    Booking,
    BookingResponse,
    CreateEventDto,
    Event,
    EventQueryParams,
    InitiateBookingDto,
    Ticket
} from '../types';

export const bookingService = {
    // List events
    async listEvents(params: EventQueryParams = {}): Promise<{ data: Event[], total: number }> {
        const response = await apiClient.get('/events', { params });
        return response.data;
    },

    // Get event by ID
    async getEventById(id: string): Promise<Event> {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    // Get nearby events
    async getNearbyEvents(lat: number, lng: number, radius = 10): Promise<{ data: Event[] }> {
        const response = await apiClient.get('/events/nearby', {
            params: { lat, lng, radius }
        });
        return response.data;
    },

    // Bookings
    async initiateBooking(data: InitiateBookingDto): Promise<BookingResponse> {
        const response = await apiClient.post('/bookings/initiate', data);
        return response.data;
    },

    async getBookingById(id: string): Promise<Booking> {
        const response = await apiClient.get(`/bookings/${id}`);
        return response.data;
    },

    async cancelBooking(id: string): Promise<void> {
        await apiClient.post(`/bookings/${id}/cancel`);
    },

    // List user bookings
    async listBookings(): Promise<{ data: Booking[], total: number }> {
        try {
            const response = await apiClient.get('/bookings');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.warn('Bookings endpoint not found, returning empty list');
                return { data: [], total: 0 };
            }
            throw error;
        }
    },

    // Tickets
    async getTicketsForBooking(bookingId: string): Promise<{ data: Ticket[] }> {
        const response = await apiClient.get(`/bookings/${bookingId}/tickets`);
        return response.data;
    },

    async getTicketById(id: string): Promise<Ticket> {
        const response = await apiClient.get(`/tickets/${id}`);
        return response.data;
    },

    async getTicketQR(id: string): Promise<string> {
        // Returns binary/image, so we might need a different handling or just use the URL
        return `${apiClient.defaults.baseURL}/tickets/${id}/qr`;
    },

    async validateTicket(qrToken: string): Promise<void> {
        await apiClient.post('/tickets/validate', { qrToken });
    },

    // Admin: Create event
    async createEvent(data: CreateEventDto): Promise<Event> {
        const response = await apiClient.post('/events', data);
        return response.data;
    },

    // Admin: Update event
    async updateEvent(id: string, data: CreateEventDto): Promise<Event> {
        const response = await apiClient.put(`/events/${id}`, data);
        return response.data;
    },

    // Admin: Delete event
    async deleteEvent(id: string): Promise<void> {
        await apiClient.delete(`/events/${id}`);
    },

    // Admin: Upload event images
    async uploadEventImages(id: string, formData: FormData): Promise<void> {
        await apiClient.post(`/events/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
