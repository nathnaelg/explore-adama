import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useCancelBooking, useMyBookings } from '@/src/features/booking/hooks/useBooking';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { BookingHistorySkeleton } from '../components/BookingSkeleton';

export default function BookingHistoryScreen() {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const { data: bookingsData, isLoading, error, refetch } = useMyBookings();
    const { mutate: cancelBooking } = useCancelBooking();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'PENDING', label: 'Pending' },
        { id: 'CONFIRMED', label: 'Confirmed' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' },
    ];

    const bookings = useMemo(() => bookingsData?.data || [], [bookingsData]);

    const filteredBookings = useMemo(() => {
        if (selectedFilter === 'all') return bookings;
        return bookings.filter(b => b.status === selectedFilter);
    }, [bookings, selectedFilter]);

    const stats = useMemo(() => {
        const upcoming = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
        const totalSpent = bookings.reduce((acc, b) => acc + (b.total || 0), 0);
        return {
            total: bookings.length,
            upcoming,
            spent: totalSpent,
        };
    }, [bookings]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return '#4CAF50';
            case 'PENDING': return '#2196F3';
            case 'COMPLETED': return '#9E9E9E';
            case 'CANCELLED': return '#FF3B30';
            default: return muted;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'Confirmed';
            case 'PENDING': return 'Pending';
            case 'COMPLETED': return 'Completed';
            case 'CANCELLED': return 'Cancelled';
            default: return status;
        }
    };

    const { isGuest } = useAuth();

    if (isGuest) {
        return (
            <ThemedView style={[styles.container, { backgroundColor: bg }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.guestState}>
                    <View style={[styles.guestIconCircle, { backgroundColor: primary + '15' }]}>
                        <Ionicons name="calendar-outline" size={60} color={primary} />
                    </View>
                    <ThemedText type="title" style={styles.guestTitle}>Your Bookings</ThemedText>
                    <ThemedText style={[styles.guestSubtitle, { color: muted }]}>
                        Sign in to manage your bookings, view tickets, and revisit your travel history.
                    </ThemedText>
                    <TouchableOpacity
                        style={[styles.signInButton, { backgroundColor: primary }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <ThemedText style={styles.signInButtonText}>Sign In / Register</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    if (isLoading) {
        return <BookingHistorySkeleton />;
    }

    if (error) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: bg }]}>
                <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
                <ThemedText type="title" style={{ marginTop: 16 }}>Something went wrong</ThemedText>
                <ThemedText style={{ textAlign: 'center', marginTop: 8, color: muted }}>
                    {(error as any)?.response?.data?.message || error.message || 'Failed to fetch bookings.'}
                </ThemedText>
                <TouchableOpacity style={[styles.filterButton, { marginTop: 20, backgroundColor: primary }]} onPress={() => refetch()}>
                    <ThemedText style={{ color: 'white' }}>Retry</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Booking History
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {filters.map((filter) => {
                        const active = selectedFilter === filter.id;
                        return (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.filterButton,
                                    { backgroundColor: active ? primary : card },
                                ]}
                                onPress={() => setSelectedFilter(filter.id)}
                            >
                                <ThemedText
                                    type="default"
                                    style={[
                                        styles.filterText,
                                        { color: active ? 'white' : muted }
                                    ]}
                                >
                                    {filter.label}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Booking Stats */}
                <View style={[styles.statsContainer, { backgroundColor: card }]}>
                    <View style={styles.statItem}>
                        <ThemedText type="title" style={[styles.statNumber, { color: text }]}>
                            {stats.total}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.statLabel, { color: muted }]}>
                            Total Bookings
                        </ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <ThemedText type="title" style={[styles.statNumber, { color: text }]}>
                            {stats.upcoming}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.statLabel, { color: muted }]}>
                            Upcoming
                        </ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <ThemedText type="title" style={[styles.statNumber, { fontSize: 16, color: text }]}>
                            ETB {stats.spent.toLocaleString()}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.statLabel, { color: muted }]}>
                            Total Spent
                        </ThemedText>
                    </View>
                </View>

                {/* Bookings List */}
                <View style={styles.bookingsList}>
                    {filteredBookings.length === 0 ? (
                        <ThemedText style={{ textAlign: 'center', marginTop: 40, color: muted }}>
                            No bookings found.
                        </ThemedText>
                    ) : (
                        filteredBookings.map((booking) => (
                            <TouchableOpacity
                                key={booking.id}
                                style={[styles.bookingCard, { backgroundColor: card, shadowColor: 'transparent' }]} // Removed shadow for better dark mode, relying on card color diff
                                onPress={() => router.push(`/bookings/${booking.id}` as any)}
                            >
                                <View style={styles.bookingHeader}>
                                    <View style={[styles.bookingType, { backgroundColor: `${primary}20` }]}>
                                        <Ionicons name="calendar-outline" size={20} color={primary} />
                                    </View>
                                    <View style={styles.bookingInfo}>
                                        <ThemedText type="default" style={styles.bookingTitle} numberOfLines={1}>
                                            {booking.event?.title || 'Unknown Event'}
                                        </ThemedText>
                                        <View style={styles.bookingMeta}>
                                            <Ionicons name="calendar-outline" size={14} color={muted} />
                                            <ThemedText type="default" style={[styles.bookingMetaText, { color: muted }]}>
                                                {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.status)}20` }]}>
                                        <ThemedText type="default" style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                                            {getStatusText(booking.status)}
                                        </ThemedText>
                                    </View>
                                </View>

                                <View style={styles.bookingFooter}>
                                    <View style={styles.priceContainer}>
                                        <ThemedText type="default" style={[styles.priceLabel, { color: muted }]}>
                                            Total Price
                                        </ThemedText>
                                        <ThemedText type="title" style={[styles.price, { color: primary }]}>
                                            ETB {booking.total?.toLocaleString()}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.detailsContainer}>
                                        <View style={styles.detailItem}>
                                            <Ionicons name="ticket-outline" size={16} color={muted} />
                                            <ThemedText type="default" style={[styles.detailText, { color: muted }]}>
                                                {booking.quantity} tickets
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.actionButtons}>
                                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.viewButton, { backgroundColor: `${primary}10`, borderColor: primary }]}
                                                onPress={() => router.push(`/bookings/${booking.id}` as any)}
                                            >
                                                <ThemedText type="default" style={[styles.viewButtonText, { color: primary }]}>
                                                    View Details
                                                </ThemedText>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={() => cancelBooking(booking.id)}
                                            >
                                                <ThemedText type="default" style={styles.cancelButtonText}>
                                                    Cancel
                                                </ThemedText>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                    {booking.status === 'COMPLETED' && (
                                        <TouchableOpacity
                                            style={styles.reviewButton}
                                            onPress={() => router.push('/reviews/add' as any)}
                                        >
                                            <Ionicons name="star-outline" size={16} color="#FFD700" />
                                            <ThemedText type="default" style={styles.reviewButtonText}>
                                                Write Review
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    filtersContainer: {
        marginBottom: 24,
    },
    filtersContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    activeFilter: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeFilterText: {
        color: 'white',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#F5F5F5',
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    bookingsList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    bookingHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bookingType: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    bookingInfo: {
        flex: 1,
    },
    bookingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bookingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bookingMetaText: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    priceContainer: {
        alignItems: 'flex-start',
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    detailsContainer: {
        alignItems: 'flex-end',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    viewButton: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    viewButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FFEBEE',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
    reviewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFF9E6',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    reviewButtonText: {
        color: '#FF9800',
        fontSize: 14,
        fontWeight: '600',
    },
    guestState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingBottom: 80,
    },
    guestIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    signInButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
