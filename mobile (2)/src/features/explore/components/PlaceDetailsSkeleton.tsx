import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export function PlaceDetailsSkeleton() {
    const bg = useThemeColor({}, 'bg');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header Image Skeleton */}
            <Skeleton width="100%" height={300} borderRadius={0} />

            {/* Content Body */}
            <View style={[styles.content, { backgroundColor: bg }]}>
                {/* Title & Rating */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Skeleton width="70%" height={32} style={{ marginBottom: 10 }} />
                        <Skeleton width="40%" height={20} />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Skeleton width={100} height={24} style={{ marginBottom: 12 }} />
                    <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                    <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
                    <Skeleton width="60%" height={16} />
                </View>

                {/* Gallery Section */}
                <View style={styles.section}>
                    <Skeleton width={100} height={24} style={{ marginBottom: 12 }} />
                    <View style={styles.gallery}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} width={100} height={100} borderRadius={12} />
                        ))}
                    </View>
                </View>

                {/* Map/Location Section */}
                <View style={styles.section}>
                    <Skeleton width={120} height={24} style={{ marginBottom: 12 }} />
                    <Skeleton width="100%" height={150} borderRadius={16} />
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Skeleton width="65%" height={56} borderRadius={16} />
                    <Skeleton width="30%" height={56} borderRadius={16} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    section: {
        marginBottom: 28,
    },
    gallery: {
        flexDirection: 'row',
        gap: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        gap: 16,
    },
});
