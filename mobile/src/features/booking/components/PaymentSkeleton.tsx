import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

export function PaymentSkeleton() {
    const card = useThemeColor({}, 'card');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <Skeleton width={180} height={24} borderRadius={4} />
                <View style={{ width: 24 }} />
            </View>

            {/* Booking Summary */}
            <View style={[styles.card, { backgroundColor: card }]}>
                <Skeleton width="70%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={16} borderRadius={4} />
            </View>

            {/* Payment Summary */}
            <View style={styles.section}>
                <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                <View style={styles.row}>
                    <Skeleton width={120} height={16} borderRadius={4} />
                    <Skeleton width={80} height={16} borderRadius={4} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                    <Skeleton width={100} height={16} borderRadius={4} />
                    <Skeleton width={60} height={16} borderRadius={4} />
                </View>
                <View style={[styles.row, { marginTop: 20 }]}>
                    <Skeleton width={140} height={24} borderRadius={4} />
                    <Skeleton width={100} height={24} borderRadius={4} />
                </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
                <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                <View style={{ gap: 12 }}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={[styles.methodCard, { backgroundColor: card }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <Skeleton width={24} height={24} borderRadius={12} />
                                <View>
                                    <Skeleton width={120} height={20} borderRadius={4} style={{ marginBottom: 4 }} />
                                    <Skeleton width={180} height={14} borderRadius={4} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Button */}
            <Skeleton width="90%" height={56} borderRadius={12} style={{ alignSelf: 'center', marginTop: 24 }} />
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
    card: {
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    methodCard: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
