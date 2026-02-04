import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import { useBooking } from '../hooks/useBooking';

export default function BookingSuccessScreen() {
    const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
    const { data: booking, isLoading } = useBooking(bookingId || '');

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    if (isLoading || !booking) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: bg }]}>
                <ActivityIndicator size="large" color={primary} />
            </ThemedView>
        );
    }

    const tourName = booking.event?.title || 'Event Booking';
    const date = booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'Confirmed';

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
                </View>

                <ThemedText type="title" style={styles.title}>
                    Payment Successful!
                </ThemedText>

                <ThemedText type="default" style={[styles.description, { color: muted }]}>
                    Your booking for {tourName} has been confirmed. You&apos;ll receive an email with all the details shortly.
                </ThemedText>

                <View style={[styles.bookingInfo, { backgroundColor: card }]}>
                    <ThemedText type="default" style={[styles.bookingLabel, { color: muted }]}>
                        Booking ID
                    </ThemedText>
                    <ThemedText type="title" style={[styles.bookingCode, { color: primary }]}>
                        #{booking.id.slice(0, 8).toUpperCase()}
                    </ThemedText>
                    <ThemedText type="default" style={[styles.bookingDate, { color: text }]}>
                        {date}
                    </ThemedText>


                    {/* QR Code */}
                    {booking?.tickets?.[0]?.qrToken && (
                        <View style={styles.qrContainer}>
                            <QRCodeStyled
                                data={booking.tickets[0].qrToken}
                                style={styles.qrCode}
                            />
                            <ThemedText type="default" style={[styles.qrLabel, { color: muted }]}>
                                Show this QR code at the venue
                            </ThemedText>
                        </View>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: primary }]}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <ThemedText type="default" style={styles.primaryButtonText}>
                            Go to Home
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: card }]}
                        onPress={() => router.push({ pathname: `/bookings/${booking.id}` } as any)}
                    >
                        <ThemedText type="default" style={[styles.secondaryButtonText, { color: text }]}>
                            View Booking
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    bookingInfo: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
    },
    bookingLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    bookingCode: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    bookingDate: {
        fontSize: 14,
    },
    qrContainer: {
        marginTop: 24,
        alignItems: 'center',
        gap: 12,
    },
    qrCode: {
        width: 200,
        height: 200,
    },
    qrLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
