import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NotificationSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + 20 }]}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={32} height={32} borderRadius={16} />
                <Skeleton width={80} height={16} />
            </View>

            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Skeleton width={180} height={32} />
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width={70} height={32} borderRadius={16} />
                ))}
            </View>

            {/* List */}
            <View style={styles.list}>
                {/* Group 1 */}
                <View style={{ marginBottom: 20 }}>
                    <Skeleton width={60} height={16} style={{ marginBottom: 12 }} />
                    {[1, 2].map((i) => (
                        <View key={i} style={[styles.item, { backgroundColor: card }]}>
                            <Skeleton width={48} height={48} borderRadius={24} style={{ marginRight: 16 }} />
                            <View style={{ flex: 1 }}>
                                <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
                                <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
                                <Skeleton width="40%" height={12} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Group 2 */}
                <View>
                    <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
                    {[1, 2].map((i) => (
                        <View key={i} style={[styles.item, { backgroundColor: card }]}>
                            <Skeleton width={48} height={48} borderRadius={24} style={{ marginRight: 16 }} />
                            <View style={{ flex: 1 }}>
                                <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
                                <Skeleton width="90%" height={14} />
                            </View>
                        </View>
                    ))}
                </View>
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
        alignItems: 'center',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 24,
    },
    list: {
        paddingHorizontal: 20,
    },
    item: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
});
