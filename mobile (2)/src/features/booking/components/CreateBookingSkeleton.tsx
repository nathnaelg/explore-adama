import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function CreateBookingSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <Skeleton width={150} height={24} borderRadius={4} />
                <View style={{ width: 24 }} />
            </View>

            {/* Event Summary Banner */}
            <View style={[styles.banner, { backgroundColor: useThemeColor({}, 'primary') + '20' }]}>
                <Skeleton width="80%" height={32} borderRadius={4} style={{ marginBottom: 12 }} />
                <Skeleton width="40%" height={20} borderRadius={4} />
            </View>

            {/* Ticket Section */}
            <View style={styles.section}>
                <Skeleton width={180} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 16 }} />

                <View style={[styles.priceRow, { backgroundColor: card }]}>
                    <Skeleton width={100} height={28} borderRadius={4} />
                    <View style={styles.ticketCounter}>
                        <Skeleton width={36} height={36} borderRadius={18} />
                        <Skeleton width={30} height={24} borderRadius={4} />
                        <Skeleton width={36} height={36} borderRadius={18} />
                    </View>
                </View>
            </View>

            {/* Total Price Card */}
            <View style={[styles.totalContainer, { backgroundColor: card }]}>
                <Skeleton width={100} height={16} borderRadius={4} style={{ marginBottom: 12 }} />
                <Skeleton width={200} height={40} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width={120} height={16} borderRadius={4} />
            </View>

            {/* Button */}
            <Skeleton width="90%" height={56} borderRadius={16} style={{ alignSelf: 'center', marginTop: 24 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    banner: {
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    ticketCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    totalContainer: {
        marginHorizontal: 20,
        marginVertical: 24,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
});
