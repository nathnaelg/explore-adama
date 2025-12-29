import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { EventQueryParams, InitiateBookingDto } from '../types';

export const useEvents = (params: EventQueryParams = {}) => {
    return useQuery({
        queryKey: ['events', params],
        queryFn: () => bookingService.listEvents(params),
        refetchInterval: 1000,
    });
};

export const useEvent = (id: string) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => bookingService.getEventById(id),
        enabled: !!id,
        refetchInterval: 1000,
    });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: () => bookingService.listBookings(),
        refetchInterval: 1000,
    });
};

export const useNearbyEvents = (lat: number, lng: number, radius?: number) => {
    return useQuery({
        queryKey: ['events', 'nearby', { lat, lng, radius }],
        queryFn: () => bookingService.getNearbyEvents(lat, lng, radius),
        enabled: !!lat && !!lng,
        refetchInterval: 1000,
    });
};

export const useInitiateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InitiateBookingDto) => bookingService.initiateBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingService.getBookingById(id),
        enabled: !!id,
        refetchInterval: 1000,
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingService.cancelBooking(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
        },
    });
};

export const useTicket = (id: string) => {
    return useQuery({
        queryKey: ['ticket', id],
        queryFn: () => bookingService.getTicketById(id),
        enabled: !!id,
        refetchInterval: 1000,
    });
};
