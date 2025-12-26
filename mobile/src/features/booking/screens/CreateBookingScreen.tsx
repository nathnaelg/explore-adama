import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { CreateBookingSkeleton, EventsListSkeleton } from '@/src/features/booking/components/BookingSkeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEvent, useEvents, useInitiateBooking } from '../hooks/useBooking';
import { Event } from '../types';

export default function CreateBookingScreen() {
    const { eventId, placeId } = useLocalSearchParams<{ eventId?: string; placeId?: string }>();

    // Case 1: Booking a specific event
    const { data: singleEvent, isLoading: eventLoading } = useEvent(eventId || '');

    // Case 2: Looking for events at a place
    const { data: placeEventsData, isLoading: listLoading } = useEvents({
        placeId: !eventId && placeId ? placeId : undefined
    });

    const { mutate: initiateBooking, isPending: isBooking } = useInitiateBooking();

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [ticketCount, setTicketCount] = useState(1);

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    // Effect to set selected event automatically
    useEffect(() => {
        if (singleEvent) {
            setSelectedEvent(singleEvent);
        } else if (placeEventsData?.data && placeEventsData.data.length === 1) {
            setSelectedEvent(placeEventsData.data[0]);
        }
    }, [singleEvent, placeEventsData]);

    const handleConfirmBooking = () => {
        if (!selectedEvent) return;

        initiateBooking({
            eventId: selectedEvent.id,
            quantity: ticketCount,
        }, {
            onSuccess: (response) => {
                router.push({
                    pathname: '/bookings/new/payment',
                    params: { bookingId: response.booking.id }
                } as any);
            }
        });
    };

    const isLoading = eventLoading || (placeId && !eventId && listLoading);

    if (isLoading) {
        if (!eventId && placeId) {
            return <EventsListSkeleton />;
        }
        return <CreateBookingSkeleton />;
    }

    // Step 1: No Event Selected yet (Show list if multiple)
    if (!selectedEvent) {
        if (!eventId && placeId && placeEventsData?.data && placeEventsData.data.length > 0) {
            return (
                <ThemedView style={[styles.container, { backgroundColor: bg }]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={text} />
                        </TouchableOpacity>
                        <ThemedText type="title" style={styles.title}>Select Event</ThemedText>
                        <View style={{ width: 24 }} />
                    </View>
                    <ScrollView contentContainerStyle={styles.listContent}>
                        {placeEventsData.data.map((evt) => (
                            <TouchableOpacity
                                key={evt.id}
                                style={[styles.eventCard, { backgroundColor: card }]}
                                onPress={() => setSelectedEvent(evt)}
                            >
                                <ThemedText style={styles.eventCardTitle}>{evt.title}</ThemedText>
                                <View style={styles.row}>
                                    <Ionicons name="calendar-outline" size={16} color={muted} />
                                    <ThemedText style={{ color: muted }}>
                                        {new Date(evt.date).toLocaleDateString()}
                                    </ThemedText>
                                </View>
                                <ThemedText style={{ color: primary, fontWeight: 'bold', marginTop: 8 }}>
                                    ETB {evt.price?.toLocaleString()}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </ThemedView>
            );
        }

        // Error / No events found
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: bg }]}>
                <Ionicons name="calendar-outline" size={60} color={muted} />
                <ThemedText type="title" style={{ marginTop: 16, textAlign: 'center' }}>
                    {placeId ? 'No Available Bookings' : 'Event Not Found'}
                </ThemedText>
                <ThemedText style={{ color: muted, textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
                    {placeId
                        ? 'There are no upcoming events or booking slots available for this place right now.'
                        : 'The event you are looking for does not exist.'
                    }
                </ThemedText>
                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: primary, paddingHorizontal: 32 }]}
                    onPress={() => router.back()}
                >
                    <ThemedText style={{ color: 'white' }}>Go Back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const totalPrice = (selectedEvent.price || 0) * ticketCount;

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Select Tickets
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Event Summary */}
                <View style={[styles.banner, { backgroundColor: primary }]}>
                    <ThemedText type="title" style={styles.eventTitle}>
                        {selectedEvent.title}
                    </ThemedText>
                    <View style={styles.row}>
                        <Ionicons name="calendar-outline" size={16} color="white" />
                        <ThemedText style={{ color: 'white' }}>
                            {new Date(selectedEvent.date).toLocaleDateString()}
                        </ThemedText>
                    </View>
                </View>

                {/* Ticket Selection */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Standard Admission
                    </ThemedText>
                    <ThemedText style={{ color: muted, marginBottom: 12 }}>
                        Access to all main event areas and standard amenities.
                    </ThemedText>
                    <View style={[styles.priceRow, { backgroundColor: card }]}>
                        <ThemedText type="title" style={{ color: primary }}>
                            ETB {selectedEvent.price?.toLocaleString()}
                        </ThemedText>
                        <View style={styles.ticketCounter}>
                            <TouchableOpacity
                                style={[styles.counterButton, { backgroundColor: bg }]}
                                onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
                            >
                                <Ionicons name="remove" size={20} color={text} />
                            </TouchableOpacity>
                            <ThemedText type="title" style={styles.ticketCount}>
                                {ticketCount}
                            </ThemedText>
                            <TouchableOpacity
                                style={[styles.counterButton, { backgroundColor: bg }]}
                                onPress={() => setTicketCount(ticketCount + 1)}
                            >
                                <Ionicons name="add" size={20} color={text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Total Price Card */}
                <View style={[styles.totalContainer, { backgroundColor: card }]}>
                    <ThemedText type="subtitle" style={[styles.totalLabel, { color: muted }]}>
                        TOTAL PRICE
                    </ThemedText>
                    <ThemedText type="title" style={[styles.totalPrice, { color: primary }]}>
                        ETB {totalPrice.toLocaleString()}.00
                    </ThemedText>
                    <ThemedText style={{ color: muted, marginTop: 4 }}>
                        {ticketCount} tickets included
                    </ThemedText>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: primary }]}
                    onPress={handleConfirmBooking}
                    disabled={isBooking}
                >
                    {isBooking ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText type="default" style={styles.payButtonText}>
                            Confirm Booking →
                        </ThemedText>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    title: { fontSize: 20, fontWeight: 'bold' },
    banner: { padding: 20, marginHorizontal: 20, borderRadius: 16, marginBottom: 24, gap: 8 },
    eventTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16
    },
    ticketCounter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    counterButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    ticketCount: { fontSize: 20, fontWeight: 'bold', minWidth: 30, textAlign: 'center' },
    totalContainer: { marginHorizontal: 20, marginVertical: 24, padding: 24, borderRadius: 20, alignItems: 'center' },
    totalLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
    totalPrice: { fontSize: 32, fontWeight: 'bold' },
    payButton: {
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center'
    },
    payButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
    listContent: { padding: 20, gap: 16 },
    eventCard: { padding: 16, borderRadius: 16, gap: 8 },
    eventCardTitle: { fontSize: 18, fontWeight: 'bold' },
});
