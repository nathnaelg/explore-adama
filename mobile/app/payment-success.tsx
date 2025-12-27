
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PaymentSuccessScreen() {
    const { t } = useTranslation();
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');

    const handleViewBookings = () => {
        router.replace('/bookings/history');
    };

    const handleGoHome = () => {
        router.replace('/(tabs)/');
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.content, { backgroundColor: card }]}>
                <View style={[styles.iconContainer, { backgroundColor: primary + '20' }]}>
                    <Ionicons name="checkmark-circle" size={80} color={primary} />
                </View>

                <ThemedText type="title" style={styles.title}>
                    {t('payment.successTitle', 'Payment Successful!')}
                </ThemedText>

                <ThemedText type="default" style={[styles.message, { color: muted }]}>
                    {t('payment.successMessage', 'Your booking has been confirmed. You can now view your tickets.')}
                </ThemedText>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: primary }]}
                        onPress={handleViewBookings}
                    >
                        <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                            {t('payment.viewBookings', 'View My Bookings')}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.outlineButton, { borderColor: muted }]}
                        onPress={handleGoHome}
                    >
                        <ThemedText style={{ color: text }}>
                            {t('common.goHome', 'Go Home')}
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
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 16,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    outlineButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});
