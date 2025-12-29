import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const muted = useThemeColor({}, 'muted');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <Skeleton width={24} height={24} />
                    <Skeleton width={100} height={24} />
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Section */}
                <View style={[styles.profileSection, { borderBottomColor: muted + '20' }]}>
                    <Skeleton width={60} height={60} borderRadius={30} />
                    <View style={{ flex: 1, gap: 8 }}>
                        <Skeleton width={150} height={20} />
                        <Skeleton width={200} height={14} />
                    </View>
                    <Skeleton width={20} height={20} />
                </View>

                {/* Settings Groups */}
                {[1, 2, 3].map((group) => (
                    <View key={group} style={[styles.section, { borderBottomColor: muted + '20' }]}>
                        <Skeleton width={100} height={14} style={{ marginBottom: 16 }} />
                        {[1, 2, 3].map((item) => (
                            <View key={item} style={styles.settingItem}>
                                <Skeleton width={120} height={18} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Skeleton width={60} height={16} />
                                    <Skeleton width={20} height={20} />
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Logout Button */}
                <View style={styles.logoutPlaceholder}>
                    <Skeleton width="100%" height={60} borderRadius={12} />
                </View>
            </ScrollView>
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
        paddingBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        gap: 16,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    logoutPlaceholder: {
        padding: 20,
        marginTop: 20,
    },
});
