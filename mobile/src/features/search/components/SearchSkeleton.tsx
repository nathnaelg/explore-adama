import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

export function SearchSkeleton() {
    const card = useThemeColor({}, 'card');

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Skeleton width={120} height={20} />
            </View>

            <View style={styles.list}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={[styles.card, { backgroundColor: card }]}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Skeleton width={150} height={20} style={{ marginBottom: 6 }} />
                                <Skeleton width={60} height={14} borderRadius={4} />
                            </View>
                            <Skeleton width={40} height={20} borderRadius={6} />
                        </View>

                        <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
                        <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Skeleton width={80} height={14} />
                            <Skeleton width={80} height={14} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    list: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
});
