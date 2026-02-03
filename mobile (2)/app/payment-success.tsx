
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export default function PaymentSuccessScreen() {
    const { t } = useTranslation();
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');

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
                    {t('payment.successMessage', 'Your booking has been confirmed.')}
                </ThemedText>

                {/*<View style={styles.instructionContainer}>
                    <ThemedText style={[styles.instructionText, { color: text }]}>
                        {t('payment.tapDone', 'Please tap "Done" in the top-left corner to return to the app.')}
                    </ThemedText>
                </View>*/}
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
    instructionContainer: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
    },
    instructionText: {
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
});
