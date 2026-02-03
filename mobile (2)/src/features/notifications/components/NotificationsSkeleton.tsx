import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function NotificationsSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={180} height={28} />
                <Skeleton width={80} height={20} />
            </View>

            {/* List */}
            <View style={{ padding: 20, gap: 16 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={[styles.notificationCard, { backgroundColor: card }]}>
                        <Skeleton width={40} height={40} borderRadius={20} />
                        <View style={{ flex: 1, gap: 6 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Skeleton width="70%" height={16} />
                                <Skeleton width={40} height={12} />
                            </View>
                            <Skeleton width="90%" height={14} />
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
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        alignItems: 'center',
    },
});
