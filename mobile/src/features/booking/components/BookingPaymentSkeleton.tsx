import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function BookingPaymentSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Skeleton width={24} height={24} borderRadius={12} />
                    <Skeleton width={180} height={24} borderRadius={4} />
                    <View style={{ width: 24 }} />
                </View>

                {/* Booking Summary Card */}
                <View style={[styles.bookingCard, { backgroundColor: primary + '20' }]}>
                    <Skeleton width="80%" height={28} borderRadius={4} style={{ marginBottom: 8 }} />
                    <Skeleton width="60%" height={20} borderRadius={4} />
                </View>

                {/* Payment Summary Section */}
                <View style={styles.section}>
                    <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: 20 }} />
                    <View style={styles.summaryRow}>
                        <Skeleton width={80} height={16} borderRadius={4} />
                        <Skeleton width={100} height={16} borderRadius={4} />
                    </View>
                    <View style={styles.summaryRow}>
                        <Skeleton width={90} height={16} borderRadius={4} />
                        <Skeleton width={80} height={16} borderRadius={4} />
                    </View>
                    <View style={[styles.divider, { backgroundColor: card }]} />
                    <View style={styles.summaryRow}>
                        <Skeleton width={120} height={24} borderRadius={4} />
                        <Skeleton width={120} height={28} borderRadius={4} />
                    </View>
                </View>

                {/* Payment Methods Section */}
                <View style={styles.section}>
                    <Skeleton width={140} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                    <View style={[styles.methodCard, { backgroundColor: card }]}>
                        <View style={styles.methodInfo}>
                            <Skeleton width={24} height={24} borderRadius={12} />
                            <View style={{ gap: 4 }}>
                                <Skeleton width={120} height={18} borderRadius={4} />
                                <Skeleton width={180} height={14} borderRadius={4} />
                            </View>
                        </View>
                        <Skeleton width={24} height={24} borderRadius={12} />
                    </View>
                </View>

                {/* Button */}
                <Skeleton width="90%" height={56} borderRadius={12} style={{ alignSelf: 'center', marginTop: 10, marginBottom: 40 }} />
            </ScrollView>
        </View>
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
    bookingCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});
