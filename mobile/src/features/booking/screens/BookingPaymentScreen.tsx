import { LoadingScreen } from '@/src/components/feedback/LoadingScreen';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { paymentService } from '@/src/features/payments/services/payment.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useBooking } from '../hooks/useBooking';

export default function BookingPaymentScreen() {
    const { t } = useTranslation();
    const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
    const { data: booking, isLoading } = useBooking(bookingId || '');
    const { user } = useAuth();

    const [selectedMethod, setSelectedMethod] = useState('chapa');
    const [isProcessing, setIsProcessing] = useState(false);

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const tint = useThemeColor({}, 'tint');

    const paymentMethods = [
        {
            id: 'chapa',
            name: t('payment.chapaName'),
            description: t('payment.chapaDesc'),
            icon: 'card-outline',
            recommended: true,
        }
    ];

    const handleConfirmPayment = async () => {
        if (!booking || !user) return;

        if (selectedMethod !== 'chapa') {
            Alert.alert(t('payment.comingSoon'), t('payment.onlyChapaSupported'));
            return;
        }

        try {
            setIsProcessing(true);
            const response = await paymentService.initPayment({
                bookingId: booking.id,
                amount: booking.total || 0,
                userId: user.id
            });

            if (response.checkoutUrl) {
                const result = await WebBrowser.openBrowserAsync(response.checkoutUrl);

                // When browser closes, automatically try to verify
                await checkPaymentStatus(response.txRef || response.providerData?.tx_ref);
            } else {
                Alert.alert(t('common.error'), t('payment.couldNotInit'));
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            Alert.alert(t('payment.paymentFailed'), error?.message || t('payment.couldNotInit'));
        } finally {
            setIsProcessing(false);
        }
    };

    const checkPaymentStatus = async (txRef?: string) => {
        if (!txRef) {
            Alert.alert(t('payment.verification'), t('payment.verifyFailedMsg'));
            router.replace('/bookings');
            return;
        }

        setIsProcessing(true);
        try {
            const verifyResponse = await paymentService.verifyPayment(txRef);

            if (verifyResponse.status === 'success') {
                if (booking?.id) {
                    router.replace({
                        pathname: '/bookings/new/success',
                        params: { bookingId: booking.id }
                    } as any);
                } else {
                    router.replace('/bookings');
                }
            } else {
                Alert.alert(
                    t('payment.notVerified'),
                    t('payment.notVerifiedMsg'),
                    [
                        { text: t('payment.tryAgain'), onPress: () => checkPaymentStatus(txRef) },
                        { text: t('payment.later'), onPress: () => router.replace('/bookings') }
                    ]
                );
            }
        } catch (error) {
            console.error("Verify Error", error);
            Alert.alert(t('payment.verification') + " " + t('common.error'), t('payment.verifyFailedMsg'));
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading || !booking) {
        return <LoadingScreen message={t('common.loading')} />;
    }

    const tourName = booking.event?.title || t('profile.bookings');
    const date = booking.event?.date ? new Date(booking.event.date).toLocaleDateString() + ' • ' + new Date(booking.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Date N/A';
    const price = booking.total || 0;
    const serviceFee = 0;
    const total = price + serviceFee;

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        {t('payment.confirmBooking')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Booking Summary */}
                <View style={[styles.bookingCard, { backgroundColor: primary }]}>
                    <ThemedText type="title" style={styles.bookingTitle}>
                        {tourName}
                    </ThemedText>
                    <ThemedText type="default" style={styles.bookingDate}>
                        {date}
                    </ThemedText>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                        {t('payment.paymentSummary')}
                    </ThemedText>
                    <View style={styles.summaryRow}>
                        <ThemedText type="default" style={[styles.summaryLabel, { color: muted }]}>
                            {t('payment.subtotal')}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.summaryValue, { color: text }]}>
                            ETB {price.toLocaleString()}
                        </ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                        <ThemedText type="default" style={[styles.summaryLabel, { color: muted }]}>
                            {t('payment.serviceFee')}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.summaryValue, { color: text }]}>
                            ETB {serviceFee}
                        </ThemedText>
                    </View>
                    <View style={[styles.divider, { backgroundColor: muted }]} />
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <ThemedText type="title" style={styles.totalLabel}>
                            {t('payment.totalAmount')}
                        </ThemedText>
                        <ThemedText type="title" style={[styles.totalValue, { color: primary }]}>
                            ETB {total.toLocaleString()}
                        </ThemedText>
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                        {t('payment.paymentMethod')}
                    </ThemedText>
                    <View style={styles.methodsContainer}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.methodCard,
                                    { backgroundColor: card, borderColor: selectedMethod === method.id ? primary : 'transparent' },
                                    selectedMethod === method.id && { backgroundColor: `${primary}10` } // 10% opacity primary
                                ]}
                                onPress={() => setSelectedMethod(method.id)}
                            >
                                <View style={styles.methodHeader}>
                                    <View style={styles.methodInfo}>
                                        <Ionicons
                                            name={method.icon as any}
                                            size={24}
                                            color={selectedMethod === method.id ? primary : muted}
                                        />
                                        <View>
                                            <ThemedText type="default" style={[styles.methodName, { color: text }]}>
                                                {method.name}
                                            </ThemedText>
                                            <ThemedText type="default" style={[styles.methodDescription, { color: muted }]}>
                                                {method.description}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                                {selectedMethod === method.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Confirm Payment Button */}
                <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: primary }, isProcessing && { opacity: 0.7 }]}
                    onPress={handleConfirmPayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText type="default" style={styles.confirmButtonText}>
                            {t('payment.confirmPayment')}
                        </ThemedText>
                    )}
                </TouchableOpacity>
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
    bookingCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
    },
    bookingTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bookingDate: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: 16,
    },
    totalRow: {
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    methodsContainer: {
        gap: 12,
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    selectedMethod: {
    },
    methodHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 12,
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    methodDescription: {
        fontSize: 14,
    },
    recommendedBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    recommendedText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    confirmButton: {
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
