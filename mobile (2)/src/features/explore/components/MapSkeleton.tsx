import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function MapSkeleton() {
    const card = useThemeColor({}, 'card');
    const muted = useThemeColor({}, 'muted');

    return (
        <View style={styles.container}>
            {/* Search Bar Skeleton */}
            <View style={[styles.searchWrapper, { backgroundColor: card }]}>
                <Skeleton width={20} height={20} borderRadius={10} />
                <Skeleton width="70%" height={20} style={{ marginLeft: 12 }} />
            </View>

            {/* Categories Row Skeleton */}
            <View style={styles.categoriesRow}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width={80} height={36} borderRadius={20} />
                ))}
            </View>

            {/* Bottom Place Card Skeleton */}
            <View style={[styles.placeCard, { backgroundColor: card }]}>
                <Skeleton width={90} height={90} borderRadius={14} />
                <View style={{ flex: 1, gap: 8 }}>
                    <Skeleton width="80%" height={18} />
                    <Skeleton width="30%" height={14} />
                    <Skeleton width="60%" height={14} />
                    <View style={styles.placeFooter}>
                        <Skeleton width={120} height={34} borderRadius={12} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrapper: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 14,
        zIndex: 10,
    },
    categoriesRow: {
        position: 'absolute',
        top: 130,
        left: 16,
        right: 16,
        flexDirection: 'row',
        gap: 10,
        zIndex: 10,
    },
    placeCard: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        flexDirection: 'row',
        padding: 12,
        borderRadius: 18,
        gap: 12,
        elevation: 10,
    },
    placeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
});
