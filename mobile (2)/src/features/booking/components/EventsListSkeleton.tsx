import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function EventsListSkeleton() {
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

            {/* List */}
            <View style={{ padding: 20, gap: 16 }}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.eventCard, { backgroundColor: card }]}>
                        <Skeleton width="70%" height={24} borderRadius={4} style={{ marginBottom: 12 }} />
                        <Skeleton width="40%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
                        <Skeleton width={100} height={20} borderRadius={4} />
                    </View>
                ))}
            </View>
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
    eventCard: {
        padding: 20,
        borderRadius: 16,
    },
});
