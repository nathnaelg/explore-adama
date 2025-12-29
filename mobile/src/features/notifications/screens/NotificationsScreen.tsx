import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/hooks';
import { NotificationsSkeleton } from '@/src/features/notifications/components/NotificationsSkeleton';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/src/features/notifications/hooks/useNotifications';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    // Derived colors for specific UI elements
    const filterBorder = muted + '40'; // Transparent muted

    const insets = useSafeAreaInsets();
    const [selectedFilter, setSelectedFilter] = useState(t('notifications.all'));
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const filters = [t('notifications.all'), t('notifications.bookings'), t('notifications.events'), t('notifications.info')];

    const { data, isLoading, refetch, isRefetching, error, isError } = useNotifications();
    const { mutate: markRead } = useMarkNotificationRead();
    const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

    // Safely access notifications array and defaults
    // The backend returns { data: [], total: 0, ... }
    const notifications = useMemo(() => data?.data || [], [data]);

    // DEBUG LOGS
    const { user } = useAuth();
    console.log('[NotificationsDebug] Current User ID:', user?.id);
    console.log('[NotificationsDebug] Data from hook:', JSON.stringify(data, null, 2));
    console.log('[NotificationsDebug] Notifications array length:', notifications.length);
    console.log('[NotificationsDebug] isLoading:', isLoading, 'isRefetching:', isRefetching);
    console.log('[NotificationsDebug] Error:', error);
    console.log('[NotificationsDebug] isError:', isError);

    const hasUnread = notifications.some(n => !n.isRead);

    const filteredNotifications = useMemo(() => {
        if (selectedFilter === t('notifications.all')) return notifications;
        const typeMap: Record<string, string> = {
            [t('notifications.bookings')]: 'BOOKING',
            [t('notifications.events')]: 'EVENT',
            [t('notifications.info')]: 'SYSTEM'
        };
        const targetType = typeMap[selectedFilter];
        return notifications.filter(n => {
            if (targetType === 'BOOKING') return n.type === 'BOOKING' || n.type === 'PAYMENT';
            if (targetType === 'EVENT') return n.type === 'EVENT' || n.type === 'REVIEW' || n.type === 'SOCIAL';
            if (targetType === 'SYSTEM') return n.type === 'SYSTEM' || n.type === 'PROMOTION';
            return n.type === targetType;
        });
    }, [notifications, selectedFilter]);

    // Grouping Logic
    const groupedNotifications = useMemo(() => {
        const groups: { title: string, data: typeof notifications }[] = [
            { title: t('notifications.today'), data: [] },
            { title: t('notifications.yesterday'), data: [] },
            { title: t('notifications.earlier'), data: [] }
        ];

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = new Date(today - 86400000).getTime();

        filteredNotifications.forEach(n => {
            const date = new Date(n.createdAt).getTime();
            if (date >= today) {
                groups[0].data.push(n);
            } else if (date >= yesterday) {
                groups[1].data.push(n);
            } else {
                groups[2].data.push(n);
            }
        });

        return groups.filter(g => g.data.length > 0);
    }, [filteredNotifications]);

    // Helpers - using primary color with opacity for simple theming or specific colors if desired
    // To match "App Theme", we rely more on the primary color and neutral variations
    const getIconStyle = (type: string) => {
        switch (type) {
            case 'BOOKING': return { bg: primary + '15', color: primary, icon: 'ticket-outline' as const };
            case 'PAYMENT': return { bg: primary + '15', color: primary, icon: 'card-outline' as const };
            case 'EVENT': return { bg: primary + '15', color: primary, icon: 'musical-note-outline' as const };
            case 'REVIEW': return { bg: primary + '15', color: primary, icon: 'star-outline' as const };
            case 'SOCIAL': return { bg: primary + '15', color: primary, icon: 'heart-outline' as const };
            case 'PROMOTION': return { bg: primary + '15', color: primary, icon: 'pricetag-outline' as const };
            case 'SYSTEM':
            default: return { bg: primary + '15', color: primary, icon: 'notifications-outline' as const };
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) return t('notifications.hoursAgo', { count: diffInHours });
        return t('notifications.yesterday');
    };

    const { isGuest } = useAuth();

    const onRefresh = async () => {
        setIsManualRefreshing(true);
        await refetch();
        setIsManualRefreshing(false);
    };

    const handleNotificationPress = (notification: any) => {
        if (!notification.isRead) markRead(notification.id);
        // Link handling
    };

    if (isGuest) {
        return (
            <ThemedView style={[styles.container, { backgroundColor: bg }]}>
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.guestState}>
                    <View style={[styles.guestIconCircle, { backgroundColor: primary + '15' }]}>
                        <Ionicons name="notifications-outline" size={60} color={primary} />
                    </View>
                    <ThemedText type="title" style={styles.guestTitle}>{t('notifications.stayUpdated')}</ThemedText>
                    <ThemedText style={[styles.guestSubtitle, { color: muted }]}>
                        {t('notifications.guestSubtitle')}
                    </ThemedText>
                    <TouchableOpacity
                        style={[styles.signInButton, { backgroundColor: primary }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <ThemedText style={styles.signInButtonText}>{t('profile.signInRegister')}</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    if (isLoading) {
        return <NotificationsSkeleton />;
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => markAllRead()} disabled={isMarkingAll || !hasUnread}>
                    <ThemedText style={{ color: muted, fontSize: 14, fontWeight: '600' }}>{t('notifications.markAllRead')}</ThemedText>
                </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <ThemedText style={[styles.title, { color: text }]}>{t('common.notifications')}</ThemedText>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
                    {filters.map((filter) => {
                        const isActive = selectedFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterChip,
                                    isActive ? { backgroundColor: primary } : { backgroundColor: card, borderWidth: 1, borderColor: filterBorder }
                                ]}
                                onPress={() => setSelectedFilter(filter)}
                            >
                                <ThemedText style={[styles.filterText, isActive ? { fontWeight: 'bold', color: 'black' } : { color: text }]}>
                                    {filter}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={onRefresh} tintColor={primary} />}
            >
                {isLoading && !isRefetching ? (
                    <NotificationsSkeleton />
                ) : groupedNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={64} color={muted} />
                        <ThemedText style={[styles.emptyText, { color: text }]}>{t('notifications.noNotifications')}</ThemedText>
                        <ThemedText style={[styles.emptySubText, { color: muted }]}>{t('notifications.allCaughtUp')}</ThemedText>
                    </View>
                ) : (
                    groupedNotifications.map((group, groupIndex) => (
                        <View key={group.title} style={{ marginBottom: 20 }}>
                            <ThemedText style={[styles.sectionTitle, { color: muted }]}>{group.title}</ThemedText>
                            {group.data.map((n) => {
                                const style = getIconStyle(n.type);
                                return (
                                    <TouchableOpacity
                                        key={n.id}
                                        style={[styles.card, { backgroundColor: card }]}
                                        onPress={() => handleNotificationPress(n)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: style.bg }]}>
                                            <Ionicons name={style.icon} size={20} color={style.color} />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <View style={styles.cardHeader}>
                                                <ThemedText style={[styles.cardTitle, { color: text }]}>{n.title}</ThemedText>
                                                {!n.isRead && <View style={[styles.unreadDot, { backgroundColor: primary }]} />}
                                            </View>
                                            <ThemedText style={[styles.cardMessage, { color: muted }]} numberOfLines={2}>{n.message}</ThemedText>
                                            <ThemedText style={[styles.cardTime, { color: muted }]}>{formatTime(n.createdAt)}</ThemedText>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: { fontSize: 28, fontWeight: 'bold' },
    filterContainer: { marginBottom: 10 },
    filterContent: { paddingHorizontal: 20, gap: 10 },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterText: { fontSize: 14, fontWeight: '500' },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'flex-start',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
    cardMessage: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
    cardTime: { fontSize: 12 },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubText: { fontSize: 14, marginTop: 8 },
    guestState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingBottom: 80,
    },
    guestIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    signInButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
