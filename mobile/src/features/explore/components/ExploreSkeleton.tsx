import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ExploreSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + 10 }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <Skeleton width={180} height={32} />
                <Skeleton width={40} height={40} borderRadius={20} />
            </View>

            {/* Tabs Skeleton */}
            <View style={styles.tabs}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width={80} height={36} borderRadius={20} />
                ))}
            </View>

            {/* Filters Skeleton */}
            <View style={styles.filters}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} width={90} height={32} borderRadius={16} />
                ))}
            </View>

            {/* List Skeleton */}
            <View style={styles.list}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.card, { backgroundColor: card }]}>
                        {/* Text Content (Left) */}
                        <View style={styles.cardContent}>
                            <Skeleton width="70%" height={20} style={{ marginBottom: 10 }} />
                            <Skeleton width="50%" height={16} style={{ marginBottom: 10 }} />
                            <Skeleton width="30%" height={16} />
                        </View>
                        {/* Image Placeholder (Right) */}
                        <Skeleton width={100} height={100} borderRadius={12} />
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
        alignItems: 'center',
        marginBottom: 20,
    },
    tabs: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    filters: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    list: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
});
