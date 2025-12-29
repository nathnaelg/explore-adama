import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function SavedPlacesSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={24} height={24} />
                <Skeleton width={150} height={24} />
                <View style={{ width: 24 }} />
            </View>

            {/* List */}
            <View style={{ padding: 20, gap: 16 }}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.placeCard, { backgroundColor: card }]}>
                        <Skeleton width={100} height={100} borderRadius={16} />
                        <View style={{ flex: 1, gap: 8 }}>
                            <Skeleton width="80%" height={18} />
                            <Skeleton width="40%" height={14} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                <Skeleton width={60} height={14} />
                                <Skeleton width={60} height={14} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    placeCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        gap: 12,
    },
});
