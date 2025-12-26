import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

export function ReviewListSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <Skeleton width={40} height={24} />
                <Skeleton width={120} height={32} />
                <View style={{ width: 24 }} />
            </View>

            {/* Rating Summary Skeleton */}
            <View style={styles.ratingSummary}>
                <Skeleton width={80} height={60} borderRadius={16} />
                <View style={{ gap: 8 }}>
                    <Skeleton width={120} height={20} />
                    <Skeleton width={100} height={16} />
                </View>
            </View>

            {/* Review List Skeleton */}
            <View style={styles.list}>
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={[styles.card, { backgroundColor: card }]}>
                        <View style={styles.cardHeader}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Skeleton width={40} height={40} borderRadius={20} />
                                <View style={{ gap: 4 }}>
                                    <Skeleton width={100} height={16} />
                                    <Skeleton width={60} height={12} />
                                </View>
                            </View>
                            <Skeleton width={40} height={16} borderRadius={8} />
                        </View>
                        <Skeleton width="100%" height={16} style={{ marginBottom: 4 }} />
                        <Skeleton width="80%" height={16} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 20,
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
});
