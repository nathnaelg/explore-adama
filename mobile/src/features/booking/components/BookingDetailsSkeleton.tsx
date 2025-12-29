import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function BookingDetailsSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const muted = useThemeColor({}, 'muted');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={24} height={24} />
                <Skeleton width={150} height={24} />
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Event Card Skeleton */}
                <View style={[styles.card, { backgroundColor: card }]}>
                    <Skeleton width="100%" height={150} borderRadius={0} />
                    <View style={styles.cardBody}>
                        <Skeleton width="70%" height={24} style={{ marginBottom: 12 }} />
                        <View style={styles.row}>
                            <Skeleton width={16} height={16} borderRadius={8} />
                            <Skeleton width={100} height={14} />
                        </View>
                        <View style={styles.row}>
                            <Skeleton width={16} height={16} borderRadius={8} />
                            <Skeleton width={120} height={14} />
                        </View>
                    </View>
                </View>

                {/* Order Summary Section Skeleton */}
                <View style={[styles.section, { backgroundColor: card }]}>
                    <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
                    <View style={styles.infoRow}>
                        <Skeleton width={60} height={14} />
                        <Skeleton width={80} height={24} borderRadius={12} />
                    </View>
                    <View style={styles.infoRow}>
                        <Skeleton width={60} height={14} />
                        <Skeleton width={80} height={16} />
                    </View>
                    <View style={styles.infoRow}>
                        <Skeleton width={80} height={14} />
                        <Skeleton width={100} height={20} />
                    </View>
                </View>
            </ScrollView>
        </View>
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
    scrollContent: { padding: 20, gap: 20 },
    card: { borderRadius: 20, overflow: 'hidden' },
    cardBody: { padding: 16, gap: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { padding: 20, borderRadius: 20, gap: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
