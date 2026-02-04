import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';

export const useTicketsForBooking = (bookingId: string) => {
    return useQuery({
        queryKey: ['tickets', 'booking', bookingId],
        queryFn: () => bookingService.getTicketsForBooking(bookingId),
        enabled: !!bookingId,
    });
};
