import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BlogSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + 10 }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <View>
                    <Skeleton width={200} height={32} style={{ marginBottom: 4 }} />
                    <Skeleton width={150} height={16} />
                </View>
                <View style={styles.headerIcons}>
                    <Skeleton width={40} height={40} borderRadius={20} />
                    <Skeleton width={40} height={40} borderRadius={20} />
                </View>
            </View>

            {/* Categories Skeleton */}
            <View style={styles.categories}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width={80} height={36} borderRadius={20} />
                ))}
            </View>

            {/* Post List */}
            <View style={styles.list}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.card, { backgroundColor: card }]}>
                        {/* Image */}
                        <Skeleton width="100%" height={180} borderRadius={16} style={{ marginBottom: 12 }} />
                        {/* Content */}
                        <Skeleton width="90%" height={20} style={{ marginBottom: 8 }} />
                        <Skeleton width="70%" height={16} style={{ marginBottom: 12 }} />
                        <View style={styles.cardFooter}>
                            <Skeleton width={80} height={16} />
                            <Skeleton width={60} height={16} />
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    categories: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    list: {
        paddingHorizontal: 20,
        gap: 20,
    },
    card: {
        padding: 16,
        borderRadius: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
