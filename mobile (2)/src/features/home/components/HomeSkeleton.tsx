import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + 20 }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <View>
                    <Skeleton width={120} height={24} style={{ marginBottom: 8 }} />
                    <Skeleton width={80} height={16} />
                </View>
                <View style={styles.headerIcons}>
                    <Skeleton width={42} height={42} borderRadius={21} />
                    <Skeleton width={42} height={42} borderRadius={21} />
                </View>
            </View>

            {/* AI Recommendations Skeleton */}
            <View style={styles.section}>
                <Skeleton width={200} height={20} style={{ marginBottom: 20 }} />
                <Skeleton width="100%" height={160} borderRadius={20} />
            </View>

            {/* Categories Skeleton */}
            <View style={styles.section}>
                <Skeleton width={100} height={20} style={{ marginBottom: 16 }} />
                <View style={styles.categories}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.categoryItem}>
                            <Skeleton width={50} height={50} borderRadius={25} style={{ marginBottom: 8 }} />
                            <Skeleton width={60} height={12} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Nearby Places Skeleton */}
            <View style={styles.section}>
                <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
                {[1, 2].map((i) => (
                    <View key={i} style={styles.nearbyItem}>
                        <Skeleton width={60} height={60} borderRadius={12} />
                        <View style={{ flex: 1 }}>
                            <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
                            <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
                            <Skeleton width="40%" height={14} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Community Stories Skeleton */}
            <View style={styles.section}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Skeleton width={180} height={20} />
                    <Skeleton width={60} height={16} />
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {[1, 2].map((i) => (
                        <View key={i} style={{ width: 160, borderRadius: 16, overflow: 'hidden' }}>
                            <Skeleton width="100%" height={100} />
                            <View style={{ padding: 12 }}>
                                <Skeleton width="90%" height={12} style={{ marginBottom: 6 }} />
                                <Skeleton width="60%" height={12} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Events Skeleton (Happening Soon) */}
            <View style={styles.sectionHeader}>
                <Skeleton width={150} height={20} />
                <Skeleton width={60} height={16} />
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
                {[1, 2].map((i) => (
                    <View key={i} style={[styles.eventCardSkeleton, { backgroundColor: card }]}>
                        <Skeleton width={50} height={50} borderRadius={12} />
                        <View style={{ flex: 1, gap: 8 }}>
                            <Skeleton width="100%" height={16} />
                            <Skeleton width="60%" height={12} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    section: {
        marginBottom: 30,
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    categoryItem: {
        alignItems: 'center',
    },
    nearbyItem: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventCardSkeleton: {
        width: 240,
        height: 100,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
});
