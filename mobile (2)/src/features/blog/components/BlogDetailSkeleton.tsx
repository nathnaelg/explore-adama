import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function BlogDetailSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: card }]}>
                    <Skeleton width={24} height={24} />
                    <Skeleton width={120} height={20} />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Skeleton width={24} height={24} />
                        <Skeleton width={24} height={24} />
                    </View>
                </View>

                {/* Cover Image */}
                <Skeleton width="100%" height={250} borderRadius={0} />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.metaContainer}>
                        <Skeleton width={80} height={24} borderRadius={6} />
                        <Skeleton width={60} height={24} borderRadius={6} />
                    </View>

                    <Skeleton width="90%" height={34} style={{ marginBottom: 16 }} />

                    {/* Author */}
                    <View style={styles.authorInfo}>
                        <Skeleton width={40} height={40} borderRadius={20} />
                        <View style={{ gap: 4 }}>
                            <Skeleton width={120} height={16} />
                            <Skeleton width={180} height={14} />
                        </View>
                    </View>

                    {/* Interaction Bar */}
                    <View style={[styles.interactionsBar, { borderColor: useThemeColor({}, 'muted') + '40' }]}>
                        <Skeleton width={60} height={24} />
                        <Skeleton width={60} height={24} />
                        <Skeleton width={24} height={24} />
                    </View>

                    {/* Body */}
                    <View style={styles.bodyContainer}>
                        <Skeleton width="100%" height={16} style={{ marginBottom: 12 }} />
                        <Skeleton width="100%" height={16} style={{ marginBottom: 12 }} />
                        <Skeleton width="95%" height={16} style={{ marginBottom: 12 }} />
                        <Skeleton width="90%" height={16} style={{ marginBottom: 12 }} />
                        <Skeleton width="100%" height={16} style={{ marginBottom: 12 }} />
                        <Skeleton width="40%" height={16} style={{ marginBottom: 32 }} />

                        <Skeleton width="100%" height={150} borderRadius={12} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16
    },
    content: { padding: 20 },
    metaContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    interactionsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: 24,
        gap: 24
    },
    bodyContainer: { marginBottom: 32 },
});
