import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ProfileSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + 20 }]}>
            {/* Header Title */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Skeleton width={100} height={28} />
            </View>

            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: card }]}>
                <Skeleton width={110} height={110} borderRadius={55} style={{ marginBottom: 16 }} />
                <Skeleton width={180} height={24} style={{ marginBottom: 8 }} />
                <Skeleton width={220} height={16} style={{ marginBottom: 16 }} />
                <Skeleton width={120} height={36} borderRadius={20} />
            </View>

            {/* Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: card }]}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                        <Skeleton width={30} height={24} style={{ marginBottom: 4 }} />
                        <Skeleton width={50} height={12} />
                    </View>
                ))}
            </View>

            {/* Menu Section */}
            <View style={{ paddingHorizontal: 20 }}>
                <Skeleton width={80} height={16} style={{ marginBottom: 12, marginLeft: 20 }} />
                <View style={[styles.menuCard, { backgroundColor: card }]}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={[styles.menuItem, i < 3 && { borderBottomWidth: 1, borderBottomColor: bg }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                <Skeleton width={24} height={24} borderRadius={12} />
                                <Skeleton width={120} height={16} />
                            </View>
                            <Skeleton width={16} height={16} />
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
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    menuCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
});
