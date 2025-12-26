import { LoadingScreen } from '@/src/components/feedback/LoadingScreen';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useBooking, useCancelBooking } from '../hooks/useBooking';

export default function BookingViewScreen() {
    const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
    const { data: booking, isLoading, error, refetch } = useBooking(bookingId);
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');

    const handleCancel = () => {
        if (bookingId) {
            cancelBooking(bookingId);
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Loading booking details..." />;
    }

    if (error || !booking) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: bg }]}>
                <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
                <ThemedText type="title" style={{ marginTop: 16 }}>Booking not found</ThemedText>
                <ThemedText style={{ textAlign: 'center', marginTop: 8, color: muted }}>
                    {(error as any)?.response?.data?.message || 'We could not find the booking details.'}
                </ThemedText>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: primary, marginTop: 20 }]}
                    onPress={() => refetch()}
                >
                    <ThemedText style={{ color: accent }}>Retry</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const { event } = booking;

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <ThemedText type="title" style={styles.title}>Booking Details</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Event Card */}
                <View style={[styles.card, { backgroundColor: card }]}>
                    <Image
                        source={{ uri: event?.images?.[0]?.url || 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d1' }}
                        style={styles.eventImage}
                    />
                    <View style={styles.cardBody}>
                        <ThemedText type="title" style={styles.eventTitle}>{event?.title}</ThemedText>
                        <View style={styles.row}>
                            <Ionicons name="calendar-outline" size={16} color={muted} />
                            <ThemedText style={{ color: muted }}>
                                {event?.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                            </ThemedText>
                        </View>
                        <View style={styles.row}>
                            <Ionicons name="location-outline" size={16} color={muted} />
                            <ThemedText style={{ color: muted }}>Adama, Ethiopia</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Booking Info */}
                <View style={[styles.section, { backgroundColor: card }]}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Order Summary</ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText style={{ color: muted }}>Status</ThemedText>
                        <View style={[styles.statusBadge, { backgroundColor: booking.status === 'CONFIRMED' ? '#4CAF5020' : '#2196F320' }]}>
                            <ThemedText style={{ color: booking.status === 'CONFIRMED' ? '#4CAF50' : '#2196F3', fontWeight: '700' }}>
                                {booking.status}
                            </ThemedText>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText style={{ color: muted }}>Quantity</ThemedText>
                        <ThemedText style={{ color: text, fontWeight: '600' }}>{booking.quantity} Tickets</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText style={{ color: muted }}>Total Paid</ThemedText>
                        <ThemedText style={{ color: primary, fontWeight: '700', fontSize: 18 }}>
                            ETB {booking.total?.toLocaleString()}
                        </ThemedText>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: '#FF3B30' }]}
                            onPress={handleCancel}
                            disabled={isCancelling}
                        >
                            {isCancelling ? (
                                <ActivityIndicator size="small" color="#FF3B30" />
                            ) : (
                                <ThemedText style={{ color: '#FF3B30', fontWeight: '600' }}>Cancel Booking</ThemedText>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
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
    scrollContent: { padding: 20, gap: 20 },
    card: { borderRadius: 20, overflow: 'hidden', elevation: 2 },
    eventImage: { height: 150, width: '100%' },
    cardBody: { padding: 16, gap: 8 },
    eventTitle: { fontSize: 20, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { padding: 20, borderRadius: 20, gap: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    actions: { marginTop: 20 },
    button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, alignItems: 'center' },
    cancelButton: { paddingVertical: 14, borderRadius: 15, alignItems: 'center', borderWidth: 1 },
});
