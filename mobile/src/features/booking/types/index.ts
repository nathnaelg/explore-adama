import { Media, Place } from '../../explore/types';

export interface Event {
    id: string;
    title: string;
    description?: string;
    placeId?: string;
    place?: Place;
    categoryId?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    capacity?: number;
    price: number;
    images: Media[];
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    quantity: number;
    total: number;
    status: string;
    createdAt: string;
    event?: Event;
}

export interface Ticket {
    id: string;
    qrToken: string;
    status: string;
    eventId: string;
    event?: Event;
}

export interface InitiateBookingDto {
    eventId: string;
    quantity: number;
}

export interface BookingResponse {
    message: string;
    booking: Booking;
    checkoutUrl?: string;
}

export interface EventQueryParams {
    page?: number;
    perPage?: number;
    q?: string;
    placeId?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface CreateEventDto {
    title: string;
    description?: string;
    placeId?: string;
    categoryId?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    capacity?: number;
    price?: number;
}
